import { authPaths } from "./docs/auth.swagger.js";
import { studentDashboardPaths } from "./docs/studentDashboard.swagger.js";
import { teacherDashboardPaths } from "./docs/teacherDashboard.swagger.js";
import { requestsPaths } from "./docs/requests.swagger.js";
import { homeworkPaths } from "./docs/homework.swagger.js";
import { examsPaths } from "./docs/exams.swagger.js";
import { calendarPaths } from "./docs/calendar.swagger.js";
import { schedulesPaths } from "./docs/schedules.swagger.js";
import { chatPaths } from "./docs/chat.swagger.js";
import { systemPaths } from "./docs/system.swagger.js";
import { studentsPaths } from "./docs/students.swagger.js";
import { teachersPaths } from "./docs/teachers.swagger.js";
import { financesPaths } from "./docs/finances.swagger.js";
import { materialsPaths } from "./docs/materials.swagger.js";
import { weeklyReportsPaths } from "./docs/weeklyReports.swagger.js";
import { policiesPaths } from "./docs/policies.swagger.js";
import { supportPaths } from "./docs/support.swagger.js";
import { withdrawalsPaths } from "./docs/withdrawals.swagger.js";
import { transactionsPaths } from "./docs/transactions.swagger.js";
import { settingsPaths } from "./docs/settings.swagger.js";
import { coursePurchaseRequestsPaths } from "./docs/coursePurchaseRequests.swagger.js";
import { subscriptionPaths } from "./docs/subscription.swagger.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Mr. Mahmoud Platform Backend API",
    version: "1.0.0",
    description: "Complete RESTful API Documentation for all endpoints across Mr. Mahmoud Educational Platform."
  },
  servers: [
    {
      url: "http://localhost:3013",
      description: "Local Development Server"
    },
    {
      url: "https://copy.agro-plus.net",
      description: "Production Server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT Bearer token in format: Bearer <TOKEN>"
      }
    }
  },
  tags: [
    { name: "Authentication", description: "User Sign Up, Sign In, OTP & Password Management" },
    { name: "Student Dashboard", description: "Student Profile & Analytics" },
    { name: "Teacher Dashboard", description: "Teacher Profile, Students & Financial Transactions" },
    { name: "Requests", description: "System Requests Management" },
    { name: "Homework", description: "Homework Assignments, Submissions & Grading" },
    { name: "Exams", description: "Exams Management" },
    { name: "Exams Question Bank", description: "Question Bank & Questions Management" },
    { name: "Exams Attempt", description: "Student Exam Session Lifecycle" },
    { name: "Calendar", description: "Events & Schedules Calendar" },
    { name: "Schedules", description: "Live Sessions, Scheduling & Reviews" },
    { name: "Schedules Session Lifecycle", description: "Join/Leave Live Sessions" },
    { name: "Schedules Reviews", description: "Session Feedback & Reviews Moderation" },
    { name: "Chat", description: "Real-time Direct Messaging & Conversations" },
    { name: "System Administration", description: "Admin System Dashboard & Timezones" },
    { name: "System Roles & Permissions", description: "RBAC Roles & Permissions Management" },
    { name: "System Staff Management", description: "Admin & Staff User Accounts Management" },
    { name: "Students Management", description: "Admin Management of Student Accounts" },
    { name: "Teachers Management", description: "Admin Management of Teacher Accounts" },
    { name: "Subjects Management", description: "Subjects & Curricula Management" },
    { name: "Finances & Expenses", description: "Financial Expenses Tracking" },
    { name: "Educational Materials - Courses", description: "Courses & Curricula Materials" },
    { name: "Educational Materials - Lectures", description: "Lectures & Video Content" },
    { name: "Educational Materials - Categories", description: "Course Categories" },
    { name: "Educational Materials - Ranks", description: "Educational Ranks" },
    { name: "Weekly Reports", description: "Student Weekly Performance & Assessment Reports" },
    { name: "Policies & Notices", description: "Platform Terms, Privacy Policies & Announcement Notices" },
    { name: "Support Tickets", description: "Helpdesk & Customer Support Tickets" },
    { name: "Support Categories", description: "Support Ticket Categories" },
    { name: "Withdrawals", description: "Teacher Wallet Withdrawal Requests & Approvals" },
    { name: "Transactions", description: "Payment & System Financial Transactions" },
    { name: "Transactions Currency", description: "System Currency Configurations" },
    { name: "Settings", description: "Platform System Configuration Settings" },
    { name: "Course Purchase Requests", description: "Course Enrolment & Purchase Requests" },
    { name: "Subscriptions", description: "Student Subscription Plans & Renewals" },
    { name: "Subscription Plans", description: "Subscription Plans Management" },
    { name: "Subscription Requests", description: "Subscription Plan Upgrade Requests" }
  ],
  paths: {
    ...authPaths,
    ...studentDashboardPaths,
    ...teacherDashboardPaths,
    ...requestsPaths,
    ...homeworkPaths,
    ...examsPaths,
    ...calendarPaths,
    ...schedulesPaths,
    ...chatPaths,
    ...systemPaths,
    ...studentsPaths,
    ...teachersPaths,
    ...financesPaths,
    ...materialsPaths,
    ...weeklyReportsPaths,
    ...policiesPaths,
    ...supportPaths,
    ...withdrawalsPaths,
    ...transactionsPaths,
    ...settingsPaths,
    ...coursePurchaseRequestsPaths,
    ...subscriptionPaths
  }
};
