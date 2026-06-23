<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/PHPMailer/src/Exception.php';


// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit('Invalid request');
}

/**
 * 1. Validate reCAPTCHA
 */
$recaptcha_secret = '6LfzFEgsAAAAAOmi6LxT99rqxwkFQExnZ074GHoT';
$recaptcha_token  = $_POST['g-recaptcha-response'] ?? '';

if (empty($recaptcha_token)) {    
    header('Location: contact-us.html?error=1');
    exit;
}

$verify_url = 'https://www.google.com/recaptcha/api/siteverify';

$response = file_get_contents($verify_url . '?' . http_build_query([
    'secret'   => $recaptcha_secret,
    'response' => $recaptcha_token,
    'remoteip' => $_SERVER['REMOTE_ADDR']
]));

$result = json_decode($response, true);

/**
 * 2. Check result
 */
if (
    empty($result['success']) ||
    $result['score'] < 0.5 ||
    $result['action'] !== 'contact_form'
) {
    write_form_log( 'error',
        'Recaptcha Not Working',
        [
            'score' => $result['score'],
            'form_data' => $_POST
        ]
    );
    header('Location: contact-us.html?error=1');
    exit;
}

// Sanitize inputs
$first_name = trim(filter_input(INPUT_POST, 'first_name', FILTER_SANITIZE_SPECIAL_CHARS));
$last_name  = trim(filter_input(INPUT_POST, 'last_name', FILTER_SANITIZE_SPECIAL_CHARS));
$email      = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
$phone      = trim(filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_SPECIAL_CHARS));
$message    = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS));

// Validate
if (!$first_name || !$last_name || !$email || !$phone || !$message) {
    write_form_log( 'error',
        'Required fields missing',
        [
            'missing_fields' => [$first_name, $last_name, $email, $phone, $message ],
            'form_data' => $_POST
        ]
    );
    header('Location: contact-us.html?error=1');
    exit;
}

// Admin mail body
$body = "
Name: {$first_name} {$last_name}
Email: {$email}
Phone: {$phone}

Message:
{$message}
";

$thank_you_subject = 'Thank you for contacting Advertise IQ';

$thank_you_body = '
<p>Hi ' . htmlspecialchars($first_name) . ',</p>

<p>Thank you for reaching out to <strong>Advertise IQ</strong>.</p>

<p>We have received your message and our team will contact you shortly.</p>

<p><strong>Your details:</strong></p>
<ul>
    <li>Name: ' . htmlspecialchars($first_name . ' ' . $last_name) . '</li>
    <li>Email: ' . htmlspecialchars($email) . '</li>
    <li>Phone: ' . htmlspecialchars($phone) . '</li>
</ul>

<p>Best regards,<br>
Advertise IQ Team</p>
';

$mail = new PHPMailer(true);

try {
    // SMTP config
    $mail->isSMTP();
    $mail->Host       = 'mail.smtp2go.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'contact@advertiseiq.co';
    $mail->Password   = 'TmzPLCuGBEoAQWC4';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    
    // Headers
    $mail->setFrom('contact@advertiseiq.co', 'Advertise IQ');
    $mail->addReplyTo($email);
    $mail->addAddress('sales@visioninfotech.net');    
    
    $mail->Subject = 'New Contact Form Submission';
    $mail->Body    = nl2br($body);
    $mail->isHTML(true);

    $mail->send();
    
    // THANK YOU EMAIL (USER)   
    $mail->clearAddresses();
    $mail->clearReplyTos();

    $mail->addAddress($email);
    $mail->setFrom('contact@advertiseiq.co', 'Advertise IQ');

    $mail->Subject = $thank_you_subject;
    $mail->Body    = $thank_you_body;
    $mail->send();

    write_form_log( 'success', 'Contact form submitted successfully', $_POST );

    header('Location: contact-us.html?success=1');
    exit;

} catch (Exception $e) {
    error_log($mail->ErrorInfo);

    write_form_log( 'error', 'Mail sending failed',
        [
            'form_data' => $_POST,
            'php_error' => error_get_last()
        ]
    );

    header('Location: contact-us.html?error=1');
    exit;
}


/**
 * Common error/success logger
 *
 * @param string $status   success | error
 * @param string $message  Human readable message
 * @param array  $data     Form data or any related info
 */
function write_form_log($status, $message, array $data = [])
{
    // Base directory (same location as current file)
    $base_dir = __DIR__ . '/error_logs';

    // Create directory if not exists
    if (!is_dir($base_dir)) {
        mkdir($base_dir, 0755, true);
    }

    // Log file name (date-wise)
    $file_name = date('d-m-Y') . '.log';
    $file_path = $base_dir . '/' . $file_name;

    // Log format
    $log_entry = [
        'time'    => date('Y-m-d H:i:s'),
        'status'  => $status,
        'message' => $message,
        'data'    => $data,
        'ip'      => $_SERVER['REMOTE_ADDR'] ?? 'N/A'
    ];

    // Convert to readable text
    $log_text  = "----------------------------------\n";
    $log_text .= "Time    : {$log_entry['time']}\n";
    $log_text .= "Status  : {$log_entry['status']}\n";
    $log_text .= "Message : {$log_entry['message']}\n";
    $log_text .= "IP      : {$log_entry['ip']}\n";
    $log_text .= "Data    : " . print_r($log_entry['data'], true);
    $log_text .= "\n";

    // Append log safely
    file_put_contents($file_path, $log_text, FILE_APPEND | LOCK_EX);
}
