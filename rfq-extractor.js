/**
 * PIVOT RFQ Extraction Engine
 * Dual-provider AI extraction: GPT-4o → Claude fallback
 * With corrections-based learning loop
 */

import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import xlsx from 'xlsx';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ── Clients (lazy-init so dotenv has time to load .env first) ────────────────

let _openai = null;
let _anthropic = null;

function getOpenAI() {
  if (_openai === undefined) return null;
  if (!_openai && process.env.OPENAI_API_KEY) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

function getAnthropic() {
  if (_anthropic === undefined) return null;
  if (!_anthropic && process.env.ANTHROPIC_API_KEY) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

// ── Corrections Store ─────────────────────────────────────────────────────────

const CORRECTIONS_FILE = path.join(process.cwd(), 'data', 'rfq-corrections.json');

function loadCorrections() {
  try {
    if (!fs.existsSync(CORRECTIONS_FILE)) return [];
    return JSON.parse(fs.readFileSync(CORRECTIONS_FILE, 'utf8'));
  } catch { return []; }
}

export function saveCorrection({ clientId, clientName, fieldKey, sectionKey, originalValue, correctedValue, documentHash }) {
  const dir = path.dirname(CORRECTIONS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const corrections = loadCorrections();
  corrections.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    clientId,
    clientName,
    documentHash,
    sectionKey,
    fieldKey,
    originalValue,
    correctedValue
  });

  // Keep last 500 corrections
  const trimmed = corrections.slice(-500);
  fs.writeFileSync(CORRECTIONS_FILE, JSON.stringify(trimmed, null, 2));
  console.log(`[RFQ-LEARN] Correction saved: ${sectionKey}.${fieldKey} → "${correctedValue}" (was "${originalValue}")`);
}

export function getCorrectionStats() {
  const corrections = loadCorrections();
  const stats = {};
  corrections.forEach(c => {
    const key = `${c.sectionKey}.${c.fieldKey}`;
    if (!stats[key]) stats[key] = { count: 0, examples: [] };
    stats[key].count++;
    if (stats[key].examples.length < 3) {
      stats[key].examples.push({ from: c.originalValue, to: c.correctedValue });
    }
  });
  return { total: corrections.length, byField: stats };
}

// Build few-shot correction examples for prompt injection
function buildCorrectionExamples() {
  const corrections = loadCorrections();
  if (corrections.length === 0) return '';

  // Get the most recent unique corrections per field (last 3 per field)
  const byField = {};
  corrections.forEach(c => {
    if (!byField[c.fieldKey]) byField[c.fieldKey] = [];
    if (byField[c.fieldKey].length < 3) byField[c.fieldKey].push(c);
  });

  const examples = Object.entries(byField).map(([field, corrs]) => {
    return corrs.map(c =>
      `  - Field "${field}": AI extracted "${c.originalValue}" but correct value was "${c.correctedValue}"`
    ).join('\n');
  }).join('\n');

  return `\nLEARNED CORRECTIONS (from previous human reviews — apply these patterns):\n${examples}\n`;
}

// ── Document Text Extraction ──────────────────────────────────────────────────

async function extractText(file) {
  const mime = file.mimetype;
  const buffer = file.buffer;

  try {
    if (mime === 'application/pdf') {
      const result = await pdfParse(buffer);
      return result.text;
    }

    if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mime === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mime === 'application/vnd.ms-excel') {
      const wb = xlsx.read(buffer, { type: 'buffer' });
      let text = '';
      wb.SheetNames.forEach(name => {
        const ws = wb.Sheets[name];
        text += `\n[Sheet: ${name}]\n`;
        text += xlsx.utils.sheet_to_csv(ws);
      });
      return text;
    }

    // Images — return placeholder (in production: use vision API)
    return `[Image file: ${file.originalname} — visual content requires vision extraction]`;

  } catch (err) {
    console.error(`[RFQ-EXTRACT] Text extraction failed for ${file.originalname}:`, err.message);
    return `[Extraction failed for ${file.originalname}: ${err.message}]`;
  }
}

// ── LOV Reference (for prompt) ────────────────────────────────────────────────

const LOV_SUMMARY = `
MASTER LIST OF ALLOWED VALUES (use EXACTLY these values where applicable):
- product_type: GHI, GPA
- sub_product_type: IPD, IPD+OPD, OPD, Wellness
- quote_type: Base, Topup, Super-Topup, Parents Only, Students Only, Flex Plan, Base+Flex Plan, OPD, Parent-Top Up, Student-Top Up, Maternity, Cancer, Multiply Wellness
- business_type: Fresh, Own Renewal, Market Rollover
- quote_with_member_data: Yes, No
- enterprise_type: SME, Non-SME
- zone: East, West, North, South, Central
- sum_insured_type: Floater, Non Floater
- ped: Covered, Not Covered
- thirty_day_waiting: Applicable, Not Applicable
- two_year_waiting: Applicable, Not Applicable
- external_congenital: Covered, Not Covered
- domestic_emergency: Covered, Not Covered
- infertility_treatment: Covered, Not Covered
- baby_day_one: Covered, Not Covered
- pre_post_hospitalization: 30-60 Days, 60-90 Days, 90-180 Days
- corporate_wellness: Plan A, Not Covered
- normal_room_rent: No Room Rent capping, Deluxe room, Single Private Room, Single standard ac room, Shared room, General/Economy ward, 1% of Sum Insured per day, 2% of Sum Insured per day, 3% of Sum Insured per day, 4% of Sum Insured per day, or a numeric value like 500/1000/2000/3000 etc.
- icu_rent: same options as normal_room_rent
- pre_post_natal: Not Covered, 2500, 5000, 10000
- disease_sub_limits: Standard Limit, Higher Limit, No Limit, Not Applicable
- lasik: Not Covered, Covered if correction index is +/-5D, Covered if correction index is +/-6.5D, Covered if correction index is +/-7.5D
- opd: No OPD Cover, 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
- ambulance: 0, 1000, 1500, 2000, 2500, 3000, 5000, Covered upto Actual Expenses
- ambulance_amount: 1000, 1500, 2000, 2500, 3000, 5000
- co_payment: No Co-pay, 10%, 15%, 20%, 25%, 30%, 40%
- parental_co_pay: No Copay, 10%, 15%, 20%, 25%, 30%
- parent_si_restriction: Not Covered, 25% of Family SI, 50% of Family SI, 75% of Family SI, Upto FSI
- corporate_buffer: NO CB, 0, 200000, 300000, 500000, 1000000
- corporate_buffer_type: CI Restriction, Open to All
- domiciliary_hospitalization: Covered, Not Covered
- cyber_knife_stem_cell: Covered, Not Covered
- ayush_benefit: Not Covered, Upto 25% of FSI, Upto 50% of FSI, Upto FSI
- psychiatric_treatment: Covered upto 50K, Not Covered, Covered upto 1 Lac, Covered upto FSI
- modern_treatment: Not Covered, Upto 25% of FSI, Upto 50% of FSI, Upto FSI
- air_ambulance: Covered, Not Covered
- reasonable_customary_charges: Applicable, Not Applicable
- premium_rate_chart: Per Life-Age Band wise, Per Family-Age Band wise, Flat Per Life, Flat per Family
- installment_type: Monthly, Quarterly, Half Yearly, Annual
- addition_of_member: Pro Rata, Annual Premium
- deletion_of_member: Pro Rata, NIL refund
- are_all_employees_covered: Yes, No
- is_ppn_clause_applicable: Yes, No
- insurer_type: PSU, NON PSU
- terms_market_rollover: Expiring Terms, Proposed Terms
- is_emoha: Applicable, Not Applicable
- family_definition: Self Only, Self+Spouse, Self+Spouse+1Kids, Self+Spouse+2Kids, Self+Spouse+3Kids, Self+Spouse+4Kids, Self+Spouse+2Kids+2 Dependent Parents, Self+Spouse+2Kids+4 Dependent Parents (and similar combinations)
`;

// ── Extraction Prompt ─────────────────────────────────────────────────────────

function buildPrompt(documentTexts) {
  const correctionExamples = buildCorrectionExamples();
  const combinedText = documentTexts
    .map((t, i) => `=== DOCUMENT ${i + 1} ===\n${t.slice(0, 8000)}`) // cap per doc
    .join('\n\n');

  return `You are an expert Group Health Insurance RFQ analyst. Extract structured data from the following insurance RFQ documents.

${LOV_SUMMARY}
${correctionExamples}
INSTRUCTIONS:
1. For each field below, extract the value from the document(s).
2. Set "status" to:
   - "extracted" if the value is clearly present and matches an allowed LOV value
   - "clarification" if a value is present but ambiguous, conflicts between documents, or doesn't match the LOV
   - "missing" if the field is not mentioned anywhere
3. Add a "note" only for "clarification" or "missing" fields explaining why.
4. For LOV fields, ALWAYS use exact values from the master list above.
5. For numeric fields like maternity limits, return just the number (e.g. "50000" not "50,000" or "50K").
6. If multiple documents are provided, synthesize information across all of them.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "productInfo": {
    "product_type": {"value": "...", "status": "extracted|clarification|missing", "note": "..."},
    "sub_product_type": {"value": "...", "status": "...", "note": "..."},
    "quote_type": {"value": "...", "status": "...", "note": "..."},
    "business_type": {"value": "...", "status": "...", "note": "..."},
    "quote_with_member_data": {"value": "...", "status": "...", "note": "..."},
    "enterprise_type": {"value": "...", "status": "...", "note": "..."}
  },
  "corporateDetails": {
    "corporate_name": {"value": "...", "status": "...", "note": "..."},
    "industry_name": {"value": "...", "status": "...", "note": "..."},
    "location": {"value": "...", "status": "...", "note": "..."},
    "zone": {"value": "...", "status": "...", "note": "..."}
  },
  "policyDetails": {
    "sum_insured_type": {"value": "...", "status": "...", "note": "..."},
    "sum_insured_structure": {"value": "...", "status": "...", "note": "..."},
    "sum_insured_value": {"value": "...", "status": "...", "note": "..."},
    "family_definition": {"value": "...", "status": "...", "note": "..."},
    "policy_start_date": {"value": "...", "status": "...", "note": "..."},
    "policy_end_date": {"value": "...", "status": "...", "note": "..."}
  },
  "demographics": {
    "number_of_employees": {"value": "...", "status": "...", "note": "..."},
    "number_of_spouse": {"value": "...", "status": "...", "note": "..."},
    "number_of_children": {"value": "...", "status": "...", "note": "..."},
    "number_of_parents": {"value": "...", "status": "...", "note": "..."},
    "total_lives": {"value": "...", "status": "...", "note": "..."}
  },
  "existingPolicy": {
    "insurer_type": {"value": "...", "status": "...", "note": "..."},
    "existing_insurer_name": {"value": "...", "status": "...", "note": "..."},
    "existing_tpa": {"value": "...", "status": "...", "note": "..."},
    "previous_policy_no": {"value": "...", "status": "...", "note": "..."},
    "existing_policy_start_date": {"value": "...", "status": "...", "note": "..."},
    "existing_policy_end_date": {"value": "...", "status": "...", "note": "..."},
    "existing_family_definition": {"value": "...", "status": "...", "note": "..."},
    "inception_premium": {"value": "...", "status": "...", "note": "..."},
    "as_on_date_premium": {"value": "...", "status": "...", "note": "..."},
    "terms_market_rollover": {"value": "...", "status": "...", "note": "..."},
    "lives_at_inception": {"value": "...", "status": "...", "note": "..."}
  },
  "claimsExperience": {
    "incurred_claims_paid": {"value": "...", "status": "...", "note": "..."},
    "incurred_claims_paid_count": {"value": "...", "status": "...", "note": "..."},
    "incurred_claims_outstanding": {"value": "...", "status": "...", "note": "..."},
    "incurred_claims_outstanding_count": {"value": "...", "status": "...", "note": "..."},
    "incurred_claims_rejection": {"value": "...", "status": "...", "note": "..."},
    "total_incurred_claims": {"value": "...", "status": "...", "note": "..."},
    "total_incurred_claims_count": {"value": "...", "status": "...", "note": "..."},
    "claim_analysis_date": {"value": "...", "status": "...", "note": "..."}
  },
  "coverBenefits": {
    "ped": {"value": "...", "status": "...", "note": "..."},
    "thirty_day_waiting": {"value": "...", "status": "...", "note": "..."},
    "two_year_waiting": {"value": "...", "status": "...", "note": "..."},
    "external_congenital": {"value": "...", "status": "...", "note": "..."},
    "domestic_emergency": {"value": "...", "status": "...", "note": "..."},
    "infertility_treatment": {"value": "...", "status": "...", "note": "..."},
    "baby_day_one": {"value": "...", "status": "...", "note": "..."},
    "pre_post_hospitalization": {"value": "...", "status": "...", "note": "..."},
    "corporate_wellness": {"value": "...", "status": "...", "note": "..."},
    "maternity_normal": {"value": "...", "status": "...", "note": "..."},
    "maternity_c_section": {"value": "...", "status": "...", "note": "..."},
    "normal_room_rent": {"value": "...", "status": "...", "note": "..."},
    "icu_rent": {"value": "...", "status": "...", "note": "..."},
    "pre_post_natal": {"value": "...", "status": "...", "note": "..."},
    "cataract": {"value": "...", "status": "...", "note": "..."},
    "disease_sub_limits": {"value": "...", "status": "...", "note": "..."},
    "lasik": {"value": "...", "status": "...", "note": "..."},
    "opd": {"value": "...", "status": "...", "note": "..."},
    "ambulance": {"value": "...", "status": "...", "note": "..."},
    "ambulance_amount": {"value": "...", "status": "...", "note": "..."},
    "co_payment": {"value": "...", "status": "...", "note": "..."},
    "parental_co_pay": {"value": "...", "status": "...", "note": "..."},
    "parent_si_restriction": {"value": "...", "status": "...", "note": "..."}
  },
  "bufferAndSpecial": {
    "corporate_buffer": {"value": "...", "status": "...", "note": "..."},
    "corporate_buffer_type": {"value": "...", "status": "...", "note": "..."},
    "domiciliary_hospitalization": {"value": "...", "status": "...", "note": "..."},
    "cyber_knife_stem_cell": {"value": "...", "status": "...", "note": "..."},
    "ayush_benefit": {"value": "...", "status": "...", "note": "..."},
    "psychiatric_treatment": {"value": "...", "status": "...", "note": "..."},
    "modern_treatment": {"value": "...", "status": "...", "note": "..."},
    "air_ambulance": {"value": "...", "status": "...", "note": "..."},
    "reasonable_customary_charges": {"value": "...", "status": "...", "note": "..."},
    "special_conditions": {"value": "...", "status": "...", "note": "..."}
  },
  "channelDetails": {
    "broker": {"value": "...", "status": "...", "note": "..."},
    "tpa": {"value": "...", "status": "...", "note": "..."},
    "channel_name": {"value": "...", "status": "...", "note": "..."},
    "channel_code": {"value": "...", "status": "...", "note": "..."},
    "sm_contact": {"value": "...", "status": "...", "note": "..."},
    "sm_email": {"value": "...", "status": "...", "note": "..."},
    "channel_mobile": {"value": "...", "status": "...", "note": "..."},
    "alternate_email_1": {"value": "...", "status": "...", "note": "..."},
    "alternate_sm_contact_1": {"value": "...", "status": "...", "note": "..."},
    "alternate_email_2": {"value": "...", "status": "...", "note": "..."},
    "alternate_sm_contact_2": {"value": "...", "status": "...", "note": "..."},
    "brokerage_pct": {"value": "...", "status": "...", "note": "..."},
    "premium_rate_chart": {"value": "...", "status": "...", "note": "..."},
    "installment_type": {"value": "...", "status": "...", "note": "..."},
    "is_emoha": {"value": "...", "status": "...", "note": "..."},
    "quote_rewards_pct": {"value": "...", "status": "...", "note": "..."},
    "addition_of_member": {"value": "...", "status": "...", "note": "..."},
    "deletion_of_member": {"value": "...", "status": "...", "note": "..."}
  },
  "restrictions": {
    "are_all_employees_covered": {"value": "...", "status": "...", "note": "..."},
    "is_ppn_clause_applicable": {"value": "...", "status": "...", "note": "..."}
  }
}

DOCUMENTS TO ANALYSE:
${combinedText}`;
}

// ── AI Extraction ─────────────────────────────────────────────────────────────

async function extractWithOpenAI(prompt) {
  const openai = getOpenAI();
  if (!openai) throw new Error('OpenAI API key not configured');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 4096,
    response_format: { type: 'json_object' }
  });
  return response.choices[0].message.content;
}

async function extractWithClaude(prompt) {
  const anthropic = getAnthropic();
  if (!anthropic) throw new Error('Anthropic API key not configured');
  console.log('[RFQ-EXTRACT] Calling Claude API...');
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      messages: [{ role: 'user', content: prompt }],
      system: 'You are an expert Group Health Insurance analyst. Always respond with valid JSON only, no markdown.'
    });
    const textBlock = response.content.find(b => b.type === 'text');
    return textBlock ? textBlock.text : '';
  } catch (err) {
    console.error('[RFQ-EXTRACT] Claude API error details:', err.status, err.message, JSON.stringify(err.error || {}));
    throw err;
  }
}

// ── Main Export ───────────────────────────────────────────────────────────────

export async function extractRfqData(files) {
  // 1. Extract text from all uploaded files
  console.log(`[RFQ-EXTRACT] Extracting text from ${files.length} file(s)...`);
  const documentTexts = await Promise.all(files.map(extractText));

  // 2. Build the prompt (with LOV + learned corrections)
  const prompt = buildPrompt(documentTexts);
  const correctionCount = loadCorrections().length;
  console.log(`[RFQ-EXTRACT] Prompt built. ${correctionCount} corrections in learning pool.`);

  // 3. Try GPT-4o first, fall back to Claude
  let rawJson = null;
  let provider = null;

  if (getOpenAI()) {
    try {
      console.log('[RFQ-EXTRACT] Trying GPT-4o...');
      rawJson = await extractWithOpenAI(prompt);
      provider = 'gpt-4o';
      console.log('[RFQ-EXTRACT] GPT-4o succeeded.');
    } catch (err) {
      console.warn('[RFQ-EXTRACT] GPT-4o failed:', err.message, '— falling back to Claude...');
    }
  }

  if (!rawJson && getAnthropic()) {
    try {
      console.log('[RFQ-EXTRACT] Trying Claude...');
      rawJson = await extractWithClaude(prompt);
      provider = 'claude';
      console.log('[RFQ-EXTRACT] Claude succeeded.');
    } catch (err) {
      console.error('[RFQ-EXTRACT] Claude also failed:', err.message);
      throw new Error(`Claude extraction failed: ${err.message}`);
    }
  }

  if (!rawJson) throw new Error('No AI provider available. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in .env');

  // 4. Clean and parse the response
  // Strip markdown code fences if present (e.g. ```json ... ```)
  console.log('[RFQ-EXTRACT] Raw response length:', rawJson.length);
  console.log('[RFQ-EXTRACT] Raw response (last 300 chars):', JSON.stringify(rawJson.slice(-300)));
  let cleanJson = rawJson.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  // Also try to extract JSON object if there's extra text before/after
  const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanJson = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(cleanJson);
    parsed._meta = {
      provider,
      files: files.map(f => f.originalname),
      correctionPoolSize: correctionCount,
      extractedAt: new Date().toISOString()
    };
    return parsed;
  } catch (err) {
    console.error('[RFQ-EXTRACT] JSON parse failed. Raw output:', rawJson.slice(0, 500));
    throw new Error('AI returned invalid JSON. Please retry.');
  }
}
