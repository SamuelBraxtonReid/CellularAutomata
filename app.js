/*
const box = document.createElement("div");
box.style.width = "100px";
box.style.height = "100px";
box.style.background = "black";
const container = document.querySelector("#main");
container.appendChild(box);
*/
const container = document.querySelector("#main");
const gridSize = 3;
for (let row = 0; row < gridSize; row++){
  createRow(row);
  for (let column = 0; column < gridSize; column++){
    createColumn(row, column);
  }
}

function createRow(rowID){
  const div = document.createElement("div");
  div.style.height=`${container.clientHeight/gridSize}px`
  div.classList.add("row");
  div.dataset.row=`${rowID}`
  container.appendChild(div);
}

function createColumn(rowID,columnID){
  const ID = gridSize * rowID + columnID;
  const div = document.createElement("div");
  div.style.width=`${container.clientWidth/gridSize}px`
  div.classList.add("column");
  div.dataset.column=`${ID}`;
  document.querySelector(`[data-row='${rowID}']`).appendChild(div);
}
