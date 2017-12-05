
class App{

  //jsonplaceholder

  constructor(dimension){
    document.querySelectorAll(".selectColumn").forEach((column)=>{
      column.addEventListener("click",this.toggleColor.bind(this));
    });
    this.testArea = [[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]];
    for (let i = 0; i < this.testArea.length; i++) {
      const cellID = this.testArea[i].join(",");
      const cell = document.querySelector(`[data-id='${cellID}']`);
      cell.style.background = 'rgb(97, 97, 97)';
      cell.setAttribute('data-active','1');
    }
    this.maxNeighbors = 3;
    this.minNeighbors = 2;
    this.maxParents = 3;
    this.minParents = 3;
    this.intervalId = null;
    this.interval = 100;
    this.start(dimension);
  }

  prepStartingConfiguration() {
    for (const deadCell of this.deadCells) {
      this.cells.delete(deadCell)
    }
    for (const newCell of this.newCells) {
      this.cells.add(newCell)
    }
    this.newCells = new Set([...this.cells.values()]);
    for (const newCell of this.newCells) {
      for (let i = 0; i < this.testArea.length; i++) {
        let cell = newCell + this.testArea[i][0] * this.gridSize + this.testArea[i][1];
        if (cell < 0 || cell >= this.gridSize**2) {
          continue;
        }
        if (Math.abs((cell % this.gridSize) - (newCell % this.gridSize)) > 2) {
          continue;
        }
        if (this.newCells.has(cell) || this.deadCells.has(cell)) {
          break;
        }
        this.deadCells.add(cell);
        break;
      }
    }
  }

  playPause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      document.getElementById("pausePlay").firstChild.data = "play";
    } else {
      this.intervalId = setInterval(() => {app.update();},this.interval);
      document.getElementById("pausePlay").firstChild.data = "pause";
    }
  }

  toggleColor(e) {
    const cell = e.target;
    let test = cell.getAttribute('data-id').split(',');
    for (let i = 0; i < 2; i++){
      test[i] = parseInt(test[i]);
    }
    if (cell.getAttribute('data-active') === '0') {
      cell.style.background = 'rgb(97, 97, 97)';
      cell.setAttribute('data-active','1');
      this.testArea.push(test);
    } else {
      cell.style.background = 'rgb(158, 158, 158)'
      cell.setAttribute('data-active','0');
      for (let i = 0; i < this.testArea.length; i++) {
        if (this.testArea[i][0] === test[0] && this.testArea[i][1] === test[1]) {
          this.testArea.splice(i,1);
          break;
        }
      }
    }
    this.prepStartingConfiguration();
  }

  update(){
    for (const newCell of this.newCells) {
      const cell = document.querySelector(`[data-column='${newCell}']`);
      cell.style.background = "cyan";
    }
    for (const deadCell of this.deadCells) {
      const cell = document.querySelector(`[data-column='${deadCell}']`);
      cell.style.background = "black";
    }
    const activeCells = [...this.newCells,...this.deadCells];
    const affectedCells = new Set();
    for (const activeCell of activeCells) {
      for (let i = 0; i < this.testArea.length; i++) {
        let cell = activeCell + this.testArea[i][0] * this.gridSize + this.testArea[i][1];
        if (cell < 0) {
          cell += this.gridSize**2;
        } else if (cell >= this.gridSize**2) {
          cell -= this.gridSize**2;
        }
        if (Math.abs((cell % this.gridSize) - (activeCell % this.gridSize)) > 2) {
            cell -= this.testArea[i][1] * this.gridSize;
            if (cell < 0) {
              cell += this.gridSize**2;
            } else if (cell >= this.gridSize**2) {
              cell -= this.gridSize**2;
            }
        }
        affectedCells.add(cell);
      }
    }
    this.newCells.clear();
    this.deadCells.clear();
    for (const affectedCell of affectedCells) {
      let neighbors = 0;
      for (let i = 0; i < this.testArea.length; i++) {
        let testCell = affectedCell + this.testArea[i][0] * this.gridSize + this.testArea[i][1];
        if (testCell < 0) {
          testCell += this.gridSize**2;
        } else if (testCell >= this.gridSize**2) {
          testCell -= this.gridSize**2;
        }
        if (Math.abs((testCell % this.gridSize) - (affectedCell % this.gridSize)) > 2) {
          testCell -= this.testArea[i][1] * this.gridSize;
          if (testCell < 0) {
            testCell += this.gridSize**2;
          } else if (testCell >= this.gridSize**2) {
            testCell -= this.gridSize**2;
          }
        }
        if (this.cells.has(testCell)) {
          neighbors += 1;
        }
      }
      if (this.cells.has(affectedCell)) {
        if (neighbors < this.minNeighbors || neighbors > this.maxNeighbors) {
          this.deadCells.add(affectedCell);
        }
      } else if (neighbors >= this.minParents && neighbors <= this.maxParents) {
        this.newCells.add(affectedCell);
      }
    }
    for (const deadCell of this.deadCells) {
      this.cells.delete(deadCell);
    }
    for (const newCell of this.newCells) {
      this.cells.add(newCell);
    }
  }

  createRow(rowID){
    const rowDiv = document.createElement("div");
    rowDiv.style.height=`${this.container.clientHeight/this.gridSize}px`
    rowDiv.classList.add("row");
    rowDiv.dataset.row=`${rowID}`
    this.container.appendChild(rowDiv);
  }

  createColumn(rowID,columnID){
    const ID = this.gridSize * rowID + columnID;
    const columnDiv = document.createElement("div");
    columnDiv.style.width=`${this.container.clientWidth/this.gridSize}px`;
    columnDiv.classList.add("column");
    columnDiv.dataset.column=`${ID}`;
    columnDiv.style.background = 'black'
    document.querySelector(`[data-row='${rowID}']`).appendChild(columnDiv);
  }

  start(dimension){
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.container = document.querySelector("#main");
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.gridSize = dimension;
    for (let row = 0; row < this.gridSize; row++){
      this.createRow(row);
      for (let column = 0; column < this.gridSize; column++){
        this.createColumn(row, column);
      }
    }
    this.cells = new Set();
    this.newCells = new Set();
    this.deadCells = new Set();
    this.intervalId = setInterval(() => {this.update();},this.interval);
    document.getElementById("pausePlay").firstChild.data = "pause";
    document.querySelectorAll(".column").forEach((column)=>{
      column.addEventListener("click",this.makeAlive.bind(this));
    });
  }



  makeAlive(e) {
    if (this.intervalId) {
      this.playPause();
    }
    const cell = e.target;
    let test = cell.getAttribute('data-column');
    test = parseInt(test);
    if (!(cell.style.backgroundColor === 'cyan')) {
      cell.style.background = 'cyan';
      this.newCells.add(test);
      this.deadCells.delete(test);
    } else {
      cell.style.background = 'black';
      this.deadCells.add(test);
      this.newCells.delete(test);
    }
    this.prepStartingConfiguration();
  }

}

const app = new App(40);

function updateGridSize(){
  const dimension = document.getElementById("sample4").value;
  const maxNeighbors = document.getElementById("maxNeighbors").value;
  const minNeighbors = document.getElementById("minNeighbors").value;
  const maxParents = document.getElementById("maxParents").value;
  const minParents = document.getElementById("minParents").value;
  if (dimension && dimension != app.gridSize) {
    app.start(dimension);
  }
  if (maxNeighbors) {
    app.maxNeighbors = maxNeighbors;
  }
  if (minNeighbors) {
    app.minNeighbors = minNeighbors;
  }
  if (maxParents) {
    app.maxParents = maxParents;
  }
  if (minParents) {
    app.minParents = minParents;
  }
  app.prepStartingConfiguration();
}

function togglePausePlay(){
  app.playPause();
}

function clearBoard() {
  if (app.intervalId) {
    app.playPause();
  }
  app.deadCells = new Set([...app.newCells,...app.cells,...app.deadCells]);
  app.newCells = new Set();
  app.cells = new Set();
  app.update();
  app.playPause();
}
