import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

export const hash = async ({ password }) => {
  return encryptText({ text: password });
};
export const compare = async ({ password, hash }) => {
  if (!hash) return false;
  try {
    const decrypted = await decryptText({ text: hash });
    if (decrypted && decrypted !== hash) {
      return password === decrypted;
    }
  } catch (err) {
    // ignore and fallback
  }
  if (password === hash) {
    return true;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    return false;
  }
};

export const encryptText = ({ text }) => {
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPT_KEY).toString();
};

export const decryptText = async ({ text }) => {
  try {
    if (!text) return null;

    // Handle Express/URL query params replacing '+' with spaces
    const sanitizedText = text.includes(" ") ? text.replace(/ /g, "+") : text;

    const bytes = CryptoJS.AES.decrypt(sanitizedText, process.env.ENCRYPT_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted && text) {
      return text;
    }

    return decrypted;
  } catch (err) {
    return text;
  }
};