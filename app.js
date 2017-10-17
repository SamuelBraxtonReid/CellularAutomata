class App{

  constructor(){
    this.container = document.querySelector("#main");
    this.gridSize = 75;
    this.gameBoard = new Array(this.gridSize);
    for (let row = 0; row < this.gridSize; row++){
      //this.gameBoard[row] = new Array(this.gridSize);
      this.createRow(row);
      for (let column = 0; column < this.gridSize; column++){
        //this.gameBoard[row][column] = 0;
        this.createColumn(row, column);
      }
    }

    /*
    this.gameBoard[11][12] = 1;
    this.gameBoard[11][13] = 1;
    this.gameBoard[12][11] = 1;
    this.gameBoard[12][12] = 1;
    this.gameBoard[13][12] = 1;
    */

    //25: [287,288,311,312,337]
    //75: [2737,2738,2811,2812,2887]
    this.cells = new Set([2737,2738,2811,2812,2887]);
    this.newCells = new Set([2737,2738,2811,2812,2887]);
    this.deadCells = new Set();
    this.testArea = [[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]];
    setInterval(() => {this.setUpdate();},40);
  }

  //modify this for toroidal board and square board, make new method for infinite board
  setUpdate(){

    for (const newCell of this.newCells) {
      const cell = document.querySelector(`[data-column='${newCell}']`);
      cell.style.background = "white"; //problem?
    }

    for (const deadCell of this.deadCells) {
      const cell = document.querySelector(`[data-column='${deadCell}']`);
      cell.style.background = "black";
    }

    const activeCells = [...this.newCells,...this.deadCells];

    const affectedCells = new Set();

    for (const activeCell of activeCells) {
      for (let i = 0; i < this.testArea.length; i++) {
        const cell = activeCell + this.testArea[i][0] * this.gridSize + this.testArea[i][1];
        affectedCells.add(activeCell + this.testArea[i][0] * this.gridSize + this.testArea[i][1]);
      }
    }

    this.newCells.clear();
    this.deadCells.clear();

    for (const affectedCell of affectedCells) {
      if (affectedCell < 0 || affectedCell > Math.pow(this.gridSize,2)) {
        continue;
      }
      let neighbors = 0;
      for (let i = 0; i < this.testArea.length; i++) {
        if (this.cells.has(affectedCell + this.testArea[i][0] * this.gridSize + this.testArea[i][1])) {
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

  update(){
    for (let i = 0; i < this.gameBoard.length; i++){
      for (let j = 0; j < this.gameBoard[i].length; j++){
        let alive = 0;
        if (this.gameBoard[i][j] == 2 || this.gameBoard == 3){
          alive = 1;
        }
        let neighbors = 0;
        let row = i;
        let column = j;
        if (i != 0) {
          row -= 1;
        }
        while (row < this.gameBoard.length && row <= i + 1){
          if (j != 0){
            column = j - 1;
          } else {
            column = 0;
          }
          while (column < this.gameBoard[row].length && column <= j + 1){
            if (this.gameBoard[row][column] == 2 || this.gameBoard[row][column] == 3) {
              neighbors += 1;
            }
            column++;
          }
          row++;
        }
        if (alive == 1) {
          if (neighbors < 3 || neighbors > 4) {
            this.gameBoard[i][j] = 3;
          }
        } else if (neighbors == 3) {
            this.gameBoard[i][j] = 1;
        }
      }
    }
    for (let i = 0; i < this.gameBoard.length; i++){
      for (let j = 0; j < this.gameBoard[i].length; j++){
        const ID = this.gridSize * i + j;
        const cell = document.querySelector(`[data-column='${ID}']`);
        if (this.gameBoard[i][j] == 3){
          cell.style.background = "black";
          this.gameBoard[i][j] = 0;
        } else if (this.gameBoard[i][j] == 1){
          cell.style.background = "white";
          this.gameBoard[i][j] = 2;
        }
      }
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

    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    while (g + b < 255){
      g += Math.round(Math.random() * (255 - g));
      b += Math.round(Math.random() * (255 - b));
    }
    columnDiv.style.background = `rgb(${0},${g},${b})`

    //colomnDiv.style.background = "black";
    document.querySelector(`[data-row='${rowID}']`).appendChild(columnDiv);
  }

}



new App();
