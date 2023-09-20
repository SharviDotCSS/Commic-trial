//main.js: Entry point to js

//importing
import { initializeAddDialogue } from './AddDialogue.js';
import { addDraggableTextToCanvas } from './AddDialogue.js';

const canvas = document.getElementById('comic-canvas');
const context = canvas.getContext('2d');
const assetLibrary = document.querySelectorAll('.comic-asset');
const dialogueText = document.getElementById('dialogue-text');//textInput
const addDialogueBtn = document.getElementById('add-dialogue-btn');//addTextBtn
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const addPageBtn = document.getElementById('add-page-btn');
const deletePageBtn = document.getElementById('delete-page-btn');
const previewBtn = document.getElementById('preview-btn');
// Get the asset library images
const comicAssets = document.querySelectorAll(".comic-asset");

// Define a stack to store canvas states
const canvasStateStack = [];
let currentStateIndex = -1;

// Add event listeners to the asset library images for 'dragstart', 'dragend', and 'dragover' events.
comicAssets.forEach(asset => {
    asset.addEventListener("dragstart", handleDragStart);
    asset.addEventListener("dragend", handleDragEnd);
    asset.addEventListener("dragover", handleDragOver);
  });

// Add event listeners to the canvas for 'dragover', 'dragenter', 'dragleave', and 'drop' events.
canvas.addEventListener("dragover", handleDragOverCanvas);
canvas.addEventListener("dragenter", handleDragEnterCanvas);
canvas.addEventListener("dragleave", handleDragLeaveCanvas);
canvas.addEventListener("drop", handleDrop);

// Drag and drop event handlers
// Handle the 'dragstart' event when dragging an image from the asset library.
function handleDragStart(event) {
    const draggedAsset = event.target;
    event.dataTransfer.setData("text/plain", draggedAsset.src);
    saveState(); // Save the current state after dropping the image
  }

function handleDragEnd(event) {
    // Clean up if needed
  }  

// Handle the 'dragover' event for the asset library images.
function handleDragOver(event) {
  event.preventDefault();
  saveState(); // Save the current state after dropping the image
}

// Handle the 'dragover' event for the canvas.
function handleDragOverCanvas(event) {
  event.preventDefault();
  saveState(); // Save the current state after dropping the image
}

// Handle the 'dragenter' event for the canvas.
function handleDragEnterCanvas(event) {
  event.preventDefault();
  canvas.classList.add("canvas-over");
  saveState(); // Save the current state after dropping the image
}

// Handle the 'dragleave' event for the canvas.
function handleDragLeaveCanvas(event) {
  event.preventDefault();
  canvas.classList.remove("canvas-over");
  saveState(); // Save the current state after dropping the image
}

// Handle the 'drop' event when dropping an image onto the canvas.
function handleDrop(event) {
  event.preventDefault();
  canvas.classList.remove("canvas-over");
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const imageUrl = event.dataTransfer.getData("text/plain");
  drawAssetOnCanvas(imageUrl, x, y);
  saveState(); // Save the current state after dropping the image
  drawCanvas();
}

function drawAssetOnCanvas(imageUrl, x, y) {
  const img = new Image();
  img.src = imageUrl;
  img.onload = function () {
    context.drawImage(img, x, y);

    // Save the current state after placing the image on the canvas
    saveState();
  };
}

function drawCanvas() {
    // Retrieve comic data for the current page and draw elements on the canvas
    // Implement drawing functionality based on comicData (not implemented in this example)
    clearCanvas();
  
    for (const element of canvasObjects) {
      if (element.type === "image") {
        const img = new Image();
        img.src = element.src;
        img.onload = function () {
          context.drawImage(img, element.x, element.y, element.width, element.height);
          console.log("drawCanvas called");
        };
      }
      // Add more conditions for other types of elements (text, shapes, etc.)      
    
    }
  }

  function saveState() {
    console.log("state saved");
    const currentCanvasState = context.getImageData(0, 0, canvas.width, canvas.height);
    canvasStateStack.push(currentCanvasState);
    
    console.log(currentCanvasState);
    console.log("canvasstatestack",canvasStateStack);
    currentStateIndex++;
  
  }

  function undo() {
    if (currentStateIndex > 0) {
      currentStateIndex--;
      const previousCanvasState = canvasStateStack[currentStateIndex];
      context.putImageData(previousCanvasState, 0, 0);
      console.log("Undo performed");
    }
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
  }

  undoBtn.addEventListener('click', () => {
    undo(); // Call the undo function when the button is clicked
  });

// Initialize the "Add Dialogue" functionality
initializeAddDialogue(dialogueText, context);
addDraggableTextToCanvas(canvas, context);
