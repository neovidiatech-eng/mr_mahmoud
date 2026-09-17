# Frontend Integration Guide - User Status Architecture (`user.status`)

This document outlines the architecture, API endpoints, payload structures, and integration guidelines for frontend developers working with **User Status** (`status`) across the platform.

---

## 📌 Architecture Overview

1. **Single Source of Truth**:
   - `user.status` (on the `user` object) is the single source of truth for user account state across all user roles (**Students**, **Teachers**, **Staff/Stuff**, **Admins**).
   - Role tables (`student`, `teacher`, `stuff`) do **NOT** have separate `active` or `status` columns. Status is unified under `user.status`.

2. **Valid Status Values**:
   - `"active"`: Account is active and can access the platform.
   - `"pending"`: Account is pending confirmation or approval.
   - `"disabled"`: Account is disabled by an administrator.
   - `"blocked"`: Account is blocked due to policy/security reasons.
   - `"rejected"`: Registration or onboarding request was rejected.

---

## 🔐 1. Authentication & Login

### Behavior
- During login (`POST /auth/login`), if a user's `status` is set to `"disabled"` or `"blocked"`, the server returns a `403 Forbidden` response.

### Frontend Handling
```json
// Response: 403 Forbidden
{
  "success": false,
  "status": 403,
  "message": "USER_ACCOUNT_DISABLED"
}
```
**UI Recommendation**: Display a notification/toast to the user informing them that their account is disabled or blocked, and prompt them to contact support.

---

## 🎓 2. Students Management (`/students`)

### GET `/students`
- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 10)
  - `search` (string, optional): Searches `name` and `email`.
  - `status` (string, optional): Filters students by `user.status` (e.g. `?status=active` or `?status=pending`).

- **Response Structure**:
```json
{
  "success": true,
  "status": 200,
  "message": "FETCH_SUCCESS",
  "data": {
    "studentsData": [
      {
        "id": "student-uuid",
        "country": "Egypt",
        "type": "online",
        "user": {
          "id": "user-uuid",
          "name": "Karem Mahmoud",
          "email": "karem@example.com",
          "phone": "+201000000001",
          "status": "active"
        }
      }
    ],
    "pagination": {
      "totalItems": 150,
      "totalPages": 15,
      "currentPage": 1,
      "limit": 10
    },
    "status": {
      "activeStudents": 130,
      "inactiveStudents": 20,
      "totalStudents": 150
    }
  }
}
```

### POST `/students/create`
- **Form-Data Payload**:
  - `name`: string (required)
  - `email`: string (required)
  - `password`: string (required)
  - `phone`: string (required)
  - `phone_code`: string (required)
  - `parentNumber`: string (required)
  - `country`: string (required)
  - `planId`: string (required)
  - `gender`: `"male"` | `"female"` (required)
  - `type`: `"online"` | `"onsite"` (required)
  - `status`: `"active"` | `"pending"` | `"disabled"` (optional, default: `"active"`)

### PATCH `/students/update/{id}`
- **Form-Data Payload**:
  - `status`: `"active"` | `"disabled"` | `"blocked"` | `"pending"` (optional) — updates `user.status`.

---

## 👨‍🏫 3. Teachers Management (`/teachers`)

### GET `/teachers`
- **Query Parameters**:
  - `search` (string, optional)
  - `page` (integer, default: 1)
  - `limit` (integer, default: 10)
  - `status` (string, optional): Filters teachers by `user.status` (e.g. `?status=active`).

- **Response Structure**:
```json
{
  "success": true,
  "status": 200,
  "message": "FETCH_SUCCESS",
  "data": {
    "teachers": [
      {
        "id": "teacher-uuid",
        "hour_price": 150,
        "user": {
          "id": "user-uuid",
          "name": "Mahmoud Hassan",
          "email": "teacher@example.com",
          "status": "active"
        }
      }
    ],
    "pagination": { "totalItems": 20, "currentPage": 1 },
    "activeCount": 18,
    "inactiveCount": 2
  }
}
```

### POST `/teachers/create`
- **JSON Payload**:
  - `name`, `email`, `password`, `phone`, `code_country`, `currency_id`, `gender`, `age`, `hour_price` (required)
  - `status`: `"active"` | `"pending"` | `"disabled"` (optional, default: `"active"`)

### PATCH `/teachers/update/{id}`
- **JSON Payload**:
  - `status`: `"active"` | `"disabled"` | `"blocked"` (optional) — updates `user.status`.

---

## ⚙️ 4. Staff / Stuff Management (`/stuff`)

### GET `/stuff`
- **Query Parameters**: `?status=active` (filters by `user.status`).

### POST `/stuff/create` & PATCH `/stuff/update/{id}`
- Accept `status` in payload to update user account status.

---

## 📊 Summary of Integration Rules for Frontend

1. **Always read status from `object.user.status`**:
   - For a student item: `student.user.status`
   - For a teacher item: `teacher.user.status`
   - For a staff item: `stuff.user.status`

2. **Querying Status Filters**:
   - Use `?status=active` or `?status=disabled` to filter table lists dynamically in admin tables.

3. **Status Toggle UI / Status Dropdowns**:
   - When updating user status in Admin dashboards, send `PATCH /students/update/{id}` or `PATCH /teachers/update/{id}` with `{ "status": "disabled" }`.
