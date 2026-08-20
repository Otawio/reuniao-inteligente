import { TranscriptResult } from '@/lib/domain/types';

const COHERE_API_KEY = process.env.COHERE_API_KEY || '';
const COHERE_MODEL = process.env.COHERE_MODEL || 'cohere-transcribe-03-2026';

export async function transcribeAudio(
  fileBuffer: ArrayBuffer,
  fileName: string,
  language: string = 'pt'
): Promise<TranscriptResult> {
  if (!COHERE_API_KEY) {
    throw new Error('COHERE_API_KEY não configurada');
  }

  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const body = buildMultipartBody(boundary, new Uint8Array(fileBuffer), fileName, language);

  const response = await fetch('https://api.cohere.com/v2/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COHERE_API_KEY}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cohere API error ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const text = result.text || '';

  return {
    text,
    language,
    source: 'cohere',
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

function buildMultipartBody(
  boundary: string,
  fileBytes: Uint8Array,
  fileName: string,
  language: string
): Blob {
  const encoder = new TextEncoder();
  const parts: (Uint8Array | string)[] = [];

  parts.push(encoder.encode(`--${boundary}\r\n`));
  parts.push(encoder.encode('Content-Disposition: form-data; name="model"\r\n\r\n'));
  parts.push(encoder.encode(`${COHERE_MODEL}\r\n`));

  parts.push(encoder.encode(`--${boundary}\r\n`));
  parts.push(encoder.encode('Content-Disposition: form-data; name="language"\r\n\r\n'));
  parts.push(encoder.encode(`${language}\r\n`));

  parts.push(encoder.encode(`--${boundary}\r\n`));
  parts.push(encoder.encode(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`));
  parts.push(encoder.encode('Content-Type: audio/ogg\r\n\r\n'));
  parts.push(fileBytes);
  parts.push(encoder.encode('\r\n'));

  parts.push(encoder.encode(`--${boundary}--\r\n`));

  const totalLength = parts.reduce((acc, part) => acc + (typeof part === 'string' ? encoder.encode(part).length : part.length), 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    const bytes = typeof part === 'string' ? encoder.encode(part) : part;
    result.set(bytes, offset);
    offset += bytes.length;
  }

  return new Blob([result], { type: `multipart/form-data; boundary=${boundary}` });
}
