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
let openList;

function createRow(column) {
    let row = [];
    for (let i = 0; i < dim; i++) {
        row[i] = new Node((column * dim + i), column, i);
    }
    return row;
}

function assignWalls() {
    wallCount = 0;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (Math.floor(Math.random() * 100) < wallProbability) {
                map[j][i].isWall = true;
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
    return (pos - (Math.floor(pos/dim) * dim));
}

function fromPosToY(pos) {
    return Math.floor(pos/dim);
}

function pathfind() {
    openList = [];
    let pathFound = false;
    let currentNode;
    openList.push(map[startX][startY]);

    while (openList.length != 0) {
        currentNode = openList.shift();
        assignHCost(currentNode);

        if (currentNode === map[targX][targY]) {
            pathFound = true;
            break;
        }

        addNeighbours(currentNode);
        

        currentNode.isOpen = false;
        currentNode.isClosed = true;
    }

    if (!pathFound) {
        console.log('NO PATH FOUND!');
    } else 
        createFinalPath();

    repaint();

}

function countOpen() {
    let openCounter = 0;
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (map[j][i].isOpen)
                openCounter++;
        }
    }
}

function createFinalPath() {
    let current = map[targX][targY].parent;
    while (current != map[startX][startY]) {
        current.isPath = true;
        current = current.parent;
    }

}

function addNeighbours(node) {
    let neighbour;
    for (let y = -1; y < 2; y++) {
        for (let x = -1; x < 2; x++) {
            if (x === 0 && y === 0)
                continue;
            if (node.xPos + x < 0 || node.xPos + x > (dim - 1))
                continue;
            if (node.yPos + y < 0 || node.yPos + y > (dim - 1))
                continue;
            
            neighbour = map[node.xPos + x][node.yPos + y];
            assignHCost(neighbour);
            let distance = 0;
            if (x === 0 || y === 0)
                distance = 10;
            else
                distance = 14;

            if (!neighbour.isWall && !neighbour.isClosed) {
                if (!neighbour.isOpen || node.gCost + distance < neighbour.gCost) {
                    neighbour.gCost = node.gCost + distance;
                    neighbour.parent = node;
                    if (!neighbour.isOpen) {
                        neighbour.isOpen = true;
                        insertInOpen(neighbour);
                    }
                }
            }
            
            
            
        }
    }
}

function insertInOpen(node) {
        let fCost = node.fCost;
        for (i in openList) {
            if (fCost < openList[i].fCost) {
                openList.splice(i, 0, node); //simple insert
                return;
            }
            else if (fCost === openList[i].fCost) {
                fancyInsert(node, i);
                return;
            }
        }
        openList.push(node);
    }

function fancyInsert(node, index) {
    let hCost = node.hCost;
    let fCost = node.fCost;
    let counter = index;
    while (openList[counter].fCost === fCost) {
        if (hCost > openList[counter].hCost) 
            counter++;
        else {
            openList.splice(counter, 0, node);
            return;
        }
        if (counter >= openList.length) {  
            openList.splice(counter, 0, node);
            return;
        }
    }
    
    openList.splice(counter, 0, node);

    
}
function displayArray(array) {
    for (i in array) {
        console.log(array[i]);
    }
}

function assignHCost(node) {
    let left, right, up, down;
    let hCost = 0;
    let tempNode = node;
    let nodeX = tempNode.xPos;
    let nodeY = tempNode.yPos;
    while (nodeX != targX || nodeY != targY) {
        nodeX = tempNode.xPos;
        nodeY = tempNode.yPos;
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
        let newX = nodeX;
        let newY = nodeY;

        if (up) {
            hCost += 10;
            newY -= 1;
            if (left) {
                hCost += 4;
                newX -= 1;
            } else if (right) {
                hCost += 4;
                newX += 1;
            }
        } else if (down) {
            hCost += 10;
            newY += 1;
            if (left) {
                hCost += 4;
                newX -= 1;
            } else if (right) {
                hCost += 4;
                newX += 1;
            }
        } else if (left) {
            hCost += 10;
            newX -= 1;
        } else if (right) {
            hCost += 10;
            newX += 1;
        }
        tempNode = map[newX][newY];
    }
    node.hCost = hCost;
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
    table.id = 'grid';
    for (let row = 0; row < rows; row++) {
        let rowBox = table.appendChild(document.createElement('tr'));
        for (let col = 0; col < cols; col++) {
            let cell = rowBox.appendChild(document.createElement('td'));
            if (map[col][row].isWall)
                cell.className = 'wall';

            if (map[col][row].isStart)
                cell.id = 'start';

            //uncomment if want to see BTS of algorithm on GUI
         /* if (map[col][row].isTarget)
                cell.id = 'target';

            if (map[col][row].isClosed)
                cell.className = 'closed'; */
            
            if (map[col][row].isOpen)
                cell.className = 'neighbour';

            if (map[col][row].isPath)
                cell.className = 'path';


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