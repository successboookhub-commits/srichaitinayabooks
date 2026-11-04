import { query } from '../config/db.js';

// Common exam / education abbreviations and aliases in TS/AP
const SYNONYMS = {
  tspsc: 'tgpsc',
  tgpsc: 'tspsc',
  ts: 'tg',
  tg: 'ts',
  eamcet: 'eapcet',
  eapcet: 'eamcet',
  si: 'sub inspector',
  pc: 'police constable',
  constable: 'pc',
  pyq: 'previous papers',
  'previous papers': 'pyq',
  slet: 'set',
  net: 'ugc net',
};

/**
 * Remove all non-alphanumeric characters and lowercase
 * e.g. "AP-SET (Paper-1)" -> "apsetpaper1"
 */
export function stripAll(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Normalize whitespace and replace punctuation with spaces
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
 * Extract distinct words/tokens from a search string
 */
export function tokenize(str) {
  if (!str) return [];
  const norm = normalize(str);
  return norm.split(' ').filter((t) => t.length > 0);
}

/**
 * Perform smart, resilient search across all active products.
 * Handles:
 * 1. Punctuation & space variations: "apset" matches "AP-SET", "AP SET", "AP_SET"
 * 2. Words in any order: "constable police" matches "POLICE CONSTABLE"
 * 3. Category matching: "apset" or "police" automatically matches products in that category
 * 4. Publication matching: "vijetha", "sandeep", "shine india" matches publication products
 * 5. Common exam aliases: "tspsc" <-> "tgpsc", "eamcet" <-> "eapcet"
 * 6. Relevance scoring: Title matches > Category matches > Publication matches > Description matches
 */
export async function performSmartProductSearch({
  search = '',
  category_id = null,
  publication_id = null,
  featured = false,
  limit = null,
  offset = 0,
}) {
  const rawSearch = (search || '').trim();
  const searchNormalized = normalize(rawSearch);
  const searchStripped = stripAll(rawSearch);
  const searchTokens = tokenize(rawSearch);

  // Expand search with aliases/synonyms
  const expandedTokens = new Set(searchTokens);
  for (const token of searchTokens) {
    if (SYNONYMS[token]) {
      SYNONYMS[token].split(' ').forEach((syn) => expandedTokens.add(syn));
    }
  }

  // 1. Fetch active products with joined publication name
  let sql = `
    SELECT p.*, pub.name AS publication_name
    FROM products p
    LEFT JOIN publications pub ON p.publication_id = pub.id
    WHERE p.is_active = 1
  `;
  const params = [];

  if (category_id) {
    const catList = String(category_id).split(',').map((s) => s.trim()).filter(Boolean);
    if (catList.length === 1) {
      sql += ' AND JSON_CONTAINS(p.category_ids, JSON_QUOTE(?))';
      params.push(catList[0]);
    } else if (catList.length > 1) {
      const clauses = catList.map(() => 'JSON_CONTAINS(p.category_ids, JSON_QUOTE(?))').join(' OR ');
      sql += ` AND (${clauses})`;
      params.push(...catList);
    }
  }

  if (publication_id) {
    sql += ' AND p.publication_id = ?';
    params.push(Number(publication_id));
  }

  if (featured === 'true' || featured === '1' || featured === true) {
    sql += ' AND p.is_featured = 1';
  }

  const allProducts = await query(sql, params);

  // If no search term provided, sort by id DESC and apply limit
  if (!rawSearch) {
    const sorted = allProducts.sort((a, b) => b.id - a.id);
    const sliced = limit ? sorted.slice(offset, offset + Number(limit)) : sorted;
    return {
      total: sorted.length,
      products: sliced,
    };
  }

  // 2. Fetch categories and publications to match search intent against taxonomy
  const [categories, publications] = await Promise.all([
    query('SELECT id, name FROM categories'),
    query('SELECT id, name FROM publications'),
  ]);

  const exactCategoryIds = new Set();
  const partialCategoryIds = new Set();

  for (const cat of categories) {
    const cNorm = normalize(cat.name);
    const cStripped = stripAll(cat.name);

    if (cStripped === searchStripped || cNorm === searchNormalized) {
      exactCategoryIds.add(String(cat.id));
    } else if (
      (searchStripped.length >= 3 && cStripped.includes(searchStripped)) ||
      (cStripped.length >= 3 && searchStripped.includes(cStripped)) ||
      (searchTokens.length > 1 && searchTokens.every((t) => cNorm.includes(t) || cStripped.includes(stripAll(t))))
    ) {
      partialCategoryIds.add(String(cat.id));
    }
  }

  const exactPubIds = new Set();
  const partialPubIds = new Set();

  for (const pub of publications) {
    const pNorm = normalize(pub.name);
    const pStripped = stripAll(pub.name);

    if (pStripped === searchStripped || pNorm === searchNormalized) {
      exactPubIds.add(Number(pub.id));
    } else if (
      (searchStripped.length >= 3 && pStripped.includes(searchStripped)) ||
      (searchTokens.length > 1 && searchTokens.every((t) => pNorm.includes(t) || pStripped.includes(stripAll(t))))
    ) {
      partialPubIds.add(Number(pub.id));
    }
  }

  // 3. Score each product
  const tokenList = Array.from(expandedTokens);
  const scoredProducts = [];

  for (const p of allProducts) {
    const pName = p.name || p.title || '';
    const pDesc = p.description || '';
    const pubName = p.publication_name || '';

    const nameNorm = normalize(pName);
    const nameStripped = stripAll(pName);
    const pubStripped = stripAll(pubName);
    const combinedNorm = `${nameNorm} ${normalize(pubName)} ${normalize(pDesc)}`;
    const combinedStripped = stripAll(combinedNorm);

    let catIds = [];
    if (typeof p.category_ids === 'string') {
      try {
        catIds = JSON.parse(p.category_ids) || [];
      } catch (e) {
        catIds = p.category_ids.split(/[\s,]+/).filter(Boolean);
      }
    } else if (Array.isArray(p.category_ids)) {
      catIds = p.category_ids;
    }
    catIds = catIds.map(String);

    let score = 0;

    // A. Stripped name match (e.g. "apset" in "...apsetpaper1...")
    if (searchStripped.length >= 2 && nameStripped.includes(searchStripped)) {
      score += 250;
      if (nameStripped === searchStripped) score += 150; // exact complete match
      else if (nameNorm.includes(searchNormalized)) score += 80;
    }

    // B. Stripped publication match (e.g. "shineindia" in "SHINE INDIA")
    if (searchStripped.length >= 2 && pubStripped.includes(searchStripped)) {
      score += 150;
    }

    // C. Exact Category Match (e.g. searching "apset" matches Category "AP-SET")
    if (catIds.some((id) => exactCategoryIds.has(id))) {
      score += 180;
    } else if (catIds.some((id) => partialCategoryIds.has(id))) {
      score += 70;
    }

    // D. Publication ID Match
    if (exactPubIds.has(p.publication_id)) {
      score += 140;
    } else if (partialPubIds.has(p.publication_id)) {
      score += 60;
    }

    // E. Token-based matching (words can appear in any order)
    if (tokenList.length > 0) {
      let matchedTokensInName = 0;
      let matchedTokensInAll = 0;

      for (const t of tokenList) {
        const tStripped = stripAll(t);
        if (!tStripped) continue;

        if (nameNorm.includes(t) || nameStripped.includes(tStripped)) {
          matchedTokensInName++;
        }
        if (combinedNorm.includes(t) || combinedStripped.includes(tStripped)) {
          matchedTokensInAll++;
        }
      }

      // Check original query tokens (must be satisfied for multi-word queries)
      const origMatchedInName = searchTokens.filter((t) => {
        const ts = stripAll(t);
        return nameNorm.includes(t) || nameStripped.includes(ts);
      }).length;

      const origMatchedInAll = searchTokens.filter((t) => {
        const ts = stripAll(t);
        return combinedNorm.includes(t) || combinedStripped.includes(ts);
      }).length;

      if (origMatchedInName === searchTokens.length && searchTokens.length > 0) {
        score += 120 + 20 * searchTokens.length;
      } else if (origMatchedInAll === searchTokens.length && searchTokens.length > 0) {
        score += 80 + 10 * searchTokens.length;
      } else {
        score += origMatchedInName * 25 + origMatchedInAll * 10;
      }
    }

    // F. Fallback match in description
    if (searchStripped.length >= 3 && combinedStripped.includes(searchStripped)) {
      score += 30;
    }

    // Threshold for inclusion
    if (score >= 40) {
      scoredProducts.push({
        ...p,
        _searchScore: score,
      });
    }
  }

  // Sort by highest score first, then newest
  scoredProducts.sort((a, b) => b._searchScore - a._searchScore || b.id - a.id);

  const total = scoredProducts.length;
  const sliced = limit ? scoredProducts.slice(offset, offset + Number(limit)) : scoredProducts;

  return {
    total,
    products: sliced,
  };
}

