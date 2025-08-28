const audioPlayer = document.getElementById('audioPlayer');
const searchBox = document.getElementById('searchBox');
const surahSelect = document.getElementById('surahSelect');
let surahs = [];
let currentIndex = 0;
let repeatOne = false;

// تحميل السور
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
    return `audio/${String(idx+1).padStart(3,'0')}.mp3`;
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