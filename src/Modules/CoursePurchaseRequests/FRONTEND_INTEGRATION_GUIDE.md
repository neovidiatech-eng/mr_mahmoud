# دليل ربط الواجهة الأمامية - شراء الكورسات (Frontend Integration Guide)

هذا الدليل مخصص لمطوري الـ Frontend لربط دورة شراء الكورسات وعرض الكورسات المشتراة بـ API النظام، ويتضمن أمثلة كود جاهزة للاستخدام بواسطة **Axios** أو **Fetch API**.

---

## 🔑 الترويسات (Headers & Auth)

جميع الطلبات المحمية تتطلب إرسال الـ Bearer Token في الـ Headers:

```javascript
// Header التوثيق الأساسي
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`
});
```

---

## 🛒 1. تقديم طلب شراء كورس (Purchase Request)

المسار: `POST /course-purchase-requests`  
نوع البيانات: `multipart/form-data`

### 🔹 الحالة الأولى: الطالب مسجل دخول بالفعل (Authenticated Student)

لا داعي لإرسال كلمه المرور. يكتفى بإرسال الـ Token ورقم الكورس وصورة الإيصال.

```javascript
import axios from 'axios';

export const submitPurchaseForLoggedInStudent = async ({ token, courseId, receiptImageFile, notes }) => {
  const formData = new FormData();
  formData.append('courseId', courseId);
  formData.append('image', receiptImageFile); // ملف الصورة من input file
  if (notes) formData.append('notes', notes);

  try {
    const response = await axios.post('/course-purchase-requests', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { status: "success", message: "CREATE_SUCCESS", data: { requests: [...] } }
  } catch (error) {
    // معالجة الخطأ
    const message = error.response?.data?.message || 'FAILED_TO_SUBMIT_REQUEST';
    throw new Error(message);
  }
};
```

---

### 🔹 الحالة الثانية: زائر جديد ينشئ حساباً ويشتري الكورس (Guest Checkout)

يتم إرسال بيانات المستخدم كاملة شاملاً كلمة المرور وصورة الإيصال **بدون إرسال Token**.

```javascript
import axios from 'axios';

export const submitPurchaseForGuest = async ({
  name,
  email,
  phone,
  password,
  confirmPassword,
  courseId,
  parentPhone,
  rankId,
  receiptImageFile,
  notes
}) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('password', password);
  formData.append('confirmPassword', confirmPassword);
  formData.append('courseId', courseId);
  formData.append('image', receiptImageFile);

  if (parentPhone) formData.append('parentPhone', parentPhone);
  if (rankId) formData.append('rankId', rankId);
  if (notes) formData.append('notes', notes);

  try {
    const response = await axios.post('/course-purchase-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message;
    
    // التعامل مع الأخطاء الشائعة للزائر
    if (message === 'EMAIL_OR_PHONE_ALREADY_REGISTERED_PLEASE_LOGIN') {
      alert('الايميل أو رقم الهاتف مسجل بالفعل في المنصة، يرجى تسجيل الدخول أولاً');
    } else if (message === 'PASSWORD_REQUIRED') {
      alert('يرجى كتابة كلمة المرور لإنشاء حسابك الجديد');
    } else {
      alert(message || 'حدث خطأ أثناء إرسال الطلب');
    }
    throw error;
  }
};
```

---

## 📚 2. عرض الكورسات المشتراة للطالب (My Purchased Courses)

المسار: `GET /courses/my-courses`  
الهدف: إرجاع قائمة جميع الكورسات التي تم تفعيلها للطالب بعد قبول الأدمن.

```javascript
import axios from 'axios';

export const fetchMyPurchasedCourses = async (token) => {
  try {
    const response = await axios.get('/courses/my-courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.data; // قائمة الكورسات
  } catch (error) {
    console.error('Error fetching purchased courses:', error);
    throw error;
  }
};
```

#### 💡 مثال مكون React لعرض الكورسات المشتراة:

```jsx
import React, { useEffect, useState } from 'react';
import { fetchMyPurchasedCourses } from './api';

export const MyCoursesList = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPurchasedCourses(token)
      .then((data) => setCourses(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div>جاري تحميل كورساتك...</div>;

  return (
    <div className="courses-grid">
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <img src={course.image} alt={course.title} />
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <span>تاريخ الشراء: {new Date(course.purchasedAt).toLocaleDateString('ar-EG')}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## 📋 3. متابعة حالة طلبات الشراء للطالب (Check Purchase Status)

المسار: `GET /course-purchase-requests`  
الهدف: معرفة ما إذا كان الطلب `pending` أم `approved` أم `rejected`.

```javascript
export const fetchMyPurchaseRequests = async (token) => {
  const response = await axios.get('/course-purchase-requests', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data.data.items; // [{ id, status: "pending" | "approved" | "rejected", course: {...} }]
};
```

---

## ⚙️ 4. لوحة الأدمن - تغيير حالة الطلب (Admin Status Update)

المسار: `PATCH /course-purchase-requests/:id/status`

```javascript
export const updatePurchaseRequestStatusByAdmin = async ({ adminToken, requestId, status, notes }) => {
  const response = await axios.patch(`/course-purchase-requests/${requestId}/status`, {
    status, // "approved" أو "rejected"
    notes
  }, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.data;
};
```

---

## ⚠️ جدول الأخطاء ورسائل الفرونت إند (Error Handling Mapping)

يمكنك ربط الرسائل المرجعة من الباك إند بنصوص واضحة للمستخدم:

| رمز الخطأ من الباك إند | نص الرسالة المقترح للواجهة |
| :--- | :--- |
| `COURSE_ID_REQUIRED` | يرجى اختيار كورس للشراء |
| `COURSE_NOT_FOUND` | الكورس المطلوب غير موجود |
| `COURSE_ALREADY_PURCHASED` | لقد قمت بشراء هذا الكورس مسبقاً |
| `COURSE_PURCHASE_REQUEST_EXISTS` | لديك طلب شراء معلق بالفعل لهذا الكورس بانتظار مراجعة الأدمن |
| `EMAIL_OR_PHONE_ALREADY_REGISTERED_PLEASE_LOGIN` | هذا الحساب موجود لدينا بالفعل، يرجى تسجيل الدخول أولاً لإكمال الشراء |
| `PASSWORD_REQUIRED` | يرجى كتابة كلمة المرور لإنشاء حسابك |
| `REQUEST_ALREADY_PROCESSED` | تم معالجة هذا الطلب سابقاً بواسطة الأدمن |
