import { connection, notificationQueue } from "../Radis/Connection.js";
import { Worker } from "bullmq";
import * as db from "../../database/dbService.js";
import { sendSMS } from "../SMS/SendSMS.js";
import { createNotification } from "../../Modules/Notifications/notifications.service.js";

export const addNotificationJob = async ({
  scheduleId,
  studentId,
  type,
  sendAt,
}) => {
  const job = await notificationQueue.add(
    "send-notification",
    { scheduleId, studentId, type },
    {
      jobId: scheduleId, // استخدام ID الجدول كـ ID للـ Job لسهولة المسح
      delay: Math.max(0, sendAt - new Date()),
    }, // الفارق بالمللي ثانية
  );
  console.log(`Added job with ID: ${job.id}`);
};

export const removeNotificationJob = async (scheduleId) => {
  const job = await notificationQueue.getJob(scheduleId);
  if (job) {
    await job.remove();
    console.log(`Removed job associated with schedule ${scheduleId}`);
  }
};

const worker = new Worker(
  "notifications",
  async (job) => {
    const { scheduleId, studentId, type } = job.data;

    console.log(
      `Sending ${type} notification to student ${studentId} for schedule ${scheduleId}`,
    );

    try {
      const schedule = await db.findFirst({
        model: "schedule",
        where: { id: scheduleId },
        include: {
          student: {
            include: { user: true },
          },
          teacher: {
            include: { user: true },
          },
        },
      });

      if (!schedule) {
        console.log(`Schedule with ID ${scheduleId} not found.`);
        return;
      }

      const title = schedule.title || "Session";
      const studentPhone = schedule.student?.user?.phone;
      const studentCountry = schedule.student?.user?.code_country || "20";
      const studentName = schedule.student?.user?.name || "Student";
      const studentUserId = schedule.student?.user_id;

      const teacherPhone = schedule.teacher?.user?.phone;
      const teacherCountry = schedule.teacher?.user?.code_country || "20";
      const teacherName = schedule.teacher?.user?.name || "Teacher";
      const teacherUserId = schedule.teacher?.user_id;

      const smsText = `تذكير من منصة الأستاذ محمود: جلستك "${title}" تبدأ ${type}. يرجى الاستعداد.`;

      if (studentPhone) {
        await sendSMS({
          phone: studentPhone,
          codeCountry: studentCountry,
          text: smsText,
        });
        console.log(`SMS sent to student ${studentPhone}`);
      }

      if (studentUserId) {
        await createNotification({
          userId: studentUserId,
          type: "SESSION_REMINDER",
          title_ar: `تذكير بموعد الجلسة: ${title}`,
          title_en: `Session Reminder: ${title}`,
          message_ar: `تذكير بأن جلستك "${title}" تبدأ ${type}. يرجى الاستعداد.`,
          message_en: `Reminder: Your session "${title}" is starting ${type}. Please be ready.`,
        });
      }

      if (teacherPhone) {
        await sendSMS({
          phone: teacherPhone,
          codeCountry: teacherCountry,
          text: smsText,
        });
        console.log(`SMS sent to teacher ${teacherPhone}`);
      }

      if (teacherUserId) {
        await createNotification({
          userId: teacherUserId,
          type: "SESSION_REMINDER",
          title_ar: `تذكير بموعد الجلسة: ${title}`,
          title_en: `Session Reminder: ${title}`,
          message_ar: `تذكير بأن جلستك "${title}" تبدأ ${type}. يرجى الاستعداد.`,
          message_en: `Reminder: Your session "${title}" is starting ${type}. Please be ready.`,
        });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  },
  { connection },
);
