import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';

// mess with these to change how the animation looks, edit CSS variables to modify gradient colours
const WAVE_X_FREQ = 1.0;
const WAVE_Y_FREQ = 0.8;
const WAVE_SPEED = 10;
const WAVE_SPEED_VARIATION = 0.3;
const WAVE_FLOW = 0.075;
const WAVE_FLOW_VARIATION = 0.075;
const SEED = 5.0;
const WAVE_NOISE_FLOOR = 0.1;
const WAVE_NOISE_CEIL = 0.65;
const WAVE_NOISE_VARIATION = 0.07;

var container;
var camera, scene, renderer;
var uniforms;
var startTime;

let gradientColors = [];

init();
animate();

function init() {
    container = document.getElementById('container');
    initGradientColors(container);

    startTime = Date.now();

    uniforms = {
        iGlobalTime: {
            type: "f",
            value: 1.0
        },
        iResolution: {
            type: "v2",
            value: new THREE.Vector2()
        },
        u_waves: {
            value: []
        }
    };

    for(let i = 0; i < gradientColors.length; i++) {
        let wave = {
            color: new THREE.Vector3(...gradientColors[i]),
            noiseFreq: new THREE.Vector2(WAVE_X_FREQ + i / gradientColors.length, WAVE_Y_FREQ + i / gradientColors.length),
            noiseSpeed: WAVE_SPEED + WAVE_SPEED_VARIATION * i,
            noiseFlow: WAVE_FLOW + WAVE_FLOW_VARIATION * i,
            noiseSeed: SEED + 10 * i,
            noiseFloor: WAVE_NOISE_FLOOR,
            noiseCeil: WAVE_NOISE_CEIL + i * WAVE_NOISE_VARIATION
        }
        uniforms.u_waves.value.push(wave);
    }

    console.log(uniforms);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff)

    var geometry = new THREE.PlaneBufferGeometry(16, 9);

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    container.appendChild(renderer.domElement);

    onWindowResize();

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(event) {
    uniforms.iResolution.value.x = window.innerWidth;
    uniforms.iResolution.value.y = window.innerHeight;

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var currentTime = Date.now();
    uniforms.iGlobalTime.value = (currentTime - startTime) * 0.001;
    renderer.render(scene, camera);
}

function initGradientColors(container) {
    gradientColors = ["--gradient-color-1", "--gradient-color-2", "--gradient-color-3", "--gradient-color-4"].map(cssPropertyName => {
        let hex = getComputedStyle(container).getPropertyValue(cssPropertyName).trim();
        //Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work.
        if (4 === hex.length) {
            const hexTemp = hex.substr(1).split("").map(hexTemp => hexTemp + hexTemp).join("");
            hex = `#${hexTemp}`
        }
        return hex && `0x${hex.substr(1)}`
    }).filter(Boolean).map(normalizeColor);
}

//Converting colors to proper format
function normalizeColor(hexCode) {
    return [(hexCode >> 16 & 255) / 255, (hexCode >> 8 & 255) / 255, (255 & hexCode) / 255]
}