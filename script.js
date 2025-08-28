// ====== عناصر الصوت والتحكم ======
const audioPlayer = document.getElementById('audioPlayer');
const searchBox = document.getElementById('searchBox');
const surahSelect = document.getElementById('surahSelect');

let surahs = [];
let currentIndex = 0;
let repeatOne = false;

// ====== تحميل السور من ملف JSON ======
fetch('surahs.json')
    .then(res => res.json())
    .then(data => {
        surahs = data.surahs;
        populateSelect();
        loadTrack(0);
    });

// ====== ملء قائمة السور ======
function populateSelect() {
    surahs.forEach((name, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = `${String(idx+1).padStart(3,'0')} - ${name}`;
        surahSelect.appendChild(option);
    });
}

// ====== اختيار السورة ======
surahSelect.addEventListener('change', e => {
    loadTrack(parseInt(e.target.value));
    playAudio();
});

// ====== البحث في السور ======
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

// ====== مسار الصوتيات ======
function audioSrc(idx) {
    return `audio/${String(idx+1).padStart(3,'0')}.mp3`;
}

// ====== تحميل السورة الحالية ======
function loadTrack(idx) {
    currentIndex = idx;
    audioPlayer.src = audioSrc(currentIndex);
    surahSelect.value = currentIndex;
}

// ====== تشغيل / إيقاف الصوت ======
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

// ====== أزرار التالي / السابق / التكرار ======
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

// ====== تحديث الوقت ======
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
    "اللهم اجعلنا من الذين يبتغون رضاك",
    "اللهم اجعلنا من الذين لا خوف عليهم ولا هم يحزنون",
    "اللهم اجعلنا من الذين يشكرون نعمتك",
    "اللهم اجعلنا من الذين يصلون ويؤتون الزكاة",
    "اللهم اجعلنا من الذين يتصدقون سرًا وعلانية",
    "اللهم اجعلنا من الذين يحبون الخير للناس",
    "اللهم اجعلنا من الذين يرفعون ذكر الله",
    "اللهم اجعلنا من الذين يذكرونك عند الفرح والحزن",
    "اللهم اجعلنا من الذين يحبون القرآن ويتلونه",
    "اللهم اجعلنا من الذين يحافظون على أذكار الصباح والمساء",
    "اللهم اجعلنا من الذين يحبون فعل الخير",
    "اللهم اجعلنا من الذين يسعون للعلم النافع",
    "اللهم اجعلنا من الذين يوقرون الوالدين",
    "اللهم اجعلنا من الذين يصلون أرحامهم",
    "اللهم اجعلنا من الذين يبتعدون عن المعاصي",
    "اللهم اجعلنا من الذين يذكرونك دائمًا ويشكرونك",
    "اللهم اجعلنا من الذين ينشرون العلم النافع",
    "اللهم اجعلنا من الذين يذكرونك في كل أوقاتهم",
    "اللهم اجعلنا من الذين يفرحون لما يحبه الله",
    "اللهم اجعلنا من الذين يحذرون الشيطان",
    "اللهم اجعلنا من الذين يبتعدون عن الحرام",
    "اللهم اجعلنا من الذين يحبون الصدقة",
    "اللهم اجعلنا من الذين يذكرونك عند كل عمل نقوم به",
    "اللهم اجعلنا من الذين يحافظون على الصلاة في وقتها",
    "اللهم اجعلنا من الذين يدعون الله لأخوتهم المسلمين",
    "اللهم اجعلنا من الذين يحافظون على الأذكار والأدعية",
    "اللهم اجعلنا من الذين يحبون الصالحين",
    "اللهم اجعلنا من الذين يبتغون وجهك الكريم",
    "اللهم اجعلنا من الذين يحبون نشر الخير",
    "اللهم اجعلنا من الذين يذكرونك عند السعادة والحزن",
    "اللهم اجعلنا من الذين يحافظون على الصيام والقيام",
    "اللهم اجعلنا من الذين يحبون عمل الخير للناس",
    "اللهم اجعلنا من الذين يفرحون لما يرضيك يا رب"
];

const scrollTextEl = document.getElementById("scrollText");
scrollTextEl.textContent = azkar.join(" | ");

// ====== شريط مواعيد الصلاة ======
const bottomBarEl = document.createElement('div');
bottomBarEl.className = 'bottom-bar';
bottomBarEl.innerHTML = '<div class="scroll-text" id="prayerTimesText">جاري تحميل مواعيد الصلاة...</div>';
document.body.appendChild(bottomBarEl);

const prayerTimesTextEl = document.getElementById('prayerTimesText');

async function updatePrayerTimes() {
    try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
        const data = await response.json();
        const timings = data.data.timings;
        const prayers = [
            `الفجر: ${timings.Fajr}`,
            `الشروق: ${timings.Sunrise}`,
            `الظهر: ${timings.Dhuhr}`,
            `العصر: ${timings.Asr}`,
            `المغرب: ${timings.Maghrib}`,
            `العشاء: ${timings.Isha}`
        ];
        prayerTimesTextEl.textContent = prayers.join(' | ');
    } catch (err) {
        prayerTimesTextEl.textContent = 'تعذر تحميل مواعيد الصلاة';
        console.error(err);
    }
}

// تحديث مواعيد الصلاة عند التحميل وكل ساعة
updatePrayerTimes();
setInterval(updatePrayerTimes, 60 * 60 * 1000);
