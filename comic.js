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
const addPageBtn = document.getElementById('add-page-btn');
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


//Working Undo function, without redo
// function undo() {
//   if (currentSnapshotIndex > 0) {
//     // Decrement the current snapshot index
//     currentSnapshotIndex--;

//     // Clear the canvas
//     clearCanvas();

//     // Redraw all commands from the previous snapshot
//     const previousSnapshot = canvasSnapshots[currentSnapshotIndex];

//     for (const command of previousSnapshot) {
//       if (command.type === 'image') {
//         const img = new Image();
//         img.src = command.src;
//         img.onload = function () {
//           context.drawImage(img, command.x, command.y, command.width, command.height);
//         };
//       } else if (command.type === 'svg') {
//         const img = new Image();
//         img.src = command.src;
//         img.onload = function () {
//           context.drawImage(img, command.x, command.y, command.width, command.height);
//         };
//       }
//       // Handle other command types (text, shapes) if needed
//     }

//     console.log("Undo completed. Current snapshot index:", currentSnapshotIndex);
//   } else {
//     console.log("No commands to undo.");
//   }
// }


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

// function restoreCanvas(commands, snapshotIndex) {
//   // Clear the canvas
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   // Replay the drawing commands up to the desired snapshot
//   for (let i = 0; i <= snapshotIndex; i++) {
//     const command = commands[i];
//     if (command.type === 'image') {
//       const img = new Image();
//       img.src = command.src;
//       img.onload = function () {
//         context.drawImage(img, command.x, command.y, command.width, command.height);
//       };
//     } else if (command.type === 'text') {
//       context.font = command.font;
//       context.fillStyle = command.color;
//       context.fillText(command.text, command.x, command.y);
//     } else if (command.type === 'shape') {
//       context.fillStyle = command.color;
//       context.fillRect(command.x, command.y, command.width, command.height);
//     }
//   }
// }

// When drawing an image, text, or shape, instead of directly drawing, add a command to the canvasDrawingCommands array
// function drawImage(imageUrl, x, y, width, height) {
//   const command = { type: 'image', src: imageUrl, x, y, width, height };
//   canvasDrawingCommands.push(command);
//   // Increment the current command index
//   currentCommandIndex++;
//   // Perform the actual drawing here as well
//   const img = new Image();
//   img.src = imageUrl;
//   img.onload = function () {
//     context.drawImage(img, x, y, width, height);
//   };
// }

undoBtn.addEventListener('click', () => {
  undo(); // Call the undo function when the button is clicked
});

redoBtn.addEventListener('click', () => {
  redo(); // Call the undo function when the button is clicked
});

deletePageBtn.addEventListener('click', () => {
  clearCanvas();
});

let imageDataUrl = '';
saveBtn.addEventListener('click', () => {
  // Get the data URL of the canvas content (PNG format by default)
  imageDataUrl = canvas.toDataURL();
  // Now, you have the image data URL in the 'imageDataUrl' variable
  // You can send it to your project's database or use it as needed
  console.log('Image Data URL:', imageDataUrl);
  console.log("saved img");
});

// // Listen for changes in the font dropdown
// fontDropdown.addEventListener('change', () => {
//   const selectedFont = fontDropdown.value;
//   comicCanvas.style.fontFamily = selectedFont});


// Initialize the "Add Dialogue" functionality
initializeAddDialogue(dialogueText, context);
// addDraggableTextToCanvas(canvas, context);

//Preview button
// Add an event listener to the "Preview" button
// previewBtn.addEventListener('click', () => {
//   // Generate the comic image data URL (comicImageDataUrl) here

//   // Redirect to the preview page and pass the comic artwork data URL as a query parameter
//   const encodedComicDataUrl = encodeURIComponent(comicImageDataUrl);
//   window.location.href = `preview.html?comicDataUrl=${encodedComicDataUrl}`;
// });


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



// Drag images -Draging works, but conflicting with resize()
let isDragging = false;
let selectedImage = null;
let offsetX, offsetY;

canvas.addEventListener('mousedown', (e) => {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  // Check if the click occurred inside an image
  for (const image of canvasImages) {
    if (
      x >= image.x &&
      x <= image.x + image.width &&
      y >= image.y &&
      y <= image.y + image.height
    ) {
      isDragging = true;
      selectedImage = image;
      offsetX = x - image.x;
      offsetY = y - image.y;
      console.log("Clicked on image:", selectedImage); // Debugging
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    selectedImage.x = x - offsetX;
    selectedImage.y = y - offsetY;
    console.log("Dragging image:", selectedImage); // Debugging

    // Redraw the canvas
    redrawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    console.log("Released image:", selectedImage); // Debugging
  }
});

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

// Function to add an image to the canvasImages array with draggable property set to true
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

//For resizing img - adding conflict with rearrange()
let isResizing = false;
let resizingImage = null;
let clickedCorner = null;
let originalWidth, originalHeight;

canvas.addEventListener('mousedown', (e) => {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  // Check if the click occurred inside a resizable image
  for (const image of canvasImages) {
    if (
      x >= image.x &&
      x <= image.x + image.width &&
      y >= image.y &&
      y <= image.y + image.height
    ) {
      isResizing = true;
      resizingImage = image;
      
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
      
      // Store the original width and height
      originalWidth = image.width;
      originalHeight = image.height;
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isResizing) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    
    // Calculate new width and height based on mouse position
    let newWidth = originalWidth;
    let newHeight = originalHeight;
    
    if (clickedCorner.includes('left')) {
      newWidth = originalWidth + (resizingImage.x - x);
    } else {
      newWidth = originalWidth + (x - (resizingImage.x + resizingImage.width));
    }
    
    if (clickedCorner.includes('top')) {
      newHeight = originalHeight + (resizingImage.y - y);
    } else {
      newHeight = originalHeight + (y - (resizingImage.y + resizingImage.height));
    }
    
    // Update image dimensions
    resizingImage.width = newWidth;
    resizingImage.height = newHeight;
    
    // Redraw the canvas
    redrawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
  }
});














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


// let originalWidth, originalHeight;

// // Load an image onto the canvas (you can replace this with your image loading logic)
// const image = new Image();
// image.src = 'path_to_your_image.jpg';

// image.onload = () => {
//     canvas.width = image.width;
//     canvas.height = image.height;
//     context.drawImage(image, 0, 0, image.width, image.height);
// };

// canvas.addEventListener('mousedown', (e) => {
//     const x = e.clientX - canvas.getBoundingClientRect().left;
//     const y = e.clientY - canvas.getBoundingClientRect().top;

//     // Check if the click occurred inside the image
//     if (
//         x >= 0 &&
//         x <= canvas.width &&
//         y >= 0 &&
//         y <= canvas.height
//     ) {
//         isDragging = true;
//         selectedImage = image;
//         offsetX = x;
//         offsetY = y;
//         originalWidth = image.width;
//         originalHeight = image.height;
//     }
// });

// canvas.addEventListener('mousemove', (e) => {
//     if (isDragging) {
//         const x = e.clientX - canvas.getBoundingClientRect().left;
//         const y = e.clientY - canvas.getBoundingClientRect().top;
        
//         const newWidth = originalWidth + (x - offsetX);
//         const newHeight = originalHeight + (y - offsetY);

//         context.clearRect(0, 0, canvas.width, canvas.height);
//         context.drawImage(selectedImage, 0, 0, newWidth, newHeight);

//         drawBoundingBox(x, y, newWidth, newHeight);
//     }
// });

// canvas.addEventListener('mouseup', () => {
//     if (isDragging) {
//         isDragging = false;
//     }
// });

// function drawBoundingBox(x, y, width, height) {
//     context.strokeStyle = '#007bff';
//     context.lineWidth = 2;
//     context.setLineDash([5, 5]);
//     context.strokeRect(x, y, width, height);
// }



