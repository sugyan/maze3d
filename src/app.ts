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
  RepeatWrapping,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";

import { generateMaze } from "./maze";
import { Player } from "./player";
import image from "url:./data/wall_5_1.png";

const size = 8;
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
pRenderer.setSize(800, 800);
oRenderer.setSize(400, 400);
document.getElementById("maze3d")?.appendChild(pRenderer.domElement);
document.getElementById("maze2d")?.appendChild(oRenderer.domElement);

const cone = new Mesh(
  new ConeGeometry(0.5),
  new MeshBasicMaterial({ color: 0xff0000 })
);
cone.position.set(1, 1, 0);
scene.add(cone);
const player = new Player(maze, cone, pCamera);

{
  const loader = new TextureLoader();
  loader.loadAsync(image).then((texture) => {
    maze.forEach((row, i) => {
      row.forEach((col, j) => {
        if (!col) {
          const geometry = new BoxGeometry();
          texture.wrapS = RepeatWrapping;
          texture.wrapT = RepeatWrapping;
          texture.repeat.set(1, 1);
          const materials = [
            new MeshStandardMaterial({ map: texture.clone() }),
            new MeshStandardMaterial({ map: texture.clone() }),
            new MeshStandardMaterial({ map: texture.clone() }),
            new MeshStandardMaterial({ map: texture.clone() }),
            new MeshBasicMaterial({ color: 0x008080 }),
          ];
          materials[0].map!.rotation = Math.PI / 2;
          materials[1].map!.rotation = -Math.PI / 2;
          materials[2].map!.rotation = Math.PI;

          const cube = new Mesh(geometry, materials);
          cube.position.x = i;
          cube.position.y = j;
          scene.add(cube);
        }
      });
    });
    pRenderer.render(scene, pCamera);
    oRenderer.render(scene, oCamera);
  });
}

const ambientLight = new AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const oLight = new DirectionalLight(0xffffff);
oLight.position.set(0, 0, 1);
scene.add(oLight);

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

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-l")?.addEventListener("click", turnLeft);
  document.getElementById("btn-r")?.addEventListener("click", turnRight);
  document.getElementById("btn-f")?.addEventListener("click", goForward);
});
