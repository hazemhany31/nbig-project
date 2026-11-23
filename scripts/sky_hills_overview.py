"""Keep Sky Hills' approved company name in its three overview values only."""
import re


COMPANY_MARKUP = '<bdi dir="ltr">New Build International Group (NBIG)</bdi>'


def normalize_sky_hills_overview(source):
    source, static_count = re.subn(
        r'(<p\b[^>]*\bdata-t="ox"[^>]*>)([\s\S]*?)(</p>)',
        lambda match: match[1] + match[2].replace('NBIG Developments', COMPANY_MARKUP) + match[3],
        source,
    )

    def normalize_translation(match):
        quote = match['quote']
        markup = COMPANY_MARKUP.replace('"', '\\"') if quote == '"' else COMPANY_MARKUP
        value = match['value'].replace('NBIG Developments', markup)
        return match['prefix'] + quote + value + quote

    source, translation_count = re.subn(
        r'''(?<!\w)(?P<prefix>ox:\s*)(?P<quote>['"])(?P<value>(?:\\.|(?!(?P=quote))[^\\])*)(?P=quote)''',
        normalize_translation,
        source,
    )
    if (static_count, translation_count) != (1, 2):
        raise ValueError('Expected one Sky Hills overview paragraph and two translations')
    return source
