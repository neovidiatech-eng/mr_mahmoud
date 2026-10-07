import dotenv from "dotenv";
dotenv.config();

/**
 * Normalize phone number to international format without plus sign or leading zero
 * e.g., phone="01012345678", codeCountry="20" or "+20" -> "201012345678"
 * e.g., phone="+201012345678" -> "201012345678"
 */
export const normalizePhoneNumber = (phone, codeCountry = "20") => {
  if (!phone) return "";
  let cleanPhone = phone.toString().trim().replace(/[\s\-\(\)]/g, "");
  let cleanCode = (codeCountry || "").toString().trim().replace(/[\s\+\-]/g, "");

  // Remove leading plus
  if (cleanPhone.startsWith("+")) {
    cleanPhone = cleanPhone.substring(1);
  }

  // If already starts with country code
  if (cleanCode && cleanPhone.startsWith(cleanCode)) {
    return cleanPhone;
  }

  // If starts with 00 + country code
  if (cleanCode && cleanPhone.startsWith("00" + cleanCode)) {
    return cleanPhone.substring(2);
  }

  // If starts with 0 and we have a country code, strip the leading 0
  if (cleanCode) {
    if (cleanPhone.startsWith("0")) {
      cleanPhone = cleanPhone.substring(1);
    }
    return `${cleanCode}${cleanPhone}`;
  }

  return cleanPhone;
};

/**
 * Send SMS using MoceanAPI REST API
 * @param {Object} params
 * @param {string} params.phone - Destination phone number
 * @param {string} params.codeCountry - Country code (default: "20")
 * @param {string} params.text - SMS content
 * @param {string} params.otp - Optional OTP code
 * @returns {Promise<{success: boolean, data?: any, error?: string, raw?: any}>}
 */
export const sendSMS = async ({ phone, codeCountry = "20", text, otp }) => {
  try {
    const formattedPhone = normalizePhoneNumber(phone, codeCountry);
    if (!formattedPhone) {
      console.error("❌ SMS Error: No recipient phone number provided.");
      return { success: false, error: "No recipient phone number provided" };
    }

    const messageText = text || (otp ? `كود التحقق الخاص بك لمنصة الأستاذ محمود هو: ${otp}` : "");
    if (!messageText) {
      return { success: false, error: "No message text provided" };
    }

    const apiToken = process.env.MOCEAN_API_TOKEN;
    const sender = process.env.MOCEAN_SENDER || "MrMahmoud";

    if (!apiToken) {
      console.warn("⚠️ MOCEAN_API_TOKEN is not set. Simulating SMS sending in Dev Mode.");
      console.log(`[SMS MOCK] To: ${formattedPhone} | Message: ${messageText}`);
      return { success: true, message: "Mock SMS sent successfully", mock: true };
    }

    const bodyParams = new URLSearchParams();
    bodyParams.append("mocean-to", formattedPhone);
    bodyParams.append("mocean-from", sender);
    bodyParams.append("mocean-text", messageText);
    bodyParams.append("mocean-resp-format", "JSON");

    const response = await fetch("https://rest.moceanapi.com/rest/2/sms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    const data = await response.json();

    // Mocean response handling:
    // Successful response: { status: 0, messages: [ { status: 0, "msgid": "...", ... } ] }
    if (data.status === 0 || (Array.isArray(data.messages) && data.messages[0]?.status === 0)) {
      console.log(`✅ SMS sent successfully to ${formattedPhone}`);
      return { success: true, data };
    }

    console.error("❌ Mocean API SMS Error:", data);
    return {
      success: false,
      error: data.err_msg || data.messages?.[0]?.err_msg || "Failed to send SMS",
      raw: data,
    };
  } catch (error) {
    console.error("❌ SMS Service Exception:", error);
    return { success: false, error: error.message };
  }
};
