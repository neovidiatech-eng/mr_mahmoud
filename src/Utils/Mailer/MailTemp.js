import { getMessage } from "../i18n.js";

export const mailTemp = ({
  title,
  otp,
  text,
  username = "there",
  lang = "en",
  variant = "verify",
  metadata,
  actionUrl,
  actionText,
}) => {
  const isAr = lang === "ar";
  const brandName = "MR MAHMOUD";
  const primaryColor = "#800020";
  const secondaryColor = "#E84A6F";

  const getVariantDetails = () => {
    switch (variant) {
      case "reminder":
        return {
          header: getMessage("EMAIL_REMINDER_HEADER", lang),
          subtitle: getMessage("EMAIL_REMINDER_SUBTITLE", lang),
          desc: isAr
            ? "هذا تذكير بموعد جلستك القادمة. يرجى الاستعداد في الوقت المحدد."
            : "This is a reminder for your upcoming session. Please be ready on time.",
          iconSymbol: "🔔",
        };
      case "reset":
        return {
          header: getMessage("EMAIL_RESET_HEADER", lang),
          subtitle: getMessage("EMAIL_RESET_SUBTITLE", lang),
          desc: isAr
            ? "لقد طلبت إعادة تعيين كلمة المرور. استخدم رمز التحقق أدناه للمتابعة."
            : "You requested to reset your password. Use the verification code below to proceed.",
          iconSymbol: "🔑",
        };
      case "notification":
        return {
          header: getMessage("EMAIL_NOTIFICATION_HEADER", lang),
          subtitle: getMessage("EMAIL_NOTIFICATION_SUBTITLE", lang),
          desc: isAr
            ? "لديك إشعار وتحديث جديد في حسابك."
            : "You have a new notification and update on your account.",
          iconSymbol: "📢",
        };
      case "verify":
      default:
        return {
          header: getMessage("EMAIL_VERIFY_HEADER", lang),
          subtitle: getMessage("EMAIL_VERIFY_SUBTITLE", lang),
          desc: isAr
            ? "يرجى استخدام رمز التحقق أدناه لإكمال عمليتك بأمان."
            : "Please use the verification code below to securely complete your action.",
          iconSymbol: "🛡️",
        };
    }
  };

  const vInfo = getVariantDetails();
  const displayTitle = title || vInfo.header;

  const safeOtp = String(otp ?? "").trim();
  const otpBoxes = safeOtp
    .split("")
    .map(
      (digit) => `
      <td style="padding:0 4px;" align="center">
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
          <tr>
            <td align="center" valign="middle" style="
              width:46px;
              height:54px;
              background:#1F0910;
              border:1.5px solid ${primaryColor};
              border-radius:12px;
              text-align:center;
              font-size:24px;
              font-weight:900;
              color:#FFFFFF;
              font-family: 'Courier New', Courier, monospace;
            ">
              ${digit}
            </td>
          </tr>
        </table>
      </td>
    `
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" dir="${isAr ? "rtl" : "ltr"}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${displayTitle}</title>
  <style type="text/css">
    body { margin: 0; padding: 0; background-color: #0A0306; font-family: Arial, sans-serif; }
    table { border-collapse: collapse; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 18px !important; padding-right: 18px !important; }
      .hero-title { font-size: 30px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0A0306;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A0306;width:100%;">
    <tr>
      <td align="center" style="padding:30px 10px;">

        <!-- Main Card Container -->
        <table class="container" width="480" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:480px;background-color:#14060B;border-radius:24px;border:1px solid #80002060;">

          <!-- Top Gradient Accent Bar -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg, #800020 0%, #B31B3B 50%, #E84A6F 100%);border-top-left-radius:24px;border-top-right-radius:24px;"></td>
          </tr>

          <!-- Header Section (Logo + Brand Name) -->
          <tr>
            <td class="mobile-padding" style="padding:28px 30px 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="${isAr ? "right" : "left"}" valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Logo Badge -->
                        <td valign="middle" style="width:48px;">
                          <div style="width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg, #800020 0%, #E84A6F 100%);text-align:center;line-height:46px;font-size:22px;font-weight:900;color:#FFFFFF;">
                            <img src="https://mr-mahmoud.com/assets/white-logo.png" alt="M" width="28" height="28" style="display:inline-block;vertical-align:middle;border:0;outline:none;margin-top:9px;" />
                          </div>
                        </td>
                        <td valign="middle" style="padding-${isAr ? "right" : "left"}:12px;">
                          <div style="color:#FFFFFF;font-size:22px;font-weight:900;letter-spacing:1px;line-height:1.2;">
                            ${brandName}
                          </div>
                          <div style="color:${secondaryColor};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;">
                            ${getMessage("EMAIL_SLOGAN", lang)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Icon Section (Bulletproof HTML Email Circle) -->
          <tr>
            <td class="mobile-padding" style="padding:28px 30px 0 30px;" align="center">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td align="center" valign="middle" style="
                    width:76px;
                    height:76px;
                    border-radius:38px;
                    background-color:#220911;
                    border:2px solid ${primaryColor};
                    text-align:center;
                    line-height:76px;
                    font-size:36px;
                  ">
                    ${vInfo.iconSymbol}
                  </td>
                </tr>
              </table>

              <!-- Main Title -->
              <h1 class="hero-title" style="margin:20px 0 6px 0;color:#FFFFFF;text-align:center;font-size:34px;font-weight:900;line-height:1.2;letter-spacing:-0.5px;">
                ${vInfo.header}
              </h1>

              <div style="color:${secondaryColor};text-align:center;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px;">
                ${vInfo.subtitle}
              </div>

              <!-- Greeting & Description -->
              <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:380px;">
                <tr>
                  <td align="center" style="padding:0 10px 24px 10px;">
                    <div style="color:#FFFFFF;font-size:16px;font-weight:700;margin-bottom:8px;">
                      ${isAr ? `مرحباً <span dir="ltr">${username}</span>👋` : `Hello ${username}👋`}
                    </div>
                    <div style="color:#D8C4CB;font-size:14px;line-height:1.7;text-align:center;">
                      ${vInfo.desc}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- OTP Box Section -->
          ${
            otp
              ? `
          <tr>
            <td align="center" style="padding:0 20px 20px 20px;">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  ${otpBoxes}
                </tr>
              </table>
              <div style="margin-top:14px;color:${secondaryColor};font-size:11px;font-weight:700;letter-spacing:1px;text-align:center;">
                ${getMessage("EMAIL_OTP_EXPIRY", lang)}
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Additional Custom Text Block -->
          ${
            text
              ? `
          <tr>
            <td class="mobile-padding" style="padding:0 30px 20px 30px;">
              <div style="background-color:#1A080F;border:1px solid ${primaryColor}50;border-radius:16px;padding:16px;text-align:center;color:#E6D0D6;font-size:14px;line-height:1.7;">
                ${text}
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Optional Action Button -->
          ${
            actionUrl
              ? `
          <tr>
            <td align="center" style="padding:6px 30px 28px 30px;">
              <a href="${actionUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg, #800020 0%, #E84A6F 100%);color:#FFFFFF;text-decoration:none;border-radius:14px;font-size:13px;font-weight:800;letter-spacing:0.5px;">
                ${actionText || getMessage("EMAIL_ACTION_BTN", lang)}
              </a>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Horizontal Divider -->
          <tr>
            <td style="padding:0 30px;">
              <div style="height:1px;background-color:rgba(255,255,255,0.08);"></div>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td class="mobile-padding" style="padding:20px 30px 24px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="${isAr ? "right" : "left"}" valign="middle">
                    <div style="color:#947681;font-size:11px;">
                      © 2026 Mr Mahmoud Platform
                    </div>
                  </td>
                  <td align="${isAr ? "left" : "right"}" valign="middle">
                    <span style="display:inline-block;padding:5px 12px;border-radius:20px;background-color:#220911;border:1px solid ${primaryColor}50;color:${secondaryColor};font-size:10px;font-weight:700;letter-spacing:1px;">
                      🛡️ ${getMessage("EMAIL_FOOTER_SECURED", lang)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Sub Footer Branding -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
          <tr>
            <td align="center">
              <div style="color:#806670;font-size:11px;letter-spacing:1px;">
                Powered by <span style="color:${secondaryColor};font-weight:700;">neovidi.co</span>
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};