/**
 * Flattens bilingual `field_ar`/`field_en` columns into a single `field` key
 * for the requester's language. Removes raw `_ar`/`_en` keys by default
 * (`removeRaw = true`) to keep response payloads clean.
 * Falls back to the other language if the requested one is empty.
 * Recursively localizes nested arrays and objects.
 */
export const localize = (record, fields, lang = "en", removeRaw = true) => {
  if (!record || typeof record !== "object" || record instanceof Date) return record;

  const result = Array.isArray(record) ? [...record] : { ...record };

  if (!Array.isArray(record)) {
    const targetFields = fields && fields.length > 0 ? fields : autoDetectFields(record);
    for (const field of targetFields) {
      const arKey = `${field}_ar`;
      const enKey = `${field}_en`;
      if (arKey in record || enKey in record) {
        result[field] = lang === "ar" ? (record[arKey] ?? record[enKey]) : (record[enKey] ?? record[arKey]);
        if (removeRaw) {
          delete result[arKey];
          delete result[enKey];
        }
      }
    }
  }

  for (const key of Object.keys(result)) {
    if (Array.isArray(result[key])) {
      result[key] = result[key].map((item) => (typeof item === "object" && item !== null ? localize(item, fields, lang, removeRaw) : item));
    } else if (result[key] && typeof result[key] === "object" && !(result[key] instanceof Date)) {
      result[key] = localize(result[key], fields, lang, removeRaw);
    }
  }

  return result;
};

function autoDetectFields(obj) {
  const fields = new Set();
  for (const key of Object.keys(obj)) {
    if (key.endsWith("_ar")) {
      fields.add(key.slice(0, -3));
    } else if (key.endsWith("_en")) {
      fields.add(key.slice(0, -3));
    }
  }
  return Array.from(fields);
}

export const localizeMany = (records, fields, lang = "en", removeRaw = true) =>
  Array.isArray(records) ? records.map((r) => localize(r, fields, lang, removeRaw)) : records;

/**
 * Applies `localize` to `data` (or `data.items` for paginated list shapes)
 * in place, returning the same shape it received.
 */
export const localizeResponse = ({data, fields, lang = "en", removeRaw = true}) => {
  if (!data) return data;
  if (Array.isArray(data)) return localizeMany(data, fields, lang, removeRaw);
  if (Array.isArray(data.items)) {
    return { ...data, items: localizeMany(data.items, fields, lang, removeRaw) };
  }
  return localize(data, fields, lang, removeRaw);
};
