"""Refresh the two static Sky Hills unit sections from one unit catalogue.

The sibling landing is staged inside this workspace; publishing that staged copy
requires the normal filesystem permission for the sibling checkout.
"""
from pathlib import Path
import json
import re
import shutil
from urllib.parse import quote
from sky_hills_overview import normalize_sky_hills_overview
from sky_hills_iliving import normalize_sky_hills_iliving
from sky_hills_stat_cleanup import normalize_sky_hills_stat_cleanup
from sky_hills_handover import normalize_sky_hills_handover

ROOT = Path(__file__).resolve().parents[1]
LANDING = ROOT.parent / 'sky-hills'
BACKUP = Path('/private/tmp/nbig-sky-hills-backup')
STAGE = ROOT / 'output/sky-hills-update/landing'

PLANS = [
    dict(id='ground-90-a', area=90, floor='ground', variant='A', beds=2, baths=1),
    dict(id='ground-90-b', area=90, floor='ground', variant='B', beds=2, baths=1),
    dict(id='typical-120', area=120, floor='typical', beds=3, baths=2),
    dict(id='typical-145', area=145, floor='typical', beds=3, baths=3),
]
RENDERS = [
    ('courtyard-gardens.jpg', 'Landscaped Courtyard', 'Green gardens and pedestrian paths between the Sky Hills residences.'),
    ('courtyard-view.jpg', 'Community Gardens', 'Open lawns and landscaped community spaces at Sky Hills.'),
    ('facade.jpg', 'Residential Facade', 'Sky Hills residential buildings with landscaped street frontage.'),
]
for plan in PLANS:
    plan['image'] = f"images/floor-plans/{plan['id']}.png"
    plan['pdf'] = f"pdfs/sky-hills-{plan['id']}.pdf"


def card(plan):
    ground = plan['floor'] == 'ground'
    floor_key = 'fpGroundLabel' if ground else 'fpTypicalLabel'
    floor_name = 'Ground Floor' if ground else 'Typical Floor'
    type_key = 'fpWithGarden' if ground else 'fpApartment'
    type_text = 'With Private Garden' if ground else 'Apartment'
    outdoor_key = 'fpGardenSpec' if ground else 'fpBalcony'
    outdoor = 'Garden' if ground else 'Balcony'
    variant = f" — <span data-t=\"fpLayout{plan['variant']}\">Layout {plan['variant']}</span>" if ground else ''
    inquiry = quote(f"I'm interested in the Sky Hills {floor_name} {plan['area']} m² unit" + (f" (Layout {plan['variant']})" if ground else ''))
    beds, baths = plan['beds'], plan['baths']
    return f'''      <div class="fp-card" data-category="{plan['floor']}" data-plan="{plan['id']}">
        <div class="fp-card-img" onclick="openFPLightbox(this)" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){{event.preventDefault();openFPLightbox(this);}}" aria-label="View {floor_name} {plan['area']} square metres{(' layout ' + plan['variant']) if ground else ''}">
          <img src="{plan['image']}" alt="Sky Hills {floor_name} {plan['area']} m²{(' — Layout ' + plan['variant']) if ground else ''}" loading="lazy">
          <div class="fp-card-img-overlay"><div class="fp-card-zoom"><i class="fas fa-search-plus"></i></div></div>
        </div>
        <div class="fp-card-body">
          <div class="fp-card-floor" data-t="{floor_key}">{floor_name}</div>
          <div class="fp-card-area" data-t="fpArea{plan['area']}">{plan['area']} m²</div>
          <div class="fp-card-type"><span data-t="{type_key}">{type_text}</span>{variant}</div>
          <div class="fp-card-specs">
            <div class="fp-card-spec"><i class="fas fa-bed"></i> <span data-t="fpBeds{beds}">{beds} Bedrooms</span></div>
            <div class="fp-card-spec"><i class="fas fa-bath"></i> <span data-t="fpBaths{baths}">{baths} {'Bathroom' if baths == 1 else 'Bathrooms'}</span></div>
            <div class="fp-card-spec"><i class="fas fa-{'leaf' if ground else 'door-open'}"></i> <span data-t="{outdoor_key}">{outdoor}</span></div>
          </div>
          <div class="fp-card-actions">
            <a href="{plan['pdf']}" target="_blank" class="fp-btn-pdf"><i class="fas fa-file-pdf"></i> <span data-t="fpViewPdf">View PDF</span></a>
            <a href="https://wa.me/201112221121?text={inquiry}" target="_blank" class="fp-btn-wa" aria-label="Inquire about {plan['area']} square metres on WhatsApp"><i class="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>'''


def refresh(source):
    slides = []
    for n, (filename, title, _) in enumerate(RENDERS):
        slides.append(f'''      <div{(' class="active"' if n == 0 else '')}>
        <picture style="display:block;width:100%;height:100%;">
          <img src="images/sky-hills/{filename}" alt="Sky Hills {title}" style="width:100%;height:100%;object-fit:cover;" {('fetchpriority="high" loading="eager"' if n == 0 else 'loading="lazy"')} decoding="async">
        </picture>
      </div>''')
    source = re.sub(r'    <div class="hs" id="hs">.*?(?=    <div class="hc">)',
                    '    <div class="hs" id="hs">\n' + '\n'.join(slides) + '\n    </div>\n', source, count=1, flags=re.S)
    source = re.sub(r'^  <link rel="preload" as="image" href="images/ski-hills[^\n]+\n', '', source, flags=re.M)
    source = source.replace('<head>\n', '<head>\n  <link rel="preload" as="image" href="images/sky-hills/courtyard-gardens.jpg" fetchpriority="high">\n', 1)
    for old, new in [('ski-hills-44.jpg', 'facade.jpg'), ('ski-hills.jpg', 'courtyard-gardens.jpg')]:
        source = source.replace('images/' + old, 'images/sky-hills/' + new)
    source = re.sub(r'    <div class="fp-grid reveal">.*?\n    </div>\n  </section>',
                    '    <div class="fp-grid reveal">\n' + '\n\n'.join(map(card, PLANS)) + '\n    </div>\n  </section>', source, count=1, flags=re.S)
    source = re.sub(r'^.*<button class="fp-filter-btn" data-filter="(?:first|penthouse)".*\n', '', source, flags=re.M)
    source = source.replace('85 m² to 185 m²', '90, 120 &amp; 145 m²')
    source = source.replace('من 85 م² إلى 185 م²', '90 و120 و145 م²')
    old_en = 'Explore our diverse range of thoughtfully designed floor plans — from cozy apartments to luxurious penthouses. Select the perfect layout for your lifestyle.'
    new_en = 'Choose from 90 m² ground-floor apartments with a private garden in two layouts, or 120 m² and 145 m² apartments on typical floors.'
    source = source.replace(old_en, new_en)
    source = source.replace('استكشف مجموعتنا المتنوعة من المخططات المصممة بعناية — من الشقق المريحة إلى البنتهاوس الفاخر. اختر التصميم المناسب لأسلوب حياتك.',
                            'اختر شقة 90 م² بالدور الأرضي بحديقة خاصة ونموذجين مختلفين، أو شقة 120 م² أو 145 م² بالدور المتكرر.')
    source = source.replace('images/payment_plan/page_3_0.jpg', 'images/payment_plan/sky-hills-payment-current.png')
    source = re.sub(r'(\.fp-card-img img \{[^}]*?)object-fit: cover;', r'\1object-fit: contain;', source, count=1, flags=re.S)
    source = source.replace('.fp-card:hover .fp-card-img img {\n      transform: scale(1.05);', '.fp-card:hover .fp-card-img img {\n      transform: none;')
    # Keep an entire plan visible, including the dimensions and area heading.
    source = source.replace('      aspect-ratio: 1;\n', '      aspect-ratio: 1.414;\n      background: #ebe6e2;\n')
    for key in ('fpFirst', 'fpPenthouse', 'fpFirstLabel', 'fpPenthouseLabel', 'fpLuxury', 'fpRooftop'):
        source = re.sub(r'^    ' + key + r": '[^']*',\n", '', source, flags=re.M)
    source = source.replace("    fpWithGarden: 'With Private Garden',", "    fpWithGarden: 'With Private Garden',\n    fpArea90: '90 m²', fpArea120: '120 m²', fpArea145: '145 m²',\n    fpLayoutA: 'Layout A', fpLayoutB: 'Layout B',\n    fpBeds2: '2 Bedrooms', fpBeds3: '3 Bedrooms',\n    fpBaths1: '1 Bathroom', fpBaths2: '2 Bathrooms', fpBaths3: '3 Bathrooms',")
    source = source.replace("    fpWithGarden: 'بحديقة خاصة',", "    fpWithGarden: 'بحديقة خاصة',\n    fpArea90: '90 م²', fpArea120: '120 م²', fpArea145: '145 م²',\n    fpLayoutA: 'نموذج أ', fpLayoutB: 'نموذج ب',\n    fpBeds2: 'غرفتا نوم', fpBeds3: '3 غرف نوم',\n    fpBaths1: 'حمام واحد', fpBaths2: 'حمامان', fpBaths3: '3 حمامات',")
    # Avoid the missing mobile hero asset already present in the main page.
    source = source.replace('images/ski-hills-44-mobile.webp', 'images/ski-hills-44.webp')
    source = source.replace('src="images/cmc-pdf-thumbnail.jpg" alt="Sky Hills Brochure"', 'src="images/sky-hills-pdf-thumbnail.jpg" alt="Sky Hills Brochure"')
    # Cache-bust changed brochure and payment documents.
    for path in ('pdf/Sky-Hills-Profile.pdf', 'pdf/payment plan -sky hills ..pdf'):
        source = source.replace(f'href="{path}"', f'href="{path}?v=units-90-120-145"')
    return normalize_sky_hills_handover(normalize_sky_hills_stat_cleanup(normalize_sky_hills_iliving(normalize_sky_hills_overview(source))))


def save_backup(path, kind):
    target = BACKUP / kind / path.name
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists():
        shutil.copy2(path, target)


if __name__ == '__main__':
    main = ROOT / 'sky-hills.html'
    save_backup(main, 'main')
    save_backup(LANDING / 'index.html', 'landing')
    main.write_text(refresh((BACKUP / 'main/sky-hills.html').read_text()))
    STAGE.mkdir(parents=True, exist_ok=True)
    (STAGE / 'index.html').write_text(refresh((BACKUP / 'landing/index.html').read_text()))
    (ROOT / 'data').mkdir(exist_ok=True)
    (ROOT / 'data/sky-hills-units.json').write_text(json.dumps({'project': 'sky-hills', 'plans': PLANS}, ensure_ascii=False, indent=2) + '\n')
    render_inputs = [
        'WhatsApp Image 2026-11-05 at 11.34.43 (1).jpeg',
        'WhatsApp Image 2026-11-05 at 11.34.43.jpeg',
        'WhatsApp Image 2026-11-05 at 11.34.42 (3).jpeg',
    ]
    (ROOT / 'images/sky-hills').mkdir(exist_ok=True)
    for (filename, _, _), original in zip(RENDERS, render_inputs):
        target = ROOT / 'images/sky-hills' / filename
        if not target.exists():
            shutil.copy2(Path('/Users/hazemhany/Downloads') / original, target)
    # Refresh each gallery independently so other projects retain their own media.
    media = ''.join('  ' + json.dumps(dict(project='sky-hills', type='image', title=title, description=description, file='sky-hills/' + filename), ensure_ascii=False, indent=2).replace('\n', '\n  ') + ',\n' for filename, title, description in RENDERS)
    for path, kind, destination in [
        (ROOT / 'js/media-config.js', 'main-js', ROOT / 'js/media-config.js'),
        (LANDING / 'js/media-config.js', 'landing-js', STAGE / 'js/media-config.js'),
    ]:
        save_backup(path, kind)
        original = (BACKUP / kind / path.name).read_text()
        updated, count = re.subn(r'  // Sky Hills Media.*?(?=  // CMC 2 Media)', '  // Sky Hills Media (3 approved renders)\n' + media + '\n', original, count=1, flags=re.S)
        assert count == 1, f'Missing Sky Hills gallery section in {path}'
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(updated)
    home = ROOT / 'index.html'
    save_backup(home, 'main')
    home.write_text((BACKUP / 'main/index.html').read_text().replace('src="images/ski-hills.jpg" alt="Sky Hills"', 'src="images/sky-hills/facade.jpg" alt="Sky Hills"'))
    print('Updated main page; staged sibling landing; wrote shared unit catalogue.')
