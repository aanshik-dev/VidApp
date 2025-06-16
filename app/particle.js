particlesJS("particles-js", {
  particles: {
    number: { value: 35, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.3, random: true },
    size: { value: 50, random: true },
    line_linked: { enable: false },
    move: { enable: true, speed: 1.5, direction: "none", random: true }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: 'repulse' }
    }
  }
});