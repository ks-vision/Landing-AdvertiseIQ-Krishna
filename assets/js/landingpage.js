/* ── Theme flag — read once at load time, never reloaded ── */
const IS_LIGHT = document.documentElement.getAttribute('data-theme') === 'light';

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020205, 0.002);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 800;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
if (!IS_LIGHT) renderer.setClearColor(0x020205, 1);
container.appendChild(renderer.domElement);

// ----------------------------------------------------
// POST PROCESSING: High-end UnrealBloomPass
// ----------------------------------------------------
const renderScene = new THREE.RenderPass(scene, camera);

// Resolution, strength, radius, threshold
const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.strength = IS_LIGHT ? 0 : 2.4; // 0 in light mode (no bloom), 2.4 in dark
bloomPass.radius = 0.45;
bloomPass.threshold = 0.05;

const composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// ----------------------------------------------------
// GLOBE GENERATION (Map-Based Network)
// ----------------------------------------------------
const radius = 180;

let originalPositions;
let pointGeometry;
let pointMaterial;
let actualParticleCount = 0;
let netMat;
let netLines;
let darkColorsBuffer = null;
let lightColorsBuffer = null;

const globeGroup = new THREE.Group();
globeGroup.position.x = 180;
scene.add(globeGroup);

// Ambient glow behind the earth
const glowGeo = new THREE.PlaneGeometry(600, 600);
const glowMat = new THREE.ShaderMaterial({
    uniforms: {
        glowColor: { value: new THREE.Color(IS_LIGHT ? 0x1e3a8a : 0x000015) },
        opacity: { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
            float dist = distance(vUv, vec2(0.5));
            float alpha = smoothstep(0.5, 0.0, dist) * 0.15 * opacity;
            gl_FragColor = vec4(glowColor, alpha);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const atmosphericGlow = new THREE.Mesh(glowGeo, glowMat);
atmosphericGlow.position.set(250, 0, -50);
scene.add(atmosphericGlow);

function initGlobe(imgData, imgWidth, imgHeight) {
    const maxParticles = 120000;
    const tempPositions = [];
    const tempOriginalPos = [];
    const tempTargetPos = [];
    const tempPhases = [];
    const tempSizes = [];
    const tempColors = [];
    const tempLightColors = [];
    const tempIsOcean = [];

    const colorWhite = new THREE.Color(0xffffff);
    const colorLightBlue = new THREE.Color(0x44aaff);
    const colorBlue = new THREE.Color(0x0044ff);
    const colorDeepBlue = new THREE.Color(0x000033);
    // Light-mode: dark navy so particles show clearly on white bg
    const colorLightAll = new THREE.Color(0x020617);

    for (let i = 0; i < maxParticles; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        let u_img = (u + 0.25) % 1.0;
        const tx = Math.floor(u_img * imgWidth);
        const ty = Math.floor((phi / Math.PI) * imgHeight);

        const index = (ty * imgWidth + tx) * 4;
        const rColor = imgData.data[index];

        let isLand = rColor < 128;

        const r = radius + (Math.random() * 8 - 4);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);

        let keep = false;
        if (isLand) {
            keep = true;
        } else {
            if (Math.random() < 0.25) {
                keep = true;
            }
        }

        if (keep) {
            tempPositions.push(x, y, z);
            tempOriginalPos.push(x, y, z);
            tempPhases.push(Math.random() * Math.PI * 2);
            tempIsOcean.push(isLand ? 0.0 : 1.0);

            let mixColor = new THREE.Color();
            const rand = Math.random();
            if (rand > 0.95) {
                mixColor.copy(colorWhite);
            } else if (rand > 0.75) {
                mixColor.lerpColors(colorBlue, colorLightBlue, Math.random());
            } else {
                mixColor.lerpColors(colorDeepBlue, colorBlue, Math.random());
            }
            tempColors.push(mixColor.r, mixColor.g, mixColor.b);
            tempLightColors.push(colorLightAll.r, colorLightAll.g, colorLightAll.b);

            if (isLand) {
                tempSizes.push(Math.random() * 2.5 + 1.0);
            } else {
                tempSizes.push(Math.random() * 2.0 + 1.0);
            }

            actualParticleCount++;
        }
    }

    const rocketPositions = new Float32Array(actualParticleCount * 3);
    const rocketCustomColors = new Float32Array(actualParticleCount * 3);

    for (let i = 0; i < actualParticleCount; i++) {
        let x, y, z;
        let rVal = Math.random();

        let hNorm = Math.pow(Math.random(), 1.2);
        let loops = 3.0;
        let totalTheta = loops * Math.PI * 2;
        let theta = hNorm * totalTheta;

        let radius = 3.2 - hNorm * 2.8;

        let ribbonW;
        let ribbonH = (Math.random() - 0.5) * 0.15;

        if (hNorm < 0.90) {
            ribbonW = (Math.random() - 0.5) * 1.8;
        } else {
            let arrowFactor = (hNorm - 0.90) / 0.10;
            let arrowWidth = (1.0 - arrowFactor) * 3.0;
            ribbonW = (Math.random() - 0.5) * arrowWidth;
            ribbonH = (Math.random() - 0.5) * 0.3;
        }

        let px = Math.cos(theta) * (radius + ribbonW);
        let py = -2.5 + hNorm * 5.0 + ribbonH;
        let pz = Math.sin(theta) * (radius + ribbonW);

        let tiltX = Math.PI / 6;
        let yRot = py * Math.cos(tiltX) - pz * Math.sin(tiltX);
        let zRot = py * Math.sin(tiltX) + pz * Math.cos(tiltX);

        x = px;
        y = yRot;
        z = zRot;

        let depthFactor = (Math.sin(theta) + 1.0) / 2.0;
        let zDim = 0.2 + depthFactor * 0.8;

        let c_light = [0.1, 0.8, 1.0];
        let c_dark = [0.0, 0.2, 0.8];

        let mixH = hNorm;
        rocketCustomColors[i * 3] = (c_dark[0] + (c_light[0] - c_dark[0]) * mixH) * zDim;
        rocketCustomColors[i * 3 + 1] = (c_dark[1] + (c_light[1] - c_dark[1]) * mixH) * zDim;
        rocketCustomColors[i * 3 + 2] = (c_dark[2] + (c_light[2] - c_dark[2]) * mixH) * zDim;

        const scale = 32;
        rocketPositions[i * 3] = x * scale;
        rocketPositions[i * 3 + 1] = y * scale;
        rocketPositions[i * 3 + 2] = z * scale;
    }

    const positions = new Float32Array(tempPositions);
    originalPositions = new Float32Array(tempOriginalPos);
    const targetPositions = new Float32Array(tempTargetPos);
    const phases = new Float32Array(tempPhases);
    const sizes = new Float32Array(tempSizes);
    const isOceanArr = new Float32Array(tempIsOcean);

    darkColorsBuffer = new Float32Array(tempColors);
    lightColorsBuffer = new Float32Array(tempLightColors);
    const colors = IS_LIGHT ? lightColorsBuffer : darkColorsBuffer;

    pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('rocketPosition', new THREE.BufferAttribute(rocketPositions, 3));
    pointGeometry.setAttribute('rocketColorAttr', new THREE.BufferAttribute(rocketCustomColors, 3));
    pointGeometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(), 3));
    pointGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    pointGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    pointGeometry.setAttribute('isOcean', new THREE.BufferAttribute(isOceanArr, 1));

    // Neural Network Connection Lines
    const netGeo = new THREE.BufferGeometry();
    const netPts = [];
    const netCols = [];
    const maxPoints = Math.min(300, actualParticleCount);
    for (let i = 0; i < maxPoints; i++) {
        const idx1 = Math.floor(Math.random() * actualParticleCount);
        let idx2 = Math.floor(Math.random() * actualParticleCount);
        for (let attempt = 0; attempt < 5; attempt++) {
            let tempIdx = Math.floor(Math.random() * actualParticleCount);
            let dx = tempTargetPos[idx1 * 3] - tempTargetPos[tempIdx * 3];
            let dy = tempTargetPos[idx1 * 3 + 1] - tempTargetPos[tempIdx * 3 + 1];
            let dz = tempTargetPos[idx1 * 3 + 2] - tempTargetPos[tempIdx * 3 + 2];
            if (dx * dx + dy * dy + dz * dz < 150000) { idx2 = tempIdx; break; }
        }
        netPts.push(tempTargetPos[idx1 * 3], tempTargetPos[idx1 * 3 + 1], tempTargetPos[idx1 * 3 + 2]);
        netPts.push(tempTargetPos[idx2 * 3], tempTargetPos[idx2 * 3 + 1], tempTargetPos[idx2 * 3 + 2]);
        netCols.push(0.0, 0.4, 1.0);
        netCols.push(0.0, 0.8, 1.0);
    }
    netGeo.setAttribute('position', new THREE.Float32BufferAttribute(netPts, 3));
    netGeo.setAttribute('color', new THREE.Float32BufferAttribute(netCols, 3));

    netMat = new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.0,
        blending: THREE.AdditiveBlending, depthWrite: false
    });
    netLines = new THREE.LineSegments(netGeo, netMat);
    globeGroup.add(netLines);

    // ── POINT MATERIAL with light-mode fix ──────────────────────────
    pointMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            scrollProgress: { value: 0.0 },
            morphProgress: { value: 0.0 },
            masterOpacity: { value: 1.0 },
            isLightMode: { value: IS_LIGHT ? 1.0 : 0.0 }   // ← NEW
        },
        vertexShader: `
            attribute vec3 color;
            attribute vec3 targetPosition;
            attribute vec3 rocketPosition;
            attribute vec3 rocketColorAttr;
            attribute float phase;
            attribute float size;
            attribute float isOcean;

            varying vec3 vColor;
            varying float vAlpha;

            uniform float time;
            uniform float scrollProgress;
            uniform float morphProgress;
            uniform float masterOpacity;
            uniform float isLightMode;          // ← NEW

            void main() {
                // Section 2 Logic
                float expandProgress   = clamp(scrollProgress / 0.2, 0.0, 1.0);
                float scale            = 1.0 + (expandProgress * 0.4);
                vec3  expandedPos      = position * scale;
                float oldMorphProgress = clamp((scrollProgress - 0.2) / 0.6, 0.0, 1.0);
                vec3  flowPos          = expandedPos;
                flowPos.y += sin(time * 2.0 + position.x * 0.02) * 30.0 * oldMorphProgress;
                flowPos.x += cos(time * 1.5 + position.y * 0.02) * 30.0 * oldMorphProgress;
                vec3 basePos = mix(flowPos, targetPosition, oldMorphProgress);

                // Section 5 Earth → Rocket Morph
                vec3  midPoint = mix(basePos, rocketPosition, 0.5);
                float noise    = sin(time * 3.0 + position.x * 0.05) * cos(time * 3.0 + position.y * 0.05);
                midPoint += vec3(noise * 40.0, noise * 40.0, noise * 40.0);

                vec3 finalPos;
                if (morphProgress < 0.5) {
                    float t = morphProgress * 2.0;
                    t = t < 0.5 ? 2.0*t*t : -1.0 + (4.0 - 2.0*t)*t;
                    finalPos = mix(basePos, midPoint, t);
                } else {
                    float t = (morphProgress - 0.5) * 2.0;
                    t = t < 0.5 ? 2.0*t*t : -1.0 + (4.0 - 2.0*t)*t;
                    finalPos = mix(midPoint, rocketPosition, t);
                }

                // Rocket rotation
                if (morphProgress > 0.0) {
                    float t = morphProgress;

                    float angleY = t * (3.14159 / 6.0);
                    float cy = cos(angleY); float sy = sin(angleY);
                    float x_new = finalPos.x * cy + finalPos.z * sy;
                    float z_new = -finalPos.x * sy + finalPos.z * cy;
                    finalPos.x = x_new; finalPos.z = z_new;

                    float angleZ = t * (3.14159 / 5.0);
                    float cz = cos(angleZ); float sz = sin(angleZ);
                    float x_new2 = finalPos.x * cz - finalPos.y * sz;
                    float y_new2 = finalPos.x * sz + finalPos.y * cz;
                    finalPos.x = x_new2; finalPos.y = y_new2;
                }

                // Sphere culling
                vec3  normal   = normalize(position);
                vec3  worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;
                vec3  viewDir  = normalize(cameraPosition - worldPos);
                float facing   = dot(normal, viewDir);

                float backsideFade = smoothstep(-0.05, 0.1, facing);
                float alphaBase    = mix(backsideFade, 1.0, max(oldMorphProgress, morphProgress));

                if (alphaBase <= 0.0) {
                    vAlpha = 0.0; gl_PointSize = 0.0; gl_Position = vec4(0.0); return;
                }

                float borderFactor = 1.0 - max(0.0, facing);
                vColor = color;

                float pAlpha = 0.0;
                float pSize  = size;

                // ── Light-mode compensation (no bloom → boost alpha & size) ──
                float lightSizeBoost = 1.0 + isLightMode * 1.2;

                if (isOcean > 0.5) {
                    if (borderFactor > 0.5) {
                        float borderIntensity = smoothstep(0.5, 1.0, borderFactor);
                        pAlpha = (0.6 + 0.4 * sin(time * 2.0 + phase)) * borderIntensity;
                        // Force border particles visible in light mode
                        pAlpha = max(pAlpha, isLightMode * 0.85);
                        vColor = color * (1.0 + borderIntensity * 1.5);
                        pSize  = size * (1.0 + borderIntensity * 1.5) * lightSizeBoost;
                    } else {
                        // In light mode show ALL ocean particles, not just 25%
                        if (mod(phase, 1.0) < 0.25 || isLightMode > 0.5) {
                            pAlpha = mix(
                                abs(0.5 * sin(time * 1.0 + phase)),
                                0.7 + 0.3 * abs(sin(time * 1.0 + phase)),
                                isLightMode
                            );
                            vColor = color * 2.2;
                            pSize  = size * 0.9 * lightSizeBoost;
                        }
                    }
                } else {
                    // Land particles
                    pAlpha = mix(
                        0.7 + 0.5 * sin(time * 1.5 + phase),
                        0.85 + 0.15 * sin(time * 1.5 + phase),
                        isLightMode
                    );
                    if (borderFactor > 0.4) {
                        float borderIntensity = smoothstep(0.4, 1.0, borderFactor);
                        vColor = color * (1.0 + borderIntensity * 1.2);
                    } else {
                        // Don't over-brighten in light mode (no bloom to save it)
                        vColor *= mix(2.8, 1.0, isLightMode);
                    }
                    pSize = size * lightSizeBoost;
                }

                // Energy boost during expansion
                vColor *= 1.0 + (expandProgress * 1.5);

                // Cloud formation phase
                float twinkle     = 0.5 + 0.5 * sin(time * 4.0 + phase * 10.0);
                vec3  targetColor = vec3(0.0, 0.4, 1.0);
                vColor = mix(vColor, targetColor, oldMorphProgress);

                // Rocket morph colours
                float rocketTwinkle = 0.8 + 0.2 * sin(time * 10.0 + phase * 20.0);
                float currentAlpha  = mix(pAlpha, (twinkle * 0.8 + 0.2) * 0.01, oldMorphProgress);

                vColor = mix(vColor, rocketColorAttr * rocketTwinkle, morphProgress);
                vAlpha = mix(currentAlpha, pAlpha * rocketTwinkle, morphProgress) * alphaBase;

                vec4 mvPosition = viewMatrix * vec4(worldPos, 1.0);

                float currentSize = mix(pSize, size * 2.0, oldMorphProgress);
                float finalSize   = mix(currentSize, size * 1.5, morphProgress);
                gl_PointSize  = finalSize * (440.0 / length(cameraPosition - worldPos));
                gl_Position   = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            uniform float masterOpacity;
            void main() {
                if (vAlpha * masterOpacity <= 0.0) discard;
                vec2  xy = gl_PointCoord.xy - vec2(0.5);
                float ll = length(xy);
                if (ll > 0.5) discard;
                float alpha = smoothstep(0.5, 0.0, ll) * vAlpha * masterOpacity;
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pointGeometry, pointMaterial);
    globeGroup.add(particles);

    // Particle Exhaust
    const exhaustCount = 2000;
    const exhaustGeo = new THREE.BufferGeometry();
    const exhaustPts = new Float32Array(exhaustCount * 3);
    const exhaustPhases = new Float32Array(exhaustCount);
    for (let i = 0; i < exhaustCount; i++) {
        exhaustPts[i * 3] = (Math.random() - 0.5) * 40;
        exhaustPts[i * 3 + 1] = -150 - Math.random() * 100;
        exhaustPts[i * 3 + 2] = (Math.random() - 0.5) * 40;
        exhaustPhases[i] = Math.random() * Math.PI * 2;
    }
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPts, 3));
    exhaustGeo.setAttribute('phase', new THREE.BufferAttribute(exhaustPhases, 1));

    const exhaustMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            morphProgress: { value: 0.0 }
        },
        vertexShader: `
            attribute float phase;
            uniform float time;
            uniform float morphProgress;
            varying float vAlpha;
            void main() {
                vec3 pos  = position;
                float flow = mod(time * 100.0 + phase * 100.0, 200.0);
                pos.y -= flow;

                float angleY = 3.14159 / 6.0;
                float cy = cos(angleY); float sy = sin(angleY);
                float x_new = pos.x * cy + pos.z * sy;
                float z_new = -pos.x * sy + pos.z * cy;
                pos.x = x_new; pos.z = z_new;

                float angleZ = 3.14159 / 5.0;
                float cz = cos(angleZ); float sz = sin(angleZ);
                float x_new2 = pos.x * cz - pos.y * sz;
                float y_new2 = pos.x * sz + pos.y * cz;
                pos.x = x_new2; pos.y = y_new2;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = (100.0 / -mvPosition.z);
                vAlpha = smoothstep(-400.0, -150.0, pos.y) * morphProgress;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vAlpha;
            void main() {
                vec2  coord = gl_PointCoord - vec2(0.5);
                float dist  = length(coord);
                if (dist > 0.5) discard;
                float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
                gl_FragColor = vec4(0.0, 0.4, 1.0, alpha);
            }
        `,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const exhaustSystem = new THREE.Points(exhaustGeo, exhaustMat);
    globeGroup.add(exhaustSystem);

    globeGroup.rotation.z = Math.PI * 0.1;

    initGSAP();
}

const img = new Image();
img.crossOrigin = "Anonymous";
img.src = "https://unpkg.com/three-globe/example/img/earth-water.png";
img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    initGlobe(imgData, img.width, img.height);
};

// ----------------------------------------------------
// ORBITAL RINGS  (commented out — removed per design)
// ----------------------------------------------------
function createRing(r, tiltX, tiltY, tiltZ, speed) {
    const group = new THREE.Group();

    const geo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(r * Math.cos(a), 0, r * Math.sin(a));
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.25 });
    const line = new THREE.Line(geo, mat);
    group.add(line);

    const nodeGeo = new THREE.BufferGeometry();
    const nPts = [];
    const nColors = [];
    const nSizes = [];
    for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        nPts.push(r * Math.cos(a), 0, r * Math.sin(a));
        if (Math.random() > 0.5) {
            nColors.push(1.0, 0.4, 0.1);
        } else {
            nColors.push(0.5, 0.8, 1.0);
        }
        nSizes.push(Math.random() * 4.0 + 4.0);
    }
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nPts, 3));
    nodeGeo.setAttribute('color', new THREE.Float32BufferAttribute(nColors, 3));
    nodeGeo.setAttribute('size', new THREE.Float32BufferAttribute(nSizes, 1));

    const nodeMat = new THREE.ShaderMaterial({
        vertexShader: `
            attribute vec3 color;
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (800.0 / -mvPosition.z);
                gl_Position  = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                vec2  xy = gl_PointCoord.xy - vec2(0.5);
                float ll = length(xy);
                if (ll > 0.5) discard;
                float alpha = smoothstep(0.5, 0.0, ll);
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodes);

    group.rotation.set(tiltX, tiltY, tiltZ);
    group.userData.speed = speed;
    globeGroup.add(group);
    return group;
}

const rings = [];
// rings.push(createRing(radius + 40, 0.2,  0.4, 0.1,   0.002));
// rings.push(createRing(radius + 90, -0.4, 0.2, -0.2, -0.0015));
// rings.push(createRing(radius + 150, 0.3, -0.5, 0.4,  0.001));

// ----------------------------------------------------
// GLOWING OCEAN FLOOR
// ----------------------------------------------------
const floorGeo = new THREE.BufferGeometry();
const floorPts = [];
const floorSizes = [];
const floorOriginalY = [];

const floorWidth = 150;
const floorDepth = 80;
const spacing = 40;

for (let i = 0; i < floorWidth; i++) {
    for (let j = 0; j < floorDepth; j++) {
        const x = (i - floorWidth / 2) * spacing;
        const z = (j - floorDepth / 2) * spacing;
        const y = -350;
        floorPts.push(x, y, z);
        floorOriginalY.push(y);
        if (Math.random() > 0.95) {
            floorSizes.push(Math.random() * 4.0 + 2.0);
        } else {
            floorSizes.push(Math.random() * 1.5 + 0.5);
        }
    }
}
floorGeo.setAttribute('position', new THREE.Float32BufferAttribute(floorPts, 3));
floorGeo.setAttribute('originalY', new THREE.Float32BufferAttribute(floorOriginalY, 1));
floorGeo.setAttribute('size', new THREE.Float32BufferAttribute(floorSizes, 1));

const floorMat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, opacity: { value: 1.0 } },
    vertexShader: `
        attribute float size;
        attribute float originalY;
        varying vec3 vColor;
        uniform float time;
        void main() {
            vec3 pos    = position;
            float wave1 = sin(pos.x * 0.005 + time * 1.5) * 20.0;
            float wave2 = cos(pos.z * 0.005 + time * 1.2) * 20.0;
            pos.y = originalY + wave1 + wave2;

            float heightRatio = (pos.y - originalY + 40.0) / 80.0;
            vec3 deepBlue    = vec3(0.0, 0.2, 0.8);
            vec3 brightCyan  = vec3(0.2, 0.6, 1.0);
            vec3 white       = vec3(1.0, 1.0, 1.0);

            if (size > 4.0) {
                vColor = white * 1.8;
            } else {
                vColor = mix(deepBlue, brightCyan, heightRatio) * 1.5;
            }

            vec4  mvPosition = modelViewMatrix * vec4(pos, 1.0);
            float distFade   = smoothstep(-2000.0, 400.0, position.z);
            gl_PointSize = size * (800.0 / -mvPosition.z) * distFade;
            gl_Position  = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float opacity;
        varying vec3 vColor;
        void main() {
            vec2  xy   = gl_PointCoord.xy - vec2(0.5);
            float dist = length(xy);
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist) * 0.8 * opacity;
            gl_FragColor = vec4(vColor, alpha);
        }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
});

const floorPoints = new THREE.Points(floorGeo, floorMat);
floorPoints.position.z = -200;
scene.add(floorPoints);

// ----------------------------------------------------
// BACKGROUND STARS
// ----------------------------------------------------
const starGeo = new THREE.BufferGeometry();
const starPts = [];
const starColors = [];
const starSizes = [];

for (let i = 0; i < 2500; i++) {
    const x = (Math.random() - 0.5) * 5000;
    const y = (Math.random() - 0.5) * 3000;
    const z = (Math.random() - 0.5) * 3000 - 1000;
    starPts.push(x, y, z);
    const bright = Math.random();
    if (Math.random() > 0.9) {
        starColors.push(0.5, 0.8, 1.0);
    } else {
        starColors.push(bright, bright, bright);
    }
    starSizes.push(Math.random() * 2.5 + 0.5);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPts, 3));
starGeo.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
starGeo.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

const starMat = new THREE.ShaderMaterial({
    uniforms: { opacity: { value: 1.0 } },
    vertexShader: `
        attribute vec3  color;
        attribute float size;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (800.0 / -mvPosition.z);
            gl_Position  = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float opacity;
        varying vec3 vColor;
        void main() {
            vec2  xy   = gl_PointCoord.xy - vec2(0.5);
            float dist = length(xy);
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist) * opacity;
            gl_FragColor = vec4(vColor, alpha);
        }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
});

const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ----------------------------------------------------
// INTERACTION & ANIMATION
// ----------------------------------------------------
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
let isHovered = false;

renderer.domElement.addEventListener('mouseenter', () => { isHovered = true; });
renderer.domElement.addEventListener('mouseleave', () => { isHovered = false; });

const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2(-9999, -9999);
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const pointOfIntersection = new THREE.Vector3();
let hasMouseMoved = false;

document.addEventListener('mousemove', (event) => {
    hasMouseMoved = true;
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
    mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const shaderParams = { scrollProgress: 0.0 };
const clock = new THREE.Clock();

// ----------------------------------------------------
// LIGHT TRAILS
// ----------------------------------------------------
const trailCount = 200;
const trailGeo = new THREE.BufferGeometry();
const trailPts = new Float32Array(trailCount * 6);
const trailCols = new Float32Array(trailCount * 6);
const trailSpeeds = new Float32Array(trailCount);
const trailLengths = new Float32Array(trailCount);

for (let i = 0; i < trailCount; i++) {
    const x = (Math.random() - 0.5) * 2500 + 180;
    const y = (Math.random() - 0.5) * 300 + 300;
    const z = (Math.random() - 0.5) * 800 - 100;

    trailPts[i * 6] = x; trailPts[i * 6 + 1] = y; trailPts[i * 6 + 2] = z;
    trailPts[i * 6 + 3] = x; trailPts[i * 6 + 4] = y - 50; trailPts[i * 6 + 5] = z;

    trailCols[i * 6] = 0.8; trailCols[i * 6 + 1] = 1.0; trailCols[i * 6 + 2] = 1.2;
    trailCols[i * 6 + 3] = 0.0; trailCols[i * 6 + 4] = 0.4; trailCols[i * 6 + 5] = 1.0;

    trailSpeeds[i] = Math.random() * 8 + 4;
    trailLengths[i] = Math.random() * 100 + 40;
}
trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPts, 3));
trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCols, 3));

const trailMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.0,
    blending: THREE.AdditiveBlending, depthWrite: false
});
const trailLines = new THREE.LineSegments(trailGeo, trailMat);
scene.add(trailLines);

// ----------------------------------------------------
// ANIMATE LOOP
// ----------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    if (!pointGeometry) return;

    if (pointMaterial.uniforms.masterOpacity.value < 0.001) {
        scene.visible = false;
    } else {
        scene.visible = true;
    }

    pointMaterial.uniforms.time.value = time;
    pointMaterial.uniforms.scrollProgress.value = shaderParams.scrollProgress;
    if (typeof floorMat !== 'undefined') floorMat.uniforms.time.value = time;

    // Rings rotation (empty array — no-op)
    rings.forEach(r => { r.rotation.y += r.userData.speed; });

    // Light trails
    if (trailMat.opacity > 0.01) {
        trailLines.visible = true;
        const pts = trailGeo.attributes.position.array;
        for (let i = 0; i < trailCount; i++) {
            pts[i * 6 + 1] -= trailSpeeds[i];
            pts[i * 6 + 4] -= trailSpeeds[i];
            if (pts[i * 6 + 4] < -1000) {
                pts[i * 6 + 1] = (Math.random() - 0.5) * 300 + 300;
                pts[i * 6 + 4] = pts[i * 6 + 1] - trailLengths[i];
            }
        }
        trailGeo.attributes.position.needsUpdate = true;
    } else {
        trailLines.visible = false;
    }

    // Mouse parallax
    targetX = mouseX * 0.0002;
    targetY = mouseY * 0.0002;
    camera.position.x += (targetX * 300 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 300 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    const pos = pointGeometry.attributes.position.array;

    raycaster.setFromCamera(mouseVector, camera);
    raycaster.ray.intersectPlane(plane, pointOfIntersection);
    const localIntersect = pointOfIntersection.clone();
    globeGroup.worldToLocal(localIntersect);

    const repelRadius = 40;
    if (hasMouseMoved) {
        for (let i = 0; i < actualParticleCount; i++) {
            const idx = i * 3;
            const ox = originalPositions[idx];
            const oy = originalPositions[idx + 1];
            const oz = originalPositions[idx + 2];
            const px = pos[idx];
            const py = pos[idx + 1];

            const dx = px - localIntersect.x;
            const dy = py - localIntersect.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (mouseVector.x > -9000 && dist < repelRadius) {
                const force = (repelRadius - dist) / repelRadius;
                pos[idx] += dx * force * 0.15;
                pos[idx + 1] += dy * force * 0.15;
            }

            pos[idx] += (ox - pos[idx]) * 0.02;
            pos[idx + 1] += (oy - pos[idx + 1]) * 0.02;
            pos[idx + 2] += (oz - pos[idx + 2]) * 0.02;
        }
        pointGeometry.attributes.position.needsUpdate = true;
    }

    composer.render();
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// ----------------------------------------------------
// GSAP SCROLL ANIMATIONS
// ----------------------------------------------------
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Cinematic Morph Timeline
    const morphTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".ai-operations-section",
            start: "top 90%",
            end: "top 10%",
            scrub: 1.5,
        }
    });

    morphTl.to(".hero-section .content", { opacity: 0, y: -100, ease: "power1.inOut" }, 0);
    morphTl.to(starMat.uniforms.opacity, { value: 0, duration: 2, ease: "power1.inOut" }, 0);
    morphTl.to(floorMat.uniforms.opacity, { value: 0, duration: 2, ease: "power1.inOut" }, 0);
    morphTl.to(glowMat.uniforms.opacity, { value: 0, duration: 2, ease: "power1.inOut" }, 0);

    morphTl.to(globeGroup.position, { x: 0, duration: 2, ease: "power1.inOut" }, 0);
    morphTl.to(globeGroup.rotation, { z: 0, duration: 2, ease: "power1.inOut" }, 0);

    // Rings shrink (no-op since array is empty)
    rings.forEach(ring => {
        morphTl.to(ring.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 1.5, ease: "power1.in" }, 0);
    });

    morphTl.to(trailMat, { opacity: 0.0, duration: 2, ease: "power2.in" }, 0.5);
    if (netMat) morphTl.to(netMat, { opacity: 0.0, duration: 2, ease: "power2.in" }, 0.5);

    // Section 3
    const section3Tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".isometric-ai-section",
            start: "top 80%",
            end: "top 20%",
            scrub: 1.5,
        }
    });
    section3Tl.fromTo(glowMat.uniforms.opacity,
        { value: 0.0 }, { value: 1.0, duration: 2, ease: "power1.inOut" }, 0
    );
    section3Tl.to(globeGroup.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 2, ease: "power1.inOut" }, 0);

    // Section 2 Content
    const contentTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".ai-operations-section",
            start: "top 30%",
            end: "bottom bottom",
            toggleActions: "play none none reverse"
        }
    });
    contentTl
        .to(".ai-operations-section .ai-header", { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
        .to(".ai-operations-section .ai-card", { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.6");

    // Section 2.5
    const amContentTl = gsap.timeline({
        scrollTrigger: { trigger: ".am-operations-section", start: "top 70%", toggleActions: "play none none reverse" }
    });
    amContentTl.to(".am-operations-section .ai-header", { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });

    if (netMat) gsap.to(netMat, { opacity: 0.0, scrollTrigger: { trigger: ".method-section", start: "top 70%", end: "top 30%", scrub: true } });
    if (trailMat) gsap.to(trailMat, { opacity: 0.0, scrollTrigger: { trigger: ".method-section", start: "top 70%", end: "top 30%", scrub: true } });

    // Section 5 – hide earth
    const rocketMorphTl = gsap.timeline({
        scrollTrigger: { trigger: ".wizardly-section", start: "top 80%", end: "top 20%", scrub: 1.5 }
    });
    if (pointMaterial && pointMaterial.uniforms) {
        rocketMorphTl.to(pointMaterial.uniforms.masterOpacity, { value: 0.0, duration: 2.5, ease: "power1.inOut" }, 0);
    }
    if (glowMat && glowMat.uniforms) {
        rocketMorphTl.to(glowMat.uniforms.opacity, { value: 0.0, duration: 2.5, ease: "power1.inOut" }, 0);
    }

    // Middle Section
    gsap.from(".middle-content", { scrollTrigger: { trigger: ".middle-section", start: "top 75%", toggleActions: "play none none reverse" }, opacity: 0, y: 60, scale: 0.95, duration: 1.2, ease: "power3.out" });
    gsap.from(".middle-title", { scrollTrigger: { trigger: ".middle-section", start: "top 75%", toggleActions: "play none none reverse" }, opacity: 0, y: 40, duration: 1, delay: 0.3, ease: "power3.out" });
    gsap.from(".middle-subtitle", { scrollTrigger: { trigger: ".middle-section", start: "top 75%", toggleActions: "play none none reverse" }, opacity: 0, y: 30, duration: 1, delay: 0.5, ease: "power3.out" });

    // Section 3 – Isometric
    gsap.from(".iso-content", { scrollTrigger: { trigger: ".isometric-ai-section", start: "top 70%", toggleActions: "play none none reverse" }, opacity: 0, x: -50, duration: 1, ease: "power3.out" });
    gsap.from(".iso-container", { scrollTrigger: { trigger: ".isometric-ai-section", start: "top 70%", toggleActions: "play none none reverse" }, opacity: 0, x: 50, duration: 1, ease: "power3.out", delay: 0.2 });
    gsap.from(".saas-card", { scrollTrigger: { trigger: ".isometric-ai-section", start: "top 60%", toggleActions: "play none none reverse" }, opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: "power3.out" });

    // Section 5 – Wizardly
    gsap.from(".wizardly-left", { scrollTrigger: { trigger: ".wizardly-section", start: "top 60%", toggleActions: "play none none reverse" }, opacity: 0, x: -50, duration: 1, ease: "power3.out" });
    gsap.from(".wizardly-right", { scrollTrigger: { trigger: ".wizardly-section", start: "top 60%", toggleActions: "play none none reverse" }, opacity: 0, x: 50, duration: 1, ease: "power3.out", delay: 0.2 });

    // Section 6 – Brand
    gsap.from(".brand-left", { scrollTrigger: { trigger: ".brand-section", start: "top 60%", toggleActions: "play none none reverse" }, opacity: 0, scale: 0.9, duration: 1, ease: "power3.out" });
    gsap.from(".brand-right", { scrollTrigger: { trigger: ".brand-section", start: "top 60%", toggleActions: "play none none reverse" }, opacity: 0, x: 50, duration: 1, ease: "power3.out", delay: 0.2 });

    // Section 9 – Pricing
    gsap.from(".pricing-header", { scrollTrigger: { trigger: ".pricing-section", start: "top 75%", toggleActions: "play none none reverse" }, opacity: 0, y: 30, duration: 1, ease: "power3.out" });
    gsap.from(".pricing-card", { scrollTrigger: { trigger: ".pricing-section", start: "top 60%", toggleActions: "play none none reverse" }, opacity: 0, y: 50, duration: 0.8, stagger: 0.2, ease: "power3.out" });
}

// ----------------------------------------------------
// LIVE THEME SWITCHING
// ----------------------------------------------------
function applyTheme(isLight) {
    // 1. Canvas background
    if (isLight) {
        renderer.setClearColor(0x000000, 0);
    } else {
        renderer.setClearColor(0x020205, 1);
    }

    // 2. Bloom strength
    bloomPass.strength = isLight ? 0 : 2.4;

    // 3. Sync isLightMode uniform so shader boosts alpha/size in light mode  ← NEW
    if (pointMaterial && pointMaterial.uniforms) {
        pointMaterial.uniforms.isLightMode.value = isLight ? 1.0 : 0.0;
    }

    // 4. Atmospheric glow colour
    if (glowMat && glowMat.uniforms) {
        glowMat.uniforms.glowColor.value.set(isLight ? 0x1e3a8a : 0x000015);
    }

    // 5. Particle vertex colours — swap between stored buffers
    if (pointGeometry && darkColorsBuffer && lightColorsBuffer) {
        const colorAttr = pointGeometry.getAttribute('color');
        const src = isLight ? lightColorsBuffer : darkColorsBuffer;
        colorAttr.array.set(src);
        colorAttr.needsUpdate = true;
    }
}

// Watch for theme toggle
new MutationObserver(() => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    applyTheme(isLight);
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });