import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { pipeline } from "@xenova/transformers"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

let extractor: any = null

async function initExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractor
}

async function getEmbedding(text: string): Promise<number[]> {
  const extractor = await initExtractor()
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) {
    return 0
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dotProduct / (magnitudeA * magnitudeB)
}

async function retrieveRelevantChunks(query: string): Promise<string> {
  try {
    const queryEmbedding = await getEmbedding(query)

    const { data: allChunks, error } = await supabase
      .from('resume_chunks')
      .select('id, content, embedding')

    if (error || !allChunks) {
      console.error('Error fetching chunks:', error)
      return ''
    }

    if (allChunks.length === 0) {
      return ''
    }

    const results = allChunks
      .map((chunk) => {
        const sim = cosineSimilarity(queryEmbedding, chunk.embedding)
        return {
          content: chunk.content,
          similarity: sim
        }
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)

    return results
      .map(r => r.content)
      .join('\n\n')
  } catch (error) {
    console.error('Error retrieving chunks:', error)
    return ''
  }
}

const SYSTEM_PROMPT = `You are Isaac's portfolio assistant. Answer in 1-2 sentences. No preamble or thinking.

Answer questions about Isaac using ONLY the information provided below.
DO NOT mention skills, experience, or projects not explicitly listed.
If something isn't covered, say you don't have that detail.

Paraphrase naturally. Never quote verbatim. Be conversational and friendly.`

const MODELS = [
	"mistralai/mistral-7b-free",
	"openai/gpt-oss-20b:free",
	"nvidia/nemotron-3-super-120b-a12b:free",
]

async function callOpenRouter(model: string, messages: any[], context: string) {
	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
			"HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "",
			"X-OpenRouter-Title": "Isaac's Portfolio",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model,
			messages: [
				{ role: "system", content: `${SYSTEM_PROMPT}\n\nIsaac's Resume Information:\n---\n${context}\n---` },
				...messages,
			],
			temperature: 0.3,
			max_tokens: 100,
		}),
	})

	return { response, data: await response.json() }
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { messages } = body

		// Validate input
		if (!Array.isArray(messages)) {
			return NextResponse.json(
				{ reply: "Invalid request format." },
				{ status: 400 }
			)
		}

		if (messages.length === 0 || messages.length > 50) {
			return NextResponse.json(
				{ reply: "Invalid message count." },
				{ status: 400 }
			)
		}

		// Validate each message
		for (const msg of messages) {
			if (typeof msg.role !== "string" || typeof msg.content !== "string") {
				return NextResponse.json(
					{ reply: "Invalid message format." },
					{ status: 400 }
				)
			}
			if (msg.role !== "user" && msg.role !== "assistant") {
				return NextResponse.json(
					{ reply: "Invalid message role." },
					{ status: 400 }
				)
			}
			if (msg.content.length > 2000) {
				return NextResponse.json(
					{ reply: "Message too long." },
					{ status: 400 }
				)
			}
		}

		if (!process.env.OPENROUTER_API_KEY) {
			console.error("Missing API key")
			return NextResponse.json(
				{ reply: "Service unavailable." },
				{ status: 503 }
			)
		}

		const userQuery = messages[messages.length - 1].content
		const resumeContext = await retrieveRelevantChunks(userQuery)

		for (const model of MODELS) {
			try {
				const { response, data } = await callOpenRouter(model, messages, resumeContext)
				if (response.ok) {
					let reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't get a response."
					
					// Extract only the actual answer (last 1-2 sentences)
					const sentences = reply.match(/[^.!?]*[.!?]+/g) || []
					if (sentences.length > 0) {
						reply = sentences.slice(-2).join(' ').trim()
					}
					
					return NextResponse.json({ reply })
				}
				console.warn(`Model ${model} failed with status ${response.status}`, data)
			} catch (error) {
				console.warn(`Model ${model} failed with error:`, error)
			}
		}

		console.error("All models exhausted")
		return NextResponse.json(
			{ reply: "Sorry, something went wrong. Please try again." },
			{ status: 500 }
		)
	} catch (error) {
		console.error("Chat API error")
		return NextResponse.json(
			{ reply: "Sorry, something went wrong. Please try again." },
			{ status: 500 }
		)
	}
}