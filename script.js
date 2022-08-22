class Node {
    constructor(position, xpos, ypos) {
        this.isWall = false;
        this.gCost = 0;
        this.hCost = 0;
        this.isOpen = false;
        this.isClosed = false;
        this.isPath = false;
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
let wallCount = 0;
let map = [];

function createRow(column) {
    let row = [];
    for (let i = 0; i < dim; i++) {
        row[i] = new Node((column * dim + i), i, column);
    }
    return row;
}

function assignWalls() {
    wallCount = 0;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (Math.floor(Math.random() * 100) < wallProbability) {
                map[i][j].isWall = true;
                wallCount ++;
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
    } while (map[randomX][randomY].isWall || map[randomX][randomY].isStart || map[randomX][randomY].isTarget);

    map[randomX][randomY][terminus] = true;
    return (randomY * dim + randomX);
}

function createMap() {
    for (let i = 0; i < dim; i++) {
        map[i] = createRow(i);
    }

    assignWalls();

    if (wallCount <= dim*dim - 2) {
        let startPos = randomAssignTerminus('isStart');
        let targPos = randomAssignTerminus('isTarget');

        startX = fromPosToX(startPos);
        startY = fromPosToY(startPos);
        targX = fromPosToX(targPos);
        targY = fromPosToY(targPos);
    }
}

function fromPosToX(pos) {
    return pos - Math.floor(pos/dim) * dim;
}

function fromPosToY(pos) {
    return Math.floor(pos/dim);
}

function pathfind() {
    const openList = [];
    const closedList = [];
    let openCounter = 1; //the start node is already in the open list
    let closedCounter = 0;
    let pathFound = false;
    let current = map[0][0];
}

function init() {
    
}

function lowestFCost() {

}


// ---------------------------- JavaScript for GUI -----------------------------------

let dimSlider = document.getElementById("dim-slider");
let dimText = document.getElementById("dimension");

let wallSlider = document.getElementById('wall-slider');
let wallText = document.getElementById('probability');

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

function generate() {
    dim = dimSlider.value;
    wallProbability = wallSlider.value;
    regenerateMap();
}

function clickCell(el, r, c) {
    const node = map[c][r];
    if (!node.isStart && !node.isTarget) {
        if (assigningStart) {
            if (!node.isWall) {
                node.isStart = true;
                map[startX][startY].isStart = false;
                startX = c;
                startY = r;
            }
        } else if (assigningTarget) {
            if (!node.isWall) {
                node.isTarget = true;
                map[targX][targY].isTarget = false;
                targX = c;
                targY = r;
            }
        } else {
            console.log('click!');
            if (node.isWall) {
                node.isWall = false;
            } else {
                node.isWall = true;
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

dimSlider.oninput = function () {
    dimText.innerHTML = this.value + ' x ' + this.value + ' grid';
}

wallSlider.oninput = function () {
    wallText.innerHTML = this.value + '% wall probability';
}

function handleButtons() {
    let startButton = document.getElementById('start-button');
    let targetButton = document.getElementById('target-button');
    let generateButton = document.getElementById('generate');
    let pathfindButton = document.getElementById('pathfind');

    startButton.addEventListener('click', function() {
        clickStart(startButton, targetButton);
      });

    targetButton.addEventListener('click', function() {
        clickTarget(targetButton, startButton);
      });

    generateButton.addEventListener('click', generate);

    pathfindButton.addEventListener('click', function() {
        pathfind();
    })


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
            if (map[col][row].isWall)
                cell.className = 'wall';

            if (map[col][row].isStart)
                cell.id = 'start';

            if (map[col][row].isTarget)
                cell.id = 'target';

            if (map[col][row].isPath)
                cell.id = 'path';


            cell.addEventListener('click', (function (el, row, col) {
                return function () {
                    callback(el, row, col);
                }
            })(cell, row, col), false);
        }
    }
    return table;
}


let grid = createGrid(dim, dim, clickCell, true);
document.body.appendChild(grid);

handleButtons();