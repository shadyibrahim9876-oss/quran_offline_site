document.addEventListener('DOMContentLoaded', () => {
  const azkar = [
    "اللهم بك أصبحنا وبك أمسينا","سبحان الله والحمد لله","استغفر الله",
    "اللهم اجعل القرآن ربيع قلوبنا","اللهم احفظنا من كل شر","اللهم صلِّ على محمد",
    "سبحان الله وبحمده سبحان الله العظيم","اللهم اهدنا فيمن هديت",
    "اللهم اغفر لنا ولوالدينا","اللهم ارزقنا الجنة بغير حساب",
    "اللهم تقبّل منا ومنكم صالح الأعمال"
  ];
  const azkarEl = document.getElementById('scrollText');
  if (azkarEl){ azkarEl.innerText = azkar.join(" | "); azkarEl.classList.add('marquee'); }

  const prayerTimes = [
    "الفجر: 04:30 AM","الشروق: 06:00 AM","الظهر: 12:15 PM",
    "العصر: 03:45 PM","المغرب: 06:30 PM","العشاء: 07:45 PM"
  ];
  const prayerEl = document.getElementById('prayerTimes');
  function renderPrayerTimes(){ if (prayerEl){ prayerEl.innerText = prayerTimes.join(" | "); prayerEl.classList.add('marquee'); } }
  renderPrayerTimes();
  setInterval(renderPrayerTimes, 60*1000);

  const dtEl = document.getElementById('dateTime');
  function updateDateTime(){
    const now = new Date();
    const time = now.toLocaleTimeString('ar-EG',{timeZone:'Africa/Cairo',hour12:true,hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const date = now.toLocaleDateString('ar-EG',{timeZone:'Africa/Cairo',year:'numeric',month:'long',day:'numeric'});
    const hijri = new Intl.DateTimeFormat('ar-EG-u-ca-islamic',{day:'numeric',month:'long',year:'numeric'}).format(now);
    if (dtEl) dtEl.textContent = `${date} | ${hijri} | ${time}`;
  }
  updateDateTime(); setInterval(updateDateTime, 1000);

  const hamburger = document.querySelector('.hamburger');
  const panel = document.querySelector('.menu-panel');
  if (hamburger && panel){
    hamburger.addEventListener('click', () => panel.classList.toggle('open'));
    panel.addEventListener('click', (e) => { if (e.target.matches('a')) panel.classList.remove('open'); });
  }

  const container = document.getElementById('dynamicList');
  if (container){
    const pageType = document.body.dataset.page || '';
    const map = { 'adhkar':'adhkar.json', 'ruqyah':'ruqyah.json', 'duaa-dead':'duaa_dead.json', 'ahadith':'ahadith.json' };
    if (map[pageType]){
      fetch(map[pageType]).then(r=>r.json()).then(items=>{
        const ol=document.createElement('ol'); ol.className='content-list';
        items.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ol.appendChild(li); });
        container.appendChild(ol);
      }).catch(err=>{ container.innerHTML="<div>حدث خطأ أثناء تحميل المحتوى.</div>"; console.error(err); });
    }
  }

  const audioPlayer = document.getElementById('audioPlayer');
  if (audioPlayer){
    const searchBox = document.getElementById('searchBox');
    const surahSelect = document.getElementById('surahSelect');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    let surahs=[], currentIndex=0, repeatOne=false;

    const base = "https://archive.org/download/002_20250826_202508/";
    const surahLinks = Array.from({length:114},(_,i)=>`${base}${String(i+1).padStart(3,'0')}.mp3`);

    fetch('surahs.json?v=3').then(res=>res.json()).then(data=>{ surahs=data.surahs||[]; populateSelect(); loadTrack(0); });

    function populateSelect(){
      surahSelect.innerHTML="";
      surahs.forEach((name,idx)=>{
        const o=document.createElement('option'); o.value=idx; o.textContent=`${String(idx+1).padStart(3,'0')} - ${name}`; surahSelect.appendChild(o);
      });
    }
    surahSelect.addEventListener('change',e=>{ loadTrack(parseInt(e.target.value,10)); playAudio(); });
    searchBox.addEventListener('input',()=>{
      const filter=searchBox.value.trim();
      surahSelect.innerHTML='';
      surahs.forEach((name,idx)=>{
        if(name.includes(filter)||filter===''){ const o=document.createElement('option'); o.value=idx; o.textContent=`${String(idx+1).padStart(3,'0')} - ${name}`; surahSelect.appendChild(o); }
      });
    });

    function loadTrack(idx){
      currentIndex=idx;
      const src=surahLinks[idx];
      audioPlayer.pause(); audioPlayer.src=src; audioPlayer.load();
      surahSelect.value=idx;
      let autoPlayAfterLoad=true;
      const onCanPlay=()=>{ if(autoPlayAfterLoad) playAudio(); audioPlayer.removeEventListener('canplay', onCanPlay); };
      audioPlayer.addEventListener('canplay', onCanPlay, { once:true });
      audioPlayer.onerror=()=>{ setTimeout(()=>{ audioPlayer.load(); audioPlayer.play().catch(()=>{}); }, 1200); };
    }
    function playAudio(){ audioPlayer.play().then(()=>{ playPauseBtn.textContent='⏸️ إيقاف'; }).catch(()=>{}); }
    function pauseAudio(){ audioPlayer.pause(); playPauseBtn.textContent='▶️ تشغيل'; }

    playPauseBtn.addEventListener('click',()=>{ if(audioPlayer.paused) playAudio(); else pauseAudio(); });
    nextBtn.addEventListener('click',()=>{ currentIndex=(currentIndex+1)%surahs.length; loadTrack(currentIndex); playAudio(); });
    prevBtn.addEventListener('click',()=>{ currentIndex=(currentIndex-1+surahs.length)%surahs.length; loadTrack(currentIndex); playAudio(); });
    repeatBtn.addEventListener('click',()=>{ repeatOne=!repeatOne; repeatBtn.style.backgroundColor=repeatOne?'#23a391':''; });
    audioPlayer.addEventListener('ended',()=>{ if(repeatOne) playAudio(); else nextBtn.click(); });
    audioPlayer.addEventListener('timeupdate',()=>{
      currentTimeEl.textContent=formatTime(audioPlayer.currentTime);
      durationEl.textContent=formatTime(audioPlayer.duration);
    });
    function formatTime(t){ if(isNaN(t)) return '00:00'; const m=Math.floor(t/60), s=Math.floor(t%60); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
  }
});