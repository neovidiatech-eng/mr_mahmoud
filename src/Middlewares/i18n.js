import { getMessage, getDir, SUPPORTED_LANGUAGES } from "../Utils/i18n.js";

// Parses an `Accept-Language` header (e.g. "ar-EG,ar;q=0.9,en;q=0.8") and
// picks the highest-priority language we actually support, defaulting to "en".
const resolveLang = (header) => {
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
  const lang = resolveLang(req.headers["accept-language"]);

  // Attach to request object
  req.lang = lang;
  req.dir = getDir(lang);
  req.t = (key, params) => getMessage(key, lang, params);
  res.setHeader("Content-Language", lang);
  next();
};

