# Local QA, 23 November 2026

## Completed

- All 11 HTML pages loaded in Chromium at 1440px desktop and 390px mobile widths with no uncaught JavaScript errors.
- All 11 pages switched to Arabic/RTL at 1440px, 390px and 320px without horizontal overflow.
- All inline JavaScript and changed shared JavaScript passed Node syntax checks.
- All PHP files passed PHP 8.1 syntax checks.
- Direct PHP checks confirmed safe JSON responses for a GET request, missing server configuration and array-shaped invalid input.
- All static local HTML asset/link references resolved to files.
- Portfolio filters returned four residential and four medical projects; restoring all returned all eight.
- Mobile menu opened, exposed its expanded state and closed with Escape.
- Both active contact forms were tested with mocked server success and 503 failure responses, including duplicate-submit prevention and button reset. No real mail was sent.
- Representative desktop/mobile English and Arabic homepage, portfolio, Sky Hills and Zayed Lagoons screenshots were visually inspected.
- Corrected six missing mobile slideshow-image references to existing desktop assets. Empty image elements in hidden lightboxes intentionally have no source until opened.

## Not verified

- Real SMTP delivery, customer acknowledgements, valid production CAPTCHA completion and rotated credentials require the hosting/service owner.
- Apache rewrite/access rules require an Apache deployment check; the local preview server does not process .htaccess.
- No production deployment, purchases, key rotation, history rewriting or account-security changes were performed.
- Existing business statistics and marketing facts were preserved from the supplied source, not independently certified. No new prices, testimonials, availability or performance promises were added.
- This pass is not a security audit and does not certify that the whole site has no defects.

## Complete-site redesign pass

- Rebuilt the homepage as an architectural editorial layout and applied the shared identity to all eight project pages and both legal pages.
- Checked all eight stage selections and all eight image galleries, including keyboard opening, next/previous, Escape and focus return.
- Checked the 14 linked PDF references and internal route/anchor targets locally.
- Fixed the Zayed Lagoons form status region so the shared submit handler works.
- Added motion controls and OS reduced-motion support.
- Private interactive preview deliberately does not send messages, place calls or download project PDFs. Repository links remain functional.
- This is repository/local testing, not a claim of production deployment or successful live email delivery.
