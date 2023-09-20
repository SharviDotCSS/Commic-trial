// undoRedo.js

let comicDataArray = [];
let currentPageIndex = -1;
let canvasObjectsArray = [];

export function undo() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    canvasObjectsArray = JSON.parse(JSON.stringify(comicDataArray[currentPageIndex]));
    console.log("Undo clicked");
  }
}

export function redo() {
  if (currentPageIndex < comicDataArray.length - 1) {
    currentPageIndex++;
    canvasObjectsArray = JSON.parse(JSON.stringify(comicDataArray[currentPageIndex]));
    console.log("Redo clicked");
  }
}

export function saveState() {
  const stateCopy = JSON.parse(JSON.stringify(canvasObjectsArray));
  comicDataArray.push(stateCopy);
  currentPageIndex = comicDataArray.length - 1;
  console.log("State saved");
}

