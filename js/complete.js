/* Complete-site enhancements. No external engine, no fake lead confirmations. */
(() => {
 'use strict';
 const projects=[['sky-hills','Sky Hills','سكاي هيلز','Residential','images/sky-hills/facade.jpg','images/sky-hills/courtyard-gardens.jpg'],['zayed-hills','Zayed Hills','زايد هيلز','Residential','images/zayedd.jpg','images/zayed-2.webp'],['zayed-lagoons','Zayed Lagoons','زايد لاجونز','Residential','images/zx-07.webp','images/zx-02.webp'],['lamar-residence','Lamar Residence','لامار ريزيدنس','Residential','images/lamarrrr.webp','images/lamar-2.webp'],['cmc','CMC','سي إم سي','Medical','images/cmc-1-1.webp','images/cmc-1.webp'],['cmc-2','CMC 2','سي إم سي ٢','Medical','images/cmc-2.webp','images/cmc-2-1.webp'],['new-cmc','New CMC','نيو سي إم سي','Medical','images/cmc-3.webp','images/cmc-3-2.webp'],['prime','Prime Med','برايم ميد','Medical','images/OFFICE1.webp','images/cmcc.webp']];
 let active=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function localize(){const ar=document.documentElement.lang==='ar';document.querySelectorAll('[data-t=bh]').forEach(e=>e.textContent=ar?'العودة للرئيسية':'Back to Home');document.querySelectorAll('[data-t=cn2]').forEach(e=>e.textContent=(ar?'اتصل الآن: ':'Call Now: ')+'01112221121');const g=document.querySelector('.ngal-section');if(g){const h=g.querySelector('h2');const p=g.querySelector('p');if(h)h.textContent=ar?'صور المشروع':'Project visuals';if(p)p.textContent=ar?'استكشف صور المشروع والتصميمات المعمارية والمساحات.':'Explore project photos, architecture and spaces.';}}
 localize();new MutationObserver(localize).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 const stage=document.querySelector('.nbe-stage');
 const pause=document.querySelector('[data-stage-pause]');
 function sync(){
  const ar=document.documentElement.lang==='ar';
  document.body.dataset.motion=paused?'paused':'playing';
  if(!stage)return;
  const p=projects[active];
  stage.querySelector('[data-stage-number]').textContent=String(active+1).padStart(2,'0')+' / 08';
  stage.querySelector('[data-stage-type]').textContent=ar?(p[3]==='Medical'?'طبي':'سكني'):p[3];
  stage.querySelector('[data-stage-title]').textContent=p[1];
  stage.querySelectorAll('[data-stage-link]').forEach(a=>a.href=p[0]+'.html');
  pause.setAttribute('aria-label',ar?(paused?'تشغيل الحركة':'إيقاف الحركة'):(paused?'Play motion':'Pause motion'));
  pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'▷':'Ⅱ';
 }
 function select(i){active=(i+projects.length)%projects.length;const p=projects[active];
  const image=stage.querySelector('[data-stage-image]');image.src=p[4];image.alt=p[1];
  const alt=stage.querySelector('[data-stage-alternate]');alt.src=p[5];alt.alt=p[1]+' alternate view';
  stage.querySelectorAll('[data-stage-select]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.stageSelect)===active)));
  const holder=stage.querySelector('.nbe-stage-photo');holder.classList.remove('arrive');void holder.offsetWidth;holder.classList.add('arrive');sync();
 }
 if(stage){stage.querySelectorAll('[data-stage-select]').forEach(b=>b.onclick=()=>select(Number(b.dataset.stageSelect)));stage.querySelector('[data-stage-prev]').onclick=()=>select(active-1);stage.querySelector('[data-stage-next]').onclick=()=>select(active+1);pause.onclick=()=>{paused=!paused;sync()};sync()}
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 // Stop legacy image slideshows when motion is paused or OS reduced motion is enabled.
 if(!stage&&document.querySelector('.hs')){
  const b=document.createElement('button');b.type='button';b.className='nbig-motion-control';b.style.cssText='position:relative;display:block;margin:15px auto 0;padding:12px 20px;border:1px solid #8cabb4;background:transparent;color:#183d48;min-height:44px';
  const hero=document.querySelector('.hero');hero.appendChild(b);b.style.order='3';
  function label(){b.textContent=document.documentElement.lang==='ar'?(paused?'تشغيل الحركة':'إيقاف الحركة'):(paused?'Play motion':'Pause motion');b.setAttribute('aria-pressed',String(paused));document.body.dataset.motion=paused?'paused':'playing'}
  b.onclick=()=>{paused=!paused;label()};new MutationObserver(label).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});label();
 }
 const legacy=[...document.querySelectorAll('.gi')].filter(x=>x.querySelector('img'));
 if(legacy.length){
  const dialog=document.createElement('dialog');dialog.className='nbig-image-dialog';dialog.setAttribute('aria-label','Project photos');dialog.innerHTML='<button type="button" data-gallery-close aria-label="Close image">×</button><img alt=""><div><button type="button" data-gallery-prev aria-label="Previous image">←</button><span></span><button type="button" data-gallery-next aria-label="Next image">→</button></div>';document.body.appendChild(dialog);let current=0,launch=null;
  function show(i){current=(i+legacy.length)%legacy.length;const source=legacy[current].querySelector('img');dialog.querySelector('img').src=source.src;dialog.querySelector('img').alt=source.alt;dialog.querySelector('div>span').textContent=(current+1)+' / '+legacy.length}
  function close(){dialog.close();document.body.style.overflow='';launch?.focus()}
  legacy.forEach((el,i)=>{el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',el.querySelector('img').alt);el.onclick=()=>{launch=el;show(i);dialog.showModal();document.body.style.overflow='hidden'};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}}});
  dialog.querySelector('[data-gallery-close]').onclick=close;dialog.querySelector('[data-gallery-prev]').onclick=()=>show(current-1);dialog.querySelector('[data-gallery-next]').onclick=()=>show(current+1);dialog.oncancel=e=>{e.preventDefault();close()};dialog.onkeydown=e=>{if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1)};
 }
 // Make Escape close image overlays and restore the launching control.
 let launcher=null;
 document.addEventListener('click',e=>{if(e.target.closest('.ngal-item,.fp-card-img,.mp-img'))launcher=e.target.closest('.ngal-item,.fp-card-img,.mp-img')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&launcher){setTimeout(()=>launcher?.focus(),0)}});
})();
