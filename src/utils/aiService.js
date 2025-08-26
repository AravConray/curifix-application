import fs from 'fs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not defined. AI functions will not work.');
}

export async function getAiResponse({ messages, model = DEFAULT_MODEL, temperature = 0.7, maxTokens = 1024, topP = 1.0, n = 1, presencePenalty = 0, frequencyPenalty = 0 }) {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key');
  }
  const payload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    n,
    presence_penalty: presencePenalty,
    frequency_penalty: frequencyPenalty,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(OPENAI_ENDPOINT, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    if (!data || !data.choices) {
      throw new Error('Invalid response from OpenAI API');
    }
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('AI Service error:', err);
    throw err;
  }
}

export function loadAiConfiguration(filePath) {
  try {
    const raw = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const config = JSON.parse(raw);
    if (!config.apiKey) {
      console.warn('Configuration missing apiKey');
    }
    return config;
  } catch (err) {
    console.error(`Failed to load AI configuration from ${filePath}: ${err}`);
    throw err;
  }
}
