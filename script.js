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
let targX, targY, startX, startY;
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

function randomAssignTerminus(terminus) {
    let randomX = 0;
    let randomY = 0;
    do {
        randomX = Math.floor(Math.random() * dim);
        randomY = Math.floor(Math.random() * dim);
    } while (map[randomX][randomY].wall);
    map[randomX][randomY][terminus] = true;
    return (randomY * dim + randomX);
}

function createMap() {
    for (let i = 0; i < dim; i++) {
        map[i] = createRow(i);
    }
    assignWalls();

    let startPos = randomAssignTerminus('isStart');
    let targPos = randomAssignTerminus('isTarget');

    startX = fromPosToX(startPos);
    startY = fromPosToY(startPos);
    targX = fromPosToX(targPos);
    targY = fromPosToY(targPos);
}

function fromPosToX(pos) {
    return pos - Math.floor(pos/dim) * dim;
}

function fromPosToY(pos) {
    return Math.floor(pos/dim);
}

// -------------------- JavaScript for GUI -----------------------------------

let slider = document.getElementById("slider");
let output = document.getElementById("dimension");
let assigningStart = false;
let assigningTarget = false;

function clickStart(startButton, targetButton) {
    assigningTarget = false;
    targetButton.className = 'unselected';
    if (!assigningStart) {
        assigningStart = true;
        startButton.className = 'selected';
    }
    else {
        assigningStart = false;
        startButton.className = 'unselected';
    }
}

function clickTarget(targetButton, startButton) {
    assigningStart = false;
    startButton.className = 'unselected';

    if (!assigningTarget) {
        assigningTarget = true;
        targetButton.className = 'selected';
    }
    else {
        assigningTarget = false;
        targetButton.className = 'unselected';
    }
}

function clickCell(el, r, c) {
    const node = map[c][r];
    if (!node.isStart && !node.isTarget) {
        if (assigningStart) {
            if (!node.wall) {
                node.isStart = true;
                map[startX][startY].isStart = false;
                startX = c;
                startY = r;
            }
        } else if (assigningTarget) {
            if (!node.wall) {
                node.isTarget = true;
                map[targX][targY].isTarget = false;
                targX = c;
                targY = r;
            }
        } else {
            console.log('click!');
            if (node.wall) {
                node.wall = false;
            } else {
                node.wall = true;
            }
        }
        repaint();
    }
}


function regenerateMap() {
    document.body.removeChild(grid);
    grid = createGrid(dim, dim, clickCell, true);
    document.body.appendChild(grid);
}
function repaint() {
    document.body.removeChild(grid);
    grid = createGrid(dim, dim, clickCell, false);
    document.body.appendChild(grid);
}

slider.oninput = function () {
    dim = this.value;
    output.innerHTML = dim + ' x ' + dim + ' grid';
    regenerateMap();
}

function handleButtons() {
    let startButton = document.getElementById('start-button');
    let targetButton = document.getElementById('target-button');

    startButton.addEventListener('click', function() {
        clickStart(startButton, targetButton);
      });

    targetButton.addEventListener('click', function() {
        clickTarget(targetButton, startButton);
      });
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

handleButtons();

let grid = createGrid(dim, dim, clickCell, true);
document.body.appendChild(grid);