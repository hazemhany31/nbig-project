"""Preserve the approved Sky Hills poster placement and location additions."""
import re


POSTER_PATH = 'images/sky-hills/i-living-smart-home.jpg'
POSTER = '''    <figure class="sky-iliving-poster">
      <img src="images/sky-hills/i-living-smart-home.jpg" alt="i Living smart home controls for lighting, air conditioning, security and unit monitoring" width="1024" height="1280" loading="lazy" decoding="async">
    </figure>
'''
POSTER_CSS = '''.sky-iliving-poster { width: 100%; max-width: 560px; margin: 48px auto 0; }
.sky-iliving-poster img { display: block; width: 100%; height: auto; border-radius: 16px; }'''
EN_PREFIX = 'Sky Hills is located in Hadayek October (October Gardens), '
EN_ADDITION = 'with direct views of O West Compound, on the second plot from Al Wahat Road near Mall of Egypt, '
AR_PREFIX = 'يقع سكاي هيلز في حدائق أكتوبر، '
AR_ADDITION = 'بإطلالة مباشرة على كمبوند أو ويست، وثاني نمرة من طريق الواحات بالقرب من مول مصر، '


def normalize_sky_hills_iliving(source):
    def location(value):
        if EN_PREFIX in value and EN_ADDITION not in value:
            value = value.replace(EN_PREFIX, EN_PREFIX + EN_ADDITION)
        if AR_PREFIX in value and AR_ADDITION not in value:
            value = value.replace(AR_PREFIX, AR_PREFIX + AR_ADDITION)
        return value

    source, count = re.subn(
        r'(<p\b[^>]*data-t="ld"[^>]*>)([\s\S]*?)(</p>)',
        lambda m: m[1] + location(m[2]) + m[3], source)
    if count != 1:
        raise ValueError('Expected one Sky Hills location paragraph')
    source, count = re.subn(
        r"(?<!\w)ld:\s*'[^'\n]*'", lambda m: location(m[0]), source)
    if count != 2:
        raise ValueError('Expected two Sky Hills location translations')
    if '<figure class="sky-iliving-poster">' not in source:
        match = re.search(r'<section class="fsec">(?:(?!</section>)[\s\S])*data-t="fti"(?:(?!</section>)[\s\S])*</section>', source)
        if not match:
            raise ValueError('Sky Hills amenities section not found')
        section = match[0].replace('  </section>', POSTER + '  </section>')
        source = source[:match.start()] + section + source[match.end():]
    if POSTER_CSS not in source:
        source = source.replace('  </style>', '  \n' + POSTER_CSS + '\n</style>', 1)
    return source
