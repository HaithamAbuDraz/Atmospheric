// particles.js - Canvas Animations

import { getWeatherCondition } from './utils.js';

let particles = [];
let particleAnimationId = null;
let canvas = null;
let ctx = null;
let PARTICLE_COUNT = 60;
let lastWeatherId = 800; // store last weather condition for resize

export function initParticles(canvasElement, particleCount = 60) {
  canvas = canvasElement;
  ctx = canvas.getContext('2d');
  PARTICLE_COUNT = particleCount;
  resizeCanvas();
}

export function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  // Regenerate particles on resize to match new dimensions
  if (lastWeatherId) {
    updateParticles(lastWeatherId);
  }
}

export function updateParticles(weatherId) {
  if (!canvas || !ctx) return;

  // Start animation if not running
  if (!particleAnimationId) {
    animateParticles();
  }

  const condition = getWeatherCondition(weatherId);
  lastWeatherId = weatherId; // store for resize
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 2.5,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7,
      type: condition,
      wind: (Math.random() - 0.5) * 1.5,
      wobble: Math.random() * Math.PI * 2,
    });
  }
}

export function animateParticles() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    if (p.type === 'Rain' || p.type === 'Drizzle' || p.type === 'Thunderstorm') {
      ctx.strokeStyle = `rgba(180,210,240,${p.opacity})`;
      ctx.lineWidth = p.size * 0.5;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.wind * 2, p.y + p.size * 6);
      ctx.stroke();
      p.y += p.speed * 3;
      p.x += p.wind;
    } else if (p.type === 'Snow') {
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.speed * 1.2;
      p.x += Math.sin(p.wobble + p.y * 0.02) * 0.8;
    } else if (p.type === 'Clouds' || p.type === 'Mist') {
      ctx.fillStyle = `rgba(200,210,225,${p.opacity * 0.5})`;
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.wind * 0.6;
      p.y += (Math.random() - 0.5) * 0.3;
    } else {
      ctx.fillStyle = `rgba(255,255,255,${p.opacity * 0.4})`;
      ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed * 0.4;
      p.x += Math.sin(p.wobble + Date.now() * 0.001) * 0.5;
    }

    // Reset if out of bounds
    if (p.y > canvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
    if (p.x > canvas.width + 20) p.x = -20;
    if (p.x < -20) p.x = canvas.width + 20;
    if (p.y < -30 && p.type === 'Clear') p.y = canvas.height + 20;
  });

  particleAnimationId = requestAnimationFrame(animateParticles);
}

export function cleanupParticles() {
  if (particleAnimationId) {
    cancelAnimationFrame(particleAnimationId);
    particleAnimationId = null;
  }
}

export function startParticles() {
  if (!particleAnimationId) {
    animateParticles();
  }
}