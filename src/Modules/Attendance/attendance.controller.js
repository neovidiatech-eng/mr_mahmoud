import {
  asyncHandler,
  successResponse,
  errorResponse,
} from "../../Utils/Response.js";
import * as db from "../../database/dbService.js";
import { studentTypes } from "../../Utils/Enums/studentTypes.js";

export const checkIn = asyncHandler(async (req, res, next) => {
  const { qrToken, studentId, status = "present", attendanceDate } = req.body;
  const adminOrTeacherId = req.user?.id;

  // 1. Locate student
  let student;
  if (qrToken) {
    student = await db.findFirst({
      model: "student",
      where: {
        qrToken,
        qrActive: true,
        type: studentTypes.ONSITE,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
        rank: true,
        plan: true,
      },
    });
  } else if (studentId) {
    student = await db.findFirst({
      model: "student",
      where: {
        OR: [{ id: studentId }, { user_id: studentId }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
        rank: true,
        plan: true,
      },
    });
  }

  if (!student) {
    return errorResponse({
      req,
      next,
      message: "STUDENT_NOT_FOUND_OR_INACTIVE_QR",
      status: 404,
    });
  }

  // 2. Prepare target date (start of day UTC)
  const targetDate = attendanceDate ? new Date(attendanceDate) : new Date();
  targetDate.setUTCHours(0, 0, 0, 0);

  // 3. Check for existing attendance for this student on this date
  const existingRecord = await db.findFirst({
    model: "Attendance",
    where: {
      studentId: student.id,
      attendanceDate: targetDate,
    },
  });

  if (existingRecord) {
    return errorResponse({
      req,
      next,
      message: "STUDENT_ALREADY_CHECKED_IN_TODAY",
      status: 409,
      data: {
        alreadyCheckedIn: true,
        existingAttendance: existingRecord,
        student,
      },
    });
  }

  // 4. Create attendance and update student session counter in transaction
  const result = await db.transaction(async (tx) => {
    const newAttendance = await tx.create({
      model: "Attendance",
      data: {
        studentId: student.id,
        attendanceDate: targetDate,
        checkedInAt: new Date(),
        status,
        checkedInBy: adminOrTeacherId,
      },
    });

    const updatedStudent = await tx.updateOne({
      model: "student",
      where: { id: student.id },
      data: {
        sessions_attended: { increment: 1 },
        sessions_remaining: {
          decrement: student.sessions_remaining > 0 ? 1 : 0,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
        rank: true,
        plan: true,
      },
    });

    return { newAttendance, updatedStudent };
  });

  return successResponse({
    res,
    req,
    status: 201,
    message: "ATTENDANCE_CHECK_IN_SUCCESSFUL",
    data: {
      attendance: result.newAttendance,
      student: result.updatedStudent,
    },
  });
});

export const getAttendanceList = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, search, date, status, studentId } = req.query;

  const where = {};

  if (studentId) {
    where.studentId = studentId;
  }

  if (status) {
    where.status = status;
  }

  if (date) {
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);
    where.attendanceDate = targetDate;
  }

  if (search) {
    where.student = {
      user: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
        ],
      },
    };
  }

  const { items, pagination } = await db.findManyWithPaginationAndCount({
    model: "Attendance",
    where,
    page,
    limit,
    orderBy: { checkedInAt: "desc" },
    include: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          rank: true,
        },
      },
    },
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "ATTENDANCE_LIST_RETRIEVED",
    data: { items, pagination },
  });
});

export const getStudentAttendance = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const { page = 1, limit = 20, startDate, endDate, status } = req.query;

  const student = await db.findFirst({
    model: "student",
    where: {
      OR: [{ id: studentId }, { user_id: studentId }],
    },
  });

  if (!student) {
    return errorResponse({
      req,
      next,
      message: "STUDENT_NOT_FOUND",
      status: 404,
    });
  }

  const where = {
    studentId: student.id,
  };

  if (status) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.attendanceDate = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setUTCHours(0, 0, 0, 0);
      where.attendanceDate.gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      where.attendanceDate.lte = end;
    }
  }

  const { items, pagination } = await db.findManyWithPaginationAndCount({
    model: "Attendance",
    where,
    page,
    limit,
    orderBy: { attendanceDate: "desc" },
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "STUDENT_ATTENDANCE_HISTORY_RETRIEVED",
    data: { studentId: student.id, items, pagination },
  });
});

export const getTodaySummary = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [totalOnsiteStudents, checkedInToday, presentCount, lateCount, absentCount] =
    await Promise.all([
      db.count({ model: "student", where: { type: studentTypes.ONSITE, active: true } }),
      db.count({ model: "Attendance", where: { attendanceDate: today } }),
      db.count({ model: "Attendance", where: { attendanceDate: today, status: "present" } }),
      db.count({ model: "Attendance", where: { attendanceDate: today, status: "late" } }),
      db.count({ model: "Attendance", where: { attendanceDate: today, status: "absent" } }),
    ]);

  return successResponse({
    res,
    req,
    status: 200,
    message: "TODAY_ATTENDANCE_SUMMARY_RETRIEVED",
    data: {
      date: today,
      totalOnsiteStudents,
      checkedInToday,
      remainingToScan: Math.max(totalOnsiteStudents - checkedInToday, 0),
      stats: {
        present: presentCount,
        late: lateCount,
        absent: absentCount,
      },
    },
  });
});

export const updateAttendanceStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const record = await db.findOne({
    model: "Attendance",
    where: { id },
  });

  if (!record) {
    return errorResponse({
      req,
      next,
      message: "ATTENDANCE_RECORD_NOT_FOUND",
      status: 404,
    });
  }

  const updatedRecord = await db.updateOne({
    model: "Attendance",
    where: { id },
    data: { status },
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "ATTENDANCE_RECORD_UPDATED",
    data: updatedRecord,
  });
});

export const deleteAttendance = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const record = await db.findOne({
    model: "Attendance",
    where: { id },
  });

  if (!record) {
    return errorResponse({
      req,
      next,
      message: "ATTENDANCE_RECORD_NOT_FOUND",
      status: 404,
    });
  }

  await db.transaction(async (tx) => {
    await tx.deleteOne({ model: "Attendance", where: { id } });

    await tx.updateOne({
      model: "student",
      where: { id: record.studentId },
      data: {
        sessions_attended: { decrement: 1 },
        sessions_remaining: { increment: 1 },
      },
    });
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "ATTENDANCE_RECORD_DELETED",
  });
});
