//main.js: Entry point to js

//importing
import { initializeAddDialogue } from './AddDialogue.js';
import { addDraggableTextToCanvas } from './AddDialogue.js';
//  import {undo, redo} from './fuct_undoRedo.js';


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
context.willReadFrequently = true; // Set willReadFrequently to true for performance optimization


// Define a stack to store canvas states
const canvasStateStack = [];
let currentStateIndex = -1;

 const canvasObjects = []; // Initialize it as an empty array

 const restore_array = []; // Define the restore_array array

// Initialize a variable to store the canvas state as a data URL
// let canvasDataUrl = canvas.toDataURL('image/png');

 // Example object representing an image
  const imageObject = {
    type: "image",        // Type of the element (image, text, shape, etc.)
    src: "image_url.jpg", // Image source URL or data
    x: 100,               // X-coordinate on the canvas
    y: 100,               // Y-coordinate on the canvas
    width: 200,           // Width of the element (for images, shapes, etc.)
    height: 150           // Height of the element
  };

// Push the imageObject into the canvasObjects array
  canvasObjects.push(imageObject);

//  const textObject = {
//    type: "text",         // Type of the element (image, text, shape, etc.)
//    text: "Hello, World!", // Text content
//    x: 50,                // X-coordinate on the canvas
//    y: 50,                // Y-coordinate on the canvas
//    font: "16px Arial",   // Font and font size
//    color: "black"        // Text color
//  };

 // Push the textObject into the canvasObjects array
//  canvasObjects.push(textObject);


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
saveState();

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
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;
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
  drawCanvas(); // Redraw the canvas


 }

// function handleDrop(event) {
//   event.preventDefault();
//   canvas.classList.remove("canvas-over");
//   const rect = canvas.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   drawAssetOnCanvas(currentImageUrl, x, y); // Pass the URL of the dragged image
//   saveState();
//   drawCanvas();
// }


// let currentImageUrl; // Variable to store the URL of the currently dragged image

// comicAssets.forEach(asset => {
//     asset.addEventListener("dragstart", function (event) {
//         const draggedAsset = event.target;
//         currentImageUrl = draggedAsset.src; // Store the URL of the dragged image
//         console.log(currentImageUrl); // Debugging line
//         event.dataTransfer.setData("text/plain", currentImageUrl);
//         saveState();
//     });
// });


function drawAssetOnCanvas(imageUrl, x, y) {
  const img = new Image();
  img.src = imageUrl;
  console.log("draws asset on canvas");
  console.log(imageUrl);
  img.onload = function () {
    context.drawImage(img, x, y);

    // Save the current state after placing the image on the canvas
    saveState();
    drawCanvas();


  };
}

function drawCanvas() {
  // Retrieve comic data for the current page and draw elements on the canvas
  // Implement drawing functionality based on comicData (not implemented in this example)
  // clearCanvas();
  console.log("drawCanvas called");

  // Clear the canvas first
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Retrieve the last ImageData from the canvas state stack
  if (canvasStateStack.length > 0) {
    const previousCanvasState = canvasStateStack[canvasStateStack.length - 1];
    context.putImageData(previousCanvasState, 0, 0);
  }

  for (const element of canvasObjects) {
    console.log(canvasObjects);
    
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
  
  saveState();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
}

function saveState() {
  console.log("state saved");
  const currentCanvasState = context.getImageData(0, 0, canvas.width, canvas.height);
  canvasStateStack.push(currentCanvasState);
  
  console.log(currentCanvasState);
  console.log("canvasstatestack",canvasStateStack);
  currentStateIndex++;

}


//  function undo() {
//    if (currentStateIndex > 0) {
     
//      const previousCanvasState = canvasStateStack.pop();
//       console.log("previous state:",previousCanvasState);
//       context.putImageData(previousCanvasState, 0, 0);
//      drawCanvas(); // Redraw the canvas with the restored state
//      console.log("undo");
//    }
//  }

    function undo() {
      if (currentStateIndex > 0) {
         currentStateIndex--;

         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
         const previousCanvasState = canvasStateStack[currentStateIndex];
         console.log("previous state:",previousCanvasState);
         context.putImageData(previousCanvasState, 0, 0);
        drawCanvas(); // Redraw the canvas with the restored state
        console.log("undo");
      }
    }


// Define a data structure to represent a canvas state
 function CanvasState(elements) {
   this.elements = elements; // Store the elements on the canvas
 }

// Add an event listener to the undo button
undoBtn.addEventListener('click', () => {
  undo(); // Call the undo function when the button is clicked
});

// Add an event listener to the undo button
redoBtn.addEventListener('click', () => {
  redo(); // Call the undo function when the button is clicked
});

deletePageBtn.addEventListener('click', () => {
  clearCanvas();
});

// Initialize the "Add Dialogue" functionality
 initializeAddDialogue(dialogueText, context);
 addDraggableTextToCanvas(canvas, context);

