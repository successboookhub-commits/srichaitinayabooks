// Sri Chaitanya Book Center - Smart Book Title Capitalization Utility
// Converts ALL CAPS titles to clean, professional Title Case while preserving standard acronyms (SI, AP, TGPSC, etc.)

const PRESERVED_ACRONYMS = new Set([
  'AP', 'TS', 'TG', 'APPSC', 'TGPSC', 'SI', 'PC', 'TET', 'DSC', 'RRB', 'NTPC',
  'SSC', 'CGL', 'CHSL', 'GD', 'UPSC', 'IAS', 'IPS', 'IFS', 'PYQ', 'PYQS', 'MCQ',
  'MCQS', 'GK', 'GS', 'TM', 'EM', 'PDF', 'TJR', 'AK', 'RC', 'ALP', 'CBSE', 'NCERT',
  'SCERT', 'B.ED', 'D.ED', 'S.I.', 'D.NO'
]);

const ROMAN_NUMERALS = /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$/i;

// Connecting words that stay lowercase in the middle of a title
const MINOR_WORDS = new Set(['and', 'or', 'for', 'of', 'in', 'on', 'at', 'to', 'by', 'with', 'the', 'a', 'an']);

function formatSingleWord(word, isFirstWord = false) {
  if (!word) return '';

  const cleanAlnum = word.replace(/[^A-Za-z0-9]/g, '');
  const upperClean = cleanAlnum.toUpperCase();

  // If word is a recognized exam acronym or Roman numeral, keep uppercase
  if (PRESERVED_ACRONYMS.has(upperClean)) {
    return word.toUpperCase();
  }

  if (ROMAN_NUMERALS.test(cleanAlnum)) {
    return word.toUpperCase();
  }

  // Handle numbers with letters like 10MONTH -> 10 Month, 1st, 2nd
  if (/^\d+[A-Za-z]+$/.test(word)) {
    const match = word.match(/^(\d+)([A-Za-z]+)$/);
    if (match) {
      const num = match[1];
      const suff = match[2];
      if (/^(st|nd|rd|th)$/i.test(suff)) {
        return num + suff.toLowerCase();
      }
      return num + ' ' + suff.charAt(0).toUpperCase() + suff.slice(1).toLowerCase();
    }
  }

  // Preserve pure numbers and decimals (e.g. 2026, 4.0)
  if (/^\d/.test(word)) {
    return word;
  }

  const lower = word.toLowerCase();
  if (!isFirstWord && MINOR_WORDS.has(lower)) {
    return lower;
  }

  // Capitalize first letter, lowercase the rest
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function toTitleCase(title) {
  if (!title || typeof title !== 'string') return title || '';
  const trimmed = title.trim();
  if (!trimmed) return '';

  // Match words, including those with apostrophes ('s), ampersands, or hyphens
  return trimmed.replace(/[A-Za-z0-9]+(?:['’][A-Za-z]+)?/g, (match, offset) => {
    const isFirstWord = (offset === 0);

    // Handle apostrophes like CHARY'S -> Chary's
    if (match.includes("'") || match.includes('’')) {
      const q = match.includes("'") ? "'" : '’';
      const parts = match.split(q);
      const base = formatSingleWord(parts[0], isFirstWord);
      const suffix = parts[1] ? parts[1].toLowerCase() : '';
      return `${base}${q}${suffix}`;
    }

    return formatSingleWord(match, isFirstWord);
  });
}

export default toTitleCase;
