import { getTransporter, getBrevoClient } from "./MailerClient.js";
import { mailTemp } from "./MailTemp.js";
import { getMessage } from "../i18n.js";

export const sendEmail = async ({
  email,
  subject,
  text,
  otp,
  username,
  lang = "en",
  variant,
  metadata,
  actionUrl,
  actionText,
}) => {
  if (!email) {
    console.error("❌ Mailer Error: No recipient email provided.");
    return { success: false, error: "No recipient email provided" };
  }

  const emailSubject = subject || getMessage("EMAIL_DEFAULT_SUB", lang);
  const emailText =
    text || getMessage("EMAIL_BODY_TEXT", lang, { otp: otp || "N/A" });
  const html = mailTemp({
    otp,
    title: emailSubject,
    text,
    username,
    lang,
    variant,
    metadata,
    actionUrl,
    actionText,
  });

  const senderEmail =
    process.env.BREVO_SENDER ||
    process.env.MAIL_FROM ||
    process.env.MAIL_USER ||
    "noreply@mr-mahmoud-academy.net";
  const senderName =
    process.env.MAIL_SENDER_NAME ||
    process.env.SENDER_NAME ||
    "Mr Mahmoud Academy";

  // 1) Primary Method: Send email via Brevo v3 API (Direct fetch)
  try {
    const rawApiKey =
      process.env.BREVO_API_KEY ||
      process.env.BREVO_KEY ||
      process.env.MAIL_API_KEY;

    const apiKey = rawApiKey
      ? rawApiKey.trim().replace(/^["'\s]+|["'\s]+$/g, "")
      : null;

    if (apiKey) {
      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email, name: username || undefined }],
          subject: emailSubject,
          htmlContent: html,
          textContent: emailText,
        }),
      });

      const brevoData = await brevoRes.json();
      if (!brevoRes.ok) {
        throw new Error(
          brevoData?.message || `Brevo API HTTP ${brevoRes.status}`
        );
      }

      const messageId = brevoData?.messageId || "brevo-sent";
      console.log("📧 Email sent successfully via Brevo API:", messageId);
      return { success: true, messageId };
    }
  } catch (brevoError) {
    console.error("❌ Brevo API Error:", brevoError.message);
    console.warn("⚠️ Falling back to Nodemailer SMTP...");
  }

  // 2) Secondary Method: Send email via Nodemailer SMTP
  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    replyTo: senderEmail,
    to: email,
    subject: emailSubject,
    text: emailText,
    html: html,
    headers: {
      "X-Entity-Ref-ID": Date.now().toString(),
    },
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully via SMTP:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    if (error.code === "ETIMEDOUT") {
      console.error("❌ Mailer Timeout: Could not connect to SMTP server.");
    } else {
      console.error("❌ Mailer Error:", error.message);
    }

    if (
      process.env.NODE_ENV === "development" ||
      process.env.ALLOW_MOCK_EMAIL === "true" ||
      process.env.MOCK_EMAIL === "true"
    ) {
      console.warn(
        `🔑 [DEV MOCK EMAIL FALLBACK] Email failed to deliver via API/SMTP. Recipient: ${email} | OTP: ${otp || "N/A"}`
      );
      return {
        success: true,
        mocked: true,
        messageId: `dev-mocked-${Date.now()}`,
        otp,
      };
    }

    return { success: false, error: error.message, code: error.code };
  }
};
