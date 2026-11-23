<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/src/PHPMailer.php';
require __DIR__ . '/src/SMTP.php';
require __DIR__ . '/src/Exception.php';

$emailConfig = require __DIR__ . '/email_config.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $emailConfig['smtp']['host'];
    $mail->SMTPAuth = $emailConfig['smtp']['auth'];
    $mail->Username = $emailConfig['smtp']['username'];
    $mail->Password = $emailConfig['smtp']['password'];
    $mail->SMTPSecure = $emailConfig['smtp']['encryption'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $emailConfig['smtp']['port'];
    $mail->CharSet = $emailConfig['settings']['charset'];
    $mail->Timeout = $emailConfig['settings']['timeout'];
    $mail->SMTPDebug = 2; // Always debug for test
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => $emailConfig['settings']['verify_peer'],
            'verify_peer_name' => $emailConfig['settings']['verify_peer_name'],
            'allow_self_signed' => $emailConfig['settings']['allow_self_signed'],
        ]
    ];

    $mail->setFrom($emailConfig['email']['from_email'], $emailConfig['email']['from_name']);
    $mail->addAddress($emailConfig['email']['to_email'], $emailConfig['email']['to_name']);
    $mail->isHTML(true);
    $mail->Subject = "Test Email";
    $mail->Body = "<p>This is a test email to check SMTP settings.</p>";

    $mail->send();
    echo "Test email sent successfully!";
} catch (Exception $e) {
    echo "Test email failed: " . $e->getMessage();
}
?>
