/* Procedural architectural study. Real 3D geometry, perspective projection and depth sorting. No project model is implied. */
export function mountStudy(root){
 if(!root||root.dataset.mounted)return ()=>{};root.dataset.mounted='true';
 const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx){root.dataset.fallback='true';return ()=>{}}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),state={yaw:-.65,pitch:.42,zoom:1,split:0,target:0,auto:!reduced.matches,visible:true,drag:false};let last=0,frame=0,dead=false,w=1,h=1,dpr=1,oldX=0,oldY=0;
 const faces=[];const colors={stone:[221,224,209],white:[242,241,224],glass:[47,116,125],dark:[19,60,70],copper:[157,130,92],leaf:[45,105,93]};
 function box(x,y,z,dx,dy,dz,color,layer=0){const v=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(a=>[x+a[0]*dx/2,y+a[1]*dy/2,z+a[2]*dz/2]);[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]].forEach((ids,i)=>faces.push({v:ids.map(j=>v[j]),c:colors[color],shade:[.65,.9,.74,1,.96,.58][i],layer}));}
 box(0,-2.6,0,8.8,.18,6.4,'stone');box(0,-2.48,0,7.2,.08,4.7,'white');
 for(let floor=0;floor<5;floor++){
  const y=-2.2+floor*.92,offset=floor===4?-.55:0,width=floor===4?4.9:6.6;
  box(offset,y,0,width,.16,3.8,'white',floor);box(offset,y+.43,0,width-.42,.72,3.35,'glass',floor);
  // Deep projecting facade fins and terraces model actual volume rather than flat textures.
  for(let j=0;j<9;j++){const x=offset-width/2+.3+j*(width-.6)/8;box(x,y+.45,1.77,.09,.84,.24,'stone',floor);box(x,y+.45,-1.77,.09,.84,.24,'stone',floor)}
  for(const x of [offset-width/2+.1,offset+width/2-.1])box(x,y+.45,0,.16,.84,3.7,'stone',floor);
  box(offset,y+.87,0,width+.25,.1,4.05,'white',floor);
 }
 box(-.55,2.51,0,5.2,.1,4.05,'white',4);box(-2.2,2.67,-.5,1.2,.28,1.8,'leaf',4);
 for(let i=0;i<8;i++){box(-2.4+i*.68,2.8,.75,.06,.4,1.5,'copper',4)}
 for(const x of [-3.7,3.7])for(const z of [-2.5,2.5]){box(x,-1.97,z,.12,1,.12,'copper');box(x,-1.36,z,.6,.78,.6,'leaf')}
 function rotate(v,layer){let [x,y,z]=v;y+=layer*state.split*.62;const cy=Math.cos(state.yaw),sy=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);const a=x*cy+z*sy,b=-x*sy+z*cy;return [a,y*cp+b*sp,-y*sp+b*cp]}
 function draw(t){if(dead)return;frame=requestAnimationFrame(draw);if(t-last<40||!state.visible||document.hidden)return;const dt=Math.min(80,t-last||40);last=t;if(state.auto&&!state.drag)state.yaw+=dt*.000085;state.split+=(state.target-state.split)*.1;
  const ar=document.documentElement.lang==='ar'||root.closest('[lang=ar]');root.querySelectorAll('[data-study-en]').forEach(e=>{const txt=e.dataset[ar?'studyAr':'studyEn'];if(txt&&e.textContent!==txt)e.textContent=txt});
  ctx.fillStyle='#dce6e2';ctx.fillRect(0,0,w,h);const scale=Math.min(w/14,h/(12.8+state.split*3))*state.zoom;const proj=v=>{const p=15/(15+v[2]);return [w*.5+v[0]*scale*p,h*(.50+state.split*.06)-v[1]*scale*p]};
  // Perspective ground grid.
  ctx.strokeStyle='rgba(26,78,82,.12)';ctx.lineWidth=1;for(let i=-8;i<=8;i++){for(const ab of [[[-8,-2.75,i],[8,-2.75,i]],[[i,-2.75,-8],[i,-2.75,8]]]){const a=proj(rotate(ab[0],0)),b=proj(rotate(ab[1],0));ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()}}
  // Soft ground shadow, followed by painter-sorted solid faces.
  ctx.save();ctx.translate(w/2,h*.77);ctx.scale(1,.24);const gr=ctx.createRadialGradient(0,0,8,0,0,w*.32);gr.addColorStop(0,'rgba(15,55,60,.24)');gr.addColorStop(1,'rgba(15,55,60,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,w*.32,0,Math.PI*2);ctx.fill();ctx.restore();
  faces.map(f=>{const v=f.v.map(x=>rotate(x,f.layer));return {...f,v,z:v.reduce((s,x)=>s+x[2],0)/4}}).sort((a,b)=>b.z-a.z).forEach(f=>{const p=f.v.map(proj);ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(a=>ctx.lineTo(...a));ctx.closePath();ctx.fillStyle=`rgb(${f.c.map(c=>Math.round(c*f.shade)).join(',')})`;ctx.fill();ctx.strokeStyle='rgba(31,75,78,.13)';ctx.lineWidth=.55;ctx.stroke()});
  root.dataset.rendered='true';const poster=root.querySelector('.nbig-study-poster');if(poster)poster.style.display='none';root.dataset.angle=state.yaw.toFixed(2);root.dataset.layers=state.split.toFixed(2);
 }
 function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
 const ro=new ResizeObserver(resize);ro.observe(canvas);resize();const io=new IntersectionObserver(es=>state.visible=es[0].isIntersecting,{rootMargin:'100px'});io.observe(root);
 const onDown=e=>{state.drag=true;state.auto=false;oldX=e.clientX;oldY=e.clientY;canvas.setPointerCapture(e.pointerId);sync()};const onMove=e=>{if(!state.drag)return;state.yaw+=(e.clientX-oldX)*.009;state.pitch=Math.max(-.15,Math.min(.95,state.pitch+(e.clientY-oldY)*.006));oldX=e.clientX;oldY=e.clientY};const onUp=()=>state.drag=false;
 canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onUp);
 function sync(){root.querySelector('[data-study-spin]').setAttribute('aria-pressed',String(state.auto));root.querySelector('[data-study-split]').setAttribute('aria-pressed',String(!!state.target))}
 const handlers=[];function bind(selector,fn){const el=root.querySelector(selector);el.addEventListener('click',fn);handlers.push([el,fn])}
 bind('[data-study-spin]',()=>{state.auto=!state.auto;sync()});bind('[data-study-split]',()=>{state.target=state.target?0:1;sync()});bind('[data-study-reset]',()=>{Object.assign(state,{yaw:-.65,pitch:.42,zoom:1,target:0,auto:!reduced.matches});sync()});
 const key=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){e.preventDefault();state.auto=false;if(e.key==='ArrowLeft')state.yaw-=.15;if(e.key==='ArrowRight')state.yaw+=.15;if(e.key==='ArrowUp')state.pitch=Math.min(.95,state.pitch+.1);if(e.key==='ArrowDown')state.pitch=Math.max(-.15,state.pitch-.1);if(e.key==='+')state.zoom=Math.min(1.3,state.zoom+.1);if(e.key==='-')state.zoom=Math.max(.7,state.zoom-.1);sync()}};canvas.addEventListener('keydown',key);sync();frame=requestAnimationFrame(draw);
 return ()=>{dead=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointercancel',onUp);canvas.removeEventListener('keydown',key);handlers.forEach(([e,f])=>e.removeEventListener('click',f));delete root.dataset.mounted};
}
if(typeof document!=='undefined')document.querySelectorAll('[data-study]').forEach(mountStudy);
