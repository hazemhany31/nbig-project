<?php
// ملف إعدادات البريد الإلكتروني (نموذج إرشادي)
// قم بنسخ هذا الملف إلى email_config.php وتعبئة بيانات الاعتماد الخاصة بك

return [
    // إعدادات SMTP
    'smtp' => [
        'host' => 'mail.new-build-egypt.com',        // مضيف SMTP
        'port' => 587,                               // منفذ SMTP (587 لـ TLS، 465 لـ SSL)
        'encryption' => 'tls',                       // نوع التشفير (tls أو ssl)
        'auth' => true,                              // تفعيل المصادقة
        'username' => 'info@new-build-egypt.com',    // اسم المستخدم (البريد الكامل)
        'password' => 'YOUR_EMAIL_PASSWORD_HERE',    // كلمة المرور
    ],

    // إعدادات البريد
    'email' => [
        'from_email' => 'info@new-build-egypt.com',  // البريد المرسل منه
        'from_name' => 'NBIG Contact Form',          // اسم المرسل
        'to_email' => 'info@new-build-egypt.com',    // البريد المستقبل
        'to_name' => 'NBIG Recipient',               // اسم المستقبل
    ],

    // Server-only secret. Prefer the RECAPTCHA_SECRET_KEY environment variable.
    'recaptcha' => [
        'secret' => 'YOUR_RECAPTCHA_SECRET_KEY',
        'allowed_hosts' => ['new-build-egypt.com', 'www.new-build-egypt.com'],
    ],

    // إعدادات إضافية
    'settings' => [
        'timeout' => 60,                             // مهلة الاتصال (ثانية)
        'charset' => 'UTF-8',                        // ترميز النص
        'debug' => false,                            // تفعيل وضع التصحيح
        'verify_peer' => true,                      // التحقق من شهادة SSL
        'verify_peer_name' => true,                 // التحقق من اسم الشهادة
        'allow_self_signed' => false,                 // السماح بالشهادات الذاتية
    ]
];
?>
