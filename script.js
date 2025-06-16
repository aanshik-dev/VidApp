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
const upnext = document.getElementById('upnext');
const playlist = document.getElementById('playlist');


let vidData = [
  {
    src: "../../../../../YouTube/Python/Lecture 1 Python Full Course❤️  Variables & Data Types.webm",
    title: "Lecture 1 Python Full Course❤️  Variables & Data Types",
    type: "video/webm"
  }
];



let keyTimer = null;
function showControls() {
  ctrls.style.visibility = 'visible';
  ctrls.style.bottom = '0px';
  upCtrl.style.visibility = 'visible';
  upCtrl.style.top = '0px';
  clearTimeout(keyTimer);
}

function hideControls() {
  keyTimer = setTimeout(() => {
    ctrls.style.visibility = 'hidden';
    ctrls.style.bottom = '-100%';
    upCtrl.style.visibility = 'hidden';
    upCtrl.style.top = '-100%';
  }, 5000);
}
let listTimer = null;
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

back.addEventListener('click', returnHome);
upnext.addEventListener('mouseenter', showList);
upnext.addEventListener('mouseleave', hideList);

function returnHome() {
  vid.querySelector('source').src = '';
  vid.load();
  document.removeEventListener("keydown", keyPress);
  vid.style.display = 'none';
  upCtrl.style.top = '-100%';
  ctrls.style.bottom = '-100%';
  sideCtrl.style.right = '-100%';
  upnext.style.right = '-100%';
  selectBox.style.display = 'flex';
}

vid.addEventListener("loadedmetadata", () => {
  dynamicUpdate();
  volbar.style.height = `${vid.volume * 100}%`;
});
vid.addEventListener("timeupdate", dynamicUpdate);
vid.addEventListener('mousemove', (e) => {
  showControls();
  hideControls();
});

let clickTimer = null;
let prevClick = 0;
const delay = 300;

vid.addEventListener('click', function (e) {
  upnext.style.right = '-100%';
  showControls();
  const curClick = new Date().getTime();
  const clickDelay = curClick - prevClick;
  // If click happened quickly, treat as double-click
  if (clickDelay < delay) {
    clearTimeout(clickTimer);
    toggleFullscreen(player);
    return;
  }
  // Otherwise, set a timeout for single click
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
  const hrs = Math.floor(time / 3600);
  const minutes = Math.floor(Math.floor(time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return `${hrs > 0 ? (hrs < 10 ? "0" : "") + hrs + ":" : ""}${minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

let dir = true;
function dynamicUpdate() {
  dur.textContent = formatTime(vid.duration);
  if (dir === true) {
    cur.textContent = formatTime(vid.currentTime);
  } else {
    cur.textContent = "- " + formatTime(vid.duration - vid.currentTime);
  }
  const percent = (vid.currentTime / vid.duration) * 100;
  progress.style.width = `${percent}%`;
}

decSpeed.addEventListener("click", () => adjustSpeed(-0.05))
incSpeed.addEventListener("click", () => adjustSpeed(0.05))

function adjustSpeed(change) {
  const maxSpeed = 8.0,
    minSpeed = 0.1;
  if (change) {
    vid.playbackRate = Math.max(
      minSpeed,
      Math.min(maxSpeed, vid.playbackRate + change)
    );
  } else {
    vid.playbackRate = 1;
  }
  speedText.textContent = `${vid.playbackRate.toFixed(2)} X`;
}

play.addEventListener("click", togglePlayPause);

function togglePlayPause() {
  if (vid.paused) {
    vid.play();
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

sideCtrl.addEventListener("mousemove", () => {
  showVolBar();
});

sideCtrl.addEventListener("mouseleave", () => {
  hideVolBar();
});

vol.addEventListener("click", () => {
  volbar.style.height = `0%`;
  vid.muted = !vid.muted;
  adjustVolume(0);
  volIconSet();
  hideVolBar();
});

vol.addEventListener("mouseenter", () => showVolBar());
vol.addEventListener("mouseleave", () => hideVolBar());

volgutter.addEventListener("click", function (e) {
  const clickPos = e.offsetY;
  const barHeight = volgutter.clientHeight;
  const newVol = 1 - clickPos / barHeight;
  vid.volume = newVol;
  if (newVol > 0) vid.muted = false;
  adjustVolume(0);
});

volBox.addEventListener("mouseenter", () => {
  showVolBar();
});
volBox.addEventListener("mousemove", () => {
  showVolBar();
  // hideVolBar();
});
volBox.addEventListener("mouseleave", () => {
  hideVolBar();
});

incVol.addEventListener("click", () => {
  adjustVolume(0.1);
  showVolBar();
});
decVol.addEventListener("click", () => {
  adjustVolume(-0.1)
  showVolBar();
});

function volIconSet() {
  const vol = vid.volume * 100;
  vol0.classList.add("hidden");
  vol25.classList.add("hidden");
  vol50.classList.add("hidden");
  vol75.classList.add("hidden");
  if (vid.muted) {
    vol0.classList.remove("hidden");
  } else if (vid.volume === 0) {
    vol0.classList.remove("hidden");
  } else if (vol < 35) {
    vol25.classList.remove("hidden");
  } else if (vol < 70) {
    vol50.classList.remove("hidden");
  } else if (vol <= 100) {
    vol75.classList.remove("hidden");
  } else {
    vol75.classList.remove("hidden");
  }
}

let sideTimer = null;
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
  let newVolume = vid.volume + change;
  newVolume = Math.max(0, Math.min(1, newVolume));
  newVolume = newVolume.toFixed(2);
  vid.volume = newVolume;
  if (vid.muted && change > 0) {
    vid.muted = false;
  }
  if (!vid.muted) {
    volbar.style.height = `${vid.volume * 100}%`;
  }
  volLevel.textContent = `${newVolume * 100}%`;
  volIconSet();
  showVolBar();
}

fullscr.addEventListener("click", () => toggleFullscreen(player));
function toggleFullscreen(element) {
  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.mozFullScreenElement &&
    !document.msFullscreenElement
  ) {
    // Enter fullscreen
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    ifscrin.style.display = "none";
    ifscrout.style.display = "block";
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    ifscrin.style.display = "block";
    ifscrout.style.display = "none";
  }
}

cur.addEventListener("click", toggleTime);
function toggleTime() {
  if (dir === true) {
    dir = false;
  } else {
    dir = true;
  }
  dynamicUpdate();
}

progutter.addEventListener("click", seek);
function seek(e) {
  const clickPosition = e.offsetX;
  const containerWidth = progutter.clientWidth;
  const seekTime = (clickPosition / containerWidth) * vid.duration;
  vid.currentTime = seekTime;
}

function keyPress(e) {
  showControls();
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  switch (e.key) {
    case " ":
      e.preventDefault();
      togglePlayPause();
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (e.ctrlKey) {
        seekVideo(-10);
      } else if (e.shiftKey) {
        prev.click();
      } else {
        seekVideo(-5);
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      if (e.ctrlKey) {
        seekVideo(10);
      } else if (e.shiftKey) {
        next.click();
      } else {
        seekVideo(5);
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      adjustVolume(0.1);
      hideVolBar();
      break;
    case "ArrowDown":
      e.preventDefault();
      adjustVolume(-0.1);
      hideVolBar();
      break;
    case 'm':
      e.preventDefault();
      vol.click();
      hideVolBar();
      break;
    case "f":
      e.preventDefault();
      toggleFullscreen(player);
      break;
    case "escape":
      e.preventDefault();
      toggleFullscreen(player);
      break;
    case "+":
      e.preventDefault();
      if (e.ctrlKey) {
        adjustSpeed(0.25);
      } else {
        adjustSpeed(0.05);
      }
      break;
    case "-":
      e.preventDefault();
      if (e.ctrlKey) {
        adjustSpeed(-0.25);
      } else {
        adjustSpeed(-0.05);
      }
      break;
    case "*":
      e.preventDefault();
      adjustSpeed(0);
      break;
    default:
      break;
  }
  hideControls();
}

document.addEventListener("keydown", keyPress);

const list = document.getElementById('list');
const vidTitle = document.getElementById('vid-title');

const selectBox = document.getElementById('select-box');
const selectFolder = document.getElementById('select-folder');
const selectVideo = document.getElementById('select-vid');


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

function setPrev(state) {
  if (state) {
    prev.classList.remove('inactive');
    prev.addEventListener('click', clickPrev);
  } else {
    prev.classList.add('inactive');
    prev.removeEventListener('click', clickPrev);
  }
}

function setNext(state) {
  if (state) {
    next.classList.remove('inactive');
    next.addEventListener('click', clickNext);
  } else {
    next.classList.add('inactive');
    next.removeEventListener('click', clickNext);
  }
}

let currentVideo = 0;

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
  if (vidData.length > 0) {
    setPrev(false);
    setNext(false);
    if (currentVideo < vidData.length - 1) {
      setNext(true);
    }
    if (currentVideo > 0) {
      setPrev(true);
    }
  } else {
    setNext(false);
    setPrev(false);
  }
}
prevNext();

function setVideo() {
  selectBox.style.display = 'none';
  vid.style.display = 'block';
  upnext.style.right = '0px';
  if (vidData.length > 0) {
    loadVideo(vidData[0]);
    currentVideo = 0;
  }
}

async function loadVidList() {
  try {
    list.innerHTML = '';

    setVideo();
    prevNext();
    document.addEventListener("keydown", keyPress);
    vidData.forEach((videoItem, index) => {
      if (!videoItem.src || !videoItem.title) return;

      const thumbBox = document.createElement('div');
      thumbBox.className = 'thumb-box';
      thumbBox.dataset.index = index;
      thumbBox.innerHTML = `<img class="thumbnail" src="assets/Null-Image.webp" alt="Loading"
                      onerror="this.onerror=null; this.src='assets/Null-Image.webp'">
                    <div class="thumb-title">${videoItem.title}</div>`;
      list.appendChild(thumbBox);
    });

    setupObserver(); // ✅ Moved outside of forEach to prevent repeated calls
  } catch (err) {
    console.error("Full error details:", err);
    console.error("Error stack:", err.stack);
    alert(`Error Loading videos: ${err.message}`);
  }
}

let observer;
//  Set up Intersection Observer
function setupObserver() {
  if (observer) {
    observer.disconnect();
  }

  const options = {
    root: null,
    rootMargin: '200px',
    threshold: 0.1
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const thumbBox = entry.target;
        const index = thumbBox.dataset.index;
        const videoItem = vidData[index];

        const thumb = thumbBox.querySelector('.thumbnail');
        thumbBox.addEventListener('click', () => {
          loadVideo(videoItem);
          currentVideo = index;
          prevNext();
        });

        const videoPath = videoItem.src;

        // ✅ Throttle thumbnail generation to avoid CPU spike
        setTimeout(() => {
          generateThumbnail(videoPath, thumbnail => {
            if (thumbnail) thumb.src = thumbnail;
            else thumb.alt = 'No thumbnail: ' + videoItem.title;
          });
        }, index * 150); // Add staggered delay based on index

        observer.unobserve(thumbBox);
      }
    });
  }, options);

  document.querySelectorAll('.thumb-box').forEach(thumbBox => {
    observer.observe(thumbBox);
  });
}

function generateThumbnail(videoPath, callback) {
  const video = document.createElement('video');
  video.src = videoPath;
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.currentTime = 1;

  video.addEventListener('loadeddata', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/jpeg');
    callback(dataURL);
    video.remove(); // ✅ Clean up created video element to prevent memory leaks
  });

  setTimeout(() => {
    callback(null);
    video.remove(); // ✅ Ensure removal even if timeout hits
  }, 4000);
}

function loadVideo(videoItem) {
  vidTitle.textContent = videoItem.title;
  vid.querySelector('source').src = videoItem.src;
  vid.querySelector('source').type = videoItem.type;
  vid.load();
  showControls();
}

vid.addEventListener('error', () => {
  console.log('MediaError:', vid.error.code, vid.error.message);
  alert("Error playing video");
});

loadVidList();