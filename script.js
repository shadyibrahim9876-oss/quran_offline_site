const surahList = document.getElementById("surah-list");
const searchBox = document.getElementById("searchBox");
const surahSelect = document.getElementById("surahSelect");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

let surahs = [
"الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
"هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
"الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
"لقمان","السجدة","الأحزاب","سبإ","فاطر","يس","الصافات","ص","الزمر","غافر",
"فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
"الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
"الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
"نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبإ","النازعات","عبس",
"التكوير","الإنفطار","المطففين","الإنشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
"الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
"القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
"المسد","الإخلاص","الفلق","الناس"
];

const archiveBase = "https://archive.org/download/002_20250826_202508/";

let currentIndex = 0;
let repeat = false;

// إنشاء قائمة السور
function buildList() {
    surahList.innerHTML = "";
    surahs.forEach((name, idx) => {
        const li = document.createElement("li");
        li.textContent = `${idx+1} - ${name}`;
        li.dataset.index = idx;
        li.addEventListener("click", () => {
            loadSurah(idx);
            playAudio();
        });
        surahList.appendChild(li);

        const option = document.createElement("option");
        option.value = idx;
        option.textContent = `${idx+1} - ${name}`;
        surahSelect.appendChild(option);
    });
}

// تحميل سورة محددة
function loadSurah(idx) {
    currentIndex = idx;
    const num = String(idx+1).padStart(3,'0');
    audioPlayer.src = `${archiveBase}${num}.mp3`;
    audioPlayer.load();
    markActive();
    surahSelect.value = idx;
}

// تشغيل وإيقاف
function playAudio() {
    audioPlayer.play();
    playPauseBtn.textContent = "⏸️ إيقاف";
}
function pauseAudio() {
    audioPlayer.pause();
    playPauseBtn.textContent = "▶️ تشغيل";
}

// تكرار
repeatBtn.addEventListener("click", () => {
    repeat = !repeat;
    repeatBtn.classList.toggle("active", repeat);
});

// التالي والسابق
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % surahs.length;
    loadSurah(currentIndex);
    playAudio();
});
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + surahs.length) % surahs.length;
    loadSurah(currentIndex);
    playAudio();
});

// زر تشغيل/إيقاف
playPauseBtn.addEventListener("click", () => {
    if(audioPlayer.paused) playAudio();
    else pauseAudio();
});

// اختيار من القائمة
surahSelect.addEventListener("change", () => {
    loadSurah(Number(surahSelect.value));
    playAudio();
});

// البحث
searchBox.addEventListener("input", () => {
    const term = searchBox.value.trim();
    Array.from(surahList.children).forEach(li => {
        li.style.display = li.textContent.includes(term) ? "" : "none";
    });
});

// تمييز السورة الحالية
function markActive() {
    Array.from(surahList.children).forEach((li, idx) => {
        li.classList.toggle("active", idx === currentIndex);
    });
}

// تحديث الوقت
audioPlayer.addEventListener("timeupdate", () => {
    const cur = formatTime(audioPlayer.currentTime);
    const dur = formatTime(audioPlayer.duration);
    currentTimeEl.textContent = cur;
    durationEl.textContent = dur;
});

// نهاية التشغيل
audioPlayer.addEventListener("ended", () => {
    if(repeat) {
        audioPlayer.currentTime = 0;
        playAudio();
    } else {
        nextBtn.click();
    }
});

function formatTime(t){
    if(isNaN(t)) return "00:00";
    const m = Math.floor(t/60);
    const s = Math.floor(t%60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// بدء
buildList();
loadSurah(0);
