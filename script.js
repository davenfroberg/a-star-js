function Node(position, wall, target, xpos, ypos) {
    this.gCost = 0;
    this.hCost = 0;
    this.open = false;
    this.closed = false;
    this.path = false;
    this.parent = null;
    this.position = position;
    this.wall = wall;
    this.target = target;
    this.xpos = xpos;
    this.ypos = ypos;
}

let dim = 30;
let targPos, startPos;
let wallProbability = 30; // in percent
