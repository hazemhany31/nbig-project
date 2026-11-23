"""Preserve the approved Sky Hills initial handover when refreshing old HTML."""
import re


def normalize_sky_hills_handover(source):
    source = source.replace('June 2028 (Initial) / Dec 2028 (Final)',
                            'Dec 2027 (Initial) / Dec 2028 (Final)')
    source = source.replace('يونيو 2028 (مبدئي) / ديسمبر 2028 (نهائي)',
                            'ديسمبر 2027 (مبدئي) / ديسمبر 2028 (نهائي)')
    source = re.sub(
        r'(?P<path>images/payment_plan/sky-hills-payment-current\.png)(?:\?[^"\s]*)?(?=")',
        r'\g<path>?v=handover-dec-2027', source)
    return re.sub(
        r'(?P<path>pdf/payment plan -sky hills \.\.pdf)(?:\?[^"\s]*)?(?=")',
        r'\g<path>?v=units-90-120-145-handover-dec-2027', source)
