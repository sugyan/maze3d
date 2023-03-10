import { Camera, Object3D } from "three";

type XY = { x: number; y: number };

export const Directions = {
  N: "N",
  E: "E",
  S: "S",
  W: "W",
} as const;
export type Direction = typeof Directions[keyof typeof Directions];

const TURN_R = {
  [Directions.N]: Directions.E,
  [Directions.E]: Directions.S,
  [Directions.S]: Directions.W,
  [Directions.W]: Directions.N,
};

const TURN_L = {
  [Directions.N]: Directions.W,
  [Directions.W]: Directions.S,
  [Directions.S]: Directions.E,
  [Directions.E]: Directions.N,
};

export class Player {
  readonly position: XY;
  private maze: boolean[][];
  private object: Object3D;
  private direction: Direction;
  private camera: Camera;
  constructor(maze: boolean[][], object: Object3D, camera: Camera) {
    this.maze = maze;
    this.object = object;
    this.camera = camera;
    this.position = { x: 1, y: 1 };
    this.direction = Directions.E;
  }

  public turnRight(): void {
    this.camera.rotateY(-Math.PI / 2);
    this.object.rotateZ(-Math.PI / 2);
    this.direction = TURN_R[this.direction];
  }
  public turnLeft(): void {
    this.camera.rotateY(Math.PI / 2);
    this.object.rotateZ(Math.PI / 2);
    this.direction = TURN_L[this.direction];
  }
  public goForward(): boolean {
    switch (this.direction) {
      case Directions.N:
        if (this.maze[this.position.x - 1][this.position.y]) {
          this.camera.position.x = this.position.x = this.position.x - 1;
          this.object.position.x -= 1;
          return true;
        }
        break;
      case Directions.E:
        if (this.maze[this.position.x][this.position.y + 1]) {
          this.camera.position.y = this.position.y = this.position.y + 1;
          this.object.position.y += 1;
          return true;
        }
        break;
      case Directions.S:
        if (this.maze[this.position.x + 1][this.position.y]) {
          this.camera.position.x = this.position.x = this.position.x + 1;
          this.object.position.x += 1;
          return true;
        }
        break;
      case Directions.W:
        if (this.maze[this.position.x][this.position.y - 1]) {
          this.camera.position.y = this.position.y = this.position.y - 1;
          this.object.position.y -= 1;
          return true;
        }
        break;
    }
    return false;
  }
}
