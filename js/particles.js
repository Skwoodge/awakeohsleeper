/**
 * Green Ember Particle System — Three.js
 * "Hope Burns Brightest in the Dark"
 * Floating embers rise like fireflies / sparks of hope
 */

let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let isMobile = window.innerWidth < 768;

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Scene setup
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !isMobile
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle texture - soft circle
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 32;
  textureCanvas.height = 32;
  const ctx = textureCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(233, 240, 11, 1)');
  gradient.addColorStop(0.2, 'rgba(175, 215, 52, 0.8)');
  gradient.addColorStop(0.5, 'rgba(129, 163, 65, 0.4)');
  gradient.addColorStop(1, 'rgba(129, 163, 65, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(textureCanvas);

  // Particle count based on screen size
  const count = isMobile ? 120 : 240;

  // Geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities = new Float32Array(count);
  const drifts = new Float32Array(count * 2); // x and z drift
  const opacities = new Float32Array(count);
  const bornAt = new Float32Array(count);

  const now = performance.now();

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;     // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z

    sizes[i] = 0.15 + Math.random() * 0.35;
    velocities[i] = 0.2 + Math.random() * 0.4;
    drifts[i * 2] = (Math.random() - 0.5) * 0.3;
    drifts[i * 2 + 1] = (Math.random() - 0.5) * 0.3;
    opacities[i] = 0.3 + Math.random() * 0.7;

    // Stagger birth times
    bornAt[i] = now + Math.random() * 3000;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

  // Material
  const material = new THREE.PointsMaterial({
    size: 0.5,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.8,
    color: new THREE.Color('#e9f00b'),
    sizeAttenuation: true
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Store particle data for animation
  particleSystem = {
    count,
    positions,
    sizes,
    velocities,
    drifts,
    opacities,
    bornAt,
    now
  };

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const positions = particles.geometry.attributes.position.array;
  const count = particleSystem.count;

  // Subtle camera movement based on mouse
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
  camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.01;
  camera.lookAt(0, 0, 0);

  // Update each particle
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Rise upward
    positions[i3 + 1] += particleSystem.velocities[i] * 0.02;

    // Horizontal drift (sinusoidal)
    positions[i3] += Math.sin(now * 0.001 + i) * 0.005;
    positions[i3 + 2] += Math.cos(now * 0.001 + i * 0.7) * 0.005;

    // Reset when too high
    if (positions[i3 + 1] > 20) {
      positions[i3 + 1] = -15 - Math.random() * 5;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }

    // Glow pulse based on time
    const pulse = 0.6 + 0.4 * Math.sin(now * 0.001 * 0.5 + i * 2.3);
    particles.material.opacity = 0.5 + 0.3 * pulse;
  }

  particles.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.getElementById('particle-canvas')) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initParticles();
  } else {
    document.addEventListener('DOMContentLoaded', initParticles);
  }
}
