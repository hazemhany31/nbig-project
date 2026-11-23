"""Keep the two approved Sky Hills copy removals when regenerating HTML."""
import re


def normalize_sky_hills_stat_cleanup(source):
    source = re.sub(
        r'    <div class="stat">\s*<div class="sn">100%</div>\s*'
        r'<div class="sl" data-t="sd">Fully Finished</div>\s*</div>\n',
        '', source)
    source = re.sub(r" sd: '(?:Fully Finished|تشطيب كامل)',", '', source)

    def remove_range(match):
        return match[0].replace(' (ranging from 201 to 409)', '').replace(' (من 201 إلى 409)', '')

    source = re.sub(r'<p\b[^>]*data-t="mpf3d"[^>]*>.*?</p>', remove_range, source, flags=re.S)
    return re.sub(r"(?<!\w)mpf3d:\s*'[^'\n]*'", remove_range, source)
