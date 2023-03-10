type Coord = [number, number];

const DIRS = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function generateMaze(n: number): boolean[][] {
  const length = n * 2 + 1;
  const targets: Coord[] = [];
  const maze = Array.from({ length }, (_, i) =>
    Array.from({ length }, (_, j) => {
      const ret = i > 0 && i < length - 1 && j > 0 && j < length - 1;
      if (ret && i % 2 === 0 && j % 2 === 0) {
        targets.push([i, j]);
      }
      return ret;
    })
  );
  shuffle(targets);
  targets.forEach(([i, j], index) => {
    if (!maze[i][j]) {
      return;
    }
    const current = new Set<string>();
    const stack = new Array<Coord>();
    const recursive = ([i, j]: Coord) => {
      maze[i][j] = false;
      current.add(JSON.stringify([i, j]));
      const candidates = DIRS.filter(([di, dj]) => {
        return (
          maze[i + di][j + dj] &&
          !current.has(JSON.stringify([i + di * 2, j + dj * 2]))
        );
      });
      if (candidates.length > 0) {
        stack.push([i, j]);
        const [di, dj] =
          candidates[Math.floor(Math.random() * candidates.length)];
        maze[i + di][j + dj] = false;
        if (maze[i + di * 2][j + dj * 2]) {
          maze[i + di * 2][j + dj * 2] = false;
          recursive([i + di * 2, j + dj * 2]);
        }
      } else {
        recursive(stack.pop()!);
      }
    };
    recursive([i, j]);
  });
  return maze;
}
