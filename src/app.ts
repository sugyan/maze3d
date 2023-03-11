import {
  AmbientLight,
  BoxGeometry,
  ConeGeometry,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";

import { generateMaze } from "./maze";
import { Player } from "./player";

const size = 15;
const maze = generateMaze(size);

const scene = new Scene();
const pCamera = new PerspectiveCamera(100);
const oCamera = new OrthographicCamera(
  -0.5,
  size * 2.0 + 0.5,
  size * 2.0 + 0.5,
  -0.5
);
const pRenderer = new WebGLRenderer();
const oRenderer = new WebGLRenderer();
pRenderer.setSize(750, 750);
oRenderer.setSize(400, 400);
document.body.appendChild(pRenderer.domElement);
document.body.appendChild(oRenderer.domElement);

const cone = new Mesh(
  new ConeGeometry(0.5),
  new MeshBasicMaterial({ color: 0xff0000 })
);
cone.position.set(1, 1, 0);
scene.add(cone);
const player = new Player(maze, cone, pCamera);

maze.forEach((row, i) => {
  row.forEach((col, j) => {
    if (!col) {
      const geometry = new BoxGeometry();
      const material = new MeshStandardMaterial({ color: 0x606060 });
      const cube = new Mesh(geometry, material);
      cube.position.x = i;
      cube.position.y = j;
      scene.add(cube);
    }
  });
});

const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

pCamera.position.x = 1;
pCamera.position.y = 1;
pCamera.rotateX(Math.PI / 2);
oCamera.position.z = 5;

pRenderer.render(scene, pCamera);
oRenderer.render(scene, oCamera);

function goForward() {
  if (player.goForward()) {
    pRenderer.render(scene, pCamera);
    oRenderer.render(scene, oCamera);
  }
}
function turnRight() {
  player.turnRight();
  pRenderer.render(scene, pCamera);
  oRenderer.render(scene, oCamera);
}
function turnLeft() {
  player.turnLeft();
  pRenderer.render(scene, pCamera);
  oRenderer.render(scene, oCamera);
}

window.addEventListener("keydown", (e: KeyboardEvent) => {
  switch (e.code) {
    case "ArrowUp":
      goForward();
      break;
    case "ArrowRight":
      turnRight();
      break;
    case "ArrowLeft":
      turnLeft();
      break;
  }
});
