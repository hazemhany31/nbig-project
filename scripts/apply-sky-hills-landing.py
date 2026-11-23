"""Apply the reviewed Sky Hills landing copy and retire old unit assets.

Originals are archived outside both website roots before any replacement.
Run refresh-sky-hills.py and update-sky-hills-pdfs.py first.
"""
from pathlib import Path
import hashlib
import json
import shutil
from sky_hills_overview import normalize_sky_hills_overview
from sky_hills_iliving import normalize_sky_hills_iliving, POSTER_PATH
from sky_hills_stat_cleanup import normalize_sky_hills_stat_cleanup
from sky_hills_handover import normalize_sky_hills_handover

ROOT = Path(__file__).resolve().parents[1]
LANDING = ROOT.parent / 'sky-hills'
ARCHIVE = ROOT.parent / '.sky-hills-backups/2026-11-07'
STAGED = ROOT / 'output/sky-hills-update/landing/index.html'
catalogue = json.loads((ROOT / 'data/sky-hills-units.json').read_text())
plans = catalogue['plans']
assets = [plan[key] for plan in plans for key in ('image', 'pdf')]
assets += ['pdf/Sky-Hills-Profile.pdf', 'pdf/payment plan -sky hills ..pdf',
           'images/payment_plan/sky-hills-payment-current.png', 'data/sky-hills-units.json']
assets += ['images/sky-hills/courtyard-gardens.jpg', 'images/sky-hills/courtyard-view.jpg', 'images/sky-hills/facade.jpg']
assets.append(POSTER_PATH)


def archive(source, site, relative):
    destination = ARCHIVE / site / relative
    if source.exists() and not destination.exists():
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)


for relative in assets:
    assert (ROOT / relative).is_file(), f'Missing final asset: {relative}'
assert STAGED.is_file()
# Keep all originals, including the main files backed up before PDF authoring.
previous = Path('/private/tmp/nbig-sky-hills-backup')
if previous.exists():
    shutil.copytree(previous, ARCHIVE / 'initial', dirs_exist_ok=True)
archive(LANDING / 'index.html', 'landing', 'index.html')
for relative in assets:
    archive(LANDING / relative, 'landing', relative)
    destination = LANDING / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / relative, destination)
(LANDING / 'index.html').write_text(normalize_sky_hills_handover(normalize_sky_hills_stat_cleanup(normalize_sky_hills_iliving(normalize_sky_hills_overview(STAGED.read_text())))))
archive(LANDING / 'js/media-config.js', 'landing', 'js/media-config.js')
shutil.copy2(STAGED.parent / 'js/media-config.js', LANDING / 'js/media-config.js')

retired = []
for site, checkout in [('main', ROOT), ('landing', LANDING)]:
    current_images = {Path(p['image']).name for p in plans}
    current_pdfs = {Path(p['pdf']).name for p in plans}
    candidates = [p for p in (checkout / 'images/floor-plans').glob('*.png') if p.name not in current_images]
    candidates += [p for p in (checkout / 'pdfs').glob('Type 2*.pdf') if p.name not in current_pdfs]
    # Old payment-preview extracts can still advertise obsolete unit sizes.
    candidates += list((checkout / 'images/payment_plan').glob('page_*'))
    for path in candidates:
        relative = str(path.relative_to(checkout))
        archive(path, site, relative)
        path.unlink()
        retired.append(f'{site}/{relative}')

for relative in assets:
    assert hashlib.sha256((ROOT / relative).read_bytes()).digest() == hashlib.sha256((LANDING / relative).read_bytes()).digest()
report_path = ROOT / 'output/sky-hills-update/applied.json'
# Include prior archived assets when this idempotent sync is run again.
all_retired = sorted(set(retired) | {
    str(p.relative_to(ARCHIVE)) for site in ('main', 'landing')
    for directory in ('images/floor-plans', 'images/payment_plan', 'pdfs')
    for p in (ARCHIVE / site / directory).glob('*')
    if p.is_file() and str(p.relative_to(ARCHIVE / site)) not in assets
})
report = {'backup_directory': str(ARCHIVE), 'synchronized_assets': assets, 'retired_files': all_retired}
report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(f'Applied landing update. Synchronized {len(assets)} assets; archived and retired {len(retired)} old files.')
print(f'Originals: {ARCHIVE}')
