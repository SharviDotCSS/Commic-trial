//og javascript
// Place the JavaScript code in the 'script.js' file and make sure it is in the same directory as the HTML file.

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

let comicData = []; // Array to store comic data for undo/redo
let currentPage = -1;
let canvasObjects = [];

// Canvas state for text elements
const textElements = [];

// Function to add text to the canvas
function addTextToCanvas() {
  const text = dialogueText.value;
  if (text) {
    const x = 50; // X-coordinate for initial position
    const y = 50; // Y-coordinate for initial position
    const fontSize = 18; // Font size
    const fontColor = 'black'; // Font color

    // Create a new text element object
    const textElement = {
      type: 'text',
      content: text,
      x: x,
      y: y,
      fontSize: fontSize,
      fontColor: fontColor,
      draggable: true, // Allow dragging
    };
    // Push the new text element to the array
    textElements.push(textElement);

    // Clear the text input field
    dialogueText.value = '';

    // Redraw the canvas to include the new text
    drawCanvas();
  }
}

// Event listener for adding text to the canvas
addDialogueBtn.addEventListener('click', addTextToCanvas);

function saveState() {
  // Deep clone the canvasObjects array to prevent reference issues
  const currentState = JSON.parse(JSON.stringify(canvasObjects));
  comicData.push(currentState);
  currentPage = comicData.length - 1; // Update the currentPage index
  console.log("comicData:", comicData); // Output the content of comicData
}

// Set up event listeners for undo/redo
undoBtn.addEventListener('click', () => {
  undo();
  drawCanvas();
});

redoBtn.addEventListener('click', () => {
  redo();
  drawCanvas();
});

function undo() {
  if (currentPage > 0) {
    currentPage--;
    canvasObjects = JSON.parse(JSON.stringify(comicData[currentPage])); // Restore the previous state
  }
}

// Function to clear the canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
}


function redo() {
  if (comicData.length > 1 && currentPage < comicData.length - 1) {
    currentPage++;
    canvasObjects = JSON.parse(JSON.stringify(comicData[currentPage])); // Restore the next state
  }
}

// Set up event listeners for asset selection and dialogue addition
// (Previous code for asset selection and dialogue addition remains unchanged)

// Set up event listeners for undo/redo
// undoBtn.addEventListener('click', () => {
//   if (currentPage > 0) {
//     currentPage--;
//     undo();//me
//     drawCanvas();
//   }
// });

// Function to undo the last action
// function undo() {
//   if (historyStack.length > 1) {
//     historyStack.pop(); // Remove the current state
//     currentState = historyStack[historyStack.length - 1]; // Get the previous state
//     canvasObjects = JSON.parse(currentState); // Restore the previous state
//     drawCanvas(); // Redraw the canvas
//   }
// }

// redoBtn.addEventListener('click', () => {
//   if (currentPage < comicData.length - 1) {
//     currentPage++;
//     redo();//me
//     drawCanvas();
//   }
// });

// Function to redo the last undone action
// function redo() {
//   if (currentState && historyStack.length > 1) {
//     currentState = historyStack.pop(); // Get the next state
//     canvasObjects = JSON.parse(currentState); // Restore the next state
//     drawCanvas(); // Redraw the canvas
//   }
// }

// Set up event listener for adding a new page
addPageBtn.addEventListener('click', () => {
  comicData.splice(currentPage + 1, 0, { /* Add page data here (not implemented in this example) */ });
  currentPage++;
  drawCanvas();
});

// Set up event listener for deleting the current page
deletePageBtn.addEventListener('click', () => {
  if (comicData.length > 1) {
    comicData.splice(currentPage, 1);
    if (currentPage >= comicData.length) {
      currentPage = comicData.length - 1;
    }
    drawCanvas();
  }
});

// Set up event listener for preview
previewBtn.addEventListener('click', () => {
  // Implement preview functionality here (not implemented in this example)
});

//og drawcanvas()
// Drawing functionality remains unchanged

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

// Function to draw the canvas
// function drawCanvas() {
//   // Clear the canvas
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw existing text elements
//   textElements.forEach((textElement) => {
//     context.fillStyle = textElement.fontColor;
//     context.font = `${textElement.fontSize}px Arial`;
//     context.fillText(textElement.content, textElement.x, textElement.y);
//   });
// }

//Drag images from asset library
// JavaScript

// Step 1: Add 'draggable="true"' attribute to the asset library images in your HTML.

// Get the asset library images
const comicAssets = document.querySelectorAll(".comic-asset");

// Step 2: Add event listeners to the asset library images for 'dragstart', 'dragend', and 'dragover' events.
comicAssets.forEach(asset => {
  asset.addEventListener("dragstart", handleDragStart);
  asset.addEventListener("dragend", handleDragEnd);
  asset.addEventListener("dragover", handleDragOver);
});

// Step 3: Add event listeners to the canvas for 'dragover', 'dragenter', 'dragleave', and 'drop' events.

canvas.addEventListener("dragover", handleDragOverCanvas);
canvas.addEventListener("dragenter", handleDragEnterCanvas);
canvas.addEventListener("dragleave", handleDragLeaveCanvas);
canvas.addEventListener("drop", handleDrop);

// Drag and drop event handlers

// Step 2: Handle the 'dragstart' event when dragging an image from the asset library.
function handleDragStart(event) {
  const draggedAsset = event.target;
  event.dataTransfer.setData("text/plain", draggedAsset.src);
  saveState(); // Save the current state after dropping the image
}

// Step 2: Handle the 'dragend' event after dragging an image from the asset library.
function handleDragEnd(event) {
  // Clean up if needed
}

// Step 2: Handle the 'dragover' event for the asset library images.
function handleDragOver(event) {
  event.preventDefault();
  saveState(); // Save the current state after dropping the image
}

// Step 3: Handle the 'dragover' event for the canvas.
function handleDragOverCanvas(event) {
  event.preventDefault();
  saveState(); // Save the current state after dropping the image
}

// Step 3: Handle the 'dragenter' event for the canvas.
function handleDragEnterCanvas(event) {
  event.preventDefault();
  canvas.classList.add("canvas-over");
  saveState(); // Save the current state after dropping the image
}

// Step 3: Handle the 'dragleave' event for the canvas.
function handleDragLeaveCanvas(event) {
  event.preventDefault();
  canvas.classList.remove("canvas-over");
  saveState(); // Save the current state after dropping the image
}

// Step 3: Handle the 'drop' event when dropping an image onto the canvas.
function handleDrop(event) {
  event.preventDefault();
  canvas.classList.remove("canvas-over");
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const imageUrl = event.dataTransfer.getData("text/plain");
  drawAssetOnCanvas(imageUrl, x, y);
  saveState(); // Save the current state after dropping the image
}

// //new handledrop that addds prop ele in array
// function handleDrop(event) {
//   event.preventDefault();
//   canvas.classList.remove("canvas-over");
//   const rect = canvas.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   const imageUrl = event.dataTransfer.getData("text/plain");

//   // Create a new canvas element object
//   const newCanvasElement = {
//     type: "image", // Type of element (image, text, etc.)
//     src: imageUrl, // Image URL
//     x: x, // X-coordinate on the canvas
//     y: y, // Y-coordinate on the canvas
//     width: 100, // Default width
//     height: 100, // Default height
//     // Add more properties as needed (rotation, scaling, etc.)
//   };

//   // Add the new canvas element object to the current page's data
//   if (currentPage >= 0 && currentPage < comicData.length) {
//     comicData[currentPage].push(newCanvasElement);
//   }

//   // Redraw the canvas
//   drawCanvas();
// }


// Function to draw the dropped asset on the canvas.
function drawAssetOnCanvas(imageUrl, x, y) {
  const img = new Image();
  img.src = imageUrl;
  img.onload = function () {
    context.drawImage(img, x, y);

    // Save the current state after placing the image on the canvas
    saveState();
  };
}

// JavaScript - script.js

// ... (Previous code)

// Variable to keep track of the selected image for resizing and moving
let selectedImage = null;
let offsetX = 0;
let offsetY = 0;
let isResizing = false;

// Function to handle mousedown event
function handleMouseDown(event) {
  const canvasX = event.clientX - canvas.getBoundingClientRect().left;
  const canvasY = event.clientY - canvas.getBoundingClientRect().top;

  // Check if an image is clicked for resizing
  for (let i = canvasObjects.length - 1; i >= 0; i--) {
    const obj = canvasObjects[i];
    if (
      canvasX >= obj.x &&
      canvasX <= obj.x + obj.width &&
      canvasY >= obj.y &&
      canvasY <= obj.y + obj.height
    ) {
      if (
        canvasX >= obj.x + obj.width - 10 &&
        canvasX <= obj.x + obj.width &&
        canvasY >= obj.y + obj.height - 10 &&
        canvasY <= obj.y + obj.height
      ) {
        isResizing = true;
        selectedImage = obj;
        offsetX = obj.width - (canvasX - obj.x);
        offsetY = obj.height - (canvasY - obj.y);
        break;
      } else {
        selectedImage = obj;
        offsetX = canvasX - obj.x;
        offsetY = canvasY - obj.y;
        break;
      }
    }
  }
}

// Function to handle mousemove event
function handleMouseMove(event) {
  if (selectedImage) {
    const canvasX = event.clientX - canvas.getBoundingClientRect().left;
    const canvasY = event.clientY - canvas.getBoundingClientRect().top;

    if (isResizing) {
      selectedImage.width = Math.max(canvasX - selectedImage.x + offsetX, 10);
      selectedImage.height = Math.max(canvasY - selectedImage.y + offsetY, 10);
    } else {
      selectedImage.x = canvasX - offsetX;
      selectedImage.y = canvasY - offsetY;
    }

    drawCanvas();
  }
}

// Function to handle mouseup event
function handleMouseUp(event) {
  if (selectedImage) {
    isResizing = false;
    selectedImage = null;
  }
}


