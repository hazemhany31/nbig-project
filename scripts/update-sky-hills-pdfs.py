#!/usr/bin/env python3
"""Update the Sky Hills unit catalogue without changing payment offers.

Replaces only profile page 7 and payment-plan page 3 with vector pages.
All other current PDF pages are preserved, including the separately updated
profile page 8 payment copy.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import shutil

import fitz


ROOT = Path(__file__).resolve().parents[1]
BACKUP = Path('/private/tmp/nbig-sky-hills-backup/pdf')
AUDIT = Path('/private/tmp/sky-hills-payments-audit')
FONTS = Path('/System/Library/Fonts/Supplemental')
WIDTH, HEIGHT = 600, 424.32
DARK = (0.045, 0.055, 0.08)
PANEL = (0.075, 0.09, 0.12)
GOLD = (0.79, 0.66, 0.30)
WHITE = (0.96, 0.96, 0.94)
MUTED = (0.70, 0.73, 0.77)


def html(page: fitz.Page, rect, content: str, size=11, color='#f5f5ef', rtl=False):
    """Use MuPDF's shaping engine for Arabic and preserve selectable text."""
    css = f'''
    @font-face {{font-family: PageArial; src: url("Arial.ttf");}}
    @font-face {{font-family: PageArial; src: url("Arial Bold.ttf"); font-weight: bold;}}
    body {{margin: 0; font-family: PageArial; font-size: {size}pt;
          color: {color}; line-height: 1.35;}}
    p {{margin: 0;}}
    '''
    markup = f'<div dir="{"rtl" if rtl else "ltr"}">{content}</div>'
    spare, scale = page.insert_htmlbox(
        fitz.Rect(rect), markup, css=css, archive=fitz.Archive(str(FONTS)),
        scale_low=1,
    )
    if spare < 0 or scale < 0.999:
        raise ValueError(f'Content does not fit: {rect}, {content!r}')


def text(page, x, y, value, size=12, color=WHITE, bold=False):
    page.insert_text((x, y), value, fontname='pagebold' if bold else 'pagereg',
                     fontsize=size, color=color)


def base_page(title: str, arabic_title: str, original_number: str):
    doc = fitz.open()
    p = doc.new_page(width=WIDTH, height=HEIGHT)
    p.insert_font(fontname='pagereg', fontfile=str(FONTS / 'Arial.ttf'))
    p.insert_font(fontname='pagebold', fontfile=str(FONTS / 'Arial Bold.ttf'))
    p.draw_rect(p.rect, fill=DARK, color=DARK)
    text(p, 30, 28, 'NBIG DEVELOPMENTS', 9, GOLD, bold=True)
    text(p, 30, 61, 'SKY HILLS', 25, WHITE, bold=True)
    html(p, (330, 35, 570, 69), arabic_title, 19, '#c9a84c', rtl=True)
    text(p, 30, 86, title, 11, MUTED)
    p.draw_line((30, 100), (570, 100), color=GOLD, width=1)
    p.draw_line((30, 394), (570, 394), color=(0.22, 0.24, 0.28), width=0.5)
    text(p, 30, 409, 'OCTOBER GARDENS', 8, MUTED)
    text(p, 555, 409, original_number, 9, GOLD, bold=True)
    return doc, p


def unit_card(page, x, area, arabic, english, top=138, bottom=236):
    page.draw_rect((x, top, x + 172, bottom), color=(0.30, 0.28, 0.20), fill=PANEL)
    text(page, x + 16, top + 41, f'{area} m²', 28, GOLD, bold=True)
    html(page, (x + 12, top + 50, x + 160, top + 74), arabic, 12, rtl=True)
    text(page, x + 16, top + 87, english, 10, MUTED)


def profile_page():
    doc, p = base_page('Project overview', 'تفاصيل المشروع', '07')
    html(p, (30, 112, 570, 135), 'الوحدات المتاحة', 13, rtl=True)
    unit_card(p, 30, 90, 'دور أرضي', 'Ground floor')
    unit_card(p, 214, 120, 'دور متكرر', 'Typical floor')
    unit_card(p, 398, 145, 'دور متكرر', 'Typical floor')
    # Preserve the non-unit facts printed on the original profile page 7.
    stats = [
        (30, '9 FEDDANS', 'مساحة الأرض 9 أفدنة'),
        (214, 'G + 5', 'أرضي و5 طوابق سكنية'),
        (398, '50% / 50%', 'مبانٍ / مساحات خضراء وبحيرات'),
    ]
    for x, value, label in stats:
        text(p, x + 12, 266, value, 13, GOLD, bold=True)
        html(p, (x + 8, 274, x + 164, 298), label, 9, '#c4c9d1', rtl=True)
    html(p, (30, 309, 570, 351),
         'مساحات خضراء وبحيرات صناعية، جيم، تراك جري ومنطقة للشواء. '
         'مول طبي وتجاري متكامل داخل المشروع بتقنيات Smart Technology.',
         11, rtl=True)
    html(p, (30, 358, 570, 387),
         'Landscaped spaces and artificial lakes, a gym, jogging track and barbecue area. '
         'An integrated medical and commercial mall with Smart Technology.',
         9, '#b3bac4')
    return doc


def payment_page():
    doc, p = base_page('Payment plans', 'خطط السداد', '03')
    # These are the original offers from this payment PDF, kept as distinct pairs.
    for x, percent, years in [(30, 10, 4), (214, 15, 5), (398, 20, 6)]:
        p.draw_rect((x, 118, x + 172, 222), color=(0.30, 0.28, 0.20), fill=PANEL)
        text(p, x + 16, 157, f'{percent}%', 29, GOLD, bold=True)
        html(p, (x + 12, 166, x + 160, 188), 'مقدم حجز', 11, rtl=True)
        html(p, (x + 10, 193, x + 162, 216), f'سداد حتى {years} سنوات', 11, rtl=True)
    html(p, (30, 236, 570, 260), 'الوحدات: 90 م² أرضي، 120 م² متكرر، 145 م² متكرر',
         13, '#c9a84c', rtl=True)
    html(p, (30, 269, 292, 295), 'سعر المتر يبدأ من 28,000 جنيه', 12, rtl=True)
    html(p, (310, 269, 570, 295), 'الوحدات نصف تشطيب', 12, rtl=True)
    html(p, (30, 307, 570, 333), 'تسليم مبدئي: ديسمبر 2027 | تسليم نهائي: ديسمبر 2028',
         12, rtl=True)
    html(p, (30, 350, 570, 380),
         '10% down / up to 4 years · 15% / up to 5 years · 20% / up to 6 years<br>'
         'From EGP 28,000/m² · Semi-finished · Initial: Dec 2027 · Final: Dec 2028',
         9, '#b3bac4')
    return doc


def replace_page(path: Path, page_index: int, replacement: fitz.Document):
    """Copy original page objects; replace only the requested page."""
    BACKUP.mkdir(parents=True, exist_ok=True)
    backup = BACKUP / path.name
    if not backup.exists():
        shutil.copy2(path, backup)
    source = fitz.open(path)
    out = fitz.open()
    if page_index:
        out.insert_pdf(source, from_page=0, to_page=page_index - 1)
    out.insert_pdf(replacement)
    if page_index + 1 < len(source):
        out.insert_pdf(source, from_page=page_index + 1, to_page=len(source) - 1)
    out.set_metadata(source.metadata)
    temp = path.with_suffix('.updated.pdf')
    out.save(temp, garbage=4, deflate=True)
    out.close()
    source.close()
    temp.replace(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--floor-plans-only', action='store_true')
    args = parser.parse_args()
    AUDIT.mkdir(parents=True, exist_ok=True)
    if not args.floor_plans_only:
        profile = profile_page()
        payment = payment_page()
        replace_page(ROOT / 'pdf/Sky-Hills-Profile.pdf', 6, profile)
        replace_page(ROOT / 'pdf/payment plan -sky hills ..pdf', 2, payment)
        profile[0].get_pixmap(matrix=fitz.Matrix(2, 2)).save(AUDIT / 'profile-page7-current.png')
        payment[0].get_pixmap(matrix=fitz.Matrix(2, 2)).save(
            ROOT / 'images/payment_plan/sky-hills-payment-current.png')
        print('Updated profile page 7 and payment-plan page 3.')
        print('Preserved all other current pages and payment terms.')
    # Floor-plan PDF inputs are produced by the separate image-editing task.
    # The filename and area are explicit so old unit PDFs cannot be included.
    for identity, area, floor in [
        ('ground-90-a', 90, 'Ground floor'),
        ('ground-90-b', 90, 'Ground floor'),
        ('typical-120', 120, 'Typical floor'),
        ('typical-145', 145, 'Typical floor'),
    ]:
        image = ROOT / f'images/floor-plans/{identity}.png'
        if image.exists():
            pix = fitz.Pixmap(str(image))
            doc = fitz.open()
            page = doc.new_page(width=pix.width * 0.5, height=pix.height * 0.5)
            page.insert_image(page.rect, filename=str(image))
            page.insert_text((8, 12), f'Sky Hills | {area} m² | {floor}',
                             fontsize=8, render_mode=3)
            doc.set_metadata({'title': f'Sky Hills | {area} m² | {floor}',
                              'subject': 'Current Sky Hills unit floor plan',
                              'author': 'NBIG Developments'})
            path = ROOT / f'pdfs/sky-hills-{identity}.pdf'
            doc.save(path, deflate=True)
            page.get_pixmap(matrix=fitz.Matrix(1, 1)).save(AUDIT / f'{identity}-pdf.png')
            print(f'Created {path.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
