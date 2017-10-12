/*
const box = document.createElement("div");
box.style.width = "100px";
box.style.height = "100px";
box.style.background = "black";
const container = document.querySelector("#main");
container.appendChild(box);
*/
class App {

  constructor(){
    this.container = document.querySelector("#main");
    this.gridSize = 49;
    this.gameBoard = new Array(this.gridSize);
    for (let row = 0; row < this.gridSize; row++){
      this.gameBoard[row] = new Array(this.gridSize);
      this.createRow(row);
      for (let column = 0; column < this.gridSize; column++){
        this.gameBoard[row][column] = 0;
        this.createColumn(row, column);
      }
    }
    this.run();
  }

  run(){
    this.gameBoard[23][24] = 1;
    this.gameBoard[23][25] = 1;
    this.gameBoard[24][23] = 1;
    this.gameBoard[24][24] = 1;
    this.gameBoard[25][24] = 1;
    for (let i = 0; i < 10; i++){
      this.updateScreen();
      this.updateBoard();
    }
  }

  updateBoard(){
    for (let i = 0; i < this.gameBoard.length; i++){
      for (let j = 0; j < this.gameBoard[i].length; j++){
        let alive = 0;
        if (this.gameBoard[i][j] == 1 || this.gameBoard == 2){
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
            if (this.gameBoard[row][column] == 1 || this.gameBoard[row][column] == 2) {
              neighbors += 1;
            }
            column++;
          }
          row++;
        }
        if (alive == 1) {
          if (neighbors < 3 || neighbors > 4) {
            this.gameBoard[i][j] = 2;
          }
        } else if (neighbors == 3) {
            this.gameBoard[i][j] = 3;
        }
      }
    }
    for (let i = 0; i < this.gameBoard.length; i++){
      for (let j = 0; j < this.gameBoard[i].length; j++){
        if (this.gameBoard[i][j] == 2){
          this.gameBoard[i][j] = 0;
        } else if (this.gameBoard[i][j] == 3){
          this.gameBoard[i][j] = 1;
        }
      }
    }
  }

  updateScreen(){
    for (let i = 0; i < this.gameBoard.length; i++){
      for (let j = 0; j < this.gameBoard.length; j++){
        const ID = this.gridSize * i + j;
        const cell = document.querySelector(`[data-column='${ID}']`);
        if (this.gameBoard[i][j] == 0){
          cell.style.background = "grey";
        } else if (this.gameBoard[i][j] == 1) {
          cell.style.background = "black";
        } else {
          cell.style.background = "red";
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
    columnDiv.style.width=`${this.container.clientWidth/this.gridSize}px`
    columnDiv.classList.add("column");
    columnDiv.dataset.column=`${ID}`;
    columnDiv.style.background = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`
    document.querySelector(`[data-row='${rowID}']`).appendChild(columnDiv);
  }

}

new App();
