# NBIG website

Bilingual English/Arabic property website using HTML, CSS, JavaScript and a PHP contact endpoint. No build step is required.

## Preview

For the static pages:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Static hosting, including GitHub Pages, cannot run `send_email.php`. Use PHP hosting for the contact form and Apache with `mod_rewrite` for clean URLs.

## Current layout

- `index.html`: homepage and filterable property portfolio
- Project HTML pages: existing project content, floor plans and galleries
- `css/editorial.css`: shared off-white / forest-green visual system
- `js/site-quality.js`: shared navigation, portfolio filtering and contact handling
- `js/gallery.js`: project image/video lightboxes
- `email_config.example.php`: server-only configuration template
- `CPANEL_SETUP.md`: hosting and contact configuration

The content, phone numbers, project facts and existing business statistics were retained from the supplied project, not independently certified. Confirm marketing facts and current availability before a production launch.

## Contact form

Copy `email_config.example.php` to `email_config.php` on the server only and set working SMTP settings. Configure the reCAPTCHA secret with the `RECAPTCHA_SECRET_KEY` environment variable or the private configuration file. Keep the matching public site key in each form, and confirm the allowed hostname list.

No missing-secret fallback is permitted. Missing configuration returns JSON with HTTP 503. SMTP failure returns a generic error without exposing server details. Client code prevents parallel duplicate submissions, resets consumed CAPTCHA tokens and never reports success without a successful server response.

## Security action still required

A reCAPTCHA secret existed in the original published commit. Removing it from current code does not erase Git history. The service owner must replace/revoke the exposed key pair, update the public site keys and private server secret, and verify allowed domains. Never put the replacement secret in GitHub or chat. No credential rotation or history rewrite was performed as part of this code update.

## Verification

See `QA_NOTES.md` for the checks performed and their limits. These are code and local-browser checks, not proof of successful production mail delivery or live deployment.
