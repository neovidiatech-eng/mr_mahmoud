/**
 * Flattens bilingual `field_ar`/`field_en` columns into a single `field` key
 * for the requester's language, while keeping the raw `_ar`/`_en` values on
 * the object too (admin screens still need both to edit either language).
 * Falls back to the other language if the requested one is empty.
 */
export const localize = (record, fields, lang = "en") => {
  if (!record) return record;

  const result = { ...record };
  for (const field of fields) {
    const arKey = `${field}_ar`;
    const enKey = `${field}_en`;
    if (arKey in record || enKey in record) {
      result[field] = lang === "ar" ? (record[arKey] ?? record[enKey]) : (record[enKey] ?? record[arKey]);
    }
  }
  return result;
};

export const localizeMany = (records, fields, lang = "en") =>
  Array.isArray(records) ? records.map((r) => localize(r, fields, lang)) : records;

/**
 * Applies `localize` to `data` (or `data.items` for paginated list shapes)
 * in place, returning the same shape it received.
 */
export const localizeResponse = (data, fields, lang = "en") => {
  if (!data) return data;
  if (Array.isArray(data)) return localizeMany(data, fields, lang);
  if (Array.isArray(data.items)) {
    return { ...data, items: localizeMany(data.items, fields, lang) };
  }
  return localize(data, fields, lang);
};
