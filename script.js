
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const surahSelect = document.getElementById('surahSelect');
const searchBox = document.getElementById('searchBox');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

let surahs = [
    "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة",
    "يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
    "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت",
    "الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
    "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات",
    "ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة",
    "الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم",
    "الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة",
    "الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين",
    "الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل",
    "الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة",
    "التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
    "المسد","الإخلاص","الفلق","الناس"
];

let currentSurah = 0;
let isRepeating = false;

function loadSurahs() {
    surahSelect.innerHTML = '';
    surahs.forEach((surah, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = (index+1) + " - " + surah;
        surahSelect.appendChild(option);
    });
}

function playSurah(index) {
    currentSurah = index;
    audioPlayer.src = "audio/" + String(index+1).padStart(3,'0') + ".mp3";
    audioPlayer.play();
    playPauseBtn.textContent = "⏸️";
}

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = "⏸️";
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = "▶️";
    }
});

prevBtn.addEventListener('click', () => {
    if (currentSurah > 0) playSurah(currentSurah - 1);
});

nextBtn.addEventListener('click', () => {
    if (currentSurah < surahs.length - 1) playSurah(currentSurah + 1);
});

repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatBtn.style.backgroundColor = isRepeating ? "orange" : "#006400";
});

audioPlayer.addEventListener('ended', () => {
    if (isRepeating) playSurah(currentSurah);
    else if (currentSurah < surahs.length - 1) playSurah(currentSurah + 1);
});

audioPlayer.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    durationEl.textContent = formatTime(audioPlayer.duration);
});

function formatTime(sec) {
    if (isNaN(sec)) return "00:00";
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return String(m).padStart(2,'0') + ":" + String(s).padStart(2,'0');
}

searchBox.addEventListener('input', () => {
    let term = searchBox.value.trim();
    for (let i = 0; i < surahSelect.options.length; i++) {
        let txt = surahSelect.options[i].text;
        surahSelect.options[i].style.display = txt.includes(term) ? "" : "none";
    }
});

surahSelect.addEventListener('change', () => {
    playSurah(parseInt(surahSelect.value));
});

loadSurahs();
