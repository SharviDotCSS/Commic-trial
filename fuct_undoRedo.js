const context = canvas.getContext('2d');
const canvas = document.getElementById('comic-canvas');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');

// Define a stack to store canvas states
const canvasStateStack = [];
let currentStateIndex = -1;

// Function to save the current canvas state
// export function saveState() {
//     const currentCanvasState = context.getImageData(0, 0, canvas.width, canvas.height);
//     canvasStateStack.push(currentCanvasState);
//     currentStateIndex++;
//   }

// Function to undo the last action
export function undo() {
    if (currentStateIndex > 0) {
      currentStateIndex--;
      const previousCanvasState = canvasStateStack[currentStateIndex];
      context.putImageData(previousCanvasState, 0, 0);
      drawCanvas(); // Redraw the canvas with the restored state
    }
  }

// Function to redo the last undone action
export function redo() {
    if (currentStateIndex < canvasStateStack.length - 1) {
      currentStateIndex++;
      const nextCanvasState = canvasStateStack[currentStateIndex];
      context.putImageData(nextCanvasState, 0, 0);
      drawCanvas(); // Redraw the canvas with the restored state
    }
  }

  undoBtn.addEventListener('click', undo);
  redoBtn.addEventListener('click', redo);

  saveState();