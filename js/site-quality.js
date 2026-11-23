/* Shared contact and navigation behavior. No submission is successful until the server says so. */
(() => {
  'use strict';
  const menu = document.getElementById('nm');
  const toggle = document.getElementById('mt');
  if (menu && toggle) {
    toggle.setAttribute('aria-controls', 'nm');
    toggle.setAttribute('aria-expanded', 'false');
    const sync = () => {
      const open = menu.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(open));
      if (!open && menu.contains(document.activeElement)) toggle.focus();
    };
    new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) menu.classList.remove('open');
      if (e.key === 'Tab' && menu.classList.contains('open')) {
        const links = [...menu.querySelectorAll('a,button')].filter(el => el.getClientRects().length);
        const first = links[0], last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    toggle.addEventListener('click', () => {
      if (menu.classList.contains('open')) menu.querySelector('button,a')?.focus();
    });
  }
  const cards = [...document.querySelectorAll('.pg .pc')];
  cards.forEach(card => {
    card.dataset.projectCategory = ['cmc.html','cmc-2.html','new-cmc.html','prime.html'].includes(card.getAttribute('href')) ? 'medical' : 'residential';
  });
  document.querySelectorAll('[data-project-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-project-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      cards.forEach(card => { card.hidden = button.dataset.projectFilter !== 'all' && card.dataset.projectCategory !== button.dataset.projectFilter; });
    });
  });
  document.querySelectorAll('form[data-contact-form]').forEach(form => {
    const result = form.querySelector('[role="status"]');
    const submit = form.querySelector('[type="submit"]');
    let busy = false;
    form.querySelectorAll('input:not([type="hidden"]),textarea').forEach((input, i) => {
      if (!input.id) input.id = form.id + '-field-' + i;
      const label = input.previousElementSibling;
      if (label?.tagName === 'LABEL') label.htmlFor = input.id;
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || !result || !submit || !form.reportValidity()) return;
      const ar = document.documentElement.lang === 'ar';
      const show = (message, success = false) => {
        result.textContent = message;
        result.className = 'fmsg ' + (success ? 'success' : 'error');
        result.style.display = 'block';
        result.style.color = success ? '#1d6341' : '#a52929';
      };
      const token = form.querySelector('[name="g-recaptcha-response"]')?.value;
      if (!token) {
        show(ar ? 'يرجى إكمال التحقق أولاً. لو التحقق مش ظاهر، أعد تحميل الصفحة أو تواصل معنا بالتليفون.' : 'Please complete the verification first. If it has not loaded, reload the page or contact us by phone.');
        return;
      }
      const body = new FormData(form);
      busy = true; submit.disabled = true; form.setAttribute('aria-busy', 'true');
      result.style.display = 'block';result.style.color = 'var(--muted)';result.className = 'fmsg';
      result.textContent = ar ? 'جاري الإرسال...' : 'Sending...';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch(form.getAttribute('action') || 'send_email.php', {method:'POST',body,signal:controller.signal});
        const data = await response.json();
        if (!response.ok || data.success !== true) {
          show(typeof data.message === 'string' ? data.message : (ar ? 'تعذر الإرسال. حاول مرة أخرى.' : 'Unable to send. Please try again.'));
          return;
        }
        show(ar ? 'تم استلام رسالتك. سنتواصل معك قريباً.' : 'Your message has been received. Our team will be in touch.', true);
        form.reset();
      } catch {
        show(ar ? 'لم نتأكد من وصول الرسالة. يرجى التواصل معنا بالتليفون قبل إعادة الإرسال.' : 'We could not confirm delivery. Please contact us by phone before sending again.');
      } finally {
        clearTimeout(timer); busy = false; submit.disabled = false; form.removeAttribute('aria-busy');
        if (typeof grecaptcha !== 'undefined') {
          const widget = form.querySelector('.g-recaptcha iframe');
          // Each contact page currently has a single widget.
          if (widget) { try { grecaptcha.reset(); } catch {} }
        }
      }
    });
  });
})();
