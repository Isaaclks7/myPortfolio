// scripts/embedResume.ts
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { pipeline } from '@xenova/transformers';

const execPromise = promisify(exec);

// Load .env.local manually
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc: any, line) => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').replace(/^"(.*)"$/, '$1');
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {});

Object.assign(process.env, envVars);

import { createClient } from '@supabase/supabase-js';

console.log('✓ SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'loaded' : 'MISSING');
console.log('✓ SUPABASE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'loaded' : 'MISSING');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

let extractor: any = null;

async function initExtractor() {
  if (!extractor) {
    console.log('🔄 Loading embedding model...');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

async function getEmbedding(text: string): Promise<number[]> {
  const extractor = await initExtractor();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const { stdout } = await execPromise(`pdftotext "${filePath}" -`);
    return stdout;
  } catch (error) {
    console.log('⚠️ pdftotext not available, reading PDF as text...');
    const text = fs.readFileSync(filePath, 'utf-8');
    return text;
  }
}

async function embedResume() {
  try {
    console.log('📄 Reading resume PDF...');
    
    const pdfText = await extractTextFromPDF('./public/resume.pdf');
    
    if (!pdfText || pdfText.trim().length === 0) {
      console.error('❌ Could not extract text from PDF.');
      process.exit(1);
    }
    
    console.log('✂️ Chunking text...');
    
    const chunkSize = 800;
    const chunks: string[] = [];
    
    for (let i = 0; i < pdfText.length; i += chunkSize) {
      chunks.push(pdfText.slice(i, i + chunkSize));
    }
    
    console.log(`📚 Created ${chunks.length} chunks`);
    console.log('🔗 Generating embeddings...');
    
    // Generate all embeddings first
    const records = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`⏳ Embedding chunk ${i + 1}/${chunks.length}`);
      
      const embedding = await getEmbedding(chunks[i]);
      records.push({
        content: chunks[i],
        embedding,
        metadata: {
          chunk_index: i,
          total_chunks: chunks.length,
        },
      });
    }
    
    // Delete old data first
    console.log('🗑️ Clearing old data...');
    const { error: deleteError } = await supabase
      .from('resume_chunks')
      .delete()
      .neq('id', 0); // Delete all rows
    
    if (deleteError) {
      console.error('⚠️ Could not clear old data:', deleteError);
    }
    
    // Batch insert all records
    console.log('💾 Inserting records to Supabase...');
    const { data, error } = await supabase
      .from('resume_chunks')
      .insert(records);
    
    if (error) {
      console.error('❌ Error inserting records:', error);
      throw error;
    }
    
    console.log('✅ Resume embedded successfully!');
    console.log(`📊 Inserted ${records.length} chunks`);
    console.log(`📊 Response data:`, data);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

embedResume();