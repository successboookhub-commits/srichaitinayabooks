/**
 * Strip all non-alphanumeric characters and convert to lowercase.
 * e.g. "AP-SET (Paper-1)" -> "apsetpaper1"
 */
export function stripAll(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Normalize whitespace and replace punctuation with single spaces.
 * e.g. "AP-SET / NET" -> "ap set net"
 */
export function normalize(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns true if the query matches the target text in a fuzzy, resilient way:
 * 1. Matches stripped without spaces/hyphens (e.g. "apset" in "AP-SET")
 * 2. Matches all query tokens in any order (e.g. "constable police" in "POLICE CONSTABLE")
 * 3. Case-insensitive substring match
 */
export function fuzzyMatch(targetText, query) {
  if (!query || !query.trim()) return true;
  if (!targetText) return false;

  const targetNorm = normalize(targetText);
  const targetStripped = stripAll(targetText);

  const qNorm = normalize(query);
  const qStripped = stripAll(query);

  // 1. Direct stripped match (handles "apset" matching "AP-SET", "shineindia" matching "SHINE INDIA")
  if (qStripped.length >= 2 && targetStripped.includes(qStripped)) {
    return true;
  }

  // 2. Direct normalized substring match
  if (targetNorm.includes(qNorm)) {
    return true;
  }

  // 3. Multi-token match: all tokens in query must appear in target
  const tokens = qNorm.split(' ').filter(Boolean);
  if (tokens.length > 1) {
    const allTokensMatch = tokens.every((token) => {
      const tokenStripped = stripAll(token);
      return targetNorm.includes(token) || targetStripped.includes(tokenStripped);
    });
    if (allTokensMatch) return true;
  }

  return false;
}

