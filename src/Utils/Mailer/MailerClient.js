import { BrevoClient } from "@getbrevo/brevo";
import nodemailer from "nodemailer";

let brevoClientInstance = null;

export const getBrevoClient = () => {
  const apiKey =
    process.env.BREVO_API_KEY ||
    process.env.BREVO_KEY ||
    process.env.MAIL_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!brevoClientInstance) {
    try {
      brevoClientInstance = new BrevoClient({ apiKey });
      console.log("✅ Brevo client initialized successfully");
    } catch (error) {
      console.error("❌ Brevo client initialization failed:", error.message);
      return null;
    }
  }

  return brevoClientInstance;
};

export const getTransporter = () => {
  const user = process.env.MAIL_USER || process.env.APP_EMAIL;
  const pass =
    process.env.MAIL_PASS ||
    (process.env.APP_PASSWORD ? process.env.APP_PASSWORD.replace(/\s+/g, "") : "");
  const isGmail = user && user.endsWith("@gmail.com");

  const host =
    process.env.MAIL_HOST ||
    (isGmail ? "smtp.gmail.com" : "smtp-relay.brevo.com");
  const port = Number(process.env.MAIL_PORT) || (isGmail ? 465 : 587);

  if (!user || !pass) {
    console.warn(
      "⚠️ SMTP credentials (MAIL_USER / APP_EMAIL & MAIL_PASS / APP_PASSWORD) missing or incomplete."
    );
  }

  return nodemailer.createTransport(
    isGmail
      ? {
          service: "gmail",
          auth: { user, pass },
        }
      : {
          host,
          port,
          secure: port === 465,
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
          ...(user && pass ? { auth: { user, pass } } : {}),
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
        }
  );
};




