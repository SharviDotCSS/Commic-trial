//importing
import { initializeAddDialogue, addDialogueToCanvas } from './AddDialogue.js';
import { addDraggableTextToCanvas } from './AddDialogue.js';
// import { showTab } from './content.js';


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
//google-fonts
const fontDropdown = document.getElementById('font-family');
const comicCanvas = document.getElementById('comic-canvas');

const canvasDrawingCommands = []; // Array to store canvas drawing commands
let currentCommandIndex = -1; // Index of the current drawing command


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
// function handleDragStart(event) {
//   const draggedAsset = event.target;
//   event.dataTransfer.setData("text/plain", draggedAsset.src);
//   takeSnapshot(); // Save the current state after dropping the image
// }

function handleDragStart(event) {
// For image assets
const imageAssets = document.querySelectorAll('.comic-asset[data-asset-type="image"]');
imageAssets.forEach((imgElement) => {
  imgElement.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", event.target.src);
    event.dataTransfer.setData("assetType", "image"); // Set the asset type to 'image'
    // takeSnapshot(); // Save the current state after dropping the image
  });
});

// For SVG assets
const svgAssets = document.querySelectorAll('.comic-asset[data-asset-type="svg"]');
svgAssets.forEach((svgElement) => {
  svgElement.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", event.target.src);
    event.dataTransfer.setData("assetType", "svg"); // Set the asset type to 'svg'
    // takeSnapshot(); // Save the current state after dropping the SVG
  });
});

   }

function handleDragEnd(event) {
  // Clean up if needed
}

// Handle the 'dragover' event for the asset library images.
function handleDragOver(event) {
  event.preventDefault();
  // takeSnapshot(); // Save the current state after dropping the image
}

// Handle the 'dragover' event for the canvas.
function handleDragOverCanvas(event) {
  event.preventDefault();
  // takeSnapshot(); // Save the current state after dropping the image
}

// Handle the 'dragenter' event for the canvas.
function handleDragEnterCanvas(event) {
  event.preventDefault();
  canvas.classList.add("canvas-over");
  // takeSnapshot(); // Save the current state after dropping the image
}

// Handle the 'dragleave' event for the canvas.
function handleDragLeaveCanvas(event) {
  event.preventDefault();
  canvas.classList.remove("canvas-over");
  // takeSnapshot(); // Save the current state after dropping the image
}

// Handle the 'drop' event when dropping an image onto the canvas. (only for imgs)
// function handleDrop(event) {
//   event.preventDefault();
//   canvas.classList.remove("canvas-over");
//   const rect = canvas.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   const imageUrl = event.dataTransfer.getData("text/plain");
//   drawAssetOnCanvas(imageUrl, x, y);
//   const width = 500; // Replace with the desired width
//   const height = 500; // Replace with the desired height

//   drawImage(imageUrl, x, y, width, height);
//   takeSnapshot(); // Save the current state after dropping the image
// //   drawCanvas();
// }

// Handle the 'drop' event when dropping an asset onto the canvas (for img & svgs)
function handleDrop(event) {
  event.preventDefault();
  canvas.classList.remove("canvas-over");
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const imageUrl = event.dataTransfer.getData("text/plain");
  const assetType = event.dataTransfer.getData("assetType"); // Get the asset type

  if (assetType === "svg") {
    // Handle SVG asset drop
    drawSVGOnCanvas(imageUrl, x, y);
    // Store the SVG command in canvasDrawingCommands (you need to implement this)
  } else {
    // Handle other asset types (e.g., images)
    drawAssetOnCanvas(imageUrl, x, y);
    // Store the image command in canvasDrawingCommands (you need to implement this)
  }

  takeSnapshot(); // Save the current state after dropping the asset
}


function drawAssetOnCanvas(imageUrl, x, y) {
  const img = new Image();
  img.src = imageUrl;
  img.onload = function () {
    context.drawImage(img, x, y);

    const command = {
      type: 'image',
      src: imageUrl, // URL of the image
      x: x, // X-coordinate
      y: y, // Y-coordinate
      width: img.width, // Width of the image (you can adjust this as needed)
      height: img.height, // Height of the image (you can adjust this as needed)
    };
    canvasDrawingCommands.push(command);
    console.log("canvasDrawingCommands",canvasDrawingCommands);

    // Save the current state after placing the image on the canvas
    // takeSnapshot();
    console.log("img drawn");
  };
}

// Function to draw an SVG asset on the canvas
function drawSVGOnCanvas(svgUrl, x, y) {
  const img = new Image();

  // Load the SVG image
  img.src = svgUrl;

  // Wait for the image to load before drawing it on the canvas
  img.onload = function () {
    // You can set the width and height of the SVG as desired
    const width = 100;
    const height = 100;

    // Draw the SVG image on the canvas at the specified coordinates
    context.drawImage(img, x, y, width, height);

    // Optionally, you can add additional logic here, such as saving the canvas state
    // takeSnapshot();
  };
}

// function drawCanvas() {
//     // Retrieve comic data for the current page and draw elements on the canvas
//     // Implement drawing functionality based on comicData (not implemented in this example)


//     for (const element of canvasObjects) {
//       if (element.type === "image") {
//         const img = new Image();
//         img.src = element.src;
//         img.onload = function () {
//           context.drawImage(img, element.x, element.y, element.width, element.height);
//           console.log("drawCanvas called");
//         };
//       }
//       // Add more conditions for other types of elements (text, shapes, etc.) 

//     
//   }

//     }
//   }

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
}

const canvasSnapshots = []; // Array to store canvas snapshots
let currentSnapshotIndex = 0; // Index of the current canvas snapshot

function takeSnapshot() {
  // Create a copy of the canvas drawing commands
  const drawingCommandsCopy = canvasDrawingCommands.slice();
  canvasSnapshots.push(drawingCommandsCopy);
  currentSnapshotIndex++; // Increment the current snapshot index
  console.log("Current Snapshot Index:", currentSnapshotIndex); // Add this line to log the index
}

//   function undo() {
//     if (currentSnapshotIndex > 0) {
//       currentSnapshotIndex--; // Move to the previous snapshot
//       const previousSnapshotData = canvasSnapshots[currentSnapshotIndex];
//       const img = new Image();
//       img.onload = function () {
//         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
//         context.drawImage(img, 0, 0); // Draw the previous snapshot
//       };
//       img.src = previousSnapshotData;
//     }
//   }

// function undo() {
//   if (currentCommandIndex >= 0) {
//     // Remove the last drawing command
//     canvasDrawingCommands.pop();
//     clearCanvas(); // Clear the canvas

//     // Redraw all commands except the undone one
//     for (let i = 0; i < canvasDrawingCommands.length; i++) {
//       const command = canvasDrawingCommands[i];
//       if (command.type === 'image') {
//         const img = new Image();
//         img.src = command.src;
//         img.onload = function () {
//           context.drawImage(img, command.x, command.y, command.width, command.height);
//         };
//       } else if (command.type === 'text') {
//         context.font = command.font;
//         context.fillStyle = command.color;
//         context.fillText(command.text, command.x, command.y);
//       } else if (command.type === 'shape') {
//         context.fillStyle = command.color;
//         context.fillRect(command.x, command.y, command.width, command.height);
//       }
//     }

//     // Decrement the current command index
//     currentCommandIndex--;

//     console.log("Undo completed. Current command index: ", currentCommandIndex);
//   } else {
//     console.log("No commands to undo.");
//   }
// }

function undo() {
  if (currentSnapshotIndex > 0) {
    // Decrement the current snapshot index
    currentSnapshotIndex--;

    // Clear the canvas
    clearCanvas();

    // Redraw all commands from the previous snapshot
    const previousSnapshot = canvasSnapshots[currentSnapshotIndex];

    for (const command of previousSnapshot) {
      if (command.type === 'image') {
        const img = new Image();
        img.src = command.src;
        img.onload = function () {
          context.drawImage(img, command.x, command.y, command.width, command.height);
        };
      } else if (command.type === 'svg') {
        const img = new Image();
        img.src = command.src;
        img.onload = function () {
          context.drawImage(img, command.x, command.y, command.width, command.height);
        };
      }
      // Handle other command types (text, shapes) if needed
    }

    console.log("Undo completed. Current snapshot index:", currentSnapshotIndex);
  } else {
    console.log("No commands to undo.");
  }
}

function restoreCanvas(commands, snapshotIndex) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Replay the drawing commands up to the desired snapshot
  for (let i = 0; i <= snapshotIndex; i++) {
    const command = commands[i];
    if (command.type === 'image') {
      const img = new Image();
      img.src = command.src;
      img.onload = function () {
        context.drawImage(img, command.x, command.y, command.width, command.height);
      };
    } else if (command.type === 'text') {
      context.font = command.font;
      context.fillStyle = command.color;
      context.fillText(command.text, command.x, command.y);
    } else if (command.type === 'shape') {
      context.fillStyle = command.color;
      context.fillRect(command.x, command.y, command.width, command.height);
    }
  }
}

// When drawing an image, text, or shape, instead of directly drawing, add a command to the canvasDrawingCommands array
function drawImage(imageUrl, x, y, width, height) {
  const command = { type: 'image', src: imageUrl, x, y, width, height };
  canvasDrawingCommands.push(command);
  // Increment the current command index
  currentCommandIndex++;
  // Perform the actual drawing here as well
  const img = new Image();
  img.src = imageUrl;
  img.onload = function () {
    context.drawImage(img, x, y, width, height);
  };
}

undoBtn.addEventListener('click', () => {
  undo(); // Call the undo function when the button is clicked
});

deletePageBtn.addEventListener('click', () => {
  clearCanvas();
});

// // Listen for changes in the font dropdown
// fontDropdown.addEventListener('change', () => {
//   const selectedFont = fontDropdown.value;
//   comicCanvas.style.fontFamily = selectedFont});


// Initialize the "Add Dialogue" functionality
initializeAddDialogue(dialogueText, context);
// addDraggableTextToCanvas(canvas, context);






//content.js
const imagesTab = document.getElementById('imagesTab');
const svgTab = document.getElementById('svgTab');
const iconTab = document.getElementById('iconTab');
const customAssetsTab = document.getElementById('customAssetsTab'); // Get the custom assets tab

const imagesContent = document.getElementById('imagesContent');
const svgContent = document.getElementById('svgContent');
const iconContent = document.getElementById('iconContent');
const customAssetsContent = document.getElementById('customAssetsContent');
const customAssetInput = document.getElementById('customAssetInput');
const uploadButton = document.querySelector('.upload-button');

// Function to handle the custom asset upload
function handleCustomAssetUpload(event) {
  const files = event.target.files;

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      const customAsset = document.createElement('div');
      customAsset.classList.add('custom-asset');

      const img = new Image();
      img.src = imageUrl;
      img.alt = 'Custom Asset';
      img.classList.add('comic-asset');
      img.setAttribute('data-asset-type', 'custom');
      img.draggable = true;

      customAsset.appendChild(img);
      customAssetsContent.appendChild(customAsset);
    }
  }

  customAssetInput.value = ''; // Clear the input field
}

// Add event listeners to the tabs
imagesTab.addEventListener('click', () => {
  imagesContent.style.display = 'grid';
  svgContent.style.display = 'none';
  iconContent.style.display = 'none';
  customAssetsContent.style.display = 'none';
});

svgTab.addEventListener('click', () => {
  imagesContent.style.display = 'none';
  svgContent.style.display = 'grid';
  iconContent.style.display = 'none';
  customAssetsContent.style.display = 'none';
});

iconTab.addEventListener('click', () => {
  imagesContent.style.display = 'none';
  svgContent.style.display = 'none';
  iconContent.style.display = 'grid';
  customAssetsContent.style.display = 'none';
});

customAssetsTab.addEventListener('click', () => {
  imagesContent.style.display = 'none';
  svgContent.style.display = 'none';
  iconContent.style.display = 'none';
  customAssetsContent.style.display = 'grid';
});

// Listen for the click event on the upload button
uploadButton.addEventListener('click', () => {
  customAssetInput.click();
});

// Listen for changes in the file input
customAssetInput.addEventListener('change', handleCustomAssetUpload);

// Initially hide SVGs and custom assets
svgContent.style.display = 'none';
customAssetsContent.style.display = 'none';
