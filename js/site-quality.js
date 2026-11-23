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
/* Lightweight dimensional scene, no external engine or downloaded model. */
(() => {
  'use strict';
  if (!document.body.classList.contains('homepage')) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scene = document.createElement('div');
  scene.className = 'nbig-scene';
  scene.setAttribute('aria-label', 'Interactive abstract 3D architecture');
  const buildings = [
    { x: '-105px', y: '48px', z: '-25px', scale: '.72' },
    { x: '0px', y: '0px', z: '30px', scale: '1' },
    { x: '80px', y: '64px', z: '-45px', scale: '.64' }
  ];
  scene.innerHTML = '<div class="nbig-scene-title"><strong>Build beyond the ordinary.</strong><span>NBIG / Architecture in motion</span></div><div class="nbig-city"><div class="nbig-ground"></div>' + buildings.map(b => '<div class="nbig-building" style="--x:'+b.x+';--y:'+b.y+';--z:'+b.z+';scale:'+b.scale+'">'+['front','back','right','left','roof'].map(f=>'<div class="nbig-face nbig-'+f+'"></div>').join('')+'</div>').join('') + '</div><img class="nbig-photo-card" src="images/sky-hills/facade.jpg" alt="Sky Hills facade"><p class="nbig-scene-note">Abstract 3D study, not a project model. Drag to rotate.</p><div class="nbig-scene-controls"><button type="button" data-scene="left" aria-label="Rotate architecture left">↶ Rotate</button><button type="button" data-scene="pause">Pause motion</button><button type="button" data-scene="right" aria-label="Rotate architecture right">Rotate ↷</button></div><div class="nbig-motion-line"></div>';
  const property = document.createElement('a');property.className='nbig-property-label';property.href='sky-hills.html';property.innerHTML='<span>Featured project</span><strong>Sky Hills ↗</strong>';scene.appendChild(property);
  hero.insertBefore(scene, hero.querySelector('.hbg'));
  const city=scene.querySelector('.nbig-city');
  let angle=-48, paused=false, start=null, moved=false;
  function rotate(delta){ angle=Math.max(-150,Math.min(60,angle+delta)); paused=true; scene.dataset.paused='true'; city.style.animation='none'; city.style.transform='rotateX(-15deg) rotateY('+angle+'deg)'; update(); }
  function update(){ const ar=document.documentElement.lang==='ar'; scene.querySelector('.nbig-property-label span').textContent=ar?'مشروع مميز':'Featured project';scene.querySelector('[data-scene=left]').textContent=ar?'↶ تدوير':'↶ Rotate';scene.querySelector('[data-scene=right]').textContent=ar?'تدوير ↷':'Rotate ↷'; scene.querySelector('[data-scene="pause"]').textContent=paused?(ar?'تشغيل الحركة':'Play motion'):(ar?'إيقاف الحركة':'Pause motion');scene.querySelector('[data-scene="pause"]').setAttribute('aria-pressed',String(paused));scene.querySelector('.nbig-scene-title strong').textContent=ar?'ابنِ خارج المألوف.':'Build beyond the ordinary.';scene.querySelector('.nbig-scene-title span').textContent=ar?'NBIG / عمارة تتحرك':'NBIG / Architecture in motion';scene.querySelector('.nbig-scene-note').textContent=ar?'تكوين ثلاثي الأبعاد للتوضيح، وليس نموذجًا لمشروع. اسحب للتدوير.':'Abstract 3D study, not a project model. Drag to rotate.'; }
  scene.querySelector('[data-scene="left"]').onclick=()=>rotate(-25);
  scene.querySelector('[data-scene="right"]').onclick=()=>rotate(25);
  scene.querySelector('[data-scene="pause"]').onclick=()=>{paused=!paused;scene.dataset.paused=String(paused);city.style.animation=paused?'none':'';if(!paused)city.style.transform='';update();};
  scene.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;start=e.clientX;moved=false;});
  scene.addEventListener('pointermove',e=>{if(start===null||e.buttons===0)return;const delta=e.clientX-start;if(Math.abs(delta)>4)moved=true;if(moved){rotate(delta*.5);start=e.clientX;}});
  scene.addEventListener('pointerup',()=>{start=null;});scene.addEventListener('pointerleave',()=>{start=null;});
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){paused=true;scene.dataset.paused='true';}
  update();
})();
