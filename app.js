
class App{

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
      cell.style.background = "white";
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
        if (neighbors < 2 || neighbors > 3) {
          this.deadCells.add(affectedCell);
        }
      } else if (neighbors === 3) {
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
    /*
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    while (g + b < 255){
      g += Math.round(Math.random() * (255 - g));
      b += Math.round(Math.random() * (255 - b));
    }
    */
    //columnDiv.style.background = `rgb(${0},${g},${b})`
    columnDiv.style.background = 'black'
    document.querySelector(`[data-row='${rowID}']`).appendChild(columnDiv);
  }

  start(dimension){
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
    this.prepStartingConfiguration();
    this.intervalId = setInterval(() => {this.update();},100);
    document.getElementById("pausePlay").firstChild.data = "pause";
    document.querySelectorAll(".column").forEach((column)=>{
      column.addEventListener("click",this.makeAlive.bind(this));
    });
  }

  makeAlive(e) {
    const cell = e.target;
    let test = cell.getAttribute('data-column');
    test = parseInt(test);
    if (!(cell.style.backgroundColor === 'white')) {
      cell.style.background = 'white';
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

const app = new App(100);

function updateGridSize(){
  const dimension = document.getElementById("sample4").value;
  if (dimension && dimension != app.gridSize) {
    app.start(dimension);
  }
}

function togglePausePlay(){
  if (app.intervalId) {
    clearInterval(app.intervalId);
    app.intervalId = null;
    document.getElementById("pausePlay").firstChild.data = "play";
  } else {
    app.intervalId = setInterval(() => {app.update();},100);
    document.getElementById("pausePlay").firstChild.data = "pause";
  }
}
