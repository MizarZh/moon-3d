import * as THREE from 'three';
import moonData from './js/data';
import $ from 'jquery';
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

// !初始化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// const composer = new EffectComposer(renderer);

// !月球材质
const texture = new THREE.TextureLoader().load('./img/lroc_color_poles_2k.png');
const heightTexture = new THREE.TextureLoader().load('./img/ldem_4.png');
// texture.center = new THREE.Vector2(0.5, 0.5);
// heightTexture.center = new THREE.Vector2(0.5, 0.5);
const geometry = new THREE.SphereGeometry(3, 32, 32);
const material = new THREE.MeshPhongMaterial({
  map: texture,
  bumpMap: heightTexture,
  bumpScale: 0.01,
  specular: 0x010101,
});
const moonMesh = new THREE.Mesh(geometry, material);

// !灯光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 0, 0);
directionalLight.lookAt(0, 0, 0);
// 全局光
const ambientLight = new THREE.AmbientLight(0x222222);

scene.add(directionalLight);
scene.add(ambientLight);
scene.add(moonMesh);

// !辅助 debug用

// 坐标轴
const axesHelper = new THREE.AxesHelper(5);

// 光照在月球上的位置
const lightMeshGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const lightMeshMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const lightMesh = new THREE.Mesh(lightMeshGeometry, lightMeshMaterial);

// 赤道
const circleGeometry = new THREE.RingGeometry(3, 4, 32);
const circleMaterial = new THREE.MeshBasicMaterial({
  color: 0x0066c,
  side: THREE.DoubleSide,
});
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.rotateX(-Math.PI / 2);
scene.add(axesHelper);
scene.add(lightMesh);
scene.add(circle);

// 摄像机初始位置
camera.position.x = 10;
camera.lookAt(0, 0, 0);

// !数据
// 转换函数，将longitude,latitude,r转换成三维坐标系
const convert = (lon, lat, r) => {
  // if (lon > 180) lon = 360 - lon;
  lon = (Math.PI / 180) * lon;
  lat = (Math.PI / 180) * lat;
  return [
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    -r * Math.cos(lat) * Math.sin(lon),
  ];
};
let nameMap = {
  centerLon: '  ObsSub-LON',
  centerLat: 'ObsSub-LAT',
  lightLon: '  SunSub-LON',
  lightLat: ' SunSub-LAT',
  rotateAng: '    NP.ang',
};
let map = {
  centerLon: 8,
  centerLat: 9,
  lightLon: 10,
  lightLat: 11,
  rotateAng: 14,
};

// !动画
let r = 10,
  i = 1,
  n = moonData.data.length,
  FPS = 50,
  renderDT = 1 / FPS,
  timeS = 0;
// console.log(moonData);
let clock = new THREE.Clock();
const animate = function () {
  requestAnimationFrame(animate);
  // 帧率设定
  let T = clock.getDelta();
  timeS = timeS + T;
  if (i < n && timeS > renderDT) {
    let frame = moonData.data[i];
    // centerLon, centerLat: 月球正对观测者的经纬度
    // lightLon, lightLat: 光照经纬度
    // rotateAng: 北极轴倾斜角
    let centerLon = parseFloat(frame[map.centerLon]),
      centerLat = parseFloat(frame[map.centerLat]),
      lightLon = parseFloat(frame[map.lightLon]),
      lightLat = parseFloat(frame[map.lightLat]),
      rotateAng = parseFloat(frame[map.rotateAng]);
    // console.log(centerLon, centerLat, lightLon, lightLat, rotateAng);
    camera.position.set(...convert(centerLon, centerLat, r));
    camera.lookAt(0, 0, 0);
    camera.rotateZ((rotateAng / 180) * Math.PI);

    directionalLight.position.set(...convert(lightLon, lightLat, r));
    directionalLight.lookAt(0, 0, 0);
    timeS = 0;
    i += 1;
    // debug
    lightMesh.position.set(...convert(lightLon, lightLat, 3));
    $('.data').text(`
      date:${frame[0]}
      phase:${frame[7]}%
      centerLon:${centerLon}
      centerLat:${centerLat}
      lightLon:${lightLon}
      lightLat:${lightLat}
      rotateAng:${rotateAng}
      `);
  }
  renderer.render(scene, camera);
};

// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);

try {
  animate();
} catch (e) {
  console.log(e);
}
