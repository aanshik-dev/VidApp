particlesJS("particles-js", {
  particles: {
    number: { value: 30, density: { enable: true, value_area: 900 } },
    color: { value: ["#8b00ff", "#ff6ef7", "#c77dff"] },
    shape: { type: "circle" },
    opacity: { value: 0.25, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05 } },
    size: { value: 60, random: true, anim: { enable: true, speed: 1, size_min: 10 } },
    line_linked: { enable: false },
    move: { enable: true, speed: 0.8, direction: "none", random: true, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "bubble" },
      resize: true
    },
    modes: {
      bubble: { distance: 200, size: 80, duration: 2, opacity: 0.4 }
    }
  },
  retina_detect: true
});