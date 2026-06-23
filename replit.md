# AdvertiseIQ — Marketing Landing Page

## Overview
A static marketing site for the AdvertiseIQ AI-powered Amazon advertising platform. Built with HTML5, CSS3, vanilla JavaScript, Three.js, GSAP, and PHP (contact form). No framework — intentionally lightweight.

## Running the App
The PHP built-in dev server serves the site:
```
php -S 0.0.0.0:5000
```
Port 5000 is exposed as port 80 externally.

## Project Structure
- `index.html`, `about-us.html`, `contact-us.html`, `features.html`, `pricing.html`, `market.html`, `ppc-sales.html` — page templates
- `assets/css/` — stylesheets (per-page + global)
- `assets/js/` — scripts (`index.js` Three.js hero, `site.js` global, `custom.js` sliders)
- `assets/img/` — logos, dashboard screenshots, SVGs
- `contact-mail.php` — contact form handler (PHPMailer + SMTP)
- `PHPMailer/` — bundled PHPMailer v6 library
- `error_logs/` — daily PHP log files for form submissions

## Contact Form Environment Variables
The contact form (`contact-mail.php`) reads all credentials from environment variables. Set these as Replit Secrets if email sending is needed:

| Secret | Description | Default |
|---|---|---|
| `SMTP_PASSWORD` | SMTP password (required to send mail) | _(none — logs only if unset)_ |
| `SMTP_USERNAME` | SMTP username | `contact@advertiseiq.co` |
| `SMTP_FROM` | From address | `contact@advertiseiq.co` |
| `SMTP_HOST` | SMTP host | `mail.smtp2go.com` |
| `SMTP_PORT` | SMTP port | `465` |
| `CONTACT_MAIL_TO` | Recipient for contact submissions | `sales@visioninfotech.net` |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret | _(skipped if unset)_ |

## User Preferences
- No frontend framework — keep it plain HTML/CSS/JS
- Credentials must always come from environment variables, never hardcoded
