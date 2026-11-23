<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// استدعاء ملفات PHPMailer
require __DIR__ . '/src/PHPMailer.php';
require __DIR__ . '/src/SMTP.php';
require __DIR__ . '/src/Exception.php';

// تحميل إعدادات البريد من email_config.php
$emailConfig = require __DIR__ . '/email_config.php';

header('Content-Type: application/json; charset=utf-8');

// ─── HONEYPOT CHECK ──────────────────────────────────────────────────────────
if (!empty($_POST['website'])) {
  echo json_encode(['success' => false, 'message' => 'Spam detected.']);
  exit;
}

// ─── RATE LIMITING (per IP, max 5 per 10 minutes) ────────────────────────────
$rateFile = sys_get_temp_dir() . '/nbig_rate_' . md5($_SERVER['REMOTE_ADDR'] ?? '0');
$rateLimit = 5;
$rateWindow = 600;
$now = time();
$requests = [];
if (file_exists($rateFile)) {
  $data = json_decode(file_get_contents($rateFile), true);
  if (is_array($data)) {
    $requests = array_filter($data, fn($t) => ($now - $t) < $rateWindow);
  }
}
if (count($requests) >= $rateLimit) {
  echo json_encode(['success' => false, 'message' => 'Too many requests. Please wait a few minutes.']);
  exit;
}
$requests[] = $now;
file_put_contents($rateFile, json_encode(array_values($requests)));

// ─── reCAPTCHA SERVER-SIDE VERIFICATION ──────────────────────────────────────
$recaptchaSecret = '6Lfja30sAAAAAXro6ekMOHAcl8PJjOlbBAxvlJv';
$recaptchaToken = trim($_POST['g-recaptcha-response'] ?? '');
if (empty($recaptchaToken)) {
  echo json_encode(['success' => false, 'message' => 'يرجى إكمال التحقق من reCAPTCHA.']);
  exit;
}
$verifyResponse = @file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($recaptchaSecret) . '&response=' . urlencode($recaptchaToken) . '&remoteip=' . urlencode($_SERVER['REMOTE_ADDR'] ?? ''));
if ($verifyResponse === false) {
  $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query(['secret' => $recaptchaSecret, 'response' => $recaptchaToken, 'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '']), CURLOPT_RETURNTRANSFER => true, CURLOPT_SSL_VERIFYPEER => false, CURLOPT_TIMEOUT => 10]);
  $verifyResponse = curl_exec($ch);
  curl_close($ch);
}
$captchaResult = json_decode($verifyResponse, true);
if (!isset($captchaResult['success']) || $captchaResult['success'] !== true) {
  echo json_encode(['success' => false, 'message' => 'فشل التحقق من reCAPTCHA.']);
  exit;
}

// استقبال البيانات من POST
$project = trim($_POST['project'] ?? 'Prime Med');
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$number = trim($_POST['phone'] ?? $_POST['number'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$number) {
  echo json_encode(['success' => false, 'message' => 'يرجى إدخال جميع البيانات المطلوبة.']);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني غير صحيح.']);
  exit;
}

$mail = new PHPMailer(true);

try {
  // ===============================================
  // 1. إعدادات الإيميل الأول (إلى مدير الموقع)
  // ===============================================
  $mail->isSMTP();
  $mail->Host = $emailConfig['smtp']['host'];
  $mail->SMTPAuth = $emailConfig['smtp']['auth'];
  $mail->Username = $emailConfig['smtp']['username'];
  $mail->Password = $emailConfig['smtp']['password'];
  $mail->SMTPSecure = $emailConfig['smtp']['encryption'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port = $emailConfig['smtp']['port'];
  $mail->CharSet = $emailConfig['settings']['charset'];

  // === !! سطر مهم جدا: اقفل الـ Debug بعد ما تخلص !! ===
  $mail->SMTPDebug = 0; // خليه 0 بدل 2 بعد ما تتأكد إن كله تمام

  $mail->SMTPOptions = [
    'ssl' => [
      'verify_peer' => $emailConfig['settings']['verify_peer'],
      'verify_peer_name' => $emailConfig['settings']['verify_peer_name'],
      'allow_self_signed' => $emailConfig['settings']['allow_self_signed'],
    ]
  ];

  $mail->setFrom($emailConfig['email']['from_email'], $emailConfig['email']['from_name']);
  $mail->addAddress($emailConfig['email']['to_email'], $emailConfig['email']['to_name']);
  $mail->addReplyTo($email, $name);

  $mail->isHTML(true);
  $mail->Subject = "📧 رسالة جديدة من موقع " . $project;
  $mail->Body = '
    <html lang="ar" dir="rtl">
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; background:#f6f7fa;padding:30px;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:14px;box-shadow:0 4px 24px #0001;overflow:hidden;">
        <div style="background:#0078d4;color:#fff;padding:24px 0 18px 0;text-align:center;font-size:1.5rem;font-weight:700;">
          رسالة جديدة من موقع ' . htmlspecialchars($project) . ' <span style="font-size:1.3rem;">📧</span>
        </div>
        <div style="padding:32px 24px 18px 24px;">
          <div style="margin-bottom:18px;">
            <span style="color:#0078d4;font-weight:600;">الاسم 👤</span>
            <div style="background:#f7fafd;border-radius:10px;padding:12px 18px;margin-top:6px;border-right:4px solid #0078d4;">' . htmlspecialchars($name) . '</div>
          </div>
          <div style="margin-bottom:18px;">
            <span style="color:#0078d4;font-weight:600;">البريد الإلكتروني 📧</span>
            <div style="background:#f7fafd;border-radius:10px;padding:12px 18px;margin-top:6px;border-right:4px solid #0078d4;">' . htmlspecialchars($email) . '</div>
          </div>
          <div style="margin-bottom:18px;">
            <span style="color:#0078d4;font-weight:600;">رقم الهاتف 📱</span>
            <div style="background:#f7fafd;border-radius:10px;padding:12px 18px;margin-top:6px;border-right:4px solid #0078d4;">' . htmlspecialchars($number) . '</div>
          </div>'
    . ($message ? '
          <div style="margin-bottom:18px;">
            <span style="color:#d4af37;font-weight:600;">الرسالة 💬</span>
            <div style="background:#fffbe7;border-radius:10px;padding:12px 18px;margin-top:6px;border-right:4px solid #ffc107;">' . nl2br(htmlspecialchars($message)) . '</div>
          </div>' : '') .
    '</div>
        <div style="background:#f6f7fa;padding:18px 0 8px 0;text-align:center;color:#888;font-size:1rem;border-top:1px solid #eee;">
          تم الإرسال من موقع ' . htmlspecialchars($project) . '<br>
          <span style="color:#0078d4;font-size:1.1em;">التاريخ والوقت: ' . date("Y-m-d H:i:s") . '</span>
        </div>
      </div>
    </body>
    </html>
    ';

  $mail->send();

  // ===============================================
  // 2. إعدادات الإيميل الثاني (رسالة التأكيد للعميل)
  // ===============================================
  $userMail = new PHPMailer(true);
  $userMail->isSMTP();
  $userMail->Host = $emailConfig['smtp']['host'];
  $userMail->SMTPAuth = $emailConfig['smtp']['auth'];
  $userMail->Username = $emailConfig['smtp']['username'];
  $userMail->Password = $emailConfig['smtp']['password'];
  $userMail->SMTPSecure = $emailConfig['smtp']['encryption'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
  $userMail->Port = $emailConfig['smtp']['port'];
  $userMail->CharSet = $emailConfig['settings']['charset'];
  $userMail->SMTPDebug = 0; // خلي ده مقفول دايماً

  // *** هذا هو السطر الذي تم إصلاحه ***
  // نعيد تعريف الإعدادات بدلاً من نسخها
  $userMail->SMTPOptions = [
    'ssl' => [
      'verify_peer' => $emailConfig['settings']['verify_peer'],
      'verify_peer_name' => $emailConfig['settings']['verify_peer_name'],
      'allow_self_signed' => $emailConfig['settings']['allow_self_signed'],
    ]
  ];

  $userMail->setFrom($emailConfig['email']['from_email'], $emailConfig['email']['from_name']);
  $userMail->addAddress($email, $name);
  $userMail->isHTML(true);
  $userMail->Subject = "شكراً لك - تم استلام رسالتك";
  $userMail->Body = '
    <html dir="rtl" lang="ar">
    <head><meta charset="UTF-8"><title>تأكيد استلام الرسالة</title></head>
    <body style="font-family: Arial, sans-serif; background:#f5f5f5;margin:0;padding:20px;">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
            <div style="background:#0078d4;color:white;padding:36px 0 30px 0;text-align:center;border-radius:16px 16px 0 0;">
                <h1 style="margin:0;font-size:2rem;font-weight:700;">شكراً لك</h1>
            </div>
            <div style="padding:30px;text-align:center;">
                <h2 style="color:#222;font-size:1.4rem;font-weight:700;margin-bottom:10px;">تم استلام رسالتك بنجاح</h2>
                <div style="font-size:1.1em;font-weight:700;margin-bottom:10px;">عزيزي/عزيزتي <span style="color:#0078d4;">' . htmlspecialchars($name) . '</span></div>
                <div style="font-size:1em;color:#555;margin-bottom:12px;">نشكرُك لتواصلك معنا. تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.</div>
                <div style="font-size:1.1em;color:#222;">سيتم التواصل معك على رقم الهاتف: <b>' . htmlspecialchars($number) . '</b></div>
                <div style="color:#666;font-size:12px;margin-top:18px;">
                    ' . htmlspecialchars($project) . ' - NBIG Developments<br>
                    📞 19938 | 📧 info@nbig.com
                </div>
            </div>
        </div>
    </body>
    </html>
    ';

  $userMail->send();

  // لو كل حاجة نجحت، ارجع برسالة نجاح
  echo json_encode(['success' => true, 'message' => '✅ تم إرسال الرسالة بنجاح!']);

} catch (Exception $e) {
  // لو حصل أي خطأ في أي من الإيميلين، ارجع برسالة خطأ
  echo json_encode(['success' => false, 'message' => 'تعذر الإرسال: ' . $e->getMessage()]);
}
?>