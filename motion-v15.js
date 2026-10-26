(()=>{
  'use strict';
  const $=(q,base=document)=>base.querySelector(q), $$=(q,base=document)=>[...base.querySelectorAll(q)];
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(hover:hover) and (pointer:fine)');
  const root=document.documentElement;
  const isReduced=()=>mq.matches;
  const safelyAnimate=(el,frames,options)=>{try{if(!isReduced() && el?.animate)return el.animate(frames,options)}catch(e){} return null};

  /* 1. Reveal & scroll motion */
  const reveal=$$('.section-topline,.expertise-grid article,.education-row,.gallery-note,.site-footer,.contact-direct a');
  const observers=[];
  if(!isReduced() && 'IntersectionObserver' in window){
    root.classList.add('motion-ready');
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');io.unobserve(entry.target);
    }),{threshold:.12,rootMargin:'0px 0px -20px 0px'});
    observers.push(io);
    reveal.forEach((el,i)=>{el.classList.add('motion-reveal');el.style.setProperty('--reveal-delay',`${(i%4)*85}ms`);io.observe(el)});
  }

  /* 2. Magnetic/spring microinteractions */
  const controls=$$('.contact-button,.header-contact,.round-arrow,.filter-chip,.modal-open-file');
  controls.forEach(el=>{
    el.addEventListener('pointerdown',()=>safelyAnimate(el,[{scale:'1'},{scale:'.94',offset:.22},{scale:'1.035',offset:.7},{scale:'1'}],{duration:490,easing:'cubic-bezier(.24,.74,.24,1)'}));
    if(!fine.matches || isReduced())return;
    el.classList.add('motion-magnetic');
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)/r.width, y=(e.clientY-r.top-r.height/2)/r.height;
      el.style.setProperty('--magnetic-x',`${Math.max(-9,Math.min(9,x*16)).toFixed(1)}px`);
      el.style.setProperty('--magnetic-y',`${Math.max(-9,Math.min(9,y*16)).toFixed(1)}px`);
    },{passive:true});
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--magnetic-x','0px');el.style.setProperty('--magnetic-y','0px')});
  });

  /* 3. CSS perspective 3D interactive cards, not resource-heavy WebGL */
  function bindTilt(el,xVar,yVar,maxAngle=5){
    if(!el||!fine.matches||isReduced())return;
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      el.style.setProperty(xVar,`${(-y*2*maxAngle).toFixed(2)}deg`);
      el.style.setProperty(yVar,`${(x*2*maxAngle).toFixed(2)}deg`);
    },{passive:true});
    el.addEventListener('pointerleave',()=>{el.style.setProperty(xVar,'0deg');el.style.setProperty(yVar,'0deg')});
  }
  bindTilt($('#certOpen'),'--cert-rx','--cert-ry',3.2);
  const galleryGrid=$('#activityGrid');
  if(galleryGrid){const attached=new WeakSet();
    const watch=new MutationObserver(()=>$$('.gallery-card',galleryGrid).forEach(card=>{if(attached.has(card))return;attached.add(card);bindTilt(card,'--card-rx','--card-ry',4.2)}));
    watch.observe(galleryGrid,{childList:true});
    $$('.gallery-card',galleryGrid).forEach(card=>{attached.add(card);bindTilt(card,'--card-rx','--card-ry',4.2)});
  }

  /* 4. Gallery frame zoom/reveal after image loads */
  const modalImage=$('#modalImage');
  if(modalImage){modalImage.addEventListener('load',()=>{
    if(isReduced())return;
    modalImage.classList.remove('frame-enter');void modalImage.offsetWidth;modalImage.classList.add('frame-enter');
  })}

  /* 5. Background parallax and subtle scroll zoom; respect device budget */
  const shapes=$$('[data-depth]');
  const headings=$$('.about .display-heading,.activities .display-heading');
  let raf=0;
  const update=()=>{
    raf=0;
    if(isReduced()||!fine.matches)return;
    const vh=window.innerHeight;
    shapes.forEach(el=>{const container=el.parentElement; if(!container)return;const r=container.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const depth=Number(el.dataset.depth)||0;const offset=(vh/2-r.top-r.height/2)*depth;el.style.translate=`0 ${Math.max(-110,Math.min(110,offset))}px`});
    headings.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const p=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));el.style.scale=String(.975+.025*p)});
  };
  window.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});
  window.addEventListener('resize',()=>{if(!raf)raf=requestAnimationFrame(update)},{passive:true});
  update();

  /* 6. Internal chapter transitions (this is a single-page site) */
  const wipe=$('#chapterWipe');let busy=false;
  $$('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const href=link.getAttribute('href'),target=href&&$(href);
      if(!target||isReduced())return;
      // Open mobile menu handles closing separately in main.js.
      e.preventDefault();
      if(busy)return;busy=true;
      wipe.classList.remove('is-playing');void wipe.offsetWidth;wipe.classList.add('is-playing');
      window.setTimeout(()=>{
        const rect=target.getBoundingClientRect();window.scrollTo({top:window.scrollY+rect.top,behavior:'instant'});
        if(window.location.hash!==href)history.pushState(null,'',href);
      },320);
      window.setTimeout(()=>{wipe.classList.remove('is-playing');busy=false},720);
    });
  });

  // Disable continuous effects whenever user changes motion preference.
  mq.addEventListener?.('change',()=>{if(isReduced()){root.classList.remove('motion-ready');reveal.forEach(el=>{el.classList.add('is-visible');el.style.removeProperty('--reveal-delay')});shapes.forEach(el=>el.style.removeProperty('translate'));headings.forEach(el=>el.style.removeProperty('scale'));}});
})();
