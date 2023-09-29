//importing
import { initializeAddDialogue, addDialogueToCanvas } from './AddDialogue.js';
// import { addDraggableTextToCanvas } from './AddDialogue.js';
// import { showTab } from './content.js';


const canvas = document.getElementById('comic-canvas');
const context = canvas.getContext('2d');
const assetLibrary = document.querySelectorAll('.comic-asset');
const dialogueText = document.getElementById('dialogue-text');//textInput
const addDialogueBtn = document.getElementById('add-dialogue-btn');//addTextBtn
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
// const addPageBtn = document.getElementById('add-page-btn');
const deletePageBtn = document.getElementById('delete-page-btn');
const previewBtn = document.getElementById('preview-btn');
const saveBtn = document.getElementById('save-btn');
// Get the asset library images
const comicAssets = document.querySelectorAll(".comic-asset");
//google-fonts
const fontDropdown = document.getElementById('font-family');
const comicCanvas = document.getElementById('comic-canvas');
// Capture the comic artwork from the canvas as a data URL
const comicImageDataUrl = comicCanvas.toDataURL('image/png');
//for rearanging on canvas
let beingdragged;

const canvasDrawingCommands = []; // Array to store canvas drawing commands
let currentCommandIndex = -1; // Index of the current drawing command

const setCanvasBackground = () => {
  // setting whole canvas background to white, so the downloaded img background will be white
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
  // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
  // canvas.width = canvas.offsetWidth;
  // canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});


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
      beingdragged = event.target;
      console.log(beingdragged);
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
    console.log("canvasDrawingCommands", canvasDrawingCommands);

    // Add the image to the canvasImages array with draggable set to true
    addImageToCanvasImages(img, x, y);
    addResizableImageToCanvas(img, x, y)


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


//Uundo & redo: redo works
// Array to store canvas snapshots for redo
const redoSnapshots = [];
let currentRedoIndex = -1;

// // Function to handle redo, kindda works
function redo() {
  if (currentRedoIndex < redoSnapshots.length - 1) {
    console.log("Before Redo: ", redoSnapshots);
    // Increment the redo index
    currentRedoIndex++;

    // Clear the canvas
    clearCanvas();

    // Redraw all commands from the redo snapshot
    const redoSnapshot = redoSnapshots[currentRedoIndex];

    for (const command of redoSnapshot) {
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
    console.log("After Redo: ", redoSnapshots);

    console.log("Redo completed. Current redo index:", currentRedoIndex);
  } else {
    console.log("No commands to redo.");
  }
}

// // Function to handle undo, working fine but not with redo
function undo() {
  if (currentSnapshotIndex > 0) {
    console.log("currentSnapshotIndex",currentSnapshotIndex);
    // Decrement the current snapshot index
    currentSnapshotIndex--;
    console.log("currentSnapshotIndex--",currentSnapshotIndex);

    // Push the undone snapshot to redoSnapshots
    const undoneSnapshot = canvasSnapshots[currentSnapshotIndex + 1];
    console.log("canvasSnapshots",canvasSnapshots);
    redoSnapshots.push(undoneSnapshot);
    console.log("undoneSnapshot",undoneSnapshot);

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

    // Reset the redo index
    currentRedoIndex = -1;

    console.log("Undo completed. Current snapshot index:", currentSnapshotIndex);
  } else {
    console.log("No commands to undo.");
  }
}

undoBtn.addEventListener('click', () => {
  undo(); // Call the undo function when the button is clicked
});

redoBtn.addEventListener('click', () => {
  redo(); // Call the undo function when the button is clicked
});

deletePageBtn.addEventListener('click', () => {
  clearCanvas();
  canvasImages.splice(0); // This will remove all elements from the array
});

// let imageDataUrl = '';
// saveBtn.addEventListener('click', () => {
//   // Get the data URL of the canvas content (PNG format by default)
//   imageDataUrl = canvas.toDataURL();
//   // Now, you have the image data URL in the 'imageDataUrl' variable
//   // You can send it to your project's database or use it as needed
//   console.log('Image Data URL:', imageDataUrl);
//   console.log("saved img");
// });


// Initialize the "Add Dialogue" functionality
initializeAddDialogue(dialogueText, context);

//Save in gallery
// add event listener to the save button
previewBtn.addEventListener('click', () => {
  // get the image data from the canvas
  const imageData = canvas.toDataURL();

  // save the image data to local storage
  localStorage.setItem('saved-artwork', imageData);

  // open a new tab to display the saved artwork
  window.open('preview.html');
});


//Resize & Rearrage imgs on canvas
function redrawCanvas() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw all images with their new positions from the canvasImages array
  for (const imageObject of canvasImages) {
    context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);
    console.log(imageObject);
  }
}

const canvasImages = []; // Array to store images placed on the canvas

// // Function to add an image to the canvasImages array with draggable property set to true
function addImageToCanvasImages(image, x, y) {
  canvasImages.push({
    x: x,
    y: y,
    width: image.width,
    height: image.height,
    draggable: true,
    element: image,
  });
  console.log("from function addImageToCanvasImages",canvasImages);
}

let isResizing = false;
let resizingImage = null;
let clickedCorner = null;
let originalWidth, originalHeight;

let isDragging = false;
let selectedImage = null;
let offsetX, offsetY;

canvas.addEventListener('mousedown', (e) => {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  for (const image of canvasImages) {
    if (
      x >= image.x &&
      x <= image.x + image.width &&
      y >= image.y &&
      y <= image.y + image.height
    ) {
      const isNearLeftEdge = x <= image.x + 5;
      const isNearRightEdge = x >= image.x + image.width - 5;
      const isNearTopEdge = y <= image.y + 5;
      const isNearBottomEdge = y >= image.y + image.height - 5;

      if (isNearLeftEdge || isNearRightEdge || isNearTopEdge || isNearBottomEdge) {
        isDragging = false;
        isResizing = true;
        selectedImage = null;
        resizingImage = image;
        offsetX = x - image.x;
        offsetY = y - image.y;
        originalWidth = image.width;
        originalHeight = image.height;

        // Determine which corner was clicked
        const centerX = image.x + image.width / 2;
        const centerY = image.y + image.height / 2;
        if (x < centerX && y < centerY) {
          clickedCorner = 'top-left';
        } else if (x < centerX && y >= centerY) {
          clickedCorner = 'bottom-left';
        } else if (x >= centerX && y < centerY) {
          clickedCorner = 'top-right';
        } else {
          clickedCorner = 'bottom-right';
        }
      } else {
        isDragging = true;
        isResizing = false;
        selectedImage = image;
        resizingImage = null;
        offsetX = x - image.x;
        offsetY = y - image.y;
      }
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedImage) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    selectedImage.x = x - offsetX;
    selectedImage.y = y - offsetY;

    redrawCanvasWithBoundingBox(selectedImage);
  } else if (isResizing && resizingImage) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    if (clickedCorner === 'center') {
      // You can add custom logic here for resizing from the center if needed
    } else {
      let newWidth = originalWidth + (x - (resizingImage.x + resizingImage.width));
      let newHeight = originalHeight + (y - (resizingImage.y + resizingImage.height));

      resizingImage.width = newWidth;
      resizingImage.height = newHeight;
    }

    redrawCanvasWithBoundingBox(resizingImage);
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  isResizing = false;
});

canvas.addEventListener('mouseleave', () => {
  if (!isDragging && !isResizing) {
    // Remove the bounding box when the mouse leaves the canvas
    redrawCanvas();
  }
});

canvas.addEventListener('click', (e) => {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  let isClickOnImage = false;

  for (const image of canvasImages) {
    if (
      x >= image.x &&
      x <= image.x + image.width &&
      y >= image.y &&
      y <= image.y + image.height
    ) {
      isClickOnImage = true;
      break;
    }
  }

  if (!isClickOnImage) {
    // Remove the bounding box when clicking outside an image
    redrawCanvas();
  }
});

function redrawCanvasWithBoundingBox(image) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const imageObject of canvasImages) {
    if (imageObject !== image) {
      context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);
    }
  }

  if (image) {
    // Set the stroke style to blue
    context.strokeStyle = 'blue';
    // Set the line width
    context.lineWidth = 2;
    // Set the line dash pattern (dash, gap)
    context.setLineDash([5, 5]); // Change these values to adjust the dash pattern
    context.strokeRect(image.x, image.y, image.width, image.height);
    context.drawImage(image.element, image.x, image.y, image.width, image.height);
    // Reset the line dash to default (solid)
    context.setLineDash([]);
  }
}




//content.js
const imagesTab = document.getElementById('imagesTab');
// const svgTab = document.getElementById('svgTab');
const iconTab = document.getElementById('iconTab');
const customAssetsTab = document.getElementById('customAssetsTab'); // Get the custom assets tab

const imagesContent = document.getElementById('imagesContent');
// const svgContent = document.getElementById('svgContent');
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
  // svgContent.style.display = 'none';
  iconContent.style.display = 'none';
  customAssetsContent.style.display = 'none';
});

// svgTab.addEventListener('click', () => {
//   imagesContent.style.display = 'none';
//   svgContent.style.display = 'grid';
//   iconContent.style.display = 'none';
//   customAssetsContent.style.display = 'none';
// });

iconTab.addEventListener('click', () => {
  imagesContent.style.display = 'none';
  // svgContent.style.display = 'none';
  iconContent.style.display = 'grid';
  customAssetsContent.style.display = 'none';
});

customAssetsTab.addEventListener('click', () => {
  imagesContent.style.display = 'none';
  // svgContent.style.display = 'none';
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
// svgContent.style.display = 'none';
iconContent.style.display = 'none';
customAssetsContent.style.display = 'none';






//icon.js
const iconsContainer = document.getElementById('iconContent');
const apiKey = 'AXWFg3J6fammE65afkm3eGDkaRPOvP7iVg9FtXmatLftXYCJ';

// Function to fetch icons from the Flaticon API
async function fetchComicIcons() {
  try {
    const response = await fetch('https://api.flaticon.com/v2/items', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    // Filter icons to include only those with a "comic" tag or category
    const comicIcons = data.icons.filter(icon => icon.tags.includes('comic'));

    // Process the filtered icons and populate the icons container
    populateIconsContainer(comicIcons);
  } catch (error) {
    console.error('Error fetching icons:', error);
  }
}

// Function to populate the icons container with fetched icons
function populateIconsContainer(icons) {
  iconsContainer.innerHTML = ''; // Clear any existing icons

  icons.forEach(icon => {
    const iconElement = document.createElement('img');
    iconElement.src = icon.raster_sizes[0].formats[0].preview_url;
    iconElement.alt = icon.name;
    iconElement.classList.add('comic-asset');
    iconElement.dataset.assetType = 'icon';
    iconElement.draggable = true;

    // Add a click event listener to handle icon selection
    iconElement.addEventListener('click', () => {
      // Handle icon selection (e.g., add to canvas or insert into text)
      handleIconSelection(icon);
    });

    // Append the icon to the icons container
    iconsContainer.appendChild(iconElement);
  });
}

// Call the function to fetch comic icons when your page loads
window.addEventListener('load', fetchComicIcons);





