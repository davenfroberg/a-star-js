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
let map = [];

function createRow() {
    let row = [];
    for (let i = 0; i < dim; i++) {
        row[i] = new Node();
    }
    return row;
}

function assignWalls() {
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (Math.floor(Math.random() * 100) < wallProbability) {
                map[i][j].wall = true;
            }
        }
    }
}

function createMap() {
    for (let i = 0; i < dim; i++) {
        map[i] = createRow();
    }
    assignWalls();
}


