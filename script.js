// Scene setup
const container = document.getElementById("scene-container");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Cube
const colors = [0x00ff88, 0xff6b35, 0x4287f5, 0xff1744, 0x9c27b0, 0xffeb3b];
let currentColor = 0;

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshPhysicalMaterial({ color: colors[currentColor], metalness: 0.7, roughness: 0.1 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Lights
scene.add(new THREE.AmbientLight(0x404040, 0.4));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(colors[currentColor], 2, 100);
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(3000);
for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 20;
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: colors[currentColor], size: 0.02, opacity: 0.6, transparent: true });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Controls
let isRotating = true;

// Botón pausar / reanudar rotación
document.getElementById("toggleRotation").addEventListener("click", () => {
  isRotating = !isRotating;
  document.getElementById("toggleRotation").textContent = isRotating ? "⏸ Pausar" : "▶ Reanudar";
});

// Botón cambiar color
document.getElementById("changeColor").addEventListener("click", () => {
  currentColor = (currentColor + 1) % colors.length;
  cube.material.color.setHex(colors[currentColor]);
  pointLight.color.setHex(colors[currentColor]);
  particles.material.color.setHex(colors[currentColor]);
});

// Mouse move orbit
window.addEventListener("mousemove", (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  camera.position.x = mouseX * 2;
  camera.position.y = mouseY * 2;
  camera.lookAt(0, 0, 0);
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (isRotating) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  const time = Date.now() * 0.001;
  cube.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
  pointLight.intensity = 1.5 + Math.sin(time * 3) * 0.5;
  particles.rotation.y += 0.0005;

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
