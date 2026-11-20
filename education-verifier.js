/**
 * education-verifier.js
 * AI-powered education document extraction + ARM comparison + rules engine
 * Uses Claude Vision (primary) or GPT-4V (fallback) to extract text from certificate images
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── ARM data loader ─────────────────────────────────────────────────────────

let _armData = null;

function loadArmData() {
  if (_armData) return _armData;
  const filePath = path.join(__dirname, 'data', 'arm-prospects.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  _armData = JSON.parse(raw);
  return _armData;
}

export function getProspectById(prospectId) {
  const arm = loadArmData();
  return arm.prospects.find(p => p.prospect_id === prospectId) || null;
}

export function getAllProspects() {
  const arm = loadArmData();
  return arm.prospects;
}

// ─── AI extraction prompt ─────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are a document extraction specialist for Indian education certificates.

Analyze this education certificate image carefully and extract the following fields.

Return ONLY a valid JSON object with exactly these keys:
{
  "candidate_name": "full name EXACTLY as printed on certificate — preserve original word order and case",
  "candidate_name_normalized": "normalized form: FirstName Surname only. Indian certificates often print names as 'Surname FirstName FathersName' — rewrite as 'FirstName Surname' (drop patronymic/father's name). Example: 'PATIL CHARULATA DIPAK' → 'CHARULATA PATIL'. If name is already FirstName Surname order or you cannot determine order, repeat same as candidate_name.",
  "roll_number": "examination roll number or registration number",
  "passing_year": "4-digit year of passing the examination (YYYY format)",
  "qualification_type": "e.g. '10th' / 'SSC' / 'SSLC' / 'Matriculation' / '12th' / 'HSC' / 'HSSC' / 'Intermediate' / 'B.Sc' / 'B.Com' / 'Graduation' / etc.",
  "institution_name": "name of school/college if visible",
  "board_name": "name of examining board/university",
  "result": "PASS / FAIL / COMPARTMENT / PROMOTED / unknown",
  "confidence": {
    "candidate_name": 0.0-1.0,
    "roll_number": 0.0-1.0,
    "passing_year": 0.0-1.0,
    "qualification_type": 0.0-1.0
  },
  "notes": "any important observations — partial view, unclear text, unusual format, language other than English, etc."
}

Rules for extraction:
- candidate_name: Extract EXACTLY as printed. Do NOT guess or correct spellings.
- candidate_name_normalized: Normalize to 'FirstName Surname' order for Indian names. Many Indian boards print 'SURNAME FIRSTNAME FATHERSNAME' — identify and reorder. If unsure, use same as candidate_name.
- passing_year: Look for year of exam, year of passing, date on certificate. Extract only YYYY.
- If the certificate is for Class 11 / Grade 11 with FAIL result, note this clearly — it means 10th Pass equivalent.
- If a field is not visible or cannot be determined, use null.
- Be precise. Do not fabricate data.`;

// ─── Claude Vision extraction ─────────────────────────────────────────────────

async function extractWithClaude(imageBuffer, mimeType) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const base64Image = imageBuffer.toString('base64');

  const response = await client.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  });

  const text = response.content[0].text.trim();
  // Extract JSON from response (may have markdown code fences)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude did not return valid JSON');
  return JSON.parse(jsonMatch[0]);
}

// ─── GPT-4V extraction ────────────────────────────────────────────────────────

async function extractWithGPT4V(imageBuffer, mimeType) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const base64Image = imageBuffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64Image}`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: dataUri, detail: 'high' },
          },
          {
            type: 'text',
            text: EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  });

  const text = response.choices[0].message.content.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('GPT-4V did not return valid JSON');
  return JSON.parse(jsonMatch[0]);
}

// ─── Main extraction dispatcher ───────────────────────────────────────────────

export async function extractEducationData(imageBuffer, mimeType) {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  let extracted = null;
  let provider = null;
  let extractionError = null;

  // Try Claude first (better at Indian documents), fallback to GPT-4V
  if (hasAnthropic) {
    try {
      extracted = await extractWithClaude(imageBuffer, mimeType);
      provider = 'claude-opus-4-5';
    } catch (err) {
      extractionError = err.message;
      console.warn('[EduVerify] Claude extraction failed:', err.message);
    }
  }

  if (!extracted && hasOpenAI) {
    try {
      extracted = await extractWithGPT4V(imageBuffer, mimeType);
      provider = 'gpt-4o';
    } catch (err) {
      extractionError = err.message;
      console.warn('[EduVerify] GPT-4V extraction failed:', err.message);
    }
  }

  if (!extracted) {
    throw new Error(extractionError || 'No AI provider configured. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env');
  }

  return { extracted, provider };
}

// ─── Name comparison utilities ────────────────────────────────────────────────

function normalizeName(name) {
  if (!name) return '';
  return name
    .toUpperCase()
    .replace(/\./g, ' ')
    .replace(/[^A-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Remove common honorific prefixes before comparison
const HONORIFIC_PREFIXES = ['SRI', 'SHRI', 'SMT', 'KUM', 'KUMARI', 'MR', 'MRS', 'MS', 'DR', 'LATE', 'SHRIMATI'];

function removeHonorifics(name) {
  const parts = name.split(' ');
  while (parts.length > 1 && HONORIFIC_PREFIXES.includes(parts[0])) {
    parts.shift();
  }
  return parts.join(' ');
}

/**
 * Compare two names and return a similarity assessment.
 * Returns: { match: 'exact'|'partial'|'no_match', score: 0.0-1.0, detail: string }
 */
function compareNames(armName, docName) {
  if (!armName || !docName) {
    return { match: 'no_match', score: 0, detail: 'One or both names are missing' };
  }

  const armNorm = removeHonorifics(normalizeName(armName));
  const docNorm = removeHonorifics(normalizeName(docName));

  // Exact match after normalization
  if (armNorm === docNorm) {
    return { match: 'exact', score: 1.0, detail: 'Names match exactly after normalization' };
  }

  // Sort words and compare (handles name order differences)
  const armWords = armNorm.split(' ').sort();
  const docWords = docNorm.split(' ').sort();
  if (armWords.join(' ') === docWords.join(' ')) {
    return {
      match: 'exact',
      score: 1.0,
      detail: 'Names match — word order differs (e.g. surname first on document)',
    };
  }

  // Word overlap score
  const armSet = new Set(armWords.filter(w => w.length > 1));
  const docSet = new Set(docWords.filter(w => w.length > 1));
  const intersection = [...armSet].filter(w => docSet.has(w));
  const union = new Set([...armSet, ...docSet]);
  const jaccardScore = union.size > 0 ? intersection.length / union.size : 0;

  // Check if doc name is a subset of ARM name (partial name on document)
  const docWordsArr = docNorm.split(' ').filter(w => w.length > 1);
  const armWordsArr = armNorm.split(' ').filter(w => w.length > 1);
  const isSubset = docWordsArr.every(w => armWordsArr.includes(w));
  const isSuperSet = armWordsArr.every(w => docWordsArr.includes(w));

  if (isSubset && docWordsArr.length >= 1) {
    const ratio = docWordsArr.length / armWordsArr.length;
    return {
      match: ratio >= 0.5 ? 'partial' : 'no_match',
      score: jaccardScore,
      detail: `Document shows partial name — ${docWordsArr.length} of ${armWordsArr.length} words match`,
    };
  }

  if (isSuperSet) {
    const extraWords = docWordsArr.filter(w => !armWordsArr.includes(w));
    const extraCount = extraWords.length;
    // All ARM parts found in document — extra word(s) are likely a patronymic/father's name
    if (extraCount === 1) {
      return {
        match: 'partial',
        score: jaccardScore,
        detail: `All name parts match — document has one extra word "${extraWords[0]}" (likely patronymic/father's name in Indian format)`,
        severity_hint: 'low',
      };
    }
    return {
      match: 'partial',
      score: jaccardScore,
      detail: `Document has additional name components not in ARM: ${extraWords.join(', ')}`,
    };
  }

  // Levenshtein-style check for single-word names or close spelling variants
  if (jaccardScore >= 0.6) {
    return {
      match: 'partial',
      score: jaccardScore,
      detail: `Name partially matches — possible spelling variant (${Math.round(jaccardScore * 100)}% word overlap)`,
    };
  }

  return {
    match: 'no_match',
    score: jaccardScore,
    detail: `Names do not match — ARM: "${armName}" vs Document: "${docName}"`,
  };
}

// ─── Qualification mapping ────────────────────────────────────────────────────

// Maps extracted qualification type (and ARM dropdown values) to a numeric level for comparison
// ARM dropdown exact values mapped here alongside extracted certificate terminology
const QUAL_LEVEL = {
  // Below minimum
  '8th': 1,
  '9th': 2,
  // IRDAI minimum = 3 (Class X / 10th)
  '10th': 3, 'classx': 3, 'class x': 3, 'ssc': 3, 'sslc': 3, 'matriculation': 3, 'matric': 3,
  '11th': 3.5, // 11th fail = 10th pass (IRDAI rule)
  // Class XII / 12th
  '12th': 4, 'classxii': 4, 'class xii': 4, 'classxii': 4, 'hsc': 4, 'hssc': 4,
  'intermediate': 4, 'puc': 4, 'pre-university': 4,
  // Diploma
  'diploma': 5,
  // Degree (Bachelor's / Graduate) — ARM dropdown: "Graduate", "Bachelors of commerce", "Bachelors of engineering"
  'graduate': 6, 'graduation': 6, "bachelor's": 6,
  'bachelorsofcommerce': 6, 'bachelorsofe ngineering': 6,
  'bachelors of commerce': 6, 'bachelors of engineering': 6,
  'b.sc': 6, 'b.com': 6, 'b.a': 6, 'b.tech': 6,
  'b.e': 6, 'b.pharmacy': 6, 'b.pharma': 6, 'mbbs': 6, 'b.ed': 6,
  // Post-Graduate / Masters — ARM dropdown: "Post Graduate", "Masters in commerce", "Masters in engineering", "Masters of business administration"
  'postgraduate': 7, 'post graduate': 7, 'post-graduation': 7, "master's": 7,
  'masters in commerce': 7, 'masters in engineering': 7, 'masters of business administration': 7,
  'm.sc': 7, 'm.com': 7, 'm.a': 7, 'm.tech': 7, 'mba': 7, 'mca': 7,
  // Professional / Associate / Fellow — ARM dropdown: "Associate/fellow of..."
  'associate': 8, 'fellow': 8,
  'associate/fellow of actuarial society of india': 8,
  'associate/fellow of institute of chartered accountants of india': 8,
  'associate/fellow of institute of company secretaries of india': 8,
  'associate/fellow of institute of costs & works accounts of india': 8,
  'associate/fellow of insurance institute of india': 8,
  'ca': 8, 'cs': 8, 'cwa': 8, 'cfa': 8, 'aiii': 8, 'fiii': 8,
};

function getQualLevel(qualStr) {
  if (!qualStr) return 0;
  const lower = qualStr.toLowerCase().replace(/\s+/g, '');
  for (const [key, level] of Object.entries(QUAL_LEVEL)) {
    if (lower.includes(key.replace(/\s+/g, ''))) return level;
  }
  return 0;
}

function normalizeClaimedQual(claimed) {
  if (!claimed) return '';
  const lower = claimed.toLowerCase().replace(/\s+/g, ' ').trim();
  // ARM dropdown exact values — map to display-friendly labels
  if (lower === 'class x' || lower.includes('10th') || lower.includes('tenth') || lower === 'ssc' || lower === 'sslc') return 'Class X';
  if (lower === 'class xii' || lower.includes('12th') || lower.includes('twelfth') || lower === 'hsc' || lower === 'inter') return 'Class XII';
  if (lower === 'graduate' || lower.includes('graduation') || lower.startsWith('bachelors')) return 'Graduate';
  if (lower === 'post graduate' || lower.startsWith('masters') || lower.includes('post-grad') || lower.includes('post grad')) return 'Post Graduate';
  if (lower.startsWith('associate') || lower.startsWith('fellow')) return 'Professional (Associate/Fellow)';
  if (lower === 'other') return 'Other';
  return claimed;
}

// ─── Rules engine ─────────────────────────────────────────────────────────────

/**
 * Rule 1: Name Match
 * Compares extracted name from document against ARM record name.
 */
function ruleNameMatch(extracted, armRecord) {
  // Try matching against verbatim doc name first
  let nameComparison = compareNames(armRecord.name, extracted.candidate_name);

  // If not exact, also try the normalized name (Indian surname-first → FirstName Surname)
  // and use whichever gives the better result
  if (nameComparison.match !== 'exact' && extracted.candidate_name_normalized &&
      extracted.candidate_name_normalized !== extracted.candidate_name) {
    const normalizedComparison = compareNames(armRecord.name, extracted.candidate_name_normalized);
    const rankOf = m => m === 'exact' ? 2 : m === 'partial' ? 1 : 0;
    if (rankOf(normalizedComparison.match) > rankOf(nameComparison.match)) {
      nameComparison = normalizedComparison;
      nameComparison.detail += ' (matched using normalized Indian name format)';
    }
  }

  const docValueDisplay = extracted.candidate_name_normalized && extracted.candidate_name_normalized !== extracted.candidate_name
    ? `${extracted.candidate_name} (normalized: ${extracted.candidate_name_normalized})`
    : extracted.candidate_name;

  if (nameComparison.match === 'exact') {
    return {
      rule_id: 'R01',
      rule_name: 'Name Match',
      status: 'PASS',
      severity: null,
      detail: nameComparison.detail,
      arm_value: armRecord.name,
      doc_value: docValueDisplay,
    };
  }

  if (nameComparison.match === 'partial') {
    // Use severity_hint if the comparison gave us one (e.g. patronymic = low)
    const severity = nameComparison.severity_hint || 'medium';
    return {
      rule_id: 'R01',
      rule_name: 'Name Match',
      status: 'FLAG',
      severity,
      detail: nameComparison.detail,
      arm_value: armRecord.name,
      doc_value: docValueDisplay,
    };
  }

  return {
    rule_id: 'R01',
    rule_name: 'Name Match',
    status: 'FAIL',
    severity: 'high',
    detail: nameComparison.detail,
    arm_value: armRecord.name,
    doc_value: docValueDisplay,
  };
}

// rulePassingYear removed — format validation merged into ruleYearMatch (R02)

/**
 * Rule 3: Minimum qualification — document must show at least 10th Pass (or equivalent)
 * Special case: 11th Fail = 10th Pass (IRDAI rule)
 */
function ruleMinimumQualification(extracted, armRecord) {
  const docQual = extracted.qualification_type;
  const docResult = (extracted.result || '').toUpperCase();
  const claimedQual = armRecord.claimed_qualification;

  // ARM "Other" = ambiguous — cannot confirm IRDAI minimum without manual review
  if (claimedQual && claimedQual.toLowerCase() === 'other') {
    return {
      rule_id: 'R03',
      rule_name: 'Minimum Qualification (10th)',
      status: 'FLAG',
      severity: 'medium',
      detail: 'ARM qualification is "Other" — cannot auto-confirm IRDAI minimum (Class X). Manual review required.',
      arm_value: claimedQual,
      doc_value: docQual || null,
    };
  }

  if (!docQual) {
    return {
      rule_id: 'R03',
      rule_name: 'Minimum Qualification (10th)',
      status: 'FLAG',
      severity: 'high',
      detail: 'Could not determine qualification type from document',
      arm_value: claimedQual,
      doc_value: null,
    };
  }

  // Special IRDAI rule: 11th Fail counts as 10th Pass
  const is11thFail =
    (docQual.toLowerCase().includes('11') || docQual.toLowerCase().includes('xi')) &&
    (docResult === 'FAIL' || docResult === 'FAILED' || docResult === 'COMPARTMENT');

  const effectiveLevel = is11thFail ? 3 : getQualLevel(docQual); // 10th = 3
  const claimedLevel = getQualLevel(normalizeClaimedQual(claimedQual));

  const minRequired = 3; // 10th Pass

  if (effectiveLevel < minRequired) {
    return {
      rule_id: 'R03',
      rule_name: 'Minimum Qualification (10th)',
      status: 'FAIL',
      severity: 'high',
      detail: `Document shows qualification below 10th — "${docQual}" ${docResult !== 'unknown' ? `(${docResult})` : ''}`,
      arm_value: claimedQual,
      doc_value: docQual,
    };
  }

  // Check if document supports claimed qualification
  if (claimedLevel > 0 && effectiveLevel < claimedLevel) {
    return {
      rule_id: 'R03',
      rule_name: 'Minimum Qualification (10th)',
      status: 'FLAG',
      severity: 'high',
      detail: `Document shows "${docQual}" but ARM claims "${claimedQual}" — qualification mismatch`,
      arm_value: claimedQual,
      doc_value: docQual + (is11thFail ? ' (11th Fail = 10th Pass)' : ''),
    };
  }

  if (effectiveLevel > claimedLevel && claimedLevel > 0) {
    return {
      rule_id: 'R03',
      rule_name: 'Minimum Qualification (10th)',
      status: 'PASS',
      severity: null,
      detail: `Document shows higher qualification than claimed — "${docQual}" exceeds "${claimedQual}"${is11thFail ? ' (11th Fail = 10th Pass rule applied)' : ''}`,
      arm_value: claimedQual,
      doc_value: docQual,
    };
  }

  return {
    rule_id: 'R03',
    rule_name: 'Minimum Qualification (10th)',
    status: 'PASS',
    severity: null,
    detail: `Qualification "${docQual}" meets minimum requirement${is11thFail ? ' (11th Fail = 10th Pass rule applied)' : ''}`,
    arm_value: claimedQual,
    doc_value: docQual,
  };
}

/**
 * Rule 4: Roll Number — must be present AND should match ARM record
 * If ARM has a roll_number, compare against document.
 * Handles suffix/prefix format variations (e.g. "GA20180056" vs "0056").
 */
function ruleRollNumber(extracted, armRecord) {
  const docRoll = extracted.roll_number ? String(extracted.roll_number).trim().toUpperCase() : null;
  const armRoll = armRecord && armRecord.roll_number ? String(armRecord.roll_number).trim().toUpperCase() : null;

  if (!docRoll) {
    return {
      rule_id: 'R04',
      rule_name: 'Roll Number',
      status: 'FAIL',
      severity: 'high',
      detail: 'Roll number not found on document — document may be incomplete or illegible',
      arm_value: armRoll,
      doc_value: null,
    };
  }

  // If ARM has no roll number, just confirm presence on document
  if (!armRoll) {
    return {
      rule_id: 'R04',
      rule_name: 'Roll Number',
      status: 'PASS',
      severity: null,
      detail: `Roll number "${docRoll}" present on document (no ARM reference to compare)`,
      arm_value: null,
      doc_value: docRoll,
    };
  }

  // Exact match
  if (docRoll === armRoll) {
    return {
      rule_id: 'R04',
      rule_name: 'Roll Number',
      status: 'PASS',
      severity: null,
      detail: `Roll number matches ARM record exactly`,
      arm_value: armRoll,
      doc_value: docRoll,
    };
  }

  // Suffix match — e.g. ARM "GA20180056" ends with doc "0056"
  if (armRoll.endsWith(docRoll) || docRoll.endsWith(armRoll)) {
    return {
      rule_id: 'R04',
      rule_name: 'Roll Number',
      status: 'FLAG',
      severity: 'low',
      detail: `Roll number is a suffix match — ARM "${armRoll}" vs document "${docRoll}" (possible format variation)`,
      arm_value: armRoll,
      doc_value: docRoll,
    };
  }

  // Contains match — one is a substring of the other
  if (armRoll.includes(docRoll) || docRoll.includes(armRoll)) {
    return {
      rule_id: 'R04',
      rule_name: 'Roll Number',
      status: 'FLAG',
      severity: 'low',
      detail: `Roll number partially matches — ARM "${armRoll}" vs document "${docRoll}" (format variation likely)`,
      arm_value: armRoll,
      doc_value: docRoll,
    };
  }

  return {
    rule_id: 'R04',
    rule_name: 'Roll Number',
    status: 'FAIL',
    severity: 'high',
    detail: `Roll number does not match ARM record`,
    arm_value: armRoll,
    doc_value: docRoll,
  };
}

/**
 * Rule 2: Year of Passing — format validation + ARM comparison in one rule.
 * Replaces the old split R02 (format only) + R05 (match only).
 */
function ruleYearMatch(extracted, armRecord) {
  const rawYear = extracted.passing_year;
  const armYear = armRecord && armRecord.passing_year ? parseInt(armRecord.passing_year, 10) : null;
  const currentYear = new Date().getFullYear();

  // ── Step 1: format / presence check ──────────────────────────────────────
  if (!rawYear || rawYear === null) {
    return {
      rule_id: 'R02',
      rule_name: 'Year of Passing',
      status: 'FAIL',
      severity: 'high',
      detail: 'Year of passing not found on document',
      arm_value: armYear ? String(armYear) : null,
      doc_value: null,
    };
  }

  const yearStr = String(rawYear).trim();
  const docYear = parseInt(yearStr, 10);

  if (!/^\d{4}$/.test(yearStr)) {
    return {
      rule_id: 'R02',
      rule_name: 'Year of Passing',
      status: 'FAIL',
      severity: 'high',
      detail: `Year format invalid — expected YYYY, got "${yearStr}"`,
      arm_value: armYear ? String(armYear) : null,
      doc_value: yearStr,
    };
  }

  if (docYear < 1960 || docYear > currentYear) {
    return {
      rule_id: 'R02',
      rule_name: 'Year of Passing',
      status: 'FLAG',
      severity: 'medium',
      detail: `Document year ${docYear} is outside expected range (1960–${currentYear})`,
      arm_value: armYear ? String(armYear) : null,
      doc_value: yearStr,
    };
  }

  // ── Step 2: ARM comparison ────────────────────────────────────────────────
  if (!armYear) {
    return {
      rule_id: 'R02',
      rule_name: 'Year of Passing',
      status: 'PASS',
      severity: null,
      detail: `Document year ${docYear} is valid — no ARM year recorded to compare`,
      arm_value: null,
      doc_value: yearStr,
    };
  }

  if (docYear === armYear) {
    return {
      rule_id: 'R02',
      rule_name: 'Year of Passing',
      status: 'PASS',
      severity: null,
      detail: `Year of passing ${docYear} matches ARM record`,
      arm_value: String(armYear),
      doc_value: yearStr,
    };
  }

  const diff = Math.abs(docYear - armYear);
  return {
    rule_id: 'R02',
    rule_name: 'Year of Passing',
    status: 'FLAG',
    severity: diff <= 2 ? 'medium' : 'high',
    detail: `Year mismatch — ARM: ${armYear}, Document: ${docYear} (${diff} year${diff !== 1 ? 's' : ''} difference)`,
    arm_value: String(armYear),
    doc_value: yearStr,
  };
}

/**
 * Rule 6: Board / University Name Match — fuzzy comparison
 */
function ruleBoardMatch(extracted, armRecord) {
  const docBoard = extracted.board_name ? extracted.board_name.trim() : null;
  const armBoard = armRecord && armRecord.board_name ? armRecord.board_name.trim() : null;

  if (!armBoard) {
    return {
      rule_id: 'R05',
      rule_name: 'Board / University Match',
      status: 'PASS',
      severity: null,
      detail: 'Board name not recorded in ARM — skipped',
      arm_value: null,
      doc_value: docBoard,
    };
  }

  if (!docBoard) {
    return {
      rule_id: 'R05',
      rule_name: 'Board / University Match',
      status: 'FLAG',
      severity: 'low',
      detail: 'Board/university name not found on document — cannot verify against ARM',
      arm_value: armBoard,
      doc_value: null,
    };
  }

  const normalize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const armN = normalize(armBoard);
  const docN = normalize(docBoard);

  if (armN === docN) {
    return { rule_id: 'R05', rule_name: 'Board / University Match', status: 'PASS', severity: null,
      detail: 'Board/university name matches ARM record', arm_value: armBoard, doc_value: docBoard };
  }

  // Check if one contains the other or high word overlap (handles abbreviations like "CBSE" vs "Central Board of Secondary Education")
  const armWords = new Set(armN.split(' ').filter(w => w.length > 2));
  const docWords = new Set(docN.split(' ').filter(w => w.length > 2));
  const overlap = [...armWords].filter(w => docWords.has(w));
  const unionSize = new Set([...armWords, ...docWords]).size;
  const jaccardBoard = unionSize > 0 ? overlap.length / unionSize : 0;

  // Check abbreviation: "CBSE" matches "Central Board of Secondary Education"
  const armAbbrev = armN.split(' ').map(w => w[0]).join('');
  const docAbbrev = docN.split(' ').map(w => w[0]).join('');
  const isAbbrevMatch = (armN === docAbbrev || docN === armAbbrev || armAbbrev === docAbbrev);

  if (isAbbrevMatch || jaccardBoard >= 0.5) {
    return {
      rule_id: 'R05',
      rule_name: 'Board / University Match',
      status: 'PASS',
      severity: null,
      detail: isAbbrevMatch
        ? `Board names match (abbreviation form) — ARM: "${armBoard}" / Document: "${docBoard}"`
        : `Board names largely match (${Math.round(jaccardBoard * 100)}% word overlap)`,
      arm_value: armBoard,
      doc_value: docBoard,
    };
  }

  if (jaccardBoard >= 0.25) {
    return {
      rule_id: 'R05',
      rule_name: 'Board / University Match',
      status: 'FLAG',
      severity: 'medium',
      detail: `Board/university name partially matches — ARM: "${armBoard}" vs Document: "${docBoard}"`,
      arm_value: armBoard,
      doc_value: docBoard,
    };
  }

  return {
    rule_id: 'R05',
    rule_name: 'Board / University Match',
    status: 'FLAG',
    severity: 'medium',
    detail: `Board/university name does not match ARM record`,
    arm_value: armBoard,
    doc_value: docBoard,
  };
}

// ─── Main verification function ───────────────────────────────────────────────

/**
 * Full verification pipeline:
 * 1. AI extraction from image
 * 2. ARM lookup
 * 3. Run 4 rules
 * 4. Return structured result
 */
export async function verifyEducationDocument(imageBuffer, mimeType, prospectId, armOverride = null) {
  const startTime = Date.now();

  // Step 1: Load ARM record (use client-side override if provided, else fetch from JSON)
  const armRecord = armOverride || getProspectById(prospectId);
  if (!armRecord) {
    throw new Error(`Prospect ID "${prospectId}" not found in ARM system`);
  }

  // Step 2: AI extraction
  let extracted, provider;
  try {
    ({ extracted, provider } = await extractEducationData(imageBuffer, mimeType));
  } catch (err) {
    return {
      success: false,
      error: err.message,
      prospect_id: prospectId,
      arm_record: armRecord,
      extracted: null,
      rules: [],
      overall_status: 'ERROR',
      processing_time_ms: Date.now() - startTime,
    };
  }

  // Step 3: Run rules engine (5 rules — R02 merges format check + ARM year comparison)
  const rules = [
    ruleNameMatch(extracted, armRecord),
    ruleYearMatch(extracted, armRecord),
    ruleMinimumQualification(extracted, armRecord),
    ruleRollNumber(extracted, armRecord),
    ruleBoardMatch(extracted, armRecord),
  ];

  // Step 4: Verification score (weighted by IRDAI rule importance)
  // 5 rules, weights sum to 100
  // R01 Name, R02 Year (format+match), R03 Qualification, R04 Roll Number, R05 Board
  const RULE_WEIGHTS = { R01: 30, R02: 17, R03: 25, R04: 20, R05: 8 };

  const scoreFactor = (rule) => {
    if (!rule || rule.status === 'PASS') return 1.0;
    const sev = rule.severity_hint || rule.severity;
    if (sev === 'low') return 0.85;
    if (sev === 'medium') return 0.5;
    return 0.0; // high / FAIL
  };

  let rawScore = 0;
  for (const rule of rules) {
    const w = RULE_WEIGHTS[rule.rule_id] || 0;
    rawScore += w * scoreFactor(rule);
  }
  const verification_score = Math.round(rawScore);

  // Score → decision threshold
  let overall_status;
  if (verification_score >= 85) overall_status = 'APPROVE';
  else if (verification_score >= 65) overall_status = 'REVIEW';
  else if (verification_score >= 40) overall_status = 'HIGH_RISK';
  else overall_status = 'REJECT';

  // Per-rule score contribution for UI display
  const score_breakdown = rules.map(r => ({
    rule_id: r.rule_id,
    rule_name: r.rule_name,
    weight: RULE_WEIGHTS[r.rule_id] || 0,
    earned: Math.round((RULE_WEIGHTS[r.rule_id] || 0) * scoreFactor(r)),
    status: r.status,
    severity: r.severity_hint || r.severity || null,
  }));

  return {
    success: true,
    prospect_id: prospectId,
    arm_record: armRecord,
    extracted,
    provider,
    rules,
    overall_status,
    verification_score,
    score_breakdown,
    flags_count: {
      high: rules.filter(r => r.severity === 'high').length,
      medium: rules.filter(r => r.severity === 'medium').length,
      low: rules.filter(r => (r.severity_hint || r.severity) === 'low').length,
      pass: rules.filter(r => r.status === 'PASS').length,
    },
    processing_time_ms: Date.now() - startTime,
  };
}
