const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_MODEL = 'deepseek-chat';
import logoImg from '../../assets/logo.png';

class DeepSeek {
  constructor(config = {}) {
    this.apiKey =
      localStorage.getItem('deepseek_api_key') ||
      config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.model = config.model || DEFAULT_MODEL;
    this.timeoutMs = Number(config.timeoutMs ?? 20000);
  }

  assertReady() {
    if (!this.apiKey) {
      throw new Error(
        'DeepSeek API key is missing. Set DEEP_SEEK_AI_API_KEY in .env.',
      );
    }
  }

  validatePrompt(prompt) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('Prompt is required and must be a non-empty string.');
    }
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async requestWithRetry(url, options, retries = 2) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const text = await response.text();
          if (response.status === 401 || response.status === 402 || (text && text.includes('authentication_error'))) {
            throw new Error('Your DeepSeek is running out of token');
          }
          throw new Error(`DeepSeek API error ${response.status}: ${text || response.statusText}`);
        }

        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error;

        if (error.message === 'Your DeepSeek is running out of token') {
          throw error;
        }

        if (attempt < retries) {
          await this.wait(500 * (attempt + 1));
        }
      }
    }

    throw lastError || new Error('DeepSeek request failed.');
  }

  async generateReport(input, options = {}) {
    this.assertReady();

    let messages = [];
    if (Array.isArray(input)) {
      messages = input;
    } else {
      this.validatePrompt(input);
      messages = [{ role: 'user', content: input.trim() }];
    }

    const {
      systemPrompt = `You are a highly intelligent and professional assistant. 
If the user asks a general question or wants to communicate, reason with them and respond normally as a conversational AI without restricting yourself to tables.

HOWEVER, if the user asks to "generate a timetable", "RPS", or "lesson plan" (e.g., 'generate timetable about computer vision'), you MUST generate a highly detailed RPS (Semester Learning Plan) based on the OBE (Outcome-Based Education) layout. 
By default, generate this in English. IF the user asks in Bahasa Indonesia, you MUST generate it in Bahasa Indonesia. 
CRITICAL INSTRUCTION: You MUST generate EXACTLY the number of meetings/rows the user requests. If they ask for 2 topics, generate EXACTLY 2 rows in the Detail Pertemuan table. DO NOT generate 8 or 14 rows by default. Pay extreme attention to the user's requested number of topics.
ABSOLUTE STRICT RULE: The VERY FIRST character of your entire response MUST be '<' (the start of the h1 title). You are strictly forbidden from outputting ANY introductory text, greetings, or conversational filler. NEVER output "Here is the RPS...". Start your response directly with the raw HTML <h1> code.

When generating the RPS timetable, you MUST use the following series of Markdown and HTML tables EXACTLY. Make sure the university header, course info, and authorization section are combined into THIS EXACT HTML table to preserve the complex colspans (translated to English if the user asked in English, or kept in Bahasa if asked in Bahasa, except for the logo placeholder).

<h1>[Document Title - Click to Edit]</h1>

<table>
  <tr>
    <td colspan="2" align="center" width="15%">
      <img src="${window.location.origin}${logoImg}" width="80" height="80" alt="Logo Unpam">
    </td>
    <td colspan="6" align="center" width="70%">
      <strong>Universitas Pamulang</strong><br>
      <strong>Program Pascasarjana</strong><br>
      <strong>Program Studi Teknik Informatika S-2</strong>
    </td>
    <td colspan="1" align="center" width="15%">
      Kode<br>Dokumen
    </td>
  </tr>
  <tr>
    <td colspan="9" align="center" style="background-color: #d9edf2; color: #000000;">
      <strong>RENCANA PEMBELAJARAN SEMESTER (SEMESTER LEARNING PLAN)</strong>
    </td>
  </tr>
  <tr>
    <td colspan="2"><strong>MATA KULIAH (MK)</strong></td>
    <td colspan="1"><strong>KODE</strong></td>
    <td colspan="1"><strong>Rumpun MK</strong></td>
    <td colspan="3" align="center"><strong>BOBOT (sks)</strong></td>
    <td colspan="1"><strong>SEMESTER</strong></td>
    <td colspan="1"><strong>Tgl Penyusunan</strong></td>
  </tr>
  <tr>
    <td colspan="2">[AI Generated Subject Name]</td>
    <td colspan="1">[AI Generated Course Code]</td>
    <td colspan="1">[AI Generated Category]</td>
    <td colspan="1" align="center">[AI Generated T value, e.g. T=3]</td>
    <td colspan="1" align="center">[AI Generated P value, e.g. P=0]</td>
    <td colspan="1" align="center">[AI Generated ECTS, e.g. ECTS=4.77]</td>
    <td colspan="1" align="center">[AI Generated Semester, e.g. 3]</td>
    <td colspan="1">[Static Current Date: ${new Date().toISOString().split('T')[0]}]</td>
  </tr>
  <tr>
    <td rowspan="2" colspan="2"><strong>OTORISASI (AUTHORIZATION)</strong></td>
    <td colspan="2"><strong>Pengembang RPS (RPS Developer)</strong></td>
    <td colspan="3"><strong>Koordinator RMK (RMK Coordinator)</strong></td>
    <td colspan="2"><strong>Koordinator Program Studi (Study Program Coordinator)</strong></td>
  </tr>
  <tr>
    <td colspan="2">[Static Name/Title]</td>
    <td colspan="3">[Static Name/Title]</td>
    <td colspan="2">[Static Name/Title]</td>
  </tr>
  <tr>
    <td rowspan="10" colspan="2" width="20%"><strong>Capaian Pembelajaran (CP)</strong></td>
    <td colspan="7"><strong>CPL-PRODI yang dibebankan pada MK</strong></td>
  </tr>
  <tr>
    <td colspan="1"><strong>CPL-1</strong></td>
    <td colspan="6">[AI Generated CPL Description]</td>
  </tr>
  <tr>
    <td colspan="1"><strong>CPL-2</strong></td>
    <td colspan="6">[AI Generated CPL Description]</td>
  </tr>
  <tr>
    <td colspan="7"><strong>Capaian Pembelajaran Mata Kuliah (CPMK)</strong></td>
  </tr>
  <tr>
    <td colspan="1"><strong>CPMK-1</strong></td>
    <td colspan="6">[AI Generated CPMK Description]</td>
  </tr>
  <tr>
    <td colspan="1"><strong>CPMK-2</strong></td>
    <td colspan="6">[AI Generated CPMK Description]</td>
  </tr>
  <tr>
    <td colspan="7"><strong>Matrik CPL - CPMK</strong></td>
  </tr>
  <tr>
    <td colspan="7" height="40"></td>
  </tr>
  <tr>
    <td colspan="7"><strong>Matrik CPMK pada Kemampuan akhir tiap tahapan belajar (Sub-CPMK)</strong></td>
  </tr>
  <tr>
    <td colspan="7" height="40"></td>
  </tr>
  <tr>
    <td colspan="2"><strong>Deskripsi Singkat MK</strong></td>
    <td colspan="7">[AI Generated Course Description]</td>
  </tr>
  <tr>
    <td rowspan="4" colspan="2"><strong>Pustaka</strong></td>
    <td colspan="2"><strong>Utama :</strong></td>
    <td colspan="5"></td>
  </tr>
  <tr>
    <td colspan="7">
      1. [Reference 1]<br>
      2. [Reference 2]
    </td>
  </tr>
  <tr>
    <td colspan="2"><strong>Pendukung :</strong></td>
    <td colspan="5"></td>
  </tr>
  <tr>
    <td colspan="7">
      1. [Reference 3]
    </td>
  </tr>
  <tr>
    <td colspan="2"><strong>Dosen Pengampu</strong></td>
    <td colspan="7">[Lecturer Names]</td>
  </tr>
</table>

### Detail Pertemuan (Meeting Details)

| Week | Session | Final Ability (Sub-CPMK) | Assessment (Indicators) | Assessment (Criteria & Form) | Learning Method (Offline) | Learning Method (Online) | Learning Material [References] | Weight (%) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | [Sub-CPMK for week 1] | 1. [Indicator 1]<br>2. [Indicator 2] | Criteria: [Criteria]<br>Form: [Form] | [Methods e.g., Lecture, Discussion]<br>[Time e.g., 3x50 mins] | [Online methods] | [Material topic]<br>[Ref 1] | 5% |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

Fill in the template with realistic, high-quality academic content related to the user's topic. Translate the table headers to the appropriate language based on the user's prompt (English by default, Bahasa Indonesia if requested in Bahasa). DO NOT USE EMOJIS.`,
      maxTokens = 10000,
      temperature = 0.5,
      model = this.model,
      retries = 2,
      onChunk
    } = options;

    const body = {
      model,
      temperature,
      max_tokens: maxTokens,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
    };

    const response = await this.requestWithRetry(
      `${this.baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      },
      retries,
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullContent = '';
    let buffer = '';
    let lastChunkTime = Date.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;

        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            const delta = data.choices[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              const now = Date.now();
              if (now - lastChunkTime > 100) {
                if (onChunk) onChunk(delta, fullContent);
                lastChunkTime = now;
              }
            }
          } catch (e) {
            // ignore JSON parse errors for partial chunks
          }
        }
      }
    }

    // Ensure final state is always pushed
    if (onChunk) onChunk('', fullContent);

    if (!fullContent) {
      throw new Error('DeepSeek returned an empty response.');
    }

    return fullContent;
  }
}

const deepSeek = new DeepSeek();

export { DeepSeek };
export default deepSeek;