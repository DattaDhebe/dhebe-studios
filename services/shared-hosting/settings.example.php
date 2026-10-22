<?php
declare(strict_types=1);
// Install ONLY as private/dhebevoice-signups/settings.php, never in public_html.
return [
    'mail_from' => 'support@dhebe.com',
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,
    'smtp_encryption' => 'ssl', // Implicit TLS; 587 with 'tls' is also supported.
    'smtp_username' => 'support@dhebe.com',
    // Set the existing mailbox password directly in the private server file,
    // or use DHEBE_SIGNUP_SMTP_PASSWORD. Never commit or publish the password.
    'smtp_password' => getenv('DHEBE_SIGNUP_SMTP_PASSWORD') ?: '',
];
