/**
 * Utility to accurately detect and format the Medium (Telugu Medium / English Medium / Bilingual)
 * of books in Sri Chaitanya Book Centre.
 */

export function detectProductMedium(product) {
  if (!product) return 'Telugu Medium';

  // Explicit property if DB has medium field
  if (product.medium) {
    const m = String(product.medium).toLowerCase().trim();
    if (m.includes('both') || m.includes('bilingual')) return 'Bilingual';
    if (m.includes('telugu') || m === 'tm' || m === 't/m') return 'Telugu Medium';
    if (m.includes('english') || m === 'em' || m === 'e/m') return 'English Medium';
  }

  const name = String(product.name || product.title || '');
  const desc = String(product.description || '');
  const combined = `${name} ${desc}`.toLowerCase();

  // 1. Check Bilingual / Both markers
  if (/\b(bilingual|both tm & em|both em & tm|both medium|telugu & english|english & telugu)\b/i.test(combined)) {
    return 'Bilingual';
  }

  // 2. Check explicit markers in title first (most accurate)
  const isNameTelugu = /\b(telugu medium|t\/m|\(tm\)|\[tm\]|\-tm|\(t\.m\)|తెలుగు మీడియం|తెలుగు మాధ్యమం|తెలుగు అకాడమీ|తెలుగు)\b/i.test(name);
  const isNameEnglish = /\b(english medium|e\/m|\(em\)|\[em\]|\-em|\(e\.m\)|ఇంగ్లీష్ మీడియం)\b/i.test(name);

  if (isNameTelugu && !isNameEnglish) return 'Telugu Medium';
  if (isNameEnglish && !isNameTelugu) return 'English Medium';
  if (isNameTelugu && isNameEnglish) return 'Bilingual';

  // 3. Check Telugu Unicode characters in title (e.g. తెలుగు లిపి)
  if (/[\u0C00-\u0C7F]/.test(name)) {
    return 'Telugu Medium';
  }

  // 4. Check description markers
  const isDescTelugu = /\b(telugu medium|t\/m|\(tm\)|తెలుగు మీడియం)\b/i.test(desc);
  const isDescEnglish = /\b(english medium|e\/m|\(em\)|ఇంగ్లీష్ మీడియం)\b/i.test(desc);

  if (isDescTelugu && !isDescEnglish) return 'Telugu Medium';
  if (isDescEnglish && !isDescTelugu) return 'English Medium';
  if (isDescTelugu && isDescEnglish) return 'Bilingual';

  // 5. Default fallback
  return 'English Medium';
}

export function getMediumBadge(medium) {
  switch (medium) {
    case 'Telugu Medium':
      return {
        label: 'Telugu Medium',
        shortLabel: 'T/M',
        classes: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        dot: 'bg-emerald-500',
      };
    case 'English Medium':
      return {
        label: 'English Medium',
        shortLabel: 'E/M',
        classes: 'bg-sky-50 text-sky-800 border-sky-200/80',
        dot: 'bg-sky-500',
      };
    case 'Bilingual':
      return {
        label: 'Telugu & English',
        shortLabel: 'TM + EM',
        classes: 'bg-purple-50 text-purple-800 border-purple-200/80',
        dot: 'bg-purple-500',
      };
    default:
      return {
        label: medium || 'English Medium',
        shortLabel: 'E/M',
        classes: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

