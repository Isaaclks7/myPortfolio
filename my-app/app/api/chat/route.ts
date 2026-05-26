import { NextRequest, NextResponse } from "next/server"

const ISAAC_CONTEXT = `
## Personal
Name: Lim Kai Sheng Isaac
Email: kaishaeng@gmail.com
LinkedIn: linkedin.com/in/isaaclks7
GitHub: github.com/isaaclks7
Portfolio: isaaclks.vercel.app

## Education
National University of Singapore (NUS), Aug 2023 – May 2027
Bachelor of Engineering in Computer Engineering, Minor in Quantitative Finance
GPA: 4.48/5.0
Coursework: Data Structures & Algorithms, Software Engineering, Machine Learning, Probability and Statistics, Linear Algebra, Digital Design, Computer Organization, Operating Systems
Activities: Eusoff Hall Floorball, Handball, NUS Recreational Basketball

## Work Experience
Certis Group — AI Engineer Intern, Jul–Dec 2025
Stack: Python, LangGraph, LangChain, RAG, Docker, HuggingFace, vLLM, FastAPI, PostgreSQL, OpenAI, Groq, LoRA
- Engineered agentic AI workflows for incident reporting, classification, and report generation
- Built a RAG AI Agent using HuggingFace embeddings and vector search for custom document Q&A
- Fine-tuned open-weight models with LoRA and prompt tuning, achieving >95% accuracy
- Built RESTful inference endpoints with vLLM and FastAPI for scalable LLM serving
- Orchestrated end-to-end ML pipelines for continuous model refinement

Oneberry Technologies — Full Stack Developer Intern, May–Aug 2024
Stack: TypeScript, Next.js, React, Node.js, Zustand, MQTT, RabbitMQ, Socket.io, Bootstrap, Strapi
- Built live sensor monitoring dashboard tracking 10,000+ sensors for Singapore's MRT
- Led frontend development using Bootstrap, Figma, CSS, Chart.js
- Built e-learning platform with video content, MCQ assessments, automated certificate generation
- Integrated SendGrid for automated certificate email delivery

## Projects
Bomb Go Boom (Mar–May 2025) — Verilog, FPGA, Digital Design
- Bomb-defusal game with three mini-games on Basys3 FPGA
- Programmed game logic using Verilog state machines

NurseSched (Mar–May 2025) — Java, OOP, JUnit
- CLI desktop app for managing nurse schedules and patient appointments
- Implemented to-do list and appointment modules with JUnit tests

## Skills
Languages: Python, C++, C, Java, TypeScript, JavaScript, SQL, Assembly
Frameworks: FastAPI, LangGraph, LangChain, RAG, HuggingFace, vLLM, Next.js, Node.js, PostgreSQL, Groq, OpenAI, Bootstrap, Tailwind
DevOps: Docker, Linux, GitHub, Postman, AWS EC2
Certifications: IBM RAG and Agentic AI (ongoing)
Interests: Backend engineering, AI-integrated workflows
Hobbies: Sports, gaming, drums, watching shows
`

const SYSTEM_PROMPT = `You are Isaac's portfolio assistant on his personal website.
Answer questions about Isaac using ONLY the information provided below.
DO NOT mention skills, experience, or projects not explicitly listed.
If something isn't covered, say you don't have that detail and suggest contacting him directly.
Keep replies concise (2-4 sentences). Be friendly but professional.

${ISAAC_CONTEXT}`

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
			// Limit message content length
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

		const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
				"HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "",
				"X-OpenRouter-Title": "Isaac's Portfolio",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "openai/gpt-oss-20b:free",
				messages: [
					{ role: "system", content: SYSTEM_PROMPT },
					...messages,
				],
			}),
		})

		const data = await response.json()
		if (!response.ok) {
			console.error("OpenRouter error status:", response.status)
			return NextResponse.json(
				{ reply: "Sorry, something went wrong. Please try again." },
				{ status: 500 }
			)
		}

		const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't get a response."
		return NextResponse.json({ reply })
	} catch (error) {
		console.error("Chat API error")
		return NextResponse.json(
			{ reply: "Sorry, something went wrong. Please try again." },
			{ status: 500 }
		)
	}
}