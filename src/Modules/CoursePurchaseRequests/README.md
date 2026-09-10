  # توثيق دورة شراء الكورسات (Course Purchases API Documentation)

  يقدم هذا المستند توثيقاً شاملاً لدورة شراء الكورسات والـ API Endpoints الخاصة بها، موضحاً المسارات، المعاملات، طريقة التوثيق (Auth)، وتفاصيل العمليات للـ Frontend والـ Backend.

  ---

  ## 📌 ملخص دورة العمل (Workflow Summary)

  ```mermaid
  sequenceDiagram
      autonumber
      actor Student as الطالب / الزائر
      participant API as الباك إند (API)
      actor Admin as الأدمن
      participant DB as قاعدة البيانات (Database)

      Student->>API: POST /course-purchase-requests (رفع إيصال + بيانات الطالب والكورس)
      alt مستخدم جديد (Guest)
          API->>DB: إنشاء حساب User + Student (حالة Pending)
      end
      API->>DB: حفظ طلب الشراء (course_purchase_request) بحالة Pending
      API-->>Student: 201 Created (تم إنشاء الطلب بنجاح)

      Admin->>API: GET /course-purchase-requests (مراجعة الطلبات المعلقة)
      API-->>Admin: قائمة الطلبات مع صورة الإيصال وبيانات الطالب
      
      Admin->>API: PATCH /course-purchase-requests/:id/status (تعديل الحالة إلى approved)
      API->>DB: إضافة سجل القيد في CoursePurchase لتفعيل الكورس
      API->>API: حذف صورة الإيصال من السيرفر للحفاظ على الخصوصية والمساحة
      API-->>Admin: 200 OK (تم القبول وتفعيل الكورس)

      Student->>API: GET /courses/my-courses (عرض الكورسات المشتراة)
      API-->>Student: قائمة الكورسات المفعلة للطالب
  ```

  ---

  ## 🚀 الـ Endpoints الخاصة بالنظام

  ### 1. تقديم طلب شراء كورس (Create Purchase Request)

  - **المسار (Endpoint):** `POST /course-purchase-requests`
  - **نوع الطلب (Content-Type):** `multipart/form-data`
  - **الصلاحية (Auth):** اختياري (متاح للطالب المسجل دخول أو للزائر الجديد Guest).

  #### 📥 بيانات الطلب (Form Data Body):

  | الحقل | النوع | إجباري؟ | الوصف |
  | :--- | :--- | :--- | :--- |
  | `image` | File (Image) | نعم | صورة إيصال الدفع (JPG, PNG, WEBP, etc.) |
  | `courseId` | String (UUID) | شرطي* | معرف الكورس المراد شراؤه |
  | `courseIds` | Array[String] | شرطي* | قائمة معرفات كورسات (في حال شراء أكثر من كورس في نفس الطلب) |
  | `name` | String | نعم | اسم الطالب |
  | `phone` | String | نعم | رقم هاتف الطالب |
  | `email` | String | نعم | البريد الإلكتروني للطالب |
  | `password` | String | شرطي** | كلمة السر (مطلوبة فقط للزائر الجديد المشتري بدون Auth Token) |
  | `confirmPassword` | String | شرطي** | تأكيد كلمة السر (يجب أن تطابق `password`) |
  | `parentPhone` | String | لا | رقم هاتف ولي الأمر |
  | `rankId` | String (UUID) | لا | معرف الصف الدراسي للطالب |
  | `notes` | String | لا | ملاحظات الطالب على طلب الشراء |

  > \* يجب إرسال إما `courseId` أو `courseIds`.  
  > \*\* كلمة السر مطلوية فقط إذا لم يكن المستخدم مسجلاً بالدخول (`req.user` غير موجود).

  #### 📤 استجابة النجاح (`201 Created`):
  ```json
  {
    "status": "success",
    "message": "CREATE_SUCCESS",
    "data": {
      "requests": [
        {
          "id": "c1f3a58e-89a7-4c12-98ab-312948293bc1",
          "studentId": "st_94829103",
          "courseId": "cr_102",
          "status": "pending",
          "receipt_img": "course-purchases/receipts/172588729102-receipt.png",
          "notes": "تم التحويل عن طريق فودافون كاش",
          "createdAt": "2026-09-09T14:30:00.000Z"
        }
      ],
      "errors": []
    }
  }
  ```

  #### ❌ استجابات الأخطاء الشائعة:
  - `400 Bad Request`: `COURSE_ID_REQUIRED` (لم يتم إرسال كورس).
  - `400 Bad Request`: `COURSE_NOT_FOUND` (الكورس غير موجود).
  - `400 Bad Request`: `COURSE_ALREADY_PURCHASED` (الكورس مشتري ومُفعل بالفعل للطالب).
  - `400 Bad Request`: `COURSE_PURCHASE_REQUEST_EXISTS` (يوجد طلب شراء معلق حالياً لنفس الكورس).
  - `400 Bad Request`: `EMAIL_OR_PHONE_ALREADY_REGISTERED_PLEASE_LOGIN` (الايميل أو الهاتف يتبع حساباً مسجلاً، يجب تسجيل الدخول أولاً).
  - `400 Bad Request`: `PASSWORD_REQUIRED` (لم يتم إرسال كلمة المرور لحساب الطالب الجديد).

  ---

  ### 2. استعراض طلبات الشراء (Get Purchase Requests)

  - **المسار (Endpoint):** `GET /course-purchase-requests`
  - **الصلاحية (Auth):** 
    - **الأدمن (`COURSE_PURCHASE_REQUESTS.READ`):** يستعرض كل طلبات النظام.
    - **الطالب:** يستعرض طلبات الشراء الخاصة به فقط.

  #### 🔍 المعاملات (Query Parameters):

  | المعامل | النوع | الافتراضي | الوصف |
  | :--- | :--- | :--- | :--- |
  | `status` | String | `all` | فلترة حسب الحالة (`pending`, `approved`, `rejected`) |
  | `page` | Number | `1` | رقم الصفحة |
  | `limit` | Number | `10` | عدد العناصر في الصفحة |

  #### 📤 استجابة النجاح (`200 OK`):
  ```json
  {
    "status": "success",
    "message": "FETCH_SUCCESS",
    "data": {
      "items": [
        {
          "id": "c1f3a58e-89a7-4c12-98ab-312948293bc1",
          "studentId": "st_94829103",
          "courseId": "cr_102",
          "status": "pending",
          "receipt_img": "course-purchases/receipts/172588729102-receipt.png",
          "notes": "تحويل بنكي",
          "createdAt": "2026-09-09T14:30:00.000Z",
          "student": {
            "user": {
              "name": "أحمد محمود",
              "email": "ahmed@example.com",
              "phone": "01012345678"
            }
          },
          "course": {
            "id": "cr_102",
            "title_ar": "كورس الرياضيات - الصف الثالث الثانوي",
            "price": 350
          }
        }
      ],
      "pagination": {
        "totalItems": 1,
        "totalPages": 1,
        "currentPage": 1,
        "limit": 10
      }
    }
  }
  ```

  ---

  ### 3. تغيير حالة طلب الشراء (Change Purchase Request Status)

  - **المسار (Endpoint):** `PATCH /course-purchase-requests/:id/status`
  - **الصلاحية (Auth):** الأدمن فقط (`COURSE_PURCHASE_REQUESTS.UPDATE`).

  #### 📥 بيانات الطلب (JSON Body):

  | الحقل | النوع | إجباري؟ | القيم المتاحة | الوصف |
  | :--- | :--- | :--- | :--- | :--- |
  | `status` | String | نعم | `approved` \| `rejected` | الحالة الجديدة للطلب |
  | `notes` | String | لا | - | ملاحظات الأدمن (مثل سبب الرفض) |

  #### 📤 استجابة النجاح (`200 OK`):
  ```json
  {
    "status": "success",
    "message": "UPDATE_SUCCESS",
    "data": {
      "id": "c1f3a58e-89a7-4c12-98ab-312948293bc1",
      "status": "approved",
      "receipt_img": null,
      "notes": "تم التأكد من الإيصال وتفعيل الكورس"
    }
  }
  ```

  > 💡 **ملاحظة تفعيل الكورس:** عند تغيير الحالة إلى `approved`:
  > 1. يتم إدراج سجل في جدول `CoursePurchase` لتفعيل الكورس للطالب فوراً.
  > 2. يتم حذف صورة الإيصال من السيرفر لحماية الخصوصية وتوفير المساحة.

  ---

  ### 4. استرجاع الكورسات المشتراة للطالب (Get My Purchased Courses)

  - **المسار (Endpoint):** `GET /courses/my-courses`
  - **الصلاحية (Auth):** الطالب المسجل دخول (`Bearer Token`).

  #### 📤 استجابة النجاح (`200 OK`):
  ```json
  {
    "status": "success",
    "message": "FETCH_SUCCESS",
    "data": [
      {
        "id": "cr_102",
        "title": "كورس الرياضيات - الصف الثالث الثانوي",
        "description": "شرح كامل لمنهج الرياضيات",
        "price": 350,
        "purchasedAt": "2026-09-09T14:35:00.000Z",
        "rank": {
          "id": "rn_03",
          "name": "الصف الثالث الثانوي",
          "slug": "3rd-secondary"
        },
        "category": {
          "id": "cat_01",
          "name": "رياضيات"
        }
      }
    ]
  }
  ```

  ---

  ## 🔒 الملاحظات الأمنية وقواعد العمل (Business Rules)

  1. **التعامل مع حسابات الطلبة:**
    - إذا تم تقديم طلب من قبل طالب **مسجّل الدخول** (`Bearer Token`)، يتم إضافة الطلب لحسابه مباشرة.
    - إذا تم تقديم الطلب من قبل **زائر** واكتشف النظام أن البريد الإلكتروني أو رقم الهاتف موجودان مسبقاً، يُرفض الطلب ويُطلب منه تسجيل الدخول لمنع أي انتحال شخصية.
    - في حال كان الزائر مستخدماً جديداً كلياً، يُشترط إرسال `password` ويتم تشفيرها وإنشاء حساب `User` وحساب `Student` له بحالة `pending`.
  2. **التحقق التلقائي من التكرار:**
    - يمنع النظام شراء كورس مفعّل مسبقاً للطالب.
    - يمنع النظام تقديم أكثر من طلب شراء معلق لنفس الكورس ونفس الطالب.
  3. **التنظيف الذاتي:**
    - عند معالجة الطلب (قبول أو رفض)، يتم حذف ملف صورة الإيصال المرفوع على السيرفر تلقائياً.
    - في حال حدوث أي خطأ أثناء إنشاء الطلب، يتم مسح الإيصال المرفوع فوراً لمنع الملفات العالقة.
