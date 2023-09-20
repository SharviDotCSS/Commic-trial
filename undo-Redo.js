//undo-Redo.js
// let comicDataArray = [];
// let currentPageIndex = -1;
// let canvasObjectsArray = [];

// Initialize canvas state variables
let canvasObjects = []; // This will store your canvas objects
let canvasStateStack = []; // This will store the history of canvas states
let currentStateIndex = -1; // Index of the current state

export class CanvasState {
    constructor(canvasObjects) {
      this.canvasObjects = canvasObjects;
    }
  }
  

export function saveState() {
    currentStateIndex++;
    canvasStateStack.splice(currentStateIndex);
    canvasStateStack.push(JSON.stringify(canvasObjects));
    console.log(canvasStateStack);
  }

export function undo() {
    if (currentStateIndex > 0) {
      currentStateIndex--;
      canvasObjects = JSON.parse(canvasStateStack[currentStateIndex]);
      drawCanvas();
    }
  }

// export function undo() {
//     console.log("undo clicked");

//     for (let i = 0; i < comicDataArray.length; i++) {
//         console.log(`State ${i}:`, comicDataArray[i]);
//       }

//   if (currentPageIndex > 0) {
//     currentPageIndex--;
//     canvasObjectsArray = JSON.parse(JSON.stringify(comicDataArray[currentPageIndex]));
//     console.log("Undo clicked");
//   }
// }

export function redo() {
    console.log("Redo clicked");
  if (currentPageIndex < comicDataArray.length - 1) {
    currentPageIndex++;
    canvasObjectsArray = JSON.parse(JSON.stringify(comicDataArray[currentPageIndex]));
    console.log("Redo clicked");
  }
}

// Function to capture the current canvas state and add it to comicData
//  function saveState() {
//     console.log("state sved");
//     const currentState = new CanvasState(canvasObjectsArray.slice()); // Create a copy of canvasObjects
//     comicDataArray.push(currentState);
//   }

// export function saveState() {
//   const stateCopy = JSON.parse(JSON.stringify(canvasObjectsArray));
//   comicDataArray.push(stateCopy);
//   currentPageIndex = comicDataArray.length - 1;
//   console.log("State saved");
// }