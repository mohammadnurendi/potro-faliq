
(()=>{
  'use strict';
  const $=(s,ctx=document)=>ctx.querySelector(s), $$=(s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const CONFIG=window.FALIQ_SITE_CONFIG||{};

  const activityGroups=[
    {cat:'sosial',tag:'KEGIATAN SOSIAL',title:'Aksi Sosial & Kolaborasi Lapangan',description:'Dokumentasi kegiatan lapangan, pengabdian sosial, dan momen kebersamaan bersama masyarakat.',note:'Kumpulan foto ditampilkan satu per satu agar pengalaman visual terasa lebih rapi dan hidup.',images:['assets/gallery/activity-01.webp','assets/gallery/activity-03.webp','assets/gallery/activity-13.webp'],cover:'assets/gallery/activity-01.webp'},
    {cat:'organisasi',tag:'KEGIATAN ORGANISASI',title:'Kebersamaan dalam Organisasi',description:'Dokumentasi kebersamaan organisasi, forum, dan kegiatan kelompok yang membangun jejaring serta kolaborasi.',note:'Foto ditampilkan dalam viewer adaptif; ukuran popup menyesuaikan orientasi gambar.',images:['assets/gallery/activity-07-part1.webp','assets/gallery/activity-07-part2.webp','assets/gallery/activity-07-part3.webp','assets/gallery/activity-07-part4.webp','assets/gallery/activity-23.webp'],cover:'assets/gallery/activity-23.webp'},
    {cat:'pendidikan',tag:'PENDIDIKAN',title:'Ruang Belajar dan Diskusi',description:'Suasana belajar, diskusi, dan proses penyampaian materi dalam lingkungan pendidikan dan pembinaan.',note:'Empat frame dari satu dokumentasi kolase dipisah agar setiap momen bisa dilihat jelas.',images:['assets/gallery/activity-12-part1.webp','assets/gallery/activity-12-part2.webp','assets/gallery/activity-12-part3.webp','assets/gallery/activity-12-part4.webp','assets/gallery/activity-15.webp'],cover:'assets/gallery/activity-12-part2.webp'},
    {cat:'sosial',tag:'PENDAMPINGAN LAPANGAN',title:'Kegiatan Bersama Komunitas',description:'Kegiatan bersama komunitas dan keterlibatan langsung di berbagai ruang sosial serta lapangan.',note:'Tampilan popup dirancang lebih organik dengan rounded corners, motion, dan thumbnail navigator.',images:['assets/gallery/activity-02.webp','assets/gallery/activity-06.webp','assets/gallery/activity-10.webp'],cover:'assets/gallery/activity-02.webp'},
    {cat:'pendidikan',tag:'AKTIVITAS TERPILIH',title:'Pembinaan & Kunjungan',description:'Kumpulan dokumentasi pembinaan, kunjungan, dan interaksi yang memperkaya perjalanan profesional.',note:'Foto dipertahankan dalam rasio yang lebih natural, tanpa digabung paksa.',images:['assets/gallery/activity-05-part1.webp','assets/gallery/activity-05-part2.webp'],cover:'assets/gallery/activity-05-part1.webp'}
  ];

  const certificates=[
    {id:14,name:'Sertifikat Kompetensi Pekerja Sosial',description:'Dokumen kompetensi formal sebagai bagian dari pengembangan profesional.',image:'assets/certificates/certificate-14.webp',original:'assets/certificates/original/certificate-14.jpeg'},
    {id:16,name:'Sertifikat Penghargaan',description:'Penghargaan atas keterlibatan dan kontribusi dalam kegiatan terkait.',image:'assets/certificates/certificate-16.webp',original:'assets/certificates/original/certificate-16.jpeg'},
    {id:17,name:'Sertifikat Apresiasi',description:'Dokumen apresiasi kegiatan yang menjadi bagian dari perjalanan pengembangan diri.',image:'assets/certificates/certificate-17.webp',original:'assets/certificates/original/certificate-17.jpeg'},
    {id:18,name:'Sertifikat Keikutsertaan',description:'Sertifikat partisipasi dalam kegiatan pengembangan kapasitas dan pengalaman lapangan.',image:'assets/certificates/certificate-18.webp',original:'assets/certificates/original/certificate-18.jpeg'},
    {id:19,name:'TOEFL / Central Course Certificate',description:'Dokumen kemampuan bahasa Inggris yang mendukung kesiapan profesional.',image:'assets/certificates/certificate-19.webp',original:'assets/certificates/original/certificate-19.jpeg'},
    {id:20,name:'Dokumentasi Sertifikat',description:'Dokumentasi sertifikat tambahan dalam format potret.',image:'assets/certificates/certificate-20.webp',original:'assets/certificates/original/certificate-20.jpeg'},
    {id:21,name:'Sertifikat Organisasi',description:'Sertifikat yang terkait dengan kontribusi dalam kegiatan organisasi.',image:'assets/certificates/certificate-21.webp',original:'assets/certificates/original/certificate-21.jpeg'},
    {id:22,name:'Sertifikat Penghargaan',description:'Dokumen penghargaan sebagai bukti partisipasi dan kontribusi.',image:'assets/certificates/certificate-22.webp',original:'assets/certificates/original/certificate-22.jpeg'}
  ];

  // contacts
  const mail=String(CONFIG.email||'').trim(), wa=String(CONFIG.whatsapp||'').replace(/\D/g,''), instagram=String(CONFIG.instagram||'').replace(/^@/,'').trim();
  const setContact=(selector,href,text)=>{const el=$(selector); if(!el) return; el.href=href; if(text){const strong=el.querySelector('strong'); if(strong) strong.textContent=text;}};
  if(mail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){setContact('#emailLink',`mailto:${mail}`);setContact('#emailTextLink',`mailto:${mail}`,mail);$('#footerEmail').textContent=mail;}
  if(wa && /^62[0-9]{8,13}$/.test(wa)){setContact('#waLink',`https://wa.me/${wa}`);setContact('#waTextLink',`https://wa.me/${wa}`);}
  if(instagram && /^[a-zA-Z0-9._]+$/.test(instagram)){setContact('#instagramLink',`https://www.instagram.com/${instagram}/`);setContact('#instagramTextLink',`https://www.instagram.com/${instagram}/`,`@${instagram}`);}
  $('#copyrightYear').textContent=String(new Date().getFullYear());

  // menu
  const menuButton=$('#menuToggle'), mobileMenu=$('#mobileMenu');
  const setMenu=open=>{document.body.classList.toggle('menu-open',open); menuButton?.setAttribute('aria-expanded',String(open)); if(mobileMenu) mobileMenu.inert=!open;};
  menuButton?.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
  $$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  // gallery
  const grid=$('#activityGrid');
  function renderGallery(filter='all'){
    if(!grid) return; grid.innerHTML='';
    activityGroups.filter(item=>filter==='all'||item.cat===filter).forEach((item,idx)=>{
      const btn=document.createElement('button'); btn.type='button'; btn.className='gallery-card reveal-in'; btn.style.setProperty('--delay',`${idx*55}ms`);
      btn.innerHTML=`<img src="${item.cover}" alt="${item.title}" loading="lazy" width="960" height="720"/><span class="gallery-arrow" aria-hidden="true">↗</span><div class="gallery-card-text"><span>${item.tag}</span><h3>${item.title}</h3><small>${item.images.length} foto</small></div>`;
      btn.setAttribute('aria-label',`Lihat detail ${item.title}`);
      btn.addEventListener('click',()=>openModal({tag:item.tag,title:item.title,description:item.description,note:item.note,images:item.images,openFile:item.images[0]}));
      grid.appendChild(btn);
      requestAnimationFrame(()=>btn.classList.add('visible'));
    });
  }
  renderGallery();
  $$('.filter-chip').forEach(chip=>chip.addEventListener('click',()=>{$$('.filter-chip').forEach(c=>{c.classList.remove('active'); c.setAttribute('aria-pressed','false')}); chip.classList.add('active'); chip.setAttribute('aria-pressed','true'); renderGallery(chip.dataset.filter||'all');}));

  // modal
  const modal=$('#detailModal'), modalImage=$('#modalImage'), modalThumbs=$('#modalThumbs'), modalPrev=$('#modalPrev'), modalNext=$('#modalNext'), modalOpenFile=$('#modalOpenFile'), modalPanel=$('.modal-panel');
  let modalState={images:[], index:0, originalLinks:[]}, lastFocus=null;
  function setModalOrientation(){
    const img=modalImage;
    if(!img.naturalWidth || !modalPanel) return;
    modalPanel.classList.remove('portrait-media','landscape-media','square-media');
    const ratio=img.naturalWidth / img.naturalHeight;
    modalPanel.classList.add(ratio>1.12 ? 'landscape-media' : ratio<0.9 ? 'portrait-media' : 'square-media');
  }
  function renderModalImage(){
    const {images,index}=modalState; if(!images.length) return;
    const src=images[index]; modalImage.src=src; modalImage.alt=`${$('#modalTitle').textContent} — gambar ${index+1}`; modalOpenFile.href=modalState.originalLinks[index]||src;
    $('#modalCount').textContent=`${String(index+1).padStart(2,'0')} / ${String(images.length).padStart(2,'0')}`;
    modalPrev.hidden=modalNext.hidden=images.length<2;
    modalThumbs.innerHTML='';
    images.forEach((img,i)=>{const b=document.createElement('button'); b.type='button'; b.className='modal-thumb'+(i===index?' active':''); b.innerHTML=`<img src="${img}" alt="Thumbnail ${i+1}" loading="lazy">`; b.addEventListener('click',()=>{modalState.index=i; renderModalImage();}); modalThumbs.appendChild(b);});
  }
  modalImage.addEventListener('load',setModalOrientation);
  function openModal({tag,title,description,note,images,originalLinks}){
    lastFocus=document.activeElement;
    $('#modalTag').textContent=tag; $('#modalTitle').textContent=title; $('#modalDescription').textContent=description; $('#modalNote').textContent=note||'';
    modalState={images:[...(images||[])], index:0, originalLinks:[...(originalLinks||[])]};
    renderModalImage();
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
    requestAnimationFrame(()=>$('.modal-close',modal)?.focus());
  }
  function closeModal(){ if(!modal.classList.contains('open')) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); modalImage.removeAttribute('src'); modalThumbs.innerHTML=''; modalPanel.classList.remove('portrait-media','landscape-media','square-media'); lastFocus?.focus(); }
  function shiftModal(step){ if(modalState.images.length<2) return; modalState.index=(modalState.index+step+modalState.images.length)%modalState.images.length; renderModalImage(); }
  $$('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
  modalPrev?.addEventListener('click',()=>shiftModal(-1)); modalNext?.addEventListener('click',()=>shiftModal(1));
  let startX=null; $('.modal-stage')?.addEventListener('touchstart',e=>{startX=e.touches[0]?.clientX??null;},{passive:true}); $('.modal-stage')?.addEventListener('touchend',e=>{if(startX===null)return;const dx=(e.changedTouches[0]?.clientX??startX)-startX;startX=null;if(Math.abs(dx)<35)return;shiftModal(dx<0?1:-1);},{passive:true});

  // certificates
  let certIdx=0; const certImage=$('#certImage');
  function renderCert(){ const c=certificates[certIdx]; if(!c||!certImage) return; certImage.src=c.image; certImage.alt=c.name; $('#certName').textContent=c.name; $('#certDesc').textContent=c.description; $('#certCount').textContent=`${String(certIdx+1).padStart(2,'0')} / ${String(certificates.length).padStart(2,'0')}`; }
  $('#certPrev')?.addEventListener('click',()=>{certIdx=(certIdx-1+certificates.length)%certificates.length; renderCert();});
  $('#certNext')?.addEventListener('click',()=>{certIdx=(certIdx+1)%certificates.length; renderCert();});
  const openCert=()=>{const c=certificates[certIdx]; openModal({tag:'CREDENTIALS / OPEN ACCESS',title:c.name,description:c.description,note:'Dokumen ditampilkan penuh dan terbuka sebagai bagian dari portofolio publik.',images:[c.image],originalLinks:[c.original]});};
  $('#certOpen')?.addEventListener('click',openCert); $('#certDetailBtn')?.addEventListener('click',openCert);
  $('#certShowcase')?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();$('#certPrev').click()} if(e.key==='ArrowRight'){e.preventDefault();$('#certNext').click()}});
  let certStart=null; $('#certShowcase')?.addEventListener('touchstart',e=>{certStart=e.touches[0]?.clientX??null;},{passive:true}); $('#certShowcase')?.addEventListener('touchend',e=>{if(certStart===null)return; const dx=(e.changedTouches[0]?.clientX??certStart)-certStart; certStart=null; if(Math.abs(dx)<40)return; (dx<0?$('#certNext'):$('#certPrev')).click(); },{passive:true});
  renderCert();

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ if(modal.classList.contains('open')) closeModal(); if(document.body.classList.contains('menu-open')) setMenu(false); }
    if(modal.classList.contains('open')){ if(e.key==='ArrowLeft') shiftModal(-1); if(e.key==='ArrowRight') shiftModal(1); }
  });

  // reveals
  const revealTargets=$$('.about-layout,.expertise-panel,.activities-heading,.education-layout,.credentials-heading,.contact-center,.gallery-note,.cert-showcase,.cert-bottom,.contact-direct,.gallery-card');
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target);} }),{threshold:.1});
  if(!reduceMotion.matches) revealTargets.forEach(el=>{el.classList.add('reveal-in'); io.observe(el)});

  // journey
  const journeyItems=$$('.journey-item');
  function updateJourney(){ let active=0, closest=Infinity; const pivot=window.innerHeight*0.42; journeyItems.forEach((el,i)=>{ const rect=el.getBoundingClientRect(); const dist=Math.abs(rect.top+Math.min(rect.height,250)/2-pivot); if(dist<closest){closest=dist; active=i;} }); journeyItems.forEach((el,i)=>el.classList.toggle('active',i===active)); const current=$('#journeyCurrent'), fill=$('#journeyTrackFill'); if(current) current.textContent=String(active+1).padStart(2,'0'); if(fill) fill.style.width=`${(active+1)/journeyItems.length*100}%`; }

  // scroll fx
  const hero=$('.hero'), portrait=$('.hero-portrait'), headline=$('.hero-copy'), blueDisc=$('.hero-blue-disc'), orbitOne=$('.hero-orbit-one'), orbitTwo=$('.hero-orbit-two'), progress=$('#scrollProgress');
  let ticking=false;
  function updateScrollFX(){ ticking=false; const top=window.scrollY, max=document.documentElement.scrollHeight-window.innerHeight; if(progress) progress.style.width=`${Math.max(0,Math.min(100,max>0?top/max*100:0))}%`; if(hero && !reduceMotion.matches){ const heroHeight=hero.offsetHeight; const p=Math.min(1.15, Math.max(0, top/heroHeight)); portrait.style.transform=`translate3d(0,${p*54}px,0) scale(${1+p*0.22})`; blueDisc.style.transform=`translate3d(${p*-30}px,${p*8}px,0) scale(${1+p*0.15})`; if(orbitOne) orbitOne.style.transform=`translate3d(${p*14}px,${p*22}px,0) rotate(${p*14}deg)`; if(orbitTwo) orbitTwo.style.transform=`translate3d(${p*-18}px,${p*-16}px,0) rotate(${p*-14}deg)`; if(headline){ headline.style.opacity=String(Math.max(.06,1-p*1.18)); headline.style.transform=window.innerWidth<=840?`translate3d(0,-${p*26}px,0)`:`translate3d(0,calc(-47% - ${p*62}px),0)`; } }
    updateJourney();
  }
  window.addEventListener('scroll',()=>{ if(!ticking){ requestAnimationFrame(updateScrollFX); ticking=true; } },{passive:true});
  window.addEventListener('resize',()=>requestAnimationFrame(updateScrollFX),{passive:true});
  updateScrollFX();
})();
