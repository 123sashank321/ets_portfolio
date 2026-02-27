import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Drone3D() {
    const mountRef = useRef(null);
    const [tiltDeg, setTiltDeg] = useState(0);
    const [tiltMode, setTiltMode] = useState('HOVER');
    const [tiltColor, setTiltColor] = useState('var(--green)');

    useEffect(() => {
        if (!mountRef.current) return;
        const wrap = mountRef.current;

        let W = wrap.clientWidth || 520;
        let H = wrap.clientHeight || 380;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);
        wrap.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
        // Position camera to look at the drone from front right top
        camera.position.set(-4.5, 3.5, -5.5);
        camera.lookAt(0, -0.2, 0.5);

        const M = (c, o) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: o });
        const MC = M(0x00c8ff, 0.92); // Cyan Main
        const MCD = M(0x00c8ff, 0.38); // Cyan Dim
        const MCF = M(0x00c8ff, 0.16); // Cyan Faint
        const MA = M(0xffb800, 0.90); // Amber
        const MAD = M(0xffb800, 0.38); // Amber Dim
        const MW = M(0xffffff, 0.85); // White
        const MG = M(0x00ff88, 0.10); // Green grid

        const L = (pts, mat) => {
            const g = new THREE.BufferGeometry().setFromPoints(pts);
            return new THREE.Line(g, mat);
        };

        const ellipseXZ = (rx, rz, n, y = 0) => {
            const pts = [];
            for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * rx, y, Math.sin(a) * rz)); }
            return pts;
        };

        const ringXY = (rx, ry, n, z, yOffset = 0) => {
            const pts = [];
            for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * rx, Math.sin(a) * ry + yOffset, z)); }
            return pts;
        };

        const drone = new THREE.Group();
        scene.add(drone);

        // 1. Sleek Fuselage (Blended into wings)
        (() => {
            const profile = [
                // z, rx, ry, yo
                [-2.2, 0.05, 0.03, -0.05],
                [-1.8, 0.25, 0.15, 0.00],
                [-1.2, 0.45, 0.25, 0.10],
                [-0.6, 0.60, 0.30, 0.12],
                [0.0, 0.65, 0.28, 0.10],
                [0.6, 0.50, 0.20, 0.06],
                [1.2, 0.25, 0.12, 0.00],
                [1.6, 0.10, 0.08, -0.02],
            ];
            const N = 16;
            const rings = profile.map(([z, rx, ry, yo]) => {
                const pts = ringXY(rx, ry, N, z, yo);
                drone.add(L(pts, MCD));
                return pts;
            });
            for (let i = 0; i < N; i += 2) {
                const pts = rings.map(r => r[i]);
                drone.add(L(pts, i === 0 || i === N / 2 ? MC : MCD));
            }
            drone.add(L(rings.map(r => r[N / 4]), MC));
            drone.add(L(rings.map(r => r[3 * N / 4]), MC));

            // Pitot tubes on nose - removed as requested
        })();

        // 2. Swept Wings with Winglets
        (() => {
            const buildWing = (s) => {
                const sts = [
                    // x, z_le, z_te, y
                    [0.60 * s, -0.5, 0.6, 0.05],
                    [1.30 * s, -0.2, 0.7, 0.05],
                    [2.00 * s, 0.1, 0.8, 0.07],
                    [2.80 * s, 0.4, 0.9, 0.10],
                ];
                // LE, TE
                drone.add(L(sts.map(st => new THREE.Vector3(st[0], st[3], st[1])), MC));
                drone.add(L(sts.map(st => new THREE.Vector3(st[0], st[3], st[2])), MC));
                // Ribs
                sts.forEach(st => {
                    drone.add(L([new THREE.Vector3(st[0], st[3], st[1]), new THREE.Vector3(st[0], st[3], st[2])], MCD));
                });

                // Winglet
                const tip = sts[sts.length - 1];
                const wingletPts = [
                    new THREE.Vector3(tip[0], tip[3], tip[1]),
                    new THREE.Vector3(tip[0] + 0.05 * s, tip[3] + 0.45, tip[1] + 0.2),
                    new THREE.Vector3(tip[0] + 0.05 * s, tip[3] + 0.45, tip[2] - 0.05),
                    new THREE.Vector3(tip[0], tip[3], tip[2])
                ];
                drone.add(L(wingletPts, MC));
                drone.add(L([wingletPts[1], wingletPts[2]], MC));
            };
            buildWing(1); buildWing(-1);
        })();

        // 3. VTOL Booms & Front Tilt Motors
        let propFL, propFR;
        // The tilt groups hold both the mount and propeller so they can pivot together
        let tiltFL, tiltFR;

        (() => {
            const buildBoom = (s) => {
                const x = 1.35 * s; // Mid wing
                const zRear = 0.5; // End at wing trailing edge
                const zFront = -1.2; // Extend forward

                // Boom structure (square-ish)
                drone.add(L([new THREE.Vector3(x - 0.05, 0.05, zRear), new THREE.Vector3(x - 0.05, 0.05, zFront)], MC));
                drone.add(L([new THREE.Vector3(x + 0.05, 0.05, zRear), new THREE.Vector3(x + 0.05, 0.05, zFront)], MC));
                drone.add(L([new THREE.Vector3(x, 0.1, zRear), new THREE.Vector3(x, 0.1, zFront)], MCD));
                drone.add(L([new THREE.Vector3(x - 0.05, 0.05, zFront), new THREE.Vector3(x + 0.05, 0.05, zFront)], MC));
                drone.add(L([new THREE.Vector3(x - 0.05, 0.05, zRear), new THREE.Vector3(x + 0.05, 0.05, zRear)], MC));

                const tiltGrp = new THREE.Group();
                tiltGrp.position.set(x, 0.05, zFront + 0.1);

                // Motor Mount
                const mountPts = ellipseXZ(0.08, 0.08, 12, 0); // y=0 relative to tiltGrp
                drone.add(tiltGrp);

                tiltGrp.add(L(mountPts, MA));
                tiltGrp.add(L([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.10, 0)], MA));

                // Propeller
                const propGrp = new THREE.Group();
                propGrp.position.set(0, 0.11, 0);
                const discPts = ellipseXZ(0.40, 0.40, 24, 0);
                propGrp.add(L(discPts, MAD));
                propGrp.add(L([new THREE.Vector3(-0.40, 0, 0), new THREE.Vector3(0.40, 0, 0)], MA));
                propGrp.add(L([new THREE.Vector3(0, 0, -0.40), new THREE.Vector3(0, 0, 0.40)], MA));
                tiltGrp.add(propGrp);

                return { prop: propGrp, tilt: tiltGrp };
            };
            const left = buildBoom(-1); propFL = left.prop; tiltFL = left.tilt;
            const right = buildBoom(1); propFR = right.prop; tiltFR = right.tilt;
        })();

        // 4. Tailboom and V-Tail
        (() => {
            // Carbon Tailboom
            drone.add(L([new THREE.Vector3(0, 0.05, 1.4), new THREE.Vector3(0, 0.05, 4.2)], MC));
            drone.add(L([new THREE.Vector3(-0.02, 0.03, 1.4), new THREE.Vector3(-0.02, 0.03, 4.2)], MCD));
            drone.add(L([new THREE.Vector3(0.02, 0.03, 1.4), new THREE.Vector3(0.02, 0.03, 4.2)], MCD));

            // V-Tail at end of carbon boom
            [-1, 1].forEach(s => {
                const vPts = [
                    new THREE.Vector3(0, 0.05, 3.8),
                    new THREE.Vector3(s * 0.7, 0.6, 4.1),
                    new THREE.Vector3(s * 0.7, 0.6, 4.4),
                    new THREE.Vector3(0, 0.05, 4.15),
                    new THREE.Vector3(0, 0.05, 3.8)
                ];
                drone.add(L(vPts, MC));
                drone.add(L([new THREE.Vector3(s * 0.35, 0.3, 3.9), new THREE.Vector3(s * 0.35, 0.3, 4.25)], MCD));
            });
        })();

        // 5. Rear VTOL Motor (on Tailboom)
        let propR;
        (() => {
            const zR = 3.6; // Right in front of V-tail
            const mountPts = ellipseXZ(0.08, 0.08, 12, 0.12);
            mountPts.forEach(p => { p.z += zR; });
            drone.add(L(mountPts, MA));
            drone.add(L([new THREE.Vector3(0, 0.05, zR), new THREE.Vector3(0, 0.20, zR)], MA));

            propR = new THREE.Group();
            propR.position.set(0, 0.20, zR);
            const discPts = ellipseXZ(0.40, 0.40, 24, 0);
            propR.add(L(discPts, MAD));
            propR.add(L([new THREE.Vector3(-0.40, 0, 0), new THREE.Vector3(0.40, 0, 0)], MA));
            propR.add(L([new THREE.Vector3(0, 0, -0.40), new THREE.Vector3(0, 0, 0.40)], MA));
            drone.add(propR);
        })();

        // 6. Removed Center Pusher (As per request to have only one rear VTOL motor)


        // 7. Ground Plane Grid
        (() => {
            const gy = -1.6;
            for (let z = -3.5; z <= 5.5; z += 1.0) { drone.add(L([new THREE.Vector3(-4.0, gy, z), new THREE.Vector3(4.0, gy, z)], MG)); }
            for (let x = -4.0; x <= 4.0; x += 1.0) { drone.add(L([new THREE.Vector3(x, gy, -3.5), new THREE.Vector3(x, gy, 5.5)], MG)); }

            drone.add(L(ellipseXZ(2.5, 2.5, 48, gy), M(0x00c8ff, 0.3)));
            drone.add(L(ellipseXZ(1.0, 1.0, 24, gy), M(0xffb800, 0.4)));
            drone.add(L([new THREE.Vector3(0, gy, 0)], M(0x00c8ff, 0.5)));
        })();

        // Animation Loop
        let flightPhase = 'hover';
        let pStart = performance.now();

        let vtolSpd = 0.4, fwdSpd = 0.02;
        let smoothVtol = 100, smoothFwd = 0;

        let lastT = performance.now(), simTime = 0;
        let animId;

        const animate = (ts) => {
            animId = requestAnimationFrame(animate);
            const dt = Math.min(ts - lastT, 50); lastT = ts;
            simTime += dt * 0.001;

            // Simple bobbing and rotating to view the whole drone
            drone.position.y = Math.sin(simTime * 1.5) * 0.08;
            drone.rotation.y = Math.sin(simTime * 0.3) * 0.25;
            drone.rotation.z = Math.sin(simTime * 0.5) * 0.04;

            // Phase logic (Hover -> Transition -> Cruise -> Transition)
            const el = ts - pStart;
            if (flightPhase === 'hover' && el > 3500) { flightPhase = 'transition_fwd'; pStart = ts; }
            else if (flightPhase === 'transition_fwd' && el > 2500) { flightPhase = 'cruise'; pStart = ts; }
            else if (flightPhase === 'cruise' && el > 4000) { flightPhase = 'transition_hov'; pStart = ts; }
            else if (flightPhase === 'transition_hov' && el > 2500) { flightPhase = 'hover'; pStart = ts; }

            // Target speeds and tilt angle
            let tVtol = 0, tFwd = 0;
            let targetTilt = 0; // 0 = straight up (hover), -Math.PI/2 = full forward (cruise)

            if (flightPhase === 'hover') {
                tVtol = 0.45; tFwd = 0.0; targetTilt = 0;
            } else if (flightPhase === 'cruise') {
                // In cruise, front tilts forward completely, rear stops entirely
                tVtol = 0.02; tFwd = 0.45; targetTilt = -Math.PI / 2;
            } else if (flightPhase === 'transition_fwd') {
                const p = el / 2500;
                tVtol = 0.45 * (1 - p) + 0.02;
                tFwd = 0.45 * p + 0.02;
                targetTilt = (-Math.PI / 2) * p;
            } else if (flightPhase === 'transition_hov') {
                const p = el / 2500;
                tVtol = 0.45 * p + 0.02;
                tFwd = 0.45 * (1 - p) + 0.02;
                targetTilt = (-Math.PI / 2) * (1 - p);
            }

            vtolSpd += (tVtol - vtolSpd) * 0.1;
            fwdSpd += (tFwd - fwdSpd) * 0.1;

            // Smoothly update tilt
            tiltFL.rotation.x += (targetTilt - tiltFL.rotation.x) * 0.1;
            tiltFR.rotation.x += (targetTilt - tiltFR.rotation.x) * 0.1;

            // Apply rotations based on tilt logic
            // Front props speed combines hovering duty + fwd thrust duty
            const frontSpd = (vtolSpd + fwdSpd) * (dt / 16.67);
            const rearSpd = vtolSpd * (dt / 16.67);

            propFL.rotation.y += frontSpd;
            propFR.rotation.y -= frontSpd;
            propR.rotation.y += rearSpd;

            // Update React UI state (throttled)
            if (Math.random() < 0.1) {
                smoothVtol = Math.round((vtolSpd / 0.45) * 100);
                smoothFwd = Math.round((fwdSpd / 0.45) * 100);

                const mmap = { hover: 'VTOL HOVER', transition_fwd: 'TRANSITION', cruise: 'FWD CRUISE', transition_hov: 'TRANSITION' };
                const cmap = { hover: 'var(--amber)', transition_fwd: 'var(--cyan)', cruise: 'var(--green)', transition_hov: 'var(--cyan)' };

                setTiltDeg(`VTOL:${Math.min(smoothVtol, 100)}% PUSH:${Math.min(smoothFwd, 100)}%`);
                setTiltMode(mmap[flightPhase]);
                setTiltColor(cmap[flightPhase]);
            }

            renderer.render(scene, camera);
        };
        animId = requestAnimationFrame(animate);

        const onResize = () => {
            const W2 = wrap.clientWidth;
            if (W2 > 0) {
                renderer.setSize(W2, H);
                camera.aspect = W2 / H;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animId);
            if (renderer) renderer.dispose();
            wrap.innerHTML = ''; // Cleanup dom element
        };
    }, []);

    return (
        <div className="drone-3d-wrap" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', opacity: 1, animation: 'fadeUp 1s ease forwards' }} ref={mountRef}>
            <div className="hud-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.12em' }}>
                <div className="hud-badge" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: 'rgba(3, 10, 15, 0.88)', border: '1px solid var(--border)', color: 'var(--cyan)', padding: '0.2rem 0.8rem', fontSize: '0.58rem', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
                    MODE: <span style={{ color: tiltColor }}>{tiltMode}</span> · {tiltDeg}
                </div>
                <div className="hud-tl" style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--green)', lineHeight: 1.8, opacity: 0.85 }}>
                    SYS.OP.NOMINAL<br />LINK: SECURE<br /><span style={{ color: 'var(--amber)' }}>PWR: 86% / 64.2V</span>
                </div>
                <div className="hud-tr" style={{ position: 'absolute', top: '10px', right: '12px', color: 'var(--cyan)', lineHeight: 1.8, textAlign: 'right', opacity: 0.85 }}>
                    STALLION v2.4<br />ALT: 1,402 ASL<br /><span style={{ color: tiltColor }}>MODE: {tiltMode}</span>
                </div>
                <div className="hud-bl" style={{ position: 'absolute', bottom: '12px', left: '12px', color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.55rem', opacity: 0.6 }}>
                    X: +42.441<br />Y: -18.201<br />Z: +64.992
                </div>
                <div className="hud-br" style={{ position: 'absolute', bottom: '12px', right: '12px', color: 'var(--amber)', lineHeight: 1.8, textAlign: 'right', fontSize: '0.6rem' }}>
                    <span>{tiltDeg}</span><br />GPS: LOCK
                </div>
            </div>
        </div>
    );
}
