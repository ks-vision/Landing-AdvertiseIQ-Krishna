<?php
/**
 * AdvertiseIQ — Contact Form Mailer
 * Credentials are loaded from environment variables — never hardcoded.
 */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/PHPMailer/src/Exception.php';

header('Content-Type: application/json');

/* ── Only accept POST ── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

/* ── Load credentials from environment ── */
$recaptcha_secret = getenv('RECAPTCHA_SECRET_KEY') ?: '';
$smtp_password    = getenv('SMTP_PASSWORD') ?: '';
$smtp_username    = getenv('SMTP_USERNAME') ?: 'contact@advertiseiq.co';
$smtp_from        = getenv('SMTP_FROM')     ?: 'contact@advertiseiq.co';
$smtp_host        = getenv('SMTP_HOST')     ?: 'mail.smtp2go.com';
$smtp_port        = (int)(getenv('SMTP_PORT') ?: 465);
$mail_to          = getenv('CONTACT_MAIL_TO') ?: 'sales@visioninfotech.net';

/* ── Validate reCAPTCHA (skip if no secret configured) ── */
$recaptcha_token = $_POST['g-recaptcha-response'] ?? '';

if ($recaptcha_secret && $recaptcha_token) {
    $verify_url = 'https://www.google.com/recaptcha/api/siteverify';
    $ctx = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query([
                'secret'   => $recaptcha_secret,
                'response' => $recaptcha_token,
                'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
            ])
        ]
    ]);
    $response = @file_get_contents($verify_url, false, $ctx);
    $result   = $response ? json_decode($response, true) : [];

    if (empty($result['success']) || ($result['score'] ?? 0) < 0.4) {
        write_form_log('error', 'reCAPTCHA failed', ['score' => $result['score'] ?? 'n/a']);
        echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed. Please try again.']);
        exit;
    }
}

/* ── Sanitize & validate inputs ── */
$first_name = trim(filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$last_name  = trim(filter_input(INPUT_POST, 'last_name',  FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$email      = trim(filter_input(INPUT_POST, 'email',      FILTER_SANITIZE_EMAIL)          ?? '');
$phone      = trim(filter_input(INPUT_POST, 'phone',      FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$company    = trim(filter_input(INPUT_POST, 'company',    FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$budget     = trim(filter_input(INPUT_POST, 'budget',     FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$subject    = trim(filter_input(INPUT_POST, 'subject',    FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$message    = trim(filter_input(INPUT_POST, 'message',    FILTER_SANITIZE_SPECIAL_CHARS) ?? '');

if (!$first_name || !$last_name || !$email || !$message) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

/* ── Mail body ── */
$admin_body = "Name: {$first_name} {$last_name}\nEmail: {$email}\nPhone: {$phone}\nCompany: {$company}\nBudget: {$budget}\nSubject: {$subject}\n\nMessage:\n{$message}";

$thank_you_body = '
<p>Hi ' . htmlspecialchars($first_name) . ',</p>
<p>Thank you for reaching out to <strong>AdvertiseIQ</strong>.</p>
<p>We have received your message and our team will be in touch within 24 hours.</p>
<p><strong>Your details:</strong></p>
<ul>
    <li>Name: ' . htmlspecialchars("{$first_name} {$last_name}") . '</li>
    <li>Email: ' . htmlspecialchars($email) . '</li>
</ul>
<p>Best regards,<br>The AdvertiseIQ Team</p>';

/* ── Send mail (skip if SMTP not configured) ── */
if (!$smtp_password) {
    /* Log the submission anyway and respond success so the user journey is not broken */
    write_form_log('info', 'SMTP not configured — form submission logged only', [
        'name' => "{$first_name} {$last_name}", 'email' => $email, 'message' => $message
    ]);
    echo json_encode(['success' => true, 'message' => 'Thank you! We\'ll be in touch soon.']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $smtp_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_username;
    $mail->Password   = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $smtp_port;

    /* Admin notification */
    $mail->setFrom($smtp_from, 'AdvertiseIQ');
    $mail->addReplyTo($email, "{$first_name} {$last_name}");
    $mail->addAddress($mail_to);
    $mail->Subject = "New Contact Form: {$first_name} {$last_name}";
    $mail->Body    = nl2br($admin_body);
    $mail->isHTML(true);
    $mail->send();

    /* Thank-you to user */
    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email);
    $mail->setFrom($smtp_from, 'AdvertiseIQ');
    $mail->Subject = 'Thank you for contacting AdvertiseIQ';
    $mail->Body    = $thank_you_body;
    $mail->send();

    write_form_log('success', 'Contact form submitted', ['name' => "{$first_name} {$last_name}", 'email' => $email]);
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    error_log('PHPMailer error: ' . $mail->ErrorInfo);
    write_form_log('error', 'Mail sending failed', ['error' => $mail->ErrorInfo, 'email' => $email]);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again or email us directly.']);
}

/* ── Logger ── */
function write_form_log(string $status, string $message, array $data = []): void
{
    $base_dir = __DIR__ . '/error_logs';
    if (!is_dir($base_dir)) {
        mkdir($base_dir, 0755, true);
    }
    $file_path = $base_dir . '/' . date('d-m-Y') . '.log';
    $log_text  = "----------------------------------\n"
               . "Time    : " . date('Y-m-d H:i:s') . "\n"
               . "Status  : {$status}\n"
               . "Message : {$message}\n"
               . "IP      : " . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "\n"
               . "Data    : " . print_r($data, true) . "\n";
    file_put_contents($file_path, $log_text, FILE_APPEND | LOCK_EX);
}
