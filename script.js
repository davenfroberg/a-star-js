class Node {
    constructor(position, xpos, ypos) {
        this.wall = false;
        this.gCost = 0;
        this.hCost = 0;
        this.open = false;
        this.closed = false;
        this.path = false;
        this.parent = null;
        this.position = position;
        this.isTarget = false;
        this.isStart = false;
        this.xpos = xpos;
        this.ypos = ypos;
    }
}

let dim = 10;
let targPos, startPos;
let wallProbability = 30; // in percent
let map = [];

function createRow(column) {
    let row = [];
    for (let i = 0; i < dim; i++) {
        row[i] = new Node((column * dim + i), i, column);
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

function assignTerminus(terminus) {
    let randomX = 0;
    let randomY = 0;
    do {
        randomX = Math.floor(Math.random() * dim);
        randomY = Math.floor(Math.random() * dim);
    } while (!map[randomX][randomY].wall);
    map[randomX][randomY][terminus] = true;
}


function createMap() {
    for (let i = 0; i < dim; i++) {
        map[i] = createRow(i);
    }
    assignWalls();
    assignTerminus('isStart');
    assignTerminus('isTarget');
}


// -------------------- JavaScript for GUI -----------------------------------

let slider = document.getElementById("slider");
let output = document.getElementById("dimension");


function toggleWall(el, r, c) {
    const node = map[c][r];
    if (!node.isStart && !node.isTarget) {

        if (node.wall) {
            node.wall = false;
        } else {
            node.wall = true;
        }

        repaint();
    }
}


function regenerateMap() {
    document.body.removeChild(grid);
    grid = createGrid(dim, dim, toggleWall, true);
    document.body.appendChild(grid);
}
function repaint() {
    document.body.removeChild(grid);
    grid = createGrid(dim, dim, toggleWall, false);
    document.body.appendChild(grid);
}

slider.oninput = function () {
    dim = this.value;
    output.innerHTML = dim + ' x ' + dim + ' grid';
    regenerateMap();
}

function createGrid(rows, cols, callback, regen) {
    if (regen)
        createMap();

    let table = document.createElement('table');
    table.className = 'grid';
    for (let row = 0; row < rows; row++) {
        let rowBox = table.appendChild(document.createElement('tr'));
        for (let col = 0; col < cols; col++) {
            let cell = rowBox.appendChild(document.createElement('td'));
            if (map[col][row].wall)
                cell.className = 'wall';

            if (map[col][row].isStart)
                cell.id = 'start';

            if (map[col][row].isTarget)
                cell.id = 'target';


            cell.addEventListener('click', (function (el, row, col) {
                return function () {
                    callback(el, row, col);
                }
            })(cell, row, col), false);
        }
    }
    return table;
}

let grid = createGrid(dim, dim, toggleWall, true);
document.body.appendChild(grid);
