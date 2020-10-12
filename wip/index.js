import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';

// mess with these to change how the animation looks, edit CSS variables to modify gradient colours
const GRADIENT_VARIABLE_NAME = "gradient-color";
const WAVE_X_FREQ = 0.9;
const WAVE_Y_FREQ = 0.6;
const WAVE_SPEED = 5.0;
const WAVE_SPEED_VARIATION = 15.0;
const WAVE_FLOW = 50.0;
const WAVE_FLOW_VARIATION = 25.0;
const SEED = 469.0;
const WAVE_NOISE_FLOOR = 0.35;
const WAVE_NOISE_CEIL = 0.58;
const WAVE_NOISE_VARIATION = 0.05;
const NOISE_SEPARATION = 55.0;

const INCLINE = 0.009;
const OFFSET_VERTICAL = -1.5;

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
        },
        u_total_colors: {
            value: gradientColors.length
        },
        u_position: {
            value: {
                incline: INCLINE,
                offsetVert: OFFSET_VERTICAL,
                noiseFreq: new THREE.Vector2(1.0, 1.0),
                noiseFlow: 1.0,
                noiseAmp: 1.0,
                noiseSeed: 1.0,
            }
        },
        u_noise_magnitude: {
            value: NOISE_SEPARATION
        }
    };

    for (let i = 0; i < gradientColors.length; i++) {
        let wave = {
            color: new THREE.Vector3(...gradientColors[i]),
            noiseFreq: new THREE.Vector2(WAVE_X_FREQ + i / gradientColors.length, WAVE_Y_FREQ + i / gradientColors.length),
            noiseSpeed: WAVE_SPEED + (i % 2 == 0 ? -1 : 1) * WAVE_SPEED_VARIATION * i,
            noiseFlow: WAVE_FLOW + (i % 2 == 0 ? 1 : -1) * WAVE_FLOW_VARIATION * i,
            noiseSeed: SEED + 10 * i,
            noiseFloor: WAVE_NOISE_FLOOR,
            noiseCeil: WAVE_NOISE_CEIL + i * WAVE_NOISE_VARIATION,
            offsetHorz: i % 2 == 0 ? -1 : 1,
            offsetVert: i % 3 == 0 ? -1 : 1
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
    let color = getComputedStyle(container).getPropertyValue("--" + GRADIENT_VARIABLE_NAME + "-1");
    let current = 1;
    while (color != "") {
        gradientColors.push("--" + GRADIENT_VARIABLE_NAME + "-" + current);
        color = getComputedStyle(container).getPropertyValue("--" + GRADIENT_VARIABLE_NAME + "-" + ++current);

    }

    gradientColors = gradientColors.map(cssPropertyName => {
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