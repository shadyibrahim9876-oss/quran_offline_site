const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const surahSelect = document.getElementById("surahSelect");
const searchBox = document.getElementById("searchBox");

let currentSurah = 1;
let isRepeating = false;

const surahNames = [
    "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال",
    "التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء",
    "الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء",
    "النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر",
    "يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية",
    "الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر",
    "الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة",
    "المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
    "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات",
    "عبس","التكوير","الإنفطار","المطففين","الإنشقاق","البروج","الطارق","الأعلى",
    "الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق",
    "القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة",
    "الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"
];

function loadSurah(num) {
    audio.src = `audio/${String(num).padStart(3, '0')}.mp3`;
    audio.play();
    playPauseBtn.textContent = "⏸️ إيقاف مؤقت";
    surahSelect.value = num;
}

function updateTime() {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let m = Math.floor(seconds / 60);
    let s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "⏸️ إيقاف مؤقت";
    } else {
        audio.pause();
        playPauseBtn.textContent = "▶️ تشغيل";
    }
});

prevBtn.addEventListener("click", () => {
    if (currentSurah > 1) {
        currentSurah--;
        loadSurah(currentSurah);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentSurah < 114) {
        currentSurah++;
        loadSurah(currentSurah);
    }
});

repeatBtn.addEventListener("click", () => {
    isRepeating = !isRepeating;
    repeatBtn.style.background = isRepeating ? "lightgreen" : "";
});

audio.addEventListener("ended", () => {
    if (isRepeating) {
        loadSurah(currentSurah);
    } else if (currentSurah < 114) {
        currentSurah++;
        loadSurah(currentSurah);
    }
});

audio.addEventListener("timeupdate", updateTime);

surahNames.forEach((name, index) => {
    let opt = document.createElement("option");
    opt.value = index + 1;
    opt.textContent = `${index + 1} - ${name}`;
    surahSelect.appendChild(opt);
});

surahSelect.addEventListener("change", () => {
    currentSurah = parseInt(surahSelect.value);
    loadSurah(currentSurah);
});

searchBox.addEventListener("input", () => {
    let term = searchBox.value.trim();
    for (let option of surahSelect.options) {
        option.hidden = !option.textContent.includes(term);
    }
});

loadSurah(currentSurah);
