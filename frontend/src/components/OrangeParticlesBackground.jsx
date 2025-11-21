import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// Centralized particles options object. Edit values here and they will be used
// by the Particles component below.
const orangeParticlesConfig = {
  // make canvas background transparent so it doesn't cover page content
  background: { color: "transparent" },
  fpsLimit: 60,
  // particles: {
  //   number: { value: 60, density: { enable: true, value_area: 800 } },
  //   color: { value: ["#003366", "#2E8B57", "#D4AF37"] }, // navy, emerald, gold
  //   shape: { type: "circle" },
  //   opacity: { value: 0.7, random: false, anim: { enable: false } },
  //   size: { value: 3, random: true },
  //   links: { enable: true, distance: 150, color: "#2E8B57", opacity: 0.4, width: 1 },
  //   move: { enable: true, speed: 1, direction: "none", random: false, straight: false, out_modes: { default: "out" } }
  // },
  interactivity: {
    detectsOn: "canvas",
    events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { repulse: { distance: 100, duration: 0.4 }, push: { quantity: 6 } }
  },
  detectRetina: true
};

const OrangeParticlesBackground = () => {
  const particlesInit = useCallback(async (main) => {
    await loadFull(main);
  }, []);

  return (
    // place the particles canvas behind page content
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Particles id="orange-particles-bg" init={particlesInit} options={orangeParticlesConfig} />
    </div>
  );

};

export default OrangeParticlesBackground;
