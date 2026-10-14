/**
 * Rates – whole house, up to 10 guests, per night.
 * INCLUDED: final cleaning, bed linen & towels, electricity, heating (incl. wood), Wi-Fi, parking,
 * Alpbachtal Card. EXCLUDED: tourist tax (€3.50 per person 15+ per night), dogs, extra services.
 * Launch price list (phase A) derived in the business case (kept outside this public repository) – to be
 * approved by the host before go-live. Dates are inclusive arrival nights (from ≤ night ≤ to).
 */
export type SeasonKey = 'low' | 'shoulder' | 'winter' | 'summer' | 'peak' | 'festive';

export const SEASONS: Record<SeasonKey, { rate: number; minNights: number; de: string; en: string; deShort: string; enShort: string }> = {
  low: { rate: 390, minNights: 3, de: 'Nebensaison', en: 'Low season', deShort: 'Nebensaison', enShort: 'Low season' },
  shoulder: { rate: 450, minNights: 4, de: 'Zwischensaison', en: 'Mid season', deShort: 'Zwischensaison', enShort: 'Mid season' },
  winter: { rate: 590, minNights: 5, de: 'Winter', en: 'Winter', deShort: 'Winter', enShort: 'Winter' },
  summer: { rate: 560, minNights: 7, de: 'Sommer-Hochsaison', en: 'Summer high season', deShort: 'Sommer', enShort: 'Summer' },
  peak: { rate: 720, minNights: 7, de: 'Winter-Hochsaison, Weihnachten & Ostern', en: 'Winter high season, Christmas & Easter', deShort: 'Hochsaison', enShort: 'High season' },
  festive: { rate: 1150, minNights: 7, de: 'Silvesterwoche', en: 'New Year week', deShort: 'Silvester', enShort: 'New Year' },
};

/** Calendar. Anything not covered falls back to 'low'. */
export const CALENDAR: { from: string; to: string; season: SeasonKey }[] = [
  { from: '2026-12-19', to: '2026-12-25', season: 'peak' },
  { from: '2026-12-26', to: '2027-01-01', season: 'festive' },
  { from: '2027-01-02', to: '2027-01-06', season: 'peak' },
  { from: '2027-01-07', to: '2027-01-29', season: 'winter' },
  { from: '2027-01-30', to: '2027-03-05', season: 'peak' },
  { from: '2027-03-06', to: '2027-03-19', season: 'winter' },
  { from: '2027-03-20', to: '2027-04-05', season: 'peak' },
  { from: '2027-05-21', to: '2027-07-02', season: 'shoulder' },
  { from: '2027-07-03', to: '2027-08-29', season: 'summer' },
  { from: '2027-08-30', to: '2027-10-03', season: 'shoulder' },
  { from: '2027-12-18', to: '2027-12-24', season: 'peak' },
  { from: '2027-12-25', to: '2028-01-01', season: 'festive' },
  { from: '2028-01-02', to: '2028-01-06', season: 'peak' },
];

export const RULES = {
  shortStay: { belowNights: 3, surcharge: 250 }, // 2-night stays (low season only): + € 250 per stay
  absoluteMinNights: 2,
  dogPerNight: 12, // up to 2 dogs – confirm with host (former agency listing: € 10)
  touristTax: 3.5,
  earlyBird: { monthsAhead: 6, discount: 0.05 },
  longStay: { fromNights: 14, discount: 0.1 },
  currency: 'EUR',
};

export const FROM_PRICE = Math.min(...Object.values(SEASONS).map((s) => s.rate));

export const seasonFor = (isoDate: string): SeasonKey => {
  for (const p of CALENDAR) if (isoDate >= p.from && isoDate <= p.to) return p.season;
  return 'low';
};

/** Rows for the public season table (chronological, merged by season). */
export const SEASON_TABLE = [
  { de: '12. Okt. – 18. Dez. 2026', en: '12 Oct – 18 Dec 2026', season: 'low' },
  { de: '19. – 25. Dez. 2026 (Weihnachten)', en: '19 – 25 Dec 2026 (Christmas)', season: 'peak' },
  { de: '26. Dez. 2026 – 1. Jän. 2027 (Silvester)', en: '26 Dec 2026 – 1 Jan 2027 (New Year)', season: 'festive' },
  { de: '2. – 6. Jän. 2027', en: '2 – 6 Jan 2027', season: 'peak' },
  { de: '7. – 29. Jän. 2027', en: '7 – 29 Jan 2027', season: 'winter' },
  { de: '30. Jän. – 5. März 2027', en: '30 Jan – 5 Mar 2027', season: 'peak' },
  { de: '6. – 19. März 2027', en: '6 – 19 Mar 2027', season: 'winter' },
  { de: '20. März – 5. Apr. 2027 (Ostern)', en: '20 Mar – 5 Apr 2027 (Easter)', season: 'peak' },
  { de: '6. Apr. – 20. Mai 2027', en: '6 Apr – 20 May 2027', season: 'low' },
  { de: '21. Mai – 2. Juli 2027', en: '21 May – 2 Jul 2027', season: 'shoulder' },
  { de: '3. Juli – 29. Aug. 2027', en: '3 Jul – 29 Aug 2027', season: 'summer' },
  { de: '30. Aug. – 3. Okt. 2027', en: '30 Aug – 3 Oct 2027', season: 'shoulder' },
  { de: '4. Okt. – 17. Dez. 2027', en: '4 Oct – 17 Dec 2027', season: 'low' },
] as const;
