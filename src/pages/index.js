import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Drone3D from '../components/Drone3D';

/* ─── Real Data from Resume ───────────────────────────────────── */
const BOOT_MSGS = [
  { html: 'ETS PORTFOLIO v3.0' },
  { html: '[<span class="ok">OK</span>] Flight controller interface........... READY' },
  { html: '[<span class="ok">OK</span>] Sensor fusion pipeline................. ONLINE' },
  { html: '[<span class="ok">OK</span>] Neural inference engine................ LOADED' },
  { html: '[<span class="warn">··</span>] GPS signal............................. ACQUIRING' },
  { html: '[<span class="ok">OK</span>] Radar scanner.......................... ACTIVE' },
  { html: '[<span class="ok">OK</span>] Portfolio modules...................... INITIALIZED' },
];
const BOOT_LABELS = ['BOOT LOADER', 'HARDWARE CHECK', 'SENSOR INIT', 'AI SYSTEMS', 'GPS LINK', 'RADAR BOOT', 'LAUNCH'];

const ROLES = ['UAV Systems Engineer', 'Autonomous Flight Expert', 'Aircraft Designer', 'Aerial Robotics Researcher', 'FC Designer'];

const RADAR_PROJECTS = [
  { name: 'GPS-Denied Navigation', type: 'Isaac ROS · PX4', label: 'PRJ-01', angle: -60, dist: 0.55, rgb: '0,200,255', target: 'prj-1' },
  { name: 'Aerial Interceptor UAV', type: 'ROS 2 · C++ · Qt', label: 'PRJ-02', angle: 25, dist: 0.72, rgb: '255,184,0', target: 'prj-2' },
  { name: 'AI Object Following', type: 'YOLO · ROS 2', label: 'PRJ-03', angle: 130, dist: 0.45, rgb: '0,255,136', target: 'prj-3' },
  { name: 'ESP32 Flight Controller', type: 'KiCad · Embedded', label: 'PRJ-04', angle: -150, dist: 0.65, rgb: '255,58,58', target: 'prj-4' },
  { name: 'Custom GCS', type: 'Qt · QGC', label: 'PRJ-05', angle: 200, dist: 0.35, rgb: '180,100,255', target: 'prj-5' },
];

const CATEGORIES = {
  design: { color: '#c87eff', label: 'Design' },
  aerial: { color: '#00c8ff', label: 'Aerial Robotics' },
  ai: { color: '#ff3a3a', label: 'Perception & AI' },
  hw: { color: '#ffb800', label: 'Programming & HW' },
  sim: { color: '#00ff88', label: 'Simulation & Softwares' },
  devops: { color: '#ff6ec7', label: 'DevOps & Tools' },
};

const NODES = [
  // Design
  { id: 'fusion', label: 'Fusion 360', cat: 'design', level: 85, anchor: [0.05, 0.07] },
  { id: 'solidwks', label: 'SolidWorks', cat: 'design', level: 83, anchor: [0.16, 0.04] },
  { id: 'cad', label: 'CAD (Hub)', cat: 'design', level: 87, anchor: [0.11, 0.17] },
  { id: 'xflr5', label: 'XFLR5', cat: 'design', level: 80, anchor: [0.26, 0.04] },
  { id: 'openvsp', label: 'OpenVSP', cat: 'design', level: 78, anchor: [0.37, 0.04] },
  { id: 'ansys', label: 'Ansys', cat: 'design', level: 75, anchor: [0.25, 0.15] },
  { id: 'kicad', label: 'KiCad', cat: 'design', level: 85, anchor: [0.07, 0.30] },
  // Programming & Hardware
  { id: 'edge_dev', label: 'Edge Devices', cat: 'hw', level: 88, anchor: [0.12, 0.70] },
  { id: 'cpp', label: 'C++', cat: 'hw', level: 90, anchor: [0.20, 0.85] },
  { id: 'python', label: 'Python', cat: 'hw', level: 95, anchor: [0.30, 0.90] },
  // Aerial Robotics
  { id: 'ros2', label: 'ROS 2', cat: 'aerial', level: 95, anchor: [0.45, 0.45] },
  { id: 'px4', label: 'PX4', cat: 'aerial', level: 90, anchor: [0.32, 0.40] },
  { id: 'ardupilot', label: 'ArduPilot', cat: 'aerial', level: 85, anchor: [0.32, 0.55] },
  { id: 'gcs', label: 'QGC / MissionPlanner', cat: 'aerial', level: 90, anchor: [0.20, 0.50] },
  { id: 'mavsdk', label: 'MAVSDK', cat: 'aerial', level: 88, anchor: [0.38, 0.30] },
  { id: 'gnc', label: 'GNC Algorithms', cat: 'aerial', level: 85, anchor: [0.44, 0.62] },
  { id: 'isaac_ros', label: 'Isaac ROS', cat: 'aerial', level: 80, anchor: [0.56, 0.35] },
  // Perception & AI
  { id: 'ultralytics', label: 'Ultralytics (YOLO)', cat: 'ai', level: 90, anchor: [0.68, 0.22] },
  { id: 'pytorch_tf', label: 'PyTorch / TF', cat: 'ai', level: 85, anchor: [0.82, 0.15] },
  { id: 'opencv', label: 'OpenCV', cat: 'ai', level: 92, anchor: [0.65, 0.36] },
  { id: 'gstreamer', label: 'GStreamer', cat: 'ai', level: 78, anchor: [0.80, 0.32] },
  // Simulation & Softwares
  { id: 'matlab', label: 'MATLAB', cat: 'sim', level: 82, anchor: [0.60, 0.75] },
  { id: 'simulink', label: 'Simulink', cat: 'sim', level: 80, anchor: [0.72, 0.86] },
  { id: 'gazebo', label: 'Gazebo', cat: 'sim', level: 86, anchor: [0.56, 0.64] },
  { id: 'unreal', label: 'Unreal Engine', cat: 'sim', level: 75, anchor: [0.68, 0.96] },
  { id: 'isaac_sim', label: 'Isaac Sim', cat: 'sim', level: 78, anchor: [0.86, 0.60] },
  // DevOps & Tools
  { id: 'git', label: 'Git', cat: 'devops', level: 90, anchor: [0.42, 0.80] },
  { id: 'docker', label: 'Docker', cat: 'devops', level: 85, anchor: [0.50, 0.86] },
  { id: 'ms_tools', label: 'Microsoft Tools', cat: 'devops', level: 95, anchor: [0.46, 0.96] },
];

const EDGES = [
  // Design — CAD hub pattern
  ['fusion', 'cad'], ['solidwks', 'cad'],          // CAD tools → hub
  ['cad', 'ansys'], ['cad', 'kicad'],              // hub → analysis & PCB
  ['fusion', 'xflr5'], ['solidwks', 'xflr5'],      // connect to aerodynamic tools
  ['xflr5', 'openvsp'],                           // aero analysis chain
  ['ansys', 'xflr5'], ['ansys', 'openvsp'],        // Ansys ↔ Aircraft Design tools
  ['kicad', 'edge_dev'],
  // Hardware & Programming
  ['edge_dev', 'cpp'], ['edge_dev', 'python'], ['python', 'cpp'], ['python', 'matlab'],
  // Aerial Robotics hub (ROS 2 is the central node)
  ['ros2', 'python'], ['ros2', 'cpp'], ['ros2', 'px4'], ['ros2', 'ardupilot'],
  ['ros2', 'matlab'], ['ros2', 'simulink'], ['ros2', 'gazebo'], ['ros2', 'isaac_sim'],
  ['ros2', 'ultralytics'], ['ros2', 'isaac_ros'], ['ros2', 'mavsdk'], ['ros2', 'gnc'],
  ['ros2', 'git'], ['ros2', 'docker'],
  // Flight stacks
  ['cpp', 'px4'], ['cpp', 'ardupilot'], ['px4', 'gcs'], ['ardupilot', 'gcs'],
  ['px4', 'mavsdk'], ['ardupilot', 'mavsdk'],
  // Simulation connections (all requested)
  ['matlab', 'simulink'], ['matlab', 'px4'], ['matlab', 'gazebo'], ['matlab', 'unreal'],
  ['simulink', 'px4'], ['simulink', 'unreal'],
  ['gazebo', 'px4'], ['gazebo', 'ardupilot'],
  ['isaac_sim', 'isaac_ros'], ['isaac_sim', 'px4'],
  ['px4', 'unreal'],
  // Perception & AI
  ['isaac_ros', 'opencv'], ['isaac_ros', 'ultralytics'], ['opencv', 'ultralytics'],
  ['opencv', 'gstreamer'], ['ultralytics', 'pytorch_tf'],
  // DevOps
  ['git', 'ms_tools'], ['docker', 'ms_tools'], ['python', 'ms_tools'],
];

const PUBS = [
  {
    year: '2025 · ETAAV Conference',
    title: 'Technical Framework for Human Detection Using Multirotor Aerial Vehicle in Virtual Environment',
    venue: 'ETAAV - 2025 · Simulation-based UAV human detection framework',
    tags: ['PX4', 'Computer Vision', 'Simulation'],
    link: 'https://ieeexplore.ieee.org/document/11213339',
  },
];

const TIMELINE = [
  {
    date: 'JULY 2025 — PRESENT', role: 'Graduate Engineer Trainee', org: 'SkyTex Unmanned Aerial Solutions',
    desc: 'Developing autonomous flight stacks using PX4 and ROS 2, integrating Edge Devices for precision navigation. Avionics integration and log analysis for stability optimisation.',
    link: ''
  },
  {
    date: 'JUNE 2024 — JULY 2024', role: 'UAV Design Intern', org: 'NSIC',
    desc: 'Designed and fabricated agricultural UAV airframes, assembling heavy-lift propulsion systems. Conducted stability flight tests to validate structural integrity and performance.',
    link: 'https://drive.google.com/file/d/1Nq6soozjpGAVviwU3Kp4DhffmwYP6gET/view?usp=sharing'
  },
  {
    date: '2021 — 2025', role: 'B.Tech Aerospace Engineering', org: 'Amrita School of Engineering · CGPA 8.27',
    desc: 'GATE 2025 Qualified — All India Rank 609 (Aerospace). Core coursework in UAV dynamics, control systems, and embedded systems.',
    link: 'https://drive.google.com/file/d/1ZjvKXJc_pcTr2M3Gaa8KKTiBmK5OgzlN/view?usp=sharing'
  },
];

const PROJECTS = [
  {
    id: 'prj-1', label: 'PRJ-001 · AUTONOMOUS NAVIGATION', tag: 'AUTONOMY', tagClass: '',
    title: 'GPS-Denied Autonomous Navigation',
    desc: 'Integrated Isaac ROS Visual SLAM with PX4 to fuse visual odometry for precision position hold and drift-free state estimation in GPS-denied environments.',
    tags: ['Isaac ROS', 'PX4', 'SLAM', 'Visual Odometry', 'Embedded'],
    link: 'https://github.com/123sashank321/gz_vslam.git',
  },
  {
    id: 'prj-2', label: 'PRJ-002 · INTERCEPTOR SYSTEM', tag: 'GUIDANCE', tagClass: '',
    title: 'Aerial Interceptor UAV & Custom GCS',
    desc: 'Developed an interceptor algorithm for fixed-wing UAVs with APN guidance and PX4. Modified QGroundControl (QGC) source code to create a custom interface for real-time target interception.',
    tags: ['ROS 2', 'C++', 'Qt', 'PX4', 'QGC'],
    link: 'https://github.com/123sashank321/PX4-Autopilot.git',
  },
  {
    id: 'prj-3', label: 'PRJ-003 · VISION AI', tag: 'VISION AI', tagClass: '',
    title: 'AI-Powered Object Following Drone',
    desc: 'Developed a control loop with ROS2 and YOLO for real-time object detection and tracking by translating bounding box coordinates into velocity commands (Visual Servoing) for the PX4 flight stack.',
    tags: ['YOLO', 'ROS 2', 'Python', 'PX4', 'Visual Servoing'],
    link: 'https://github.com/123sashank321/AI-Powered-Object-Following-Drone.git',
  },
  {
    id: 'prj-4', label: 'PRJ-004 · HARDWARE DESIGN', tag: 'EMBEDDED', tagClass: '',
    title: 'ESP32 Flight Controller Design',
    desc: 'Designed and tested a custom 4-layer ESP32 flight controller. Developed the complete firmware stack including sensor fusion, stabilization and motor mixing.',
    tags: ['KiCad', 'Embedded C++', 'ESP32', 'Sensor Fusion'],
    link: 'https://github.com/123sashank321/ets_esp_drone',
  },
];

const CERTS = [
  { year: '2025', title: 'GATE 2025 Qualified', issuer: 'IIT', detail: 'All India Rank 609 — Aerospace Engineering', color: '#00c8ff', link: 'https://drive.google.com/file/d/1xXKQVuhgOKGIhnWwB5uGRPq9pJ358IuU/view?usp=sharing' },
  { year: '2025', title: 'Drone Systems and Control', issuer: 'NPTEL — IISc Bangalore', detail: 'Elite certification in UAV control theory and practice', color: '#00c8ff', link: 'https://drive.google.com/file/d/1cg3t_b3EKiOEjrKxq4zRCTFgWjC16fhR/view?usp=sharing' },
  { year: '2024', title: 'Deep Learning for Computer Vision', issuer: 'NPTEL — IIT Hyderabad', detail: 'Advanced deep learning techniques for visual perception', color: '#ff3a3a', link: '' },
  { year: '2024', title: 'Introduction to Machine Learning', issuer: 'NPTEL — IIT Madras', detail: 'Foundations of ML algorithms and applications', color: '#ff3a3a', link: '' },
  { year: '2019', title: 'NTSE Scholar', issuer: 'NCERT, Govt. of India', detail: 'National Talent Search Examination — National Merit Scholar', color: '#ffb800', link: 'https://drive.google.com/file/d/12nFuDjkCUtElz_pnk9xKbfLkHiVzQGtl/view?usp=sharing' },
];

/* ─── Radar canvas helper ─────────────────────────────────────── */
function makeRadar(canvas, size, projects, setTooltip) {
  if (!canvas) return () => { };
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2, R = size / 2 - 6;
  let sweepAngle = 0, rafId, hoveredBlip = null;
  const blips = projects.map(p => {
    const a = p.angle * Math.PI / 180, r = p.dist * R;
    return { ...p, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), glow: 0 };
  });
  const onMove = e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (size / rect.width), my = (e.clientY - rect.top) * (size / rect.height);
    hoveredBlip = null;
    blips.forEach(b => { if (Math.hypot(mx - b.x, my - b.y) < 14) hoveredBlip = b; });
    if (hoveredBlip) { canvas.style.cursor = 'pointer'; setTooltip({ show: true, x: e.clientX + 14, y: e.clientY - 10, name: hoveredBlip.name, type: hoveredBlip.type + ' — click to view' }); }
    else { canvas.style.cursor = 'crosshair'; setTooltip(t => ({ ...t, show: false })); }
  };
  const onLeave = () => { setTooltip(t => ({ ...t, show: false })); hoveredBlip = null; };
  const onClick = () => { if (hoveredBlip?.target) document.getElementById(hoveredBlip.target)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseleave', onLeave); canvas.addEventListener('click', onClick);
  function draw() {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(3,10,15,0.6)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    [0.85, 0.65, 0.43, 0.22].forEach(f => { ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(0,200,255,0.12)'; ctx.lineWidth = 1; ctx.stroke(); });
    ctx.strokeStyle = 'rgba(0,200,255,0.07)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(6, cy); ctx.lineTo(size - 6, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 6); ctx.lineTo(cx, size - 6); ctx.stroke();
    const sr = sweepAngle * Math.PI / 180;
    for (let i = 0; i < 60; i++) { const a = sr - (i * Math.PI / 180); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R - 4, a - Math.PI / 180, a + Math.PI / 180); ctx.closePath(); ctx.fillStyle = `rgba(0,200,255,${(60 - i) / 60 * 0.35})`; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + (R - 4) * Math.cos(sr), cy + (R - 4) * Math.sin(sr)); ctx.strokeStyle = 'rgba(0,200,255,0.85)'; ctx.lineWidth = 1.5; ctx.stroke();
    blips.forEach(b => {
      const bA = (Math.atan2(b.y - cy, b.x - cx) * 180 / Math.PI + 360) % 360;
      if ((sweepAngle - bA + 360) % 360 < 3) b.glow = 1.0;
      if (b.glow > 0) b.glow = Math.max(0, b.glow - 0.008);
      const isH = hoveredBlip === b, r = isH ? 7 : 4 + b.glow * 3;
      if (b.glow > 0.1 || isH) { const gr = ctx.createRadialGradient(b.x, b.y, r, b.x, b.y, r + 10 + b.glow * 10); gr.addColorStop(0, `rgba(${b.rgb},${b.glow * 0.5 + (isH ? 0.3 : 0)})`); gr.addColorStop(1, `rgba(${b.rgb},0)`); ctx.beginPath(); ctx.arc(b.x, b.y, r + 10 + b.glow * 10, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill(); }
      ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${b.rgb},${0.5 + b.glow * 0.5})`; ctx.fill();
      if (b.glow > 0.3 || isH) { ctx.fillStyle = `rgba(${b.rgb},${Math.min(1, b.glow + (isH ? 0.9 : 0))})`; ctx.font = `${size < 200 ? 6 : 7}px 'Share Tech Mono',monospace`; ctx.textAlign = 'left'; ctx.fillText(b.label, b.x + r + 4, b.y + 3); }
    });
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fillStyle = '#ffb800'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(0,200,255,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();
    sweepAngle = (sweepAngle + 0.8) % 360; rafId = requestAnimationFrame(draw);
  }
  draw();
  return () => { cancelAnimationFrame(rafId); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); canvas.removeEventListener('click', onClick); };
}

export default function Home() {
  const cursorRef = useRef(null);
  const propFR = useRef(null), propBR = useRef(null), propFL = useRef(null), propBL = useRef(null);
  const radarHeroRef = useRef(null);
  const radarContactRef = useRef(null);
  const techCanvasRef = useRef(null);
  const particleRef = useRef(null);
  const scrollBarRef = useRef(null);
  const bootRef = useRef(null);

  const [radarTip, setRadarTip] = useState({ show: false, x: 0, y: 0, name: '', type: '' });
  const [techTip, setTechTip] = useState({ show: false, x: 0, y: 0, name: '', cat: '', level: '', catColor: '#00c8ff' });
  const [twRole, setTwRole] = useState('');

  /* Boot */
  useEffect(() => {
    const boot = bootRef.current; if (!boot) return;
    const lines = boot.querySelector('.boot-lines');
    const fill = boot.querySelector('.boot-bar-fill');
    const pct = boot.querySelector('#bootPct');
    const lbl = boot.querySelector('#bootBarLabel');
    let bi = 0, p = 0;
    function step() {
      if (bi >= BOOT_MSGS.length) { const t = setInterval(() => { p = Math.min(100, p + 3); fill.style.width = p + '%'; pct.textContent = p + '%'; if (p >= 100) { clearInterval(t); setTimeout(() => boot.classList.add('done'), 400); } }, 20); return; }
      const d = document.createElement('div'); d.className = 'boot-line'; d.innerHTML = BOOT_MSGS[bi].html; lines.appendChild(d); requestAnimationFrame(() => d.classList.add('show'));
      lbl.textContent = BOOT_LABELS[bi] || 'LOADING';
      const tp = Math.round(((bi + 1) / BOOT_MSGS.length) * 90);
      const fi = setInterval(() => { p = Math.min(tp, p + 2); fill.style.width = p + '%'; pct.textContent = p + '%'; if (p >= tp) clearInterval(fi); }, 18);
      bi++; setTimeout(step, 260);
    }
    setTimeout(step, 200);
  }, []);

  /* Cursor */
  useEffect(() => {
    const dot = cursorRef.current; if (!dot) return;
    const mv = e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; };
    document.addEventListener('mousemove', mv);
    return () => document.removeEventListener('mousemove', mv);
  }, []);

  /* Scroll bar */
  useEffect(() => {
    const bar = scrollBarRef.current; if (!bar) return;
    const fn = () => { const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100; bar.style.width = p + '%'; };
    window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Particles */
  useEffect(() => {
    const canvas = particleRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const pts = Array.from({ length: 60 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.4 + 0.1, type: Math.random() > 0.7 ? 'cross' : 'dot' }));
    let rafId;
    function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height); pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.globalAlpha = p.a; ctx.strokeStyle = '#00c8ff'; ctx.lineWidth = 0.5; if (p.type === 'cross') { const s = p.r * 2.5; ctx.beginPath(); ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s); ctx.stroke(); } else { ctx.fillStyle = '#00c8ff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); } }); ctx.globalAlpha = 1; rafId = requestAnimationFrame(draw); }
    draw(); return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
  }, []);

  /* Propellers */
  useEffect(() => {
    const cfg = { fr: { ref: propFR, a: 0, s: 18 }, br: { ref: propBR, a: 45, s: -18 }, fl: { ref: propFL, a: 22, s: -20 }, bl: { ref: propBL, a: 67, s: 20 } };
    let rafId;
    function anim() { Object.values(cfg).forEach(p => { p.a = (p.a + p.s * 0.05) % 360; if (p.ref.current) p.ref.current.style.transform = `rotate(${p.a}deg)`; }); rafId = requestAnimationFrame(anim); }
    rafId = requestAnimationFrame(anim); return () => cancelAnimationFrame(rafId);
  }, []);

  /* Typewriter */
  useEffect(() => {
    let rIdx = 0, cIdx = 0, del = false, tid;
    function step() { const cur = ROLES[rIdx]; if (!del) { setTwRole(cur.slice(0, ++cIdx)); if (cIdx === cur.length) { del = true; tid = setTimeout(step, 2200); return; } tid = setTimeout(step, 65); } else { setTwRole(cur.slice(0, --cIdx)); if (cIdx === 0) { del = false; rIdx = (rIdx + 1) % ROLES.length; tid = setTimeout(step, 400); return; } tid = setTimeout(step, 35); } }
    const t = setTimeout(step, 2000); return () => { clearTimeout(t); clearTimeout(tid); };
  }, []);

  /* Radars */
  useEffect(() => makeRadar(radarHeroRef.current, 220, RADAR_PROJECTS, setRadarTip), []);
  useEffect(() => makeRadar(radarContactRef.current, 280, RADAR_PROJECTS, setRadarTip), []);

  /* Tech graph */
  useEffect(() => {
    const canvas = techCanvasRef.current; if (!canvas) return;
    function resize() { const w = canvas.parentElement?.clientWidth || 800; canvas.width = w; canvas.height = 520; }
    resize(); window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    let frame = 0, hovNode = null, rafId, pos = [];
    function layout() { const W = canvas.width, H = canvas.height; pos = NODES.map(n => ({ ...n, x: n.anchor[0] * W, y: n.anchor[1] * H, r: 6 + n.level * 0.08, pulse: Math.random() * Math.PI * 2 })); }
    layout(); window.addEventListener('resize', layout);
    function drawTech() {
      const W = canvas.width, H = canvas.height; ctx.clearRect(0, 0, W, H); frame++;
      ctx.strokeStyle = 'rgba(0,200,255,0.025)'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const zones = [
        { label: 'DESIGN', x: 0.03, y: 0.06, cat: 'design' },
        { label: 'PROG & HW', x: 0.03, y: 0.96, cat: 'hw' },
        { label: 'AERIAL ROBOTICS', x: 0.38, y: 0.28, cat: 'aerial' },
        { label: 'PERCEPTION & AI', x: 0.72, y: 0.08, cat: 'ai' },
        { label: 'SIMULATION', x: 0.70, y: 0.96, cat: 'sim' },
        { label: 'DEVOPS', x: 0.40, y: 0.96, cat: 'devops' },
      ];
      zones.forEach(z => { ctx.font = '9px "Share Tech Mono",monospace'; ctx.textAlign = 'left'; ctx.fillStyle = CATEGORIES[z.cat].color + '40'; ctx.fillText(z.label, z.x * W, z.y * H); });
      const conn = new Set(); if (hovNode) { conn.add(hovNode.id); EDGES.forEach(([a, b]) => { if (a === hovNode.id) conn.add(b); if (b === hovNode.id) conn.add(a); }); }
      EDGES.forEach(([aId, bId]) => { const a = pos.find(n => n.id === aId), b = pos.find(n => n.id === bId); if (!a || !b) return; const iH = hovNode && conn.has(aId) && conn.has(bId), iFade = hovNode && !iH; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); if (iH) { ctx.strokeStyle = 'rgba(0,200,255,0.6)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.lineDashOffset = -(frame * 0.5); } else { ctx.strokeStyle = iFade ? 'rgba(0,200,255,0.03)' : 'rgba(0,200,255,0.11)'; ctx.lineWidth = 1; ctx.setLineDash([]); } ctx.stroke(); ctx.setLineDash([]); if (iH) { const t = (Math.sin(frame * 0.04) * 0.5 + 0.5); const mx = a.x + (b.x - a.x) * t, my = a.y + (b.y - a.y) * t; ctx.beginPath(); ctx.arc(mx, my, 2, 0, Math.PI * 2); ctx.fillStyle = '#00c8ff'; ctx.fill(); } });
      pos.forEach(n => { n.pulse += 0.025; const cat = CATEGORIES[n.cat], col = cat.color; const isH = hovNode?.id === n.id, isCon = hovNode && conn.has(n.id) && !isH, isFade = hovNode && !conn.has(n.id); const ps = isH ? n.r * 1.4 : n.r + Math.sin(n.pulse) * 0.8; ctx.globalAlpha = isFade ? 0.2 : 1; const gR = ps + (isH ? 14 : 6); const grd = ctx.createRadialGradient(n.x, n.y, ps, n.x, n.y, gR); grd.addColorStop(0, col + (isH ? '60' : '22')); grd.addColorStop(1, col + '00'); ctx.beginPath(); ctx.arc(n.x, n.y, gR, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x, n.y, ps, 0, Math.PI * 2); ctx.fillStyle = isH ? col + 'cc' : (isCon ? col + '55' : '#060f18'); ctx.fill(); ctx.strokeStyle = col + (isFade ? '33' : 'cc'); ctx.lineWidth = isH ? 2 : 1; ctx.stroke(); ctx.beginPath(); ctx.arc(n.x, n.y, ps * (n.level / 100), 0, Math.PI * 2); ctx.fillStyle = col + (isFade ? '15' : (isH ? '55' : '22')); ctx.fill(); if (!isFade) { ctx.font = `${isH ? 11 : 9.5}px "Share Tech Mono",monospace`; ctx.textAlign = 'center'; ctx.fillStyle = isH ? col : col + 'bb'; ctx.fillText(n.label, n.x, n.y + ps + 13); } if (isH) { ctx.font = '8px "Share Tech Mono",monospace'; ctx.fillStyle = col + 'cc'; ctx.fillText(n.level + '%', n.x, n.y + 4); } ctx.globalAlpha = 1; });
      rafId = requestAnimationFrame(drawTech);
    }
    drawTech();
    const onMove = e => { const rect = canvas.getBoundingClientRect(), sx = canvas.width / rect.width, sy = canvas.height / rect.height; const mx = (e.clientX - rect.left) * sx, my = (e.clientY - rect.top) * sy; hovNode = null; pos.forEach(n => { if (Math.hypot(mx - n.x, my - n.y) < n.r + 10) hovNode = n; }); if (hovNode) { canvas.style.cursor = 'pointer'; const bars = '█'.repeat(Math.round(hovNode.level / 10)) + '░'.repeat(10 - Math.round(hovNode.level / 10)); setTechTip({ show: true, x: e.clientX + 14, y: e.clientY - 10, name: hovNode.label, cat: CATEGORIES[hovNode.cat].label, level: bars + ' ' + hovNode.level + '%', catColor: CATEGORIES[hovNode.cat].color }); } else { canvas.style.cursor = 'crosshair'; setTechTip(t => ({ ...t, show: false })); } };
    const onLeave = () => { setTechTip(t => ({ ...t, show: false })); hovNode = null; };
    canvas.addEventListener('mousemove', onMove); canvas.addEventListener('mouseleave', onLeave);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); window.removeEventListener('resize', layout); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <Layout title="ETS Portfolio — Sashank Erukala" description="Aerospace Engineer · UAV Systems · Embedded AI · ROS 2 · PX4" noFooter>

      {/* Boot */}
      <div className="boot-screen" ref={bootRef}>
        <div className="boot-logo-text">DRONE OPS</div>
        <div className="boot-lines" />
        <div className="boot-bar-wrap">
          <div className="boot-bar-label"><span id="bootBarLabel">INITIALIZING</span><span id="bootPct">0%</span></div>
          <div className="boot-bar"><div className="boot-bar-fill" /></div>
        </div>
      </div>

      <div className="scroll-bar" ref={scrollBarRef} />
      <div className="grid-bg" aria-hidden="true" />
      <canvas className="particle-canvas" ref={particleRef} aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="cursor-dot" ref={cursorRef} aria-hidden="true" />

      {radarTip.show && <div className="radar-tooltip" style={{ left: radarTip.x, top: radarTip.y }} aria-hidden="true">{radarTip.name}<div className="radar-tooltip-type">{radarTip.type}</div></div>}
      {techTip.show && <div className="tech-tooltip" style={{ left: techTip.x, top: techTip.y }} aria-hidden="true"><div className="tech-tooltip-name">{techTip.name}</div><div className="tech-tooltip-cat">{techTip.cat}</div><div className="tech-tooltip-level" style={{ color: techTip.catColor }}>{techTip.level}</div></div>}

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-label">Aerial Robotics Portfolio</div>
          <h1 className="hero-name">Sashank<span className="hero-name-line2">Erukala</span></h1>
          <div className="hero-roles-wrap"><span style={{ color: 'var(--muted)' }}>{'// '}</span><span className="typewriter-role">{twRole}</span></div>
          <p className="hero-desc">Aerospace Engineer &amp; Graduate Trainee with a strong foundation in UAV dynamics and control systems. GATE 2025 Qualified (Rank 609). Proficient in ROS 2, PX4, Isaac ROS, and Embedded Systems — building autonomous systems that fly.</p>
          <div className="hero-cta">
            <a href="#projects" className="btn-hud">View Projects</a>
            <a href="#contact" className="btn-hud btn-hud-amber">Get In Touch</a>
            <a href="/ets_portfolio/Resume_1.pdf" download className="btn-hud btn-hud-ghost">↓ Download CV</a>
          </div>
        </div>
        <div className="hero-right">
          {/* 3D Drone Three.js Canvas */}
          <Drone3D />
          <div className="radar-interactive-wrap"><canvas ref={radarHeroRef} className="radar-canvas" /></div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-row">
        <div className="stats-grid">
          {[{ n: '609', l: 'GATE 2025 AIR' }, { n: '3+', l: 'Years UAV Experience' }, { n: '1', l: 'Publication' }, { n: '4', l: 'Major Projects' }].map(s => (
            <div key={s.l} className="stat-cell"><span className="stat-num">{s.n}</span><span className="stat-label">{s.l}</span></div>
          ))}
        </div>
      </div>
      <div className="pg-divider" style={{ marginTop: 0 }} />

      {/* ── PROJECTS ── */}
      <section id="projects" className="pg-section">
        <div className="section-label">// 001 — PROJECTS</div>
        <h2 className="section-title">Active Missions</h2>
        <div className="projects-grid">
          {/* Featured PRJ-1 */}
          <div className="project-card-featured" id="prj-1">
            <div className="card-visual card-visual-featured">
              <div className="hud-corner hud-tl" /><div className="hud-corner hud-tr" /><div className="hud-corner hud-bl" /><div className="hud-corner hud-br" />
              {/* GPS-Denied SLAM Navigation */}
              <svg viewBox="0 0 420 240" width="100%" fill="none" style={{ maxWidth: 420 }}>
                <defs>
                  <radialGradient id="slamGlow" cx="55%" cy="50%" r="40%">
                    <stop offset="0%" stopColor="rgba(0,200,255,0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                {/* Background map region */}
                <rect x="0" y="0" width="420" height="240" fill="url(#slamGlow)" />
                {/* Grid dots - SLAM map points */}
                {[[40, 60], [80, 50], [120, 65], [155, 45], [190, 55], [230, 40], [265, 58], [300, 42], [340, 52], [370, 38],
                [50, 90], [90, 80], [130, 95], [170, 75], [210, 85], [250, 70], [290, 88], [330, 72], [360, 82],
                [60, 120], [100, 110], [140, 125], [175, 105], [215, 115], [255, 100], [295, 118], [335, 102],
                [70, 150], [110, 140], [150, 155], [185, 135], [225, 145], [265, 130], [305, 148],
                [80, 180], [120, 170], [160, 185], [195, 165], [235, 175], [275, 160]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 2.5 : 1.5} fill="#00c8ff" opacity={i % 5 === 0 ? 0.6 : 0.25} />
                ))}
                {/* Drone path trajectory */}
                <polyline points="30,190 65,170 110,155 155,135 195,118 240,100 280,82 320,65 370,48"
                  stroke="#00ff88" strokeWidth="2" strokeDasharray="6 3" opacity="0.8" />
                {/* VIO keyframe connectors */}
                {[[65, 170], [155, 135], [240, 100], [320, 65]].map(([x, y], i) => (
                  <g key={i}>
                    <rect x={x - 8} y={y - 8} width="16" height="16" stroke="#00c8ff" strokeWidth="1" fill="rgba(0,200,255,0.1)" rx="1" />
                    <line x1={x} y1={y - 8} x2={x} y2={y - 16} stroke="#00c8ff" strokeWidth="0.8" opacity="0.5" />
                  </g>
                ))}
                {/* Current drone position */}
                <circle cx="320" cy="65" r="10" stroke="#00ff88" strokeWidth="2" fill="rgba(0,255,136,0.1)">
                  <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="320" cy="65" r="4" fill="#00ff88" />
                {/* GPS denied cross */}
                <g transform="translate(360,195)">
                  <circle cx="0" cy="0" r="16" stroke="#ff3a3a" strokeWidth="1.5" fill="rgba(255,58,58,0.06)" />
                  <text x="0" y="4" fontFamily="Share Tech Mono" fontSize="9" fill="#ff3a3a" textAnchor="middle" opacity="0.9">GPS</text>
                  <line x1="-11" y1="-11" x2="11" y2="11" stroke="#ff3a3a" strokeWidth="2" />
                </g>
                {/* HUD labels */}
                <text x="8" y="14" fontFamily="Share Tech Mono" fontSize="7.5" fill="#00c8ff" opacity="0.7">VSLAM ACTIVE  ·  VIO LOCK</text>
                <text x="8" y="26" fontFamily="Share Tech Mono" fontSize="7" fill="#ffb800" opacity="0.6">DRIFT: 0.03m  ·  KF: 147  ·  POSE CONFIDENCE: HIGH</text>
                {/* Axis */}
                <line x1="14" y1="220" x2="14" y2="175" stroke="#00c8ff" strokeWidth="1" opacity="0.4" />
                <line x1="14" y1="220" x2="59" y2="220" stroke="#00c8ff" strokeWidth="1" opacity="0.4" />
                <text x="16" y="170" fontFamily="Share Tech Mono" fontSize="6" fill="#00c8ff" opacity="0.4">Y</text>
                <text x="62" y="222" fontFamily="Share Tech Mono" fontSize="6" fill="#00c8ff" opacity="0.4">X</text>
              </svg>
              <div className="card-tag">FEATURED</div>
            </div>
            <div className="card-body"><div className="card-id">PRJ-001 · AUTONOMOUS NAVIGATION</div><div className="card-title">GPS-Denied Autonomous Navigation</div><div className="card-desc">Integrated Isaac ROS Visual SLAM with PX4 to fuse visual odometry for precision position hold and drift-free state estimation in GPS-denied environments.</div></div>
            <div className="card-footer-tags">
              {['Isaac ROS', 'PX4', 'SLAM', 'Visual Odometry', 'Embedded'].map(t => <span key={t} className="tech-tag">{t}</span>)}
              <a href="https://github.com/123sashank321/GPS-Denied-Autonomous-Navigation.git" target="_blank" rel="noopener noreferrer" className="tech-tag card-github-link">↗ GitHub</a>
            </div>
          </div>

          {/* PRJ-2 */}
          <div className="project-card" id="prj-2">
            <div className="card-visual" style={{ background: 'radial-gradient(ellipse at center,rgba(255,184,0,0.08) 0%,transparent 70%)' }}>
              <div className="hud-corner hud-tl" /><div className="hud-corner hud-tr" />
              {/* Aerial Interceptor - Fixed-wing with APN pursuit */}
              <svg viewBox="0 0 200 140" width="200" fill="none">
                {/* Radar rings */}
                <circle cx="100" cy="70" r="55" stroke="#ffb800" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.25" />
                <circle cx="100" cy="70" r="35" stroke="#ffb800" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.2" />
                <circle cx="100" cy="70" r="15" stroke="#ffb800" strokeWidth="0.8" opacity="0.15" />
                {/* APN pursuit curve from interceptor to target */}
                <path d="M30,110 Q60,40 148,32" stroke="#ffb800" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.8" />
                {/* Target (red blip + crosshair) */}
                <circle cx="148" cy="32" r="6" fill="rgba(255,58,58,0.15)" stroke="#ff3a3a" strokeWidth="1.2">
                  <animate attributeName="r" values="6;10;6" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <line x1="140" y1="32" x2="156" y2="32" stroke="#ff3a3a" strokeWidth="0.8" opacity="0.8" />
                <line x1="148" y1="24" x2="148" y2="40" stroke="#ff3a3a" strokeWidth="0.8" opacity="0.8" />
                {/* Fixed-wing interceptor silhouette */}
                <g transform="translate(30,108) rotate(-35)">
                  {/* Fuselage */}
                  <ellipse cx="0" cy="0" rx="14" ry="3" fill="#0a2030" stroke="#ffb800" strokeWidth="1" />
                  {/* Wings */}
                  <polygon points="-4,-2 -4,2 -20,8 -20,4" fill="#0a2030" stroke="#ffb800" strokeWidth="0.8" />
                  <polygon points="-4,-2 -4,2 8,8 8,4" fill="#0a2030" stroke="#ffb800" strokeWidth="0.8" />
                  {/* Tail */}
                  <polygon points="-12,-1 -12,1 -18,-5 -17,-6" fill="#ffb800" opacity="0.6" />
                </g>
                {/* Velocity vector */}
                <line x1="38" y1="96" x2="55" y2="76" stroke="#00c8ff" strokeWidth="1" opacity="0.6" />
                <polygon points="55,76 49,78 51,84" fill="#00c8ff" opacity="0.6" />
                {/* GCS mini window */}
                <rect x="4" y="4" width="48" height="30" rx="2" stroke="#00c8ff" strokeWidth="0.8" fill="rgba(0,200,255,0.05)" />
                <text x="8" y="13" fontFamily="Share Tech Mono" fontSize="5" fill="#00c8ff" opacity="0.7">GCS · LIVE</text>
                <polyline points="6,28 12,22 18,25 24,18 30,20 36,14 42,16 48,10" stroke="#00ff88" strokeWidth="0.8" opacity="0.7" />
                <text x="5" y="130" fontFamily="Share Tech Mono" fontSize="6.5" fill="#ffb800" opacity="0.7">APN GUIDANCE · INTERCEPT T-4s</text>
              </svg>
              <div className="card-tag">GUIDANCE</div>
            </div>
            <div className="card-body"><div className="card-id">PRJ-002 · INTERCEPTOR SYSTEM</div><div className="card-title">Aerial Interceptor UAV &amp; Custom GCS</div><div className="card-desc">Interceptor algorithm for fixed-wing UAVs with APN guidance and PX4. Modified QGroundControl source code for real-time target interception interface.</div></div>
            <div className="card-footer-tags">
              {['ROS 2', 'C++', 'Qt', 'PX4', 'QGC'].map(t => <span key={t} className="tech-tag">{t}</span>)}
              <a href="https://github.com/123sashank321/PX4-Autopilot.git" target="_blank" rel="noopener noreferrer" className="tech-tag card-github-link">↗ GitHub</a>
            </div>
          </div>

          {/* PRJ-3 */}
          <div className="project-card" id="prj-3">
            <div className="card-visual"><div className="hud-corner hud-tl" /><div className="hud-corner hud-tr" />
              {/* AI Object Following - YOLO detection + visual servoing */}
              <svg viewBox="0 0 200 140" width="200" fill="none">
                {/* Camera frame border */}
                <rect x="5" y="5" width="190" height="130" rx="2" stroke="#00c8ff" strokeWidth="1" fill="rgba(0,200,255,0.02)" />
                {/* Scanlines */}
                {[20, 35, 50, 65, 80, 95, 110, 125].map(y => (
                  <line key={y} x1="5" y1={y} x2="195" y2={y} stroke="#00c8ff" strokeWidth="0.3" opacity="0.08" />
                ))}
                {/* Person silhouette (simplified) */}
                <ellipse cx="100" cy="42" rx="10" ry="12" fill="rgba(0,200,255,0.12)" stroke="#00c8ff" strokeWidth="0.8" opacity="0.7" />
                <path d="M84,55 Q84,80 88,100 L90,115 M116,55 Q116,80 112,100 L110,115" stroke="#00c8ff" strokeWidth="1.2" opacity="0.5" fill="none" />
                <path d="M84,60 L116,60 L116,90 L84,90 Z" fill="rgba(0,200,255,0.08)" stroke="#00c8ff" strokeWidth="0.8" opacity="0.6" />
                <path d="M90,90 L88,115 M110,90 L112,115" stroke="#00c8ff" strokeWidth="1" opacity="0.5" />
                {/* YOLO bounding box */}
                <rect x="76" y="28" width="48" height="92" rx="2" stroke="#ffb800" strokeWidth="1.5" fill="none" opacity="0.9" />
                {/* Corner markers */}
                <path d="M76,38 L76,28 L86,28" stroke="#ffb800" strokeWidth="2.5" opacity="1" />
                <path d="M114,28 L124,28 L124,38" stroke="#ffb800" strokeWidth="2.5" opacity="1" />
                <path d="M76,110 L76,120 L86,120" stroke="#ffb800" strokeWidth="2.5" opacity="1" />
                <path d="M124,110 L124,120 L114,120" stroke="#ffb800" strokeWidth="2.5" opacity="1" />
                {/* YOLO class label */}
                <rect x="76" y="18" width="48" height="11" fill="#ffb800" rx="1" />
                <text x="100" y="27" fontFamily="Share Tech Mono" fontSize="7" fill="#030a0f" textAnchor="middle" fontWeight="bold">PERSON 94%</text>
                {/* Velocity arrow */}
                <line x1="100" y1="75" x2="140" y2="75" stroke="#00ff88" strokeWidth="1.5" opacity="0.8" />
                <polygon points="140,75 133,71 133,79" fill="#00ff88" opacity="0.8" />
                <text x="141" y="72" fontFamily="Share Tech Mono" fontSize="5.5" fill="#00ff88" opacity="0.7">Vx</text>
                {/* Bottom status */}
                <text x="10" y="133" fontFamily="Share Tech Mono" fontSize="6" fill="#00c8ff" opacity="0.6">TRACKING: LOCKED  ·  FPS: 28  ·  VISUAL SERVOING: ON</text>
              </svg>
              <div className="card-tag">VISION AI</div>
            </div>
            <div className="card-body"><div className="card-id">PRJ-003 · VISUAL SERVOING</div><div className="card-title">AI-Powered Object Following Drone</div><div className="card-desc">Control loop with ROS2 and YOLO for real-time object detection — translating bounding-box coordinates into velocity commands (visual servoing) for PX4.</div></div>
            <div className="card-footer-tags">
              {['YOLO', 'ROS 2', 'Python', 'PX4', 'Visual Servoing'].map(t => <span key={t} className="tech-tag">{t}</span>)}
              <a href="https://github.com/123sashank321/AI-Powered-Object-Following-Drone.git" target="_blank" rel="noopener noreferrer" className="tech-tag card-github-link">↗ GitHub</a>
            </div>
          </div>

          {/* PRJ-4 */}
          <div className="project-card" id="prj-4">
            <div className="card-visual" style={{ background: 'radial-gradient(ellipse at center,rgba(255,184,0,0.06) 0%,transparent 70%)' }}><div className="hud-corner hud-tl" /><div className="hud-corner hud-tr" />
              {/* ESP32 Flight Controller PCB */}
              <svg viewBox="0 0 200 140" width="200" fill="none">
                {/* PCB outline */}
                <rect x="10" y="8" width="180" height="124" rx="4" stroke="#ffb800" strokeWidth="1.5" fill="rgba(255,184,0,0.03)" />
                {/* Layer indicator lines (4-layer) */}
                <rect x="10" y="8" width="180" height="124" rx="4" stroke="rgba(0,200,255,0.1)" strokeWidth="3" fill="none" />
                {/* ESP32 chip */}
                <rect x="72" y="42" width="56" height="40" rx="2" stroke="#00c8ff" strokeWidth="1.2" fill="rgba(0,200,255,0.08)" />
                <text x="100" y="60" fontFamily="Share Tech Mono" fontSize="7.5" fill="#00c8ff" textAnchor="middle" opacity="0.9">ESP32</text>
                <text x="100" y="72" fontFamily="Share Tech Mono" fontSize="5.5" fill="#00c8ff" textAnchor="middle" opacity="0.6">240MHz · WIFI</text>
                {/* ESP32 pins */}
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <g key={i}>
                    <rect x={72 - 8} y={44 + i * 5} width="6" height="3" fill="#ffb800" opacity="0.7" rx="0.5" />
                    <rect x={128 + 2} y={44 + i * 5} width="6" height="3" fill="#ffb800" opacity="0.7" rx="0.5" />
                  </g>
                ))}
                {/* Motor output pads (4 corners) */}
                {[[18, 18, 'M1'], [162, 18, 'M2'], [18, 104, 'M3'], [162, 104, 'M4']].map(([x, y, l]) => (
                  <g key={l}>
                    <rect x={x} y={y} width="20" height="16" rx="2" stroke="#ff3a3a" strokeWidth="1" fill="rgba(255,58,58,0.08)" />
                    <text x={x + 10} y={y + 10} fontFamily="Share Tech Mono" fontSize="6" fill="#ff3a3a" textAnchor="middle" opacity="0.8">{l}</text>
                  </g>
                ))}
                {/* PCB traces */}
                <polyline points="28,26 28,42 72,42" stroke="#00c8ff" strokeWidth="0.8" opacity="0.4" />
                <polyline points="172,26 172,42 128,42" stroke="#00c8ff" strokeWidth="0.8" opacity="0.4" />
                <polyline points="28,112 28,82 72,82" stroke="#00c8ff" strokeWidth="0.8" opacity="0.4" />
                <polyline points="172,112 172,82 128,82" stroke="#00c8ff" strokeWidth="0.8" opacity="0.4" />
                {/* IMU chip */}
                <rect x="16" y="56" width="28" height="22" rx="2" stroke="#00ff88" strokeWidth="1" fill="rgba(0,255,136,0.06)" />
                <text x="30" y="66" fontFamily="Share Tech Mono" fontSize="5" fill="#00ff88" textAnchor="middle" opacity="0.8">IMU</text>
                <text x="30" y="74" fontFamily="Share Tech Mono" fontSize="4.5" fill="#00ff88" textAnchor="middle" opacity="0.6">MPU6050</text>
                {/* Capacitors */}
                {[[152, 56], [152, 70], [152, 84]].map(([x, y], i) => (
                  <g key={i}>
                    <line x1={x} y1={y} x2={x + 12} y2={y} stroke="#ffb800" strokeWidth="0.8" opacity="0.5" />
                    <line x1={x + 5} y1={y - 4} x2={x + 5} y2={y + 4} stroke="#ffb800" strokeWidth="1.5" opacity="0.6" />
                    <line x1={x + 7} y1={y - 4} x2={x + 7} y2={y + 4} stroke="#ffb800" strokeWidth="1.5" opacity="0.6" />
                  </g>
                ))}
                <text x="12" y="134" fontFamily="Share Tech Mono" fontSize="6" fill="#ffb800" opacity="0.7">4-LAYER PCB  ·  ESP32  ·  CUSTOM FIRMWARE</text>
              </svg>
              <div className="card-tag">EMBEDDED</div>
            </div>
            <div className="card-body"><div className="card-id">PRJ-004 · HARDWARE DESIGN</div><div className="card-title">ESP32 Flight Controller Design</div><div className="card-desc">Designed and tested a custom 4-layer ESP32 flight controller with complete firmware stack — sensor fusion, stabilization and motor mixing.</div></div>
            <div className="card-footer-tags">
              {['KiCad', 'Embedded C++', 'ESP32', 'Sensor Fusion'].map(t => <span key={t} className="tech-tag">{t}</span>)}
              <a href="https://github.com/123sashank321/ets_esp_drone" target="_blank" rel="noopener noreferrer" className="tech-tag card-github-link">↗ GitHub</a>
            </div>
          </div>
        </div>
      </section>
      <div className="pg-divider" />

      {/* ── TECH GRAPH ── */}
      <section id="skills" className="pg-section">
        <div className="section-label">// 002 — SYSTEMS</div>
        <h2 className="section-title">Technical Stack</h2>
        <div className="tech-legend">{Object.entries(CATEGORIES).map(([k, c]) => <div key={k} className="legend-item"><div className="legend-dot" style={{ background: c.color }} />{c.label}</div>)}</div>
        <canvas ref={techCanvasRef} className="tech-canvas" />
        <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.15em', marginTop: '3.5rem', textAlign: 'center' }}>HOVER NODES TO INSPECT · CONNECTIONS SHOW DEPENDENCIES</p>
      </section>
      <div className="pg-divider" />

      {/* ── PUBLICATIONS ── */}
      <section id="pubs" className="pg-section">
        <div className="section-label">// 003 — RESEARCH</div>
        <h2 className="section-title">Publications</h2>
        <div className="pub-grid">
          {PUBS.map((p, i) => (
            <a key={i} className="pub-card" href={p.link || undefined} target={p.link ? '_blank' : undefined} rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
              <div className="pub-year">{p.year}{p.link && <span style={{ marginLeft: '0.6rem', fontSize: '0.55rem', color: 'var(--cyan)', letterSpacing: '0.1em', opacity: 0.8 }}>↗ IEEE XPLORE</span>}</div>
              <div className="pub-title">{p.title}</div>
              <div className="pub-venue">{p.venue}</div>
              <div className="pub-tags">{p.tags.map(t => <span key={t} className="pub-tag">{t}</span>)}</div>
            </a>
          ))}
        </div>
      </section>
      <div className="pg-divider" />

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="pg-section">
        <div className="section-label">// 004 — FLIGHT LOG</div>
        <h2 className="section-title">Experience</h2>
        <div className="timeline">
          {TIMELINE.map(item => (
            <div key={item.date} className="timeline-item">
              <div className="timeline-date">{item.date}</div>
              <div className="timeline-role">{item.role}</div>
              <div className="timeline-org">{item.org}</div>
              {item.desc && <div className="timeline-desc">{item.desc}</div>}
              {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="timeline-cert-link">↗ View Certificate</a>}
            </div>
          ))}
        </div>
      </section>
      <div className="pg-divider" />

      {/* ── CERTIFICATIONS & ACHIEVEMENTS ── */}
      <section id="certs" className="pg-section">
        <div className="section-label">// 005 — ACHIEVEMENTS</div>
        <h2 className="section-title">Certifications &amp; Achievements</h2>
        <div className="certs-grid">
          {CERTS.map((c, i) => {
            const inner = (
              <>
                <div className="cert-year" style={{ color: c.color }}>{c.year}{c.link && <span style={{ marginLeft: '0.5rem', fontSize: '0.5rem', opacity: 0.7 }}>↗</span>}</div>
                <div className="cert-title">{c.title}</div>
                <div className="cert-issuer">{c.issuer}</div>
                <div className="cert-detail">{c.detail}</div>
                <div className="cert-bar-wrap"><div className="cert-bar" style={{ background: c.color + '33' }}><div className="cert-bar-fill" style={{ background: c.color }} /></div></div>
              </>
            );
            return c.link
              ? <a key={i} className="cert-card" href={c.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{inner}</a>
              : <div key={i} className="cert-card">{inner}</div>;
          })}
        </div>
      </section>
      <div className="pg-divider" />

      {/* ── CONTACT ── */}
      <section id="contact" className="pg-section">
        <div className="section-label">// 006 — CONTACT</div>
        <h2 className="section-title">Establish Link</h2>
        <div className="contact-panel">
          <div>
            <p className="contact-intro">Open to collaboration, research opportunities, and exciting UAV/robotics projects. Based in Anantpur, India — operating everywhere above it.</p>
            {[
              {
                href: 'mailto:erukalasashank9@gmail.com',
                icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="#00c8ff" strokeWidth="1.5" />
                  <path d="M2 7l10 7 10-7" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>,
                label: 'erukalasashank9@gmail.com'
              },
              {
                href: 'https://github.com/123sashank321',
                icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="#c8e8f0">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>,
                label: 'github.com/123sashank321'
              },
              {
                href: 'https://linkedin.com/in/sashank-sasi',
                icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="#0A66C2">
                  <rect width="24" height="24" rx="4" fill="#0A66C2" />
                  <path d="M7.5 9.5h-3v9h3v-9zm-1.5-1a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm12.5 1c-1.6 0-2.7.8-3 1.6V9.5h-3v9h3v-4.5c0-1.4.8-2 1.8-2s1.7.6 1.7 2V18.5h3V14c0-2.7-1.5-4.5-3.5-4.5z" fill="white" />
                </svg>,
                label: 'linkedin.com/in/sashank-sasi'
              },
              {
                href: 'tel:+919391193177',
                icon: <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                label: '+91 93911 93177'
              },
            ].map(l => (
              <a key={l.label} href={l.href} className="contact-link"><div className="link-icon link-icon-lg">{l.icon}</div>{l.label}</a>
            ))}
          </div>
          <div className="contact-right">
            <canvas ref={radarContactRef} className="radar-canvas" style={{ opacity: 0.85 }} />
            <div className="contact-right-label">LINK ESTABLISHED</div>
          </div>
        </div>
      </section>

      <footer className="pg-footer">
        <span className="footer-cyan">SASHANK ERUKALA</span>&nbsp;·&nbsp;AEROSPACE ENGINEER · UAV SYSTEMS&nbsp;·&nbsp;ETS PORTFOLIO&nbsp;·&nbsp;{new Date().getFullYear()}
      </footer>
    </Layout>
  );
}
