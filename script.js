// ====== شريط الأدعية ======
const azkar = [
  "اللهم بك أصبحنا وبك أمسينا", "سبحان الله والحمد لله", "استغفر الله",
  "اللهم اجعلنا من الذين يستمعون القول فيتبعون أحسنه",
  "اللهم اغفر لنا ولآبائنا وأمهاتنا وأزواجنا وذرياتنا",
  "اللهم صل على سيدنا محمد وعلى آله وصحبه وسلم",
  "سبحان الله وبحمده سبحان الله العظيم",
  "اللهم اجعل القرآن ربيع قلوبنا ونور صدورنا",
  "اللهم اجعل هذا اليوم يوم بركة وهداية",
  "اللهم احفظنا من كل شر ومكروه",
  "اللهم اجعلنا من الصالحين",
  "اللهم ارزقنا الجنة برحمتك يا أرحم الراحمين",
  "اللهم اجعلنا من الذين يدعونك فيستجاب لهم",
  "اللهم ارحم موتانا وموتى المسلمين",
  "اللهم اجعلنا من الذين يذكرونك دائمًا",
  "اللهم اجعلنا من الذين يحبونك ويطيعون أوامرك",
  "اللهم اهدنا فيمن هديت",
  "اللهم اجعلنا من الذين يحبون فعل الخير",
  "اللهم اجعلنا من الذين يسعون للعلم النافع",
  "اللهم اجعلنا من الذين يبتغون رضاك",
  "اللهم اجعلنا من الذين يحبون الخير للناس",
  "اللهم اجعلنا من الذين يحافظون على الصلاة في وقتها",
  "اللهم اجعلنا من الذين يحبون الصدقة",
  "اللهم اجعلنا من الذين يفرحون لما يرضيك يا رب"
];

const scrollTextEl = document.getElementById("scrollText");
scrollTextEl.textContent = azkar.join(" | ");

// ====== شريط مواعيد الصلاة (تحديث تلقائي) ======
const prayerTimesEl = document.getElementById("prayerTimes");
const prayerTimes = [
  "الفجر: 04:30 AM", "الشروق: 06:00 AM", "الظهر: 12:15 PM",
  "العصر: 03:45 PM", "المغرب: 06:30 PM", "العشاء: 07:45 PM"
];
prayerTimesEl.textContent = prayerTimes.join(" | ");

// ====== التاريخ والوقت ======
function updateDateTime() {
  const now = new Date();

  // التوقيت المحلي للقاهرة
  const options = { timeZone: 'Africa/Cairo', hour12: true, hour: '2-digit', minute:'2-digit', second:'2-digit' };
  const time = now.toLocaleTimeString('ar-EG', options);

  const dateOptions = { timeZone: 'Africa/Cairo', year: 'numeric', month: 'long', day: 'numeric' };
  const date = now.toLocaleDateString('ar-EG', dateOptions);

  const hijri = new Intl.DateTimeFormat('ar-EG-u-ca-islamic', {day:'numeric', month:'long', year:'numeric'}).format(now);

  document.getElementById("dateTime").textContent = `${date} | ${hijri} | ${time}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ====== كود مشغل الصوت ======
const audioPlayer = document.getElementById('audioPlayer');
const searchBox = document.getElementById('searchBox');
const surahSelect = document.getElementById('surahSelect');
let surahs = [];
let currentIndex = 0;
let repeatOne = false;

// روابط السور من archive.org
const surahLinks = [
  "https://archive.org/download/002_20250826_202508/001.mp3",
  "https://archive.org/download/002_20250826_202508/002.mp3",
  "https://archive.org/download/002_20250826_202508/003.mp3",
  "https://archive.org/download/002_20250826_202508/004.mp3",
  "https://archive.org/download/002_20250826_202508/005.mp3",
  "https://archive.org/download/002_20250826_202508/006.mp3",
  "https://archive.org/download/002_20250826_202508/007.mp3",
  "https://archive.org/download/002_20250826_202508/008.mp3",
  "https://archive.org/download/002_20250826_202508/009.mp3",
  "https://archive.org/download/002_20250826_202508/010.mp3",
  // أكمل باقي السور بنفس الطريقة حتى آخر سورة
];

fetch('surahs.json')
    .then(res => res.json())
    .then(data => {
        surahs = data.surahs;
        populateSelect();
        loadTrack(0);
    });

function populateSelect() {
    surahs.forEach((name, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = `${String(idx+1).padStart(3,'0')} - ${name}`;
        surahSelect.appendChild(option);
    });
}

surahSelect.addEventListener('change', e => {
    loadTrack(parseInt(e.target.value));
    playAudio();
});

searchBox.addEventListener('input', () => {
    const filter = searchBox.value.trim();
    surahSelect.innerHTML = '';
    surahs.forEach((name, idx) => {
        if(name.includes(filter) || filter === '') {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = `${String(idx+1).padStart(3,'0')} - ${name}`;
            surahSelect.appendChild(option);
        }
    });
});

function audioSrc(idx) {
    return surahLinks[idx]; // استخدم روابط archive.org مباشرة
}

function loadTrack(idx) {
    currentIndex = idx;
    audioPlayer.src = audioSrc(currentIndex);
    surahSelect.value = currentIndex;
}

function playAudio() {
    audioPlayer.play();
    document.getElementById('playPauseBtn').textContent = '⏸️ إيقاف';
}

function pauseAudio() {
    audioPlayer.pause();
    document.getElementById('playPauseBtn').textContent = '▶️ تشغيل';
}

document.getElementById('playPauseBtn').addEventListener('click', () => {
    if(audioPlayer.paused) playAudio();
    else pauseAudio();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % surahs.length;
    loadTrack(currentIndex);
    playAudio();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + surahs.length) % surahs.length;
    loadTrack(currentIndex);
    playAudio();
});

document.getElementById('repeatBtn').addEventListener('click', () => {
    repeatOne = !repeatOne;
    document.getElementById('repeatBtn').style.backgroundColor = repeatOne ? '#23a391' : '';
});

audioPlayer.addEventListener('ended', () => {
    if(repeatOne) playAudio();
    else document.getElementById('nextBtn').click();
});

audioPlayer.addEventListener('timeupdate', () => {
    document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
    document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
});

function formatTime(t) {
    if(isNaN(t)) return '00:00';
    const m = Math.floor(t/60);
    const s = Math.floor(t%60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
