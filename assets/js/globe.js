/* ==========================================================================
   ADVERTISEIQ — PREMIUM 3D GLOBE
   Three.js r128 — Vanilla JS, no build tools
   ========================================================================== */
(function () {
  'use strict';

  /* ── Wait for THREE to be available ── */
  function init() {
    if (typeof THREE === 'undefined') { setTimeout(init, 60); return; }

    const container = document.getElementById('globeCanvas');
    if (!container) return;

    /* ── Scene ── */
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    /* Create WebGL context manually so we can catch failure */
    let gl = null;
    try {
      gl = container.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'high-performance' })
        || container.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' })
        || container.getContext('experimental-webgl', { alpha: true });
    } catch (e) {}

    if (!gl) {
      /* WebGL not available — CSS fallback is already visible */
      container.style.display = 'none';
      return;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: container,
        context: gl,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
    } catch (e) {
      container.style.display = 'none';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* ── Sizing ── */
    function resize() {
      const wrap = container.parentElement;
      if (!wrap) return;
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── Colors ── */
    const C_BLUE   = 0x3b82f6;
    const C_PURPLE = 0x8b5cf6;
    const C_CYAN   = 0x06b6d4;
    const C_WHITE  = 0xffffff;

    /* ── Helpers ── */
    const GLOBE_R = 1.0;

    function latLon(lat, lon, r) {
      const phi   = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta)
      );
    }

    function lerpVec3(a, b, t) {
      return new THREE.Vector3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t
      );
    }

    /* ─────────────────────────────────────────────────────
       1. GLOBE PARTICLE SPHERE
    ───────────────────────────────────────────────────── */
    function buildGlobe() {
      const count = 3200;
      const positions = [];
      const colors    = [];
      const color     = new THREE.Color();

      for (let i = 0; i < count; i++) {
        /* Fibonacci sphere distribution */
        const phi   = Math.acos(1 - 2 * (i + 0.5) / count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const x = GLOBE_R * Math.sin(phi) * Math.cos(theta);
        const y = GLOBE_R * Math.cos(phi);
        const z = GLOBE_R * Math.sin(phi) * Math.sin(theta);

        positions.push(x, y, z);

        /* Gradient colour: blue → purple by y */
        const t = (y + 1) / 2;
        if (t < 0.35) {
          color.setHex(C_PURPLE);
        } else if (t < 0.65) {
          color.setHex(C_BLUE);
        } else {
          color.setHex(C_CYAN);
        }
        colors.push(color.r, color.g, color.b);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.022,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        sizeAttenuation: true
      });

      return new THREE.Points(geo, mat);
    }

    const globePoints = buildGlobe();
    scene.add(globePoints);

    /* ─────────────────────────────────────────────────────
       2. AI CORE — central glowing energy sphere
    ───────────────────────────────────────────────────── */
    function buildAICore() {
      const group = new THREE.Group();

      /* Inner solid core */
      const innerGeo = new THREE.SphereGeometry(0.13, 24, 24);
      const innerMat = new THREE.MeshPhongMaterial({
        color: C_PURPLE,
        emissive: new THREE.Color(0x6d28d9),
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.95
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      group.add(inner);

      /* Mid glow shell */
      const midGeo = new THREE.SphereGeometry(0.19, 24, 24);
      const midMat = new THREE.MeshBasicMaterial({
        color: C_PURPLE,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      group.add(new THREE.Mesh(midGeo, midMat));

      /* Outer glow shell */
      const outerGeo = new THREE.SphereGeometry(0.27, 24, 24);
      const outerMat = new THREE.MeshBasicMaterial({
        color: C_BLUE,
        transparent: true,
        opacity: 0.10,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      group.add(new THREE.Mesh(outerGeo, outerMat));

      /* Point light from core */
      const light = new THREE.PointLight(C_PURPLE, 1.5, 2.5);
      group.add(light);

      return { group, inner, midMat, outerMat, light };
    }

    const core = buildAICore();
    scene.add(core.group);

    /* Ambient + directional lights */
    scene.add(new THREE.AmbientLight(0x1a1a2e, 2));
    const dirLight = new THREE.DirectionalLight(C_BLUE, 0.8);
    dirLight.position.set(2, 3, 2);
    scene.add(dirLight);

    /* ─────────────────────────────────────────────────────
       3. ORBIT RINGS (Three.js Torus)
    ───────────────────────────────────────────────────── */
    function buildRing(radius, tilt, color, opacity) {
      const geo = new THREE.TorusGeometry(radius, 0.003, 8, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = tilt;
      return mesh;
    }

    const ring1 = buildRing(1.18, Math.PI / 2.2, C_BLUE,   0.35);
    const ring2 = buildRing(1.28, Math.PI / 4,   C_PURPLE, 0.22);
    const ring3 = buildRing(1.10, Math.PI / 1.6, C_CYAN,   0.15);
    scene.add(ring1, ring2, ring3);

    /* ─────────────────────────────────────────────────────
       4. ORBITING NODES
    ───────────────────────────────────────────────────── */
    const nodeGroup = new THREE.Group();
    const nodeColors = [C_BLUE, C_PURPLE, C_CYAN, C_BLUE, C_PURPLE, C_CYAN];
    const nodeSpeeds = [0.4, -0.3, 0.5, -0.45, 0.35, -0.5];
    const nodeRadii  = [1.18, 1.28, 1.10, 1.22, 1.15, 1.32];
    const nodeTilts  = [
      new THREE.Euler(Math.PI/2.2, 0, 0),
      new THREE.Euler(Math.PI/4, 0, 0),
      new THREE.Euler(Math.PI/1.6, 0, 0),
      new THREE.Euler(Math.PI/3, 0, 0.5),
      new THREE.Euler(Math.PI/2.5, 0.3, 0),
      new THREE.Euler(Math.PI/1.8, 0.2, 0)
    ];
    const nodeAngles = [0, 1.0, 2.1, 3.5, 4.8, 0.5];

    const nodeObjects = nodeTilts.map((tilt, i) => {
      const geo  = new THREE.SphereGeometry(0.018, 8, 8);
      const mat  = new THREE.MeshBasicMaterial({
        color: nodeColors[i],
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      nodeGroup.add(mesh);
      return { mesh, speed: nodeSpeeds[i], radius: nodeRadii[i], tilt, angle: nodeAngles[i] };
    });
    scene.add(nodeGroup);

    /* ─────────────────────────────────────────────────────
       5. CITY CONNECTION ARCS
    ───────────────────────────────────────────────────── */
    const cities = [
      { lat: 40.7,  lon: -74.0  },   /* New York   */
      { lat: 51.5,  lon: -0.12  },   /* London     */
      { lat: 35.7,  lon: 139.7  },   /* Tokyo      */
      { lat: -33.9, lon: 151.2  },   /* Sydney     */
      { lat: 19.1,  lon: 72.9   },   /* Mumbai     */
      { lat: 52.5,  lon: 13.4   },   /* Berlin     */
      { lat: -23.5, lon: -46.6  },   /* Sao Paulo  */
      { lat: 25.2,  lon: 55.3   },   /* Dubai      */
    ];

    const arcPairs = [
      [0, 1], [0, 4], [1, 5], [2, 3],
      [2, 7], [4, 7], [6, 0], [3, 7]
    ];

    const arcGroup = new THREE.Group();

    arcPairs.forEach(([ia, ib], idx) => {
      const a = latLon(cities[ia].lat, cities[ia].lon, GLOBE_R);
      const b = latLon(cities[ib].lat, cities[ib].lon, GLOBE_R);

      /* Mid-point lifted above surface */
      const mid = lerpVec3(a, b, 0.5).normalize().multiplyScalar(GLOBE_R * 1.38);

      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const pts   = curve.getPoints(48);

      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? C_BLUE : C_PURPLE,
        transparent: true,
        opacity: 0.40,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      arcGroup.add(new THREE.Line(geo, mat));

      /* Endpoint dot */
      [a, b].forEach(pt => {
        const dotGeo = new THREE.SphereGeometry(0.014, 6, 6);
        const dotMat = new THREE.MeshBasicMaterial({
          color: idx % 2 === 0 ? C_CYAN : C_BLUE,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pt);
        arcGroup.add(dot);
      });
    });

    scene.add(arcGroup);

    /* ─────────────────────────────────────────────────────
       6. BACKGROUND PARTICLE FIELD
    ───────────────────────────────────────────────────── */
    function buildStarField() {
      const count = 600;
      const pos   = [];
      const col   = [];
      const c     = new THREE.Color();

      for (let i = 0; i < count; i++) {
        pos.push(
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 9
        );
        const choice = Math.random();
        if      (choice < 0.4) c.setHex(C_BLUE);
        else if (choice < 0.7) c.setHex(C_PURPLE);
        else                   c.setHex(C_WHITE);
        col.push(c.r, c.g, c.b);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.Float32BufferAttribute(col, 3));

      return new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      }));
    }

    scene.add(buildStarField());

    /* ─────────────────────────────────────────────────────
       7. MOUSE PARALLAX
    ───────────────────────────────────────────────────── */
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;

    document.addEventListener('mousemove', function (e) {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX = (e.clientX - cx) / cx;
      mouseY = (e.clientY - cy) / cy;
    }, { passive: true });

    /* Touch support */
    document.addEventListener('touchmove', function (e) {
      if (!e.touches[0]) return;
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX = (e.touches[0].clientX - cx) / cx;
      mouseY = (e.touches[0].clientY - cy) / cy;
    }, { passive: true });

    /* ─────────────────────────────────────────────────────
       8. ANIMATION LOOP
    ───────────────────────────────────────────────────── */
    let lastTime = 0;
    let paused   = false;

    document.addEventListener('visibilitychange', () => {
      paused = document.hidden;
    });

    function animate(ts) {
      requestAnimationFrame(animate);
      if (paused) return;

      const t  = ts * 0.001;
      const dt = Math.min(t - lastTime, 0.05);
      lastTime = t;

      /* Globe slow auto-rotation */
      globePoints.rotation.y += 0.0018;
      arcGroup.rotation.y     = globePoints.rotation.y;

      /* AI Core pulse */
      const pulse = Math.sin(t * 1.8) * 0.5 + 0.5;
      core.inner.scale.setScalar(1 + pulse * 0.18);
      core.midMat.opacity  = 0.15 + pulse * 0.22;
      core.outerMat.opacity = 0.05 + pulse * 0.10;
      core.light.intensity  = 1.0 + pulse * 1.2;

      /* Orbit rings gentle spin */
      ring1.rotation.z += 0.0006;
      ring2.rotation.z -= 0.0004;
      ring3.rotation.z += 0.0003;

      /* Orbiting nodes */
      nodeObjects.forEach(n => {
        n.angle += n.speed * 0.008;
        const pos = new THREE.Vector3(
          n.radius * Math.cos(n.angle),
          0,
          n.radius * Math.sin(n.angle)
        );
        pos.applyEuler(n.tilt);
        n.mesh.position.copy(pos);
      });

      /* Arc pulse (opacity modulation) */
      arcGroup.children.forEach((obj, i) => {
        if (obj.type === 'Line') {
          obj.material.opacity = 0.22 + Math.sin(t * 0.8 + i * 0.9) * 0.18;
        }
      });

      /* Mouse parallax (smooth) */
      targetRotX += (mouseY * 0.25 - targetRotX) * 0.04;
      targetRotY += (mouseX * 0.35 - targetRotY) * 0.04;

      const globeGroup = globePoints;
      globeGroup.rotation.x = targetRotX;
      arcGroup.rotation.x   = targetRotX;
      ring1.rotation.y     += 0.0004;
      ring2.rotation.y     -= 0.0003;

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }

  /* Boot after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
