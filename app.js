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
    this.gridSize = 30;
    for (let row = 0; row < this.gridSize; row++){
      this.createRow(row);
      for (let column = 0; column < this.gridSize; column++){
        this.createColumn(row, column);
      }
    }
  }

  createRow(rowID){
    const div = document.createElement("div");
    div.style.height=`${this.container.clientHeight/this.gridSize}px`
    div.classList.add("row");
    div.dataset.row=`${rowID}`
    this.container.appendChild(div);
  }

  createColumn(rowID,columnID){
    const ID = this.gridSize * rowID + columnID;
    const div = document.createElement("div");
    div.style.width=`${this.container.clientWidth/this.gridSize}px`
    div.classList.add("column");
    div.dataset.column=`${ID}`;
    div.style.background = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`
    document.querySelector(`[data-row='${rowID}']`).appendChild(div);
  }
  
}

new App();
