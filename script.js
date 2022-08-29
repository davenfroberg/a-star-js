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
        this.xPos = xpos;
        this.yPos = ypos;
    }

    get fCost() {
        return this.gCost + this.hCost;
    }
}

let dim = 10;
let targX, targY, startX, startY;
let wallProbability = 30; // in percent
let wallCount = 0;
let map = [];
const openList = [];

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
    const closedList = [];
    let pathFound = false;
    let current = map[0][0];

    openList.push(map[startY][startX]);
    map[startX][startY].hCost = findHCost(map[startY][startX]);

    while(openList.length != 0) {
        current = openList.shift(); //first aka most optimal Node
        closedList.push(current);
        current.isClosed = true;
        addNeighbours(current, openList, closedList);
        console.log('loop 1');
    }

    if (!pathFound) {
        console.log('There is no path found!');
    } else {
        setFinalPath(current);
    }

    repaint();
}

function setFinalPath(node) {
    let current = node;
        while (current.xPos != startX && current.yPos != startY) {
            current = current.parent;
            current.setPath(true);
            console.log('loop2');
        }
    }

function addNeighbours(current, openList, closedList) {
    // add neighbours to openList in order of lowest F Cost
    // if there's a tie for fCost, then order of lowest hCost
    // if there's a tie for hCost, then order doesn't matter
    // assign parents too

    let xPos = current.xPos;
    let yPos = current.yPos;
    let added = 0;

    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            if (x === 0 && y === 0)
                continue;
            if (xPos + x < 0 || xPos + x > dim - 1) 
                continue;
            if (yPos + y < 0 || yPos + y > dim - 1) 
                continue;

            let neighbour = map[yPos + y][xPos + x];
            console.log('CALLING FUNCTION ON ' + neighbour.xPos + '/' + neighbour.yPos);
            neighbour.hCost = findHCost(neighbour);

            let distance = 0;

            if (x === 0 || y === 0) //moving exclusively horizontally or vertically
                distance = 10;
            else
                distance = 14;

            if (!neighbour.isWall && !neighbour.isClosed) {
                    if (!neighbour.isOpen || !neighbour.gCost > current.gCost + distance) {
                        neighbour.gCost = current.gCost + distance;
                        neighbour.parent = current;
                        if (!neighbour.isOpen) {
                            neighbour.isOpen = true;
                            addToOpenList(neighbour);
                            added++;
                        }
                    }
            }
        }
    }

    console.log('ADDED: ' + added);

}

function addToOpenList(node) {
    const fCost = node.fCost;
    for (i = 0; i < openList.length-1; i++) {
        if (openList[i].fCost < fCost)
            continue;
        else if (openList[i].fCost > fCost) {
            openList.splice(i, 0, node);
            break;
        }
        else if (openList[i].fCost === fCost)
            fancyInsert(i, node);
    }
}

function fancyInsert(index, node) {
    const hCost = node.hCost;
    while (openList[index].hCost === hCost) {
        if (openList[index].fCost >= fCost) {
            openList.splice(index, 0, node);
            break;
        }
        index++;
        console.log('loop3');
    }
}

function findHCost(node) {
    let currentNode = node;
    let nodeX = currentNode.xPos;
    let nodeY = currentNode.yPos;

    let hCost = 0;
    let left, right, up, down;

    while (nodeX != targX || nodeY != targY) {
        console.log('TARGX: ' + targX);
        console.log('TARGY: ' + targY);
        console.log('NODE Y: ' + nodeY);
        console.log('NODE X: ' + nodeX);
        console.log('loop4');
        left = false;
        right = false;
        up = false;
        down = false;

        if (nodeX > targX)
            left = true;
        else if (nodeX < targX)
            right = true;

        if (nodeY > targY)
            up = true;
        else if (nodeY < targY)
            down = true;

        if (up) 
            if (left) {
                currentNode = map[nodeY - 1][nodeX - 1];
                hCost += 14;
            } else if (right) {
                currentNode = map[nodeY - 1][nodeX + 1];
                hCost += 14;
            } else {
                currentNode = map[nodeY-1][nodeX];
                hCost += 10;
            }
        else if (down)
            if (left) {
                currentNode = map[nodeY + 1][nodeX - 1];
                hCost += 14;
            } else if (right) {
                currentNode = map[nodeY + 1][nodeX + 1];
                hCost += 14;
            } else {
                currentNode = map[nodeY + 1][nodeX];
                hCost += 10;
            }

        else if (right) {
            currentNode = map[nodeY][nodeX + 1];
            hCost += 10;
        } else if (left) {
            currentNode = map[nodeY][nodeX - 1];
            hCost += 10;
        }

        console.log('HCOST: ' + hCost);
        nodeY = currentNode.yPos;
        nodeX = currentNode.xPos;
    }
        return hCost;
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
                map[startY][startX].isStart = false;
                startX = c;
                startY = r;
            }
        } else if (assigningTarget) {
            if (!node.isWall) {
                node.isTarget = true;
                map[targY][targX].isTarget = false;
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
            if (map[row][col].isWall)
                cell.className = 'wall';

            if (map[row][col].isStart)
                cell.id = 'start';

            if (map[row][col].isTarget)
                cell.id = 'target';

            if (map[row][col].isPath)
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

console.log(map[startX][startY].isStart);
console.log('startX ' + startX + ' startY' + startY);
console.log(map[targX][targY].isTarget);
console.log('targX ' + targX + ' targY' + targY);