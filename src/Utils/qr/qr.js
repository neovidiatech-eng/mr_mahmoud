import {  encryptToken } from "../Security/index.js";
import QRCode from "qrcode";

export const generateQr = async ({ userId }) => {
  const token = encryptToken({ text: userId });
  const baseUrl = process.env.QR_URL || "http://localhost:3000";
  const url = `${baseUrl}/${token}`;
  const qr = await QRCode.toDataURL(url, {
    width: 500,
    margin: 2,
    color: {
      dark: "#000",
      light: "#fff",
    },
  });
  return { qr, token };
};