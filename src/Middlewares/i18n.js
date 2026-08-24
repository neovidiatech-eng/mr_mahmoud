import { getMessage, getDir, SUPPORTED_LANGUAGES } from "../Utils/i18n.js";

// Parses language headers (`accept-language`, `lang`, `x-lang`, `language`) or query parameter (`?lang=ar`)
// and picks the highest-priority supported language ("ar" or "en"), defaulting to "en".
const resolveLang = (header, queryLang, customHeader) => {
  if (queryLang) {
    const primary = String(queryLang).trim().split("-")[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(primary)) return primary;
  }

  if (customHeader) {
    const primary = String(customHeader).trim().split("-")[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(primary)) return primary;
  }

  if (!header) return "en";

  const candidates = header
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const quality = qParam ? parseFloat(qParam.split("=")[1]) : 1;
      const primaryTag = rawTag.trim().split("-")[0].toLowerCase();
      return { primaryTag, quality: Number.isNaN(quality) ? 1 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  const match = candidates.find((c) => SUPPORTED_LANGUAGES.includes(c.primaryTag));
  return match ? match.primaryTag : "en";
};

export const langMiddleware = (req, res, next) => {
  const lang = resolveLang(
    req.headers["accept-language"],
    req.query?.lang,
    req.headers["lang"] || req.headers["x-lang"] || req.headers["language"]
  );

  // Attach to request object
  req.lang = lang;
  req.dir = getDir(lang);
  req.t = (key, params) => getMessage(key, lang, params);
  res.setHeader("Content-Language", lang);
  next();
};

