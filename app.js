
class App{

  constructor(dimension){
    this.testArea = [[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]];
    var self = this;
    document.querySelectorAll(".selectColumn").forEach((column)=>{
      column.addEventListener("click",this.toggleColor.bind(this));
    });
    for (let i = 0; i < this.testArea.length; i++) {
      const cellID = this.testArea[i].join(",");
      document.querySelector(`[data-id='${cellID}']`).style.background = 'rgb(97, 97, 97)';
    }
    this.start(dimension);
  }

  prepStartingConfiguration() {
    this.deadCells = new Set();
    for (const newCell of this.newCells) {
      for (let i = 0; i < this.testArea.length; i++) {
        let cell = newCell + this.testArea[i][0] * this.gridSize + this.testArea[i][1];
        if (cell < 0 || cell >= this.gridSize**2) {
          continue;
        }
        if (this.newCells.has(cell)) {
          break;
        }
        this.deadCells.add(cell);
        break;
      }
    }
  }

  toggleColor(e) {
    const cell = e.target;
    const color = window.getComputedStyle(cell).backgroundColor;
    let test = cell.getAttribute('data-id').split(',');
    for (let i = 0; i < 2; i++){
      test[i] = parseInt(test[i]);
    }
    if (color === 'rgb(158, 158, 158)') {
      cell.style.background = 'rgb(97, 97, 97)';
      this.testArea.push(test);
    } else if (color === 'rgb(97, 97, 97)') {
      cell.style.background = 'rgb(158, 158, 158)';
      for (let i = 0; i < this.testArea.length; i++) {
        if (this.testArea[i][0] === test[0] && this.testArea[i][1] === test[1]) {
          this.testArea.splice(i,1);
          break;
        }
      }
    }
  }

  setUpdate(){
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
        if (Math.abs((cell % this.gridSize) - (activeCell % this.gridSize)) > 1) {
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
        if (Math.abs((testCell % this.gridSize) - (affectedCell % this.gridSize)) > 1) {
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
    columnDiv.style.background = `rgb(${0},${g},${b})`
    */
    columnDiv.style.background = "black";
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
    this.cells = new Set([5050,5149,5249,5253,5349,5350,5351,5352]);
    this.newCells = new Set([5050,5149,5249,5253,5349,5350,5351,5352]);
    this.deadCells = new Set();
    this.prepStartingConfiguration();
    this.intervalId = setInterval(() => {this.setUpdate();},100);
  }

}

const app = new App(100)

function hello(){
  const dimension = document.getElementById("sample4").value;
  if (dimension && dimension != app.gridSize) {
    app.start(dimension);
  }
}
