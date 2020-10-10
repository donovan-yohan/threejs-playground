import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';

var container;
var camera, scene, renderer;
var uniforms;
var startTime;

let sectionColors = [];

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
        }
    };

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
    sectionColors = ["--gradient-color-1", "--gradient-color-2", "--gradient-color-3", "--gradient-color-4"].map(cssPropertyName => {
        let hex = getComputedStyle(container).getPropertyValue(cssPropertyName).trim();
        //Check if shorthand hex value was used and double the length so the conversion in normalizeColor will work.
        if (4 === hex.length) {
            const hexTemp = hex.substr(1).split("").map(hexTemp => hexTemp + hexTemp).join("");
            hex = `#${hexTemp}`
        }
        return hex && `0x${hex.substr(1)}`
    }).filter(Boolean).map(normalizeColor)
    console.log(sectionColors);
}

//Converting colors to proper format
function normalizeColor(hexCode) {
    return [(hexCode >> 16 & 255) / 255, (hexCode >> 8 & 255) / 255, (255 & hexCode) / 255]
}