const vid = document.getElementById("vid");
const player = document.getElementById("player");

const ctrls = document.getElementById('ctrls');
const upCtrl = document.getElementById('up-ctrls');
const sideCtrl = document.getElementById('side-ctrls');
const back = document.getElementById('back');

const decSpeed = document.getElementById("dec-speed");
const incSpeed = document.getElementById("inc-speed");
const speedText = document.getElementById("speed");

const skipLeft = document.getElementById("skip-left");
const skipRight = document.getElementById("skip-right");

const prev = document.getElementById("prev");
const next = document.getElementById("next");

const play = document.getElementById("play");
const iplay = document.getElementById("play-icon");
const ipause = document.getElementById("pause-icon");

const vol = document.getElementById("volume");
const volBox = document.getElementById("vol-box");
const volLevel = document.getElementById("vol-level");
const incVol = document.getElementById("inc-vol");
const decVol = document.getElementById("dec-vol");
const volbar = document.getElementById("vol-bar");
const volgutter = document.getElementById("vol-gutter");

const vol0 = document.getElementById("vol-mute");
const vol25 = document.getElementById("vol25");
const vol50 = document.getElementById("vol50");
const vol75 = document.getElementById("vol75");

const fullscr = document.getElementById("fullscreen");
const ifscrin = document.getElementById("fscreen-in");
const ifscrout = document.getElementById("fscreen-out");

const cur = document.getElementById("current");
const dur = document.getElementById("duration");

const progress = document.getElementById("progress-bar");
const progutter = document.getElementById("progress-back");
const seekDot = document.getElementById("seek-dot");
const seekTooltip = document.getElementById("seek-tooltip");
const upnext = document.getElementById('upnext');
const playlist = document.getElementById('playlist');

const homeScreen = document.getElementById('home-screen');
const selectFolder = document.getElementById('select-folder');
const selectVideo = document.getElementById('select-vid');
const dropZone = document.getElementById('drop-zone');
const list = document.getElementById('list');
const vidTitle = document.getElementById('vid-title');

let vidData = [];
let currentVideo = 0;
let keyTimer = null;
let listTimer = null;
let sideTimer = null;
let clickTimer = null;
let prevClick = 0;
const delay = 300;
let dir = true;
let observer;


function showControls() {
  ctrls.style.visibility = 'visible';
  ctrls.style.bottom = '0px';
  upCtrl.style.visibility = 'visible';
  upCtrl.style.top = '0px';
  clearTimeout(keyTimer);
}

function hideControls() {
  keyTimer = setTimeout(() => {
    if (!vid.paused) {
      ctrls.style.visibility = 'hidden';
      ctrls.style.bottom = '-100%';
      upCtrl.style.visibility = 'hidden';
      upCtrl.style.top = '-100%';
    }
  }, 5000);
}

function showList() {
  upnext.style.right = '0px';
  clearTimeout(listTimer);
}

function hideList() {
  listTimer = setTimeout(() => {
    upnext.style.right = '-100%';
  }, 2000);
}

playlist.addEventListener('click', showList);
playlist.addEventListener('mouseenter', showList);
playlist.addEventListener('mouseleave', hideList);
upnext.addEventListener('mouseenter', showList);
upnext.addEventListener('mouseleave', hideList);
back.addEventListener('click', returnHome);

function returnHome() {
  vid.pause();
  vid.querySelector('source').src = '';
  vid.load();
  document.removeEventListener("keydown", keyPress);
  player.classList.add('hidden');
  upCtrl.style.top = '-100%';
  ctrls.style.bottom = '-100%';
  sideCtrl.style.right = '-100%';
  upnext.style.right = '-100%';
  homeScreen.style.display = 'flex';
}

vid.addEventListener("loadedmetadata", () => {
  dynamicUpdate();
  volbar.style.height = `${vid.volume * 100}%`;
});

vid.addEventListener("timeupdate", dynamicUpdate);
vid.addEventListener('mousemove', () => {
  showControls();
  hideControls();
});

vid.addEventListener('click', function (e) {
  upnext.style.right = '-100%';
  showControls();
  const curClick = new Date().getTime();
  const clickDelay = curClick - prevClick;

  if (clickDelay < delay) {
    clearTimeout(clickTimer);
    toggleFullscreen(player);
    prevClick = 0;
    return;
  }

  clickTimer = setTimeout(() => {
    togglePlayPause();
  }, delay);
  prevClick = curClick;
  hideControls();
});

ctrls.addEventListener('mouseenter', showControls);
ctrls.addEventListener('mouseleave', hideControls);
upCtrl.addEventListener('mouseenter', showControls);
upCtrl.addEventListener('mouseleave', hideControls);

function formatTime(time) {
  if (isNaN(time)) return "00:00";
  const hrs = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return `${hrs > 0 ? (hrs < 10 ? "0" : "") + hrs + ":" : ""}${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function dynamicUpdate() {
  dur.textContent = formatTime(vid.duration);
  if (dir === true) {
    cur.textContent = formatTime(vid.currentTime);
  } else {
    cur.textContent = "- " + formatTime(vid.duration - vid.currentTime);
  }
  const percent = (vid.currentTime / vid.duration) * 100;
  progress.style.width = `${percent || 0}%`;
}

decSpeed.addEventListener("click", () => adjustSpeed(-0.05));
incSpeed.addEventListener("click", () => adjustSpeed(0.05));

function adjustSpeed(change) {
  const maxSpeed = 8.0, minSpeed = 0.1;
  if (change !== 0) {
    vid.playbackRate = Math.max(minSpeed, Math.min(maxSpeed, vid.playbackRate + change));
  } else {
    vid.playbackRate = 1;
  }
  speedText.textContent = `${vid.playbackRate.toFixed(2)} X`;
}

play.addEventListener("click", togglePlayPause);

function togglePlayPause() {
  if (vid.paused) {
    vid.play().catch(err => console.log("Play interrupted: ", err));
    iplay.classList.add("hidden");
    ipause.classList.remove("hidden");
  } else {
    vid.pause();
    iplay.classList.remove("hidden");
    ipause.classList.add("hidden");
  }
}

skipLeft.addEventListener("click", () => seekVideo(-5));
skipRight.addEventListener("click", () => seekVideo(5));

function seekVideo(seconds) {
  vid.currentTime += seconds;
}

sideCtrl.addEventListener("mousemove", showVolBar);
sideCtrl.addEventListener("mouseleave", hideVolBar);
vol.addEventListener("click", () => {
  vid.muted = !vid.muted;
  adjustVolume(0);
  volIconSet();
  hideVolBar();
});
vol.addEventListener("mouseenter", showVolBar);
vol.addEventListener("mouseleave", hideVolBar);

volgutter.addEventListener("click", function (e) {
  const rect = volgutter.getBoundingClientRect();
  const clickPos = e.clientY - rect.top;
  const barHeight = volgutter.clientHeight;
  let newVol = 1 - (clickPos / barHeight);
  newVol = Math.max(0, Math.min(1, newVol));
  vid.volume = newVol;
  if (newVol > 0) vid.muted = false;
  adjustVolume(0);
});

volBox.addEventListener("mouseenter", showVolBar);
volBox.addEventListener("mousemove", showVolBar);
volBox.addEventListener("mouseleave", hideVolBar);

incVol.addEventListener("click", () => adjustVolume(0.1));
decVol.addEventListener("click", () => adjustVolume(-0.1));

function volIconSet() {
  const level = vid.volume * 100;
  vol0.classList.add("hidden");
  vol25.classList.add("hidden");
  vol50.classList.add("hidden");
  vol75.classList.add("hidden");

  if (vid.muted || vid.volume === 0) {
    vol0.classList.remove("hidden");
  } else if (level < 35) {
    vol25.classList.remove("hidden");
  } else if (level < 70) {
    vol50.classList.remove("hidden");
  } else {
    vol75.classList.remove("hidden");
  }
}

function showVolBar() {
  sideCtrl.style.visibility = "visible";
  sideCtrl.style.right = "0px";
  volgutter.style.visibility = "visible";
  volgutter.style.height = "150px";
  clearTimeout(sideTimer);
  showControls();
}

function hideVolBar() {
  sideTimer = setTimeout(() => {
    sideCtrl.style.visibility = "hidden";
    sideCtrl.style.right = "-100%";
    volgutter.style.visibility = "hidden";
    volgutter.style.height = "0px";
    hideControls();
  }, 4000);
}

function adjustVolume(change) {
  let newVolume = parseFloat(vid.volume) + change;
  newVolume = Math.max(0, Math.min(1, newVolume));
  vid.volume = newVolume.toFixed(2);

  if (vid.muted && change > 0) {
    vid.muted = false;
  }
  if (!vid.muted) {
    volbar.style.height = `${vid.volume * 100}%`;
  } else {
    volbar.style.height = `0%`;
  }
  volLevel.textContent = `${Math.round(vid.volume * 100)}%`;
  volIconSet();
  showVolBar();
}

fullscr.addEventListener("click", () => toggleFullscreen(player));

function toggleFullscreen(element) {
  if (!document.fullscreenElement) {
    element.requestFullscreen().then(() => {
      ifscrin.classList.add("hidden");
      ifscrout.classList.remove("hidden");
    }).catch(err => console.log(err));
  } else {
    document.exitFullscreen().then(() => {
      ifscrin.classList.remove("hidden");
      ifscrout.classList.add("hidden");
    });
  }
}

cur.addEventListener("click", toggleTime);
function toggleTime() {
  dir = !dir;
  dynamicUpdate();
}

// ─── Seekbar with dot + tooltip ───
progutter.addEventListener("click", seek);
progutter.addEventListener("mousemove", seekHover);
progutter.addEventListener("mouseleave", seekLeave);
progutter.addEventListener("mousedown", seekMouseDown);

function seek(e) {
  const rect = progutter.getBoundingClientRect();
  const clickPosition = e.clientX - rect.left;
  const containerWidth = progutter.clientWidth;
  const seekTime = (clickPosition / containerWidth) * vid.duration;
  if (!isNaN(seekTime)) vid.currentTime = seekTime;
}

function seekHover(e) {
  const rect = progutter.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  const clampedPos = Math.max(0, Math.min(1, pos));
  if (seekTooltip && !isNaN(vid.duration)) {
    seekTooltip.textContent = formatTime(clampedPos * vid.duration);
    seekTooltip.style.left = `${clampedPos * 100}%`;
  }
}

function seekLeave() {
  progutter.classList.remove("seeking");
}

let isSeeking = false;
function seekMouseDown(e) {
  isSeeking = true;
  progutter.classList.add("seeking");
  document.addEventListener("mousemove", seekDrag);
  document.addEventListener("mouseup", seekMouseUp);
}

function seekDrag(e) {
  if (!isSeeking) return;
  const rect = progutter.getBoundingClientRect();
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  if (!isNaN(vid.duration)) vid.currentTime = pos * vid.duration;
}

function seekMouseUp() {
  isSeeking = false;
  progutter.classList.remove("seeking");
  document.removeEventListener("mousemove", seekDrag);
  document.removeEventListener("mouseup", seekMouseUp);
}

selectVideo.addEventListener('click', () => {
  try {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];

      if (!file) return;

      vidData = [{
        src: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        type: file.type
      }];

      await loadVidList();
    });
    fileInput.click();
  } catch (error) {
    console.error('Error selecting video:', error);
    alert('Failed to select video. See console for details.');
  }
});

selectFolder.addEventListener('click', async () => {
  try {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'video/*';

    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);

      // Clear existing data
      vidData = [];

      // Add new videos to vidData
      files.forEach(file => {
        const videoUrl = URL.createObjectURL(file);
        vidData.push({
          src: videoUrl,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          type: file.type
        });
      });

      // Load the video list
      await loadVidList();
    });

    // Trigger file dialog
    fileInput.click();
  } catch (error) {
    console.error('Error selecting videos:', error);
    alert('Failed to select videos. See console for details.');
  }
});

// Drag & Drop Listeners
// ─── Drag & Drop with animations ───
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});

dropZone.addEventListener('dragenter', () => {
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragover', () => {
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', (e) => {
  // Only remove if actually leaving the drop zone
  if (!dropZone.contains(e.relatedTarget)) {
    dropZone.classList.remove('drag-over');
  }
});

dropZone.addEventListener('drop', (e) => {
  dropZone.classList.remove('drag-over');
  dropZone.classList.add('drop-flash');
  dropZone.addEventListener('animationend', () => dropZone.classList.remove('drop-flash'), { once: true });
  if (e.dataTransfer && e.dataTransfer.files.length > 0) {
    processFiles(e.dataTransfer.files);
  }
});

function setPrev(state) {
  if (state) {
    prev.classList.remove('inactive');
  } else {
    prev.classList.add('inactive');
  }
}

function setNext(state) {
  if (state) {
    next.classList.remove('inactive');
  } else {
    next.classList.add('inactive');
  }
}

function clickPrev() {
  showControls();
  if (currentVideo > 0) {
    currentVideo--;
    loadVideo(vidData[currentVideo]);
  }
  prevNext();
}

function clickNext() {
  showControls();
  if (currentVideo < vidData.length - 1) {
    currentVideo++;
    loadVideo(vidData[currentVideo]);
  }
  prevNext();
}

prev.addEventListener('click', clickPrev);
next.addEventListener('click', clickNext);

function prevNext() {
  if (vidData.length > 1) {
    setPrev(currentVideo > 0);
    setNext(currentVideo < vidData.length - 1);
  } else {
    setNext(false);
    setPrev(false);
  }
  // Highlight active thumb
  document.querySelectorAll('.thumb-box').forEach((box, i) => {
    box.classList.toggle('active-thumb', i === currentVideo);
  });
}

function setVideo() {
  homeScreen.style.display = 'none';
  player.classList.remove('hidden');
  upnext.style.right = '0px';
  if (vidData.length > 0) {
    currentVideo = 0;
    loadVideo(vidData[0]);
  }
}

function loadVidList() {
  list.innerHTML = '';
  setVideo();
  prevNext();
  document.addEventListener("keydown", keyPress);

  vidData.forEach((videoItem, index) => {
    const thumbBox = document.createElement('div');
    thumbBox.className = 'thumb-box';
    thumbBox.dataset.index = index;
    thumbBox.innerHTML = `
      <img class="thumbnail" src="assets/Null-Image.webp" alt="Loading">
      <div class="thumb-title-wrap">
      <div class="thumb-title">${videoItem.title}</div>
      </div>
      `;
    list.appendChild(thumbBox);
  });

  setupObserver();
  // Run marquee check after DOM is ready
  setTimeout(initMarquees, 100);
}

// ─── Marquee for overflowing titles ───
function initMarquees() {
  document.querySelectorAll('.thumb-box').forEach(box => {
    const wrap = box.querySelector('.thumb-title-wrap');
    const title = box.querySelector('.thumb-title');
    if (!wrap || !title) return;

    const wrapW = wrap.offsetWidth;
    const titleW = title.scrollWidth;

    if (titleW > wrapW + 4) {
      title.classList.add('marquee-active');
      const overflow = titleW - wrapW;
      title.style.setProperty('--marquee-offset', `-${overflow}px`);
    }
  });
}


function setupObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const thumbBox = entry.target;
        const index = parseInt(thumbBox.dataset.index);
        const videoItem = vidData[index];
        const thumb = thumbBox.querySelector('.thumbnail');

        thumbBox.onclick = () => {
          loadVideo(videoItem);
          currentVideo = index;
          prevNext();
        };

        setTimeout(() => {
          generateThumbnail(videoItem.src, thumbnail => {
            if (thumbnail) thumb.src = thumbnail;
          });
        }, index * 100);

        observer.unobserve(thumbBox);
      }
    });
  }, { root: null, rootMargin: '100px', threshold: 0.1 });

  document.querySelectorAll('.thumb-box').forEach(box => observer.observe(box));
}

function generateThumbnail(videoPath, callback) {
  const video = document.createElement('video');
  video.src = videoPath;
  video.muted = true;
  video.currentTime = 2;

  video.onloadeddata = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg'));
    } catch (e) {
      callback(null);
    }
    video.remove();
  };

  video.onerror = () => {
    callback(null);
    video.remove();
  };
}

function loadVideo(videoItem) {
  vidTitle.textContent = videoItem.title;
  const source = vid.querySelector('source');
  source.src = videoItem.src;
  source.type = videoItem.type;
  vid.load();

  // Reset rate adjustments
  vid.playbackRate = 1.0;
  speedText.textContent = "1.00 X";

  // Automated Play invocation
  const playPromise = vid.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      iplay.classList.add("hidden");
      ipause.classList.remove("hidden");
    }).catch(() => {
      iplay.classList.remove("hidden");
      ipause.classList.add("hidden");
    });
  }

  hideList();
  showControls();
  hideControls();
}

vid.addEventListener('ended', () => {
  if (currentVideo < vidData.length - 1) {
    clickNext();
  }
});

vid.addEventListener('error', () => {
  alert("Error loading or playing this video file.");
});

// Key Bindings Matrix Mapping
function keyPress(e) {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  showControls();

  switch (e.key) {
    case " ":
      e.preventDefault();
      togglePlayPause();
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (e.ctrlKey) seekVideo(-5);
      else if (e.shiftKey) clickPrev();
      else if (e.altKey) seekVideo(-60);
      else seekVideo(-10);
      break;
    case "ArrowRight":
      e.preventDefault();
      if (e.ctrlKey) seekVideo(5);
      else if (e.shiftKey) clickNext();
      else if (e.altKey) seekVideo(60);
      else seekVideo(10);
      break;
    case "ArrowUp":
      e.preventDefault();
      adjustVolume(0.1);
      break;
    case "ArrowDown":
      e.preventDefault();
      adjustVolume(-0.1);
      break;
    case 'm':
    case 'M':
      e.preventDefault();
      vid.muted = !vid.muted;
      adjustVolume(0);
      break;
    case "f":
    case "F":
      e.preventDefault();
      toggleFullscreen(player);
      break;
    case "+":
    case "=":
      e.preventDefault();
      adjustSpeed(e.ctrlKey ? 0.25 : 0.05);
      break;
    case "-":
      e.preventDefault();
      adjustSpeed(e.ctrlKey ? -0.25 : -0.05);
      break;
    case "*":
      e.preventDefault();
      adjustSpeed(0);
      break;
  }
  hideControls();
}

// Initial view structural baseline assignment
homeScreen.style.display = 'flex';