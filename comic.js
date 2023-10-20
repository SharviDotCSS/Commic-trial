//importing
// import { initializeAddDialogue, addDialogueToCanvas } from './AddDialogue.js';
// import { addDraggableTextToCanvas } from './AddDialogue.js';
// import { showTab } from './content.js';


const canvas = document.getElementById('comic-canvas');
const context = canvas.getContext('2d');
const assetLibrary = document.querySelectorAll('.comic-asset');
const dialogueText = document.getElementById('dialogue-text');//textInput
const addDialogueBtn = document.getElementById('add-dialogue-btn');//addTextBtn
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
// const removeBtn = document.getElementById('remove-btn');
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
    // addResizableImageToCanvas(img, x, y);


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
// function redo() {
//   if (currentRedoIndex < redoSnapshots.length) {
//     console.log("Before Redo: ", redoSnapshots);
//     // Increment the redo index
//     currentRedoIndex++;

//     // Clear the canvas
//     clearCanvas();

//     // Redraw all commands from the redo snapshot
//     const redoSnapshot = redoSnapshots[currentRedoIndex];

//     for (const command of redoSnapshot) {
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
//     console.log("After Redo: ", redoSnapshots);

//     console.log("Redo completed. Current redo index:", currentRedoIndex);
//   } else {
//     console.log("No commands to redo.");
//   }
// }

//reversed redo()
// Function to handle redo -- only 2 redo happens properyl!
function redo() {
  if (redoSnapshots.length > 0) {
    // Pop the last snapshot from redoSnapshots
    const redoSnapshot = redoSnapshots.pop();

    // Clear the canvas
    clearCanvas();

    // Redraw all commands from the redo snapshot
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

    console.log("Redo completed. Remaining redo snapshots:", redoSnapshots.length);
  } else {
    console.log("No commands to redo.");
    console.log(redoSnapshots);

  }
}



// // Function to handle undo, working fine but not with redo, just working good commented temp
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
    // redrawCanvas();
    // console.log("mouse left");
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
    // redrawCanvas();
    redrawCanvasExceptBoundingBox();
  }
});

function redrawCanvasExceptBoundingBox() {
  // Clear the canvas but leave the other elements intact
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw all text elements
  for (const textElement of textElementsArray) {
    context.font = textElement.font;
    context.fillStyle = textElement.color;
    context.fillText(textElement.text, textElement.x, textElement.y);
  }

  // Redraw all images with their new positions from the canvasImages array
  for (const imageObject of canvasImages) {
    context.drawImage(
      imageObject.element,
      imageObject.x,
      imageObject.y,
      imageObject.width,
      imageObject.height
    );
  }
}

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




//adddialogue.js
const textDisplay = document.getElementById('text-display');
const content = document.getElementById('content');

// Declare and initialize textElementsArray
let textElementsArray = [];

// Declare textImage variable
let textImage;

function initializeAddDialogue() {
    const dialogueText = document.getElementById('dialogue-text'); // textInput
    const addDialogueBtn = document.getElementById('add-dialogue-btn'); // addTextBtn

}





// Function to fetch and populate Google Fonts in the dropdown
function populateFontDropdown() {
  fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBLWzHZ25t8e9odQPCq9F-XqDW4B1hj4Qc')
      .then(response => response.json())
      .then(data => {
          const fonts = data.items;
          fonts.forEach(font => {
              const option = document.createElement('option');
              option.value = font.family;
              option.textContent = font.family;
              fontDropdown.appendChild(option);
          });
      })
      .catch(error => console.error('Error fetching fonts:', error));
}

// // Event listener for page load
window.addEventListener('load', () => {
  // Call populateFontDropdown when the page loads
  populateFontDropdown();
});

// Add this function to update the font of the text area
function updateTextAreaFont(selectedFont) {
  const dialogueText = document.getElementById('dialogue-text');
  dialogueText.style.fontFamily = selectedFont;
}

// Modify the event listener for the "Add Dialogue" button --> working-- now
addDialogueBtn.addEventListener('click', () => {
  console.log('Add Dialogue button clicked');
  const text = dialogueText.value;
  const selectedFont = fontDropdown.value; // Get the selected font
  const fontSize = document.getElementById('font-size').value; // Get the font size
  const textColor = document.getElementById('text-color').value; // Get the text color

  // Update the canvas text properties
  updateCanvasTextProperties(selectedFont, fontSize, textColor);

  // Populate textElementsArray with text elements
  textElementsArray.push({ text: text, x: 50, y: 50, font: selectedFont, fontSize: fontSize, color: textColor });
  console.log(textElementsArray);
  addDialogueToCanvas(textImage, selectedFont, fontSize, textColor);
  console.log(dialogueText.value);
  drawCanvas(); // Call drawCanvas to update the canvas
});

// Event listener for the font dropdown to update the text area font dynamically
fontDropdown.addEventListener('change', () => {
  const selectedFont = fontDropdown.value;
  updateTextAreaFont(selectedFont);
});

// Event listener for the font size input to update the canvas text size dynamically
document.getElementById('font-size').addEventListener('input', (event) => {
  const selectedFont = fontDropdown.value;
  const fontSize = event.target.value;
  const textColor = document.getElementById('text-color').value;
  updateCanvasTextProperties(selectedFont, fontSize, textColor);
});

// Event listener for the text color input to update the canvas text color dynamically
document.getElementById('text-color').addEventListener('input', (event) => {
  const selectedFont = fontDropdown.value;
  const fontSize = document.getElementById('font-size').value;
  const textColor = event.target.value;
  updateCanvasTextProperties(selectedFont, fontSize, textColor);
});

// Add this function to update the font, font size, and text color of the canvas text
function updateCanvasTextProperties(font, fontSize, color) {
  context.font = `${fontSize}px ${font}`;
  context.fillStyle = color;
}






// Declare an array to store text elements -- in use
const textElements = [];
let currentX, currentY;

// Get a reference to your text icon element
const textIcon = document.getElementById('text-icon');
let iconClicked = false; // Initialize the flag
textIcon.addEventListener('click', function () {
  iconClicked = true; // Set the flag to true when the icon is clicked
});

canvas.addEventListener('click', function (event) {
  if (iconClicked) { // Check if the icon has been clicked
  // Get the mouse coordinates relative to the canvas
  const rect = canvas.getBoundingClientRect();
  currentX = event.clientX - rect.left;
  currentY = event.clientY - rect.top;

  // Create a text input element dynamically
  const textBox = document.createElement('input');
  textBox.type = 'text';
  textBox.style.position = 'absolute';
  textBox.style.left = currentX + 'px';
  textBox.style.top = currentY + 'px';
  textBox.id = 'dialogue-text'; // Assign an id
  textBox.placeholder = 'Enter text...';

  // Retrieve user-selected font, font size, and text color
  const selectedFont = document.getElementById('font-family').value;
  const fontSize = document.getElementById('font-size').value;
  const textColor = document.getElementById('text-color').value;

  // Set the font, font size, and text color to the text box
  textBox.style.fontFamily = selectedFont;
  textBox.style.fontSize = fontSize + 'px';
  textBox.style.color = textColor;

  // Append the text box to the body
  document.body.appendChild(textBox);

  // Focus on the text box
  textBox.focus();

  // Add an event listener for the text box to handle adding text to the canvas
  textBox.addEventListener('blur', function () {
    addDialogueToCanvas(textBox.value, currentX, currentY, selectedFont, fontSize, textColor);
    // Hide the text box when it loses focus
    textBox.style.display = 'none';
  });
}});

function drawCanvas() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw all text elements on the canvas
  for (const textElement of textElements) {
    context.font = textElement.font;
    context.fillStyle = textElement.color;
    context.fillText(textElement.text, textElement.x, textElement.y);
  }
}

function addDialogueToCanvas(text, x, y, font, fontSize, textColor) {
  // Create a text element object
  const textElement = {
    text: text,
    font: fontSize + 'px ' + font,
    color: textColor,
    x: x,
    y: y,
  };

  // Push the text element to the textElements array
  textElements.push(textElement);

  // Redraw the canvas with the new text element
  drawCanvas();
}


















//not in use code
// function drawCanvas() {
//   // Clear the canvas
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   // Redraw all images with their new positions from the canvasImages array
//   for (const imageObject of canvasImages) {
//     context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);
//   }

//   // Draw the text elements on the canvas
//   for (const textElement of textElements) {
//     context.font = textElement.font;
//     context.fillStyle = textElement.color;
//     context.fillText(textElement.text, textElement.x, textElement.y);
//   }
// }

// function addDialogueToCanvas(text, x, y, font, fontSize, textColor) {
//   // Create a text element object
//   const textElement = {
//     text: text,
//     font: fontSize + 'px ' + font,
//     color: textColor,
//     x: x,
//     y: y,
//   };

//   // Push the text element to the textElements array
//   textElements.push(textElement);

//   // Redraw the canvas with the new text element
//   drawCanvas();
// }


// // Declare an array to store text elements
// const textElements = [];


// canvas.addEventListener('click', function (event) {
//   // Get the mouse coordinates relative to the canvas
//   const rect = canvas.getBoundingClientRect();
//   currentX = event.clientX;
//   currentY = event.clientY;

//   // Create a text input element dynamically
//   const textBox = document.createElement('input');
//   textBox.type = 'text';
//   textBox.style.position = 'absolute';
//   textBox.style.left = currentX + 'px';
//   textBox.style.top = currentY + 'px';
//   textBox.id = 'dialogue-text'; // Assign an id
//   textBox.placeholder = 'Enter text...';

//   // Retrieve user-selected font, font size, and text color
//   const selectedFont = document.getElementById('font-family').value;
//   const fontSize = document.getElementById('font-size').value;
//   const textColor = document.getElementById('text-color').value;

//   // Set the font, font size, and text color to the text box
//   textBox.style.fontFamily = selectedFont;
//   textBox.style.fontSize = fontSize + 'px';
//   textBox.style.color = textColor;

//   // Append the text box to the body
//   document.body.appendChild(textBox);

//   // Focus on the text box
//   textBox.focus();

//   // Add an event listener for the text box to handle adding text to the canvas
//   textBox.addEventListener('blur', function () {
//     // addTextToCanvas(textBox.value);
//     addDialogueToCanvas(textBox.value, currentX, currentY, selectedFont, fontSize, textColor);
//     console.log("Text box will be removed");
//     // Remove the text box when it loses focus (e.g., when the user is done typing)
//     // textBox.remove();
//     // Hide the text box when it loses focus
//     textBox.style.display = 'none';
//   });
// });


//moving textbox
// const addDialogueBtn = document.getElementById('add-dialogue-btn');
// canvas.addEventListener('click', function (e) {
//   const x = e.clientX - canvas.getBoundingClientRect().left;
//   const y = e.clientY - canvas.getBoundingClientRect().top;

//   // Show the input field and button at the clicked location
//   const inputField = document.getElementById('dialogue-text');
//   // const addButton = document.getElementById('addDialogueBtn');

//   inputField.style.display = 'block';
//   addDialogueBtn.style.display = 'block';
//   inputField.style.left = x + 'px';
//   inputField.style.top = y + 'px';

//   // Store the clicked location
//   inputField.dataset.x = x;
//   inputField.dataset.y = y;
// });

// let isAddingDialogue = false; // To track the state

// addDialogueBtn.addEventListener('click', function () {
//   const inputField = document.getElementById('dialogue-text');
//   // Toggle the state
//   isAddingDialogue = !isAddingDialogue;

//   if (isAddingDialogue) {
//     // When "Add Dialogue" is clicked
//     inputField.style.display = 'none'; // Hide the textarea

//     // Add a click event to specify the position
//     canvas.addEventListener('click', function (e) {
//       if (isAddingDialogue) {
//         const x = e.clientX - canvas.getBoundingClientRect().left;
//         const y = e.clientY - canvas.getBoundingClientRect().top;

//         // Set the position and dimensions of the textarea
//         inputField.style.left = x + 'px';
//         inputField.style.top = y + 'px';

//         // Display the textarea
//         inputField.style.display = 'block';

//         // Focus on the textarea for text input
//         inputField.focus();
//       }
//     });
//   } else {
//     // When "Add Dialogue" is clicked again
//     inputField.style.display = 'none'; // Hide the textarea

//     // Get the text entered by the user
//     const text = inputField.value;

//     // Draw the text on the canvas at the specified location
//     // You can use context.fillText() to do this.
//     // Also, consider text size, font, and color selection.
//     // Finally, update the canvas with the new drawing.
//   }
// });

// Function to add text to the canvas -- 20 use this
// function addTextToCanvas(text, currentX, currentY) {
//   // Set the font and color on the context
//   context.font = '48px Arial';
//   context.fillStyle = 'black';

//   // Measure the text size
//   const textMetrics = context.measureText(text);

//   // Draw the text directly on the canvas at the stored coordinates
//   context.fillText(text, currentX, currentY);

//   // Save the canvas portion containing the text as an image
//   const textImage = new Image();
//   textImage.src = canvas.toDataURL();

//   // Now you have an image representation of the text
//   // You can add this image to the canvasImages array at the stored coordinates
//   addImageToCanvasImages(textImage, currentX, currentY, textMetrics.width, 48);

//   // Draw the canvas with the new image
//   drawCanvas();
// }

// function addDialogueToCanvas(text, x, y) { --20
//   // Set the font and color on the context
//   context.font = `${fontSize}px ${font}`;
//   context.fillStyle = textColor;

//   // Draw the text directly on the canvas at the specified coordinates
//   context.fillText(text, x, y);
// }


// function addTextToCanvas(text, x, y) {
//   const text = dialogueText.value; // Get the text value
//   const selectedFont = fontDropdown.value; // Get the selected font
//   const fontSize = document.getElementById('font-size').value; // Get the font size
//   const textColor = document.getElementById('text-color').value; // Get the text color

//   // Set the font and color on the context
//   context.font = `${fontSize}px ${selectedFont}`;
//   context.fillStyle = textColor;

//   // Draw the text directly on the canvas at the provided coordinates
//   context.fillText(text, x, y);
  
//   // Save the canvas portion containing the text as an image
//   const textImage = new Image();
//   textImage.src = canvas.toDataURL();

//   // You can add this image to the canvasImages array (if needed)
//   // addImageToCanvasImages(textImage, x, y, textMetrics.width, fontSize);

//   // Draw the canvas with the new text
//   drawCanvas();
// }

//created for text on img 
// canvas.addEventListener('click', function (event) {
//   const rect = canvas.getBoundingClientRect();
//   const currentX = event.clientX - rect.left;
//   const currentY = event.clientY - rect.top;

//   // Check if the click occurred on an image
//   let clickedOnImage = false;

//   for (const image of imageObjects) {
//     if (
//       currentX >= image.x && currentX <= image.x + image.width &&
//       currentY >= image.y && currentY <= image.y + image.height
//     ) {
//       // A click occurred on this image
//       addTextToCanvas("Your text here", image.x, image.y);
//       clickedOnImage = true;
//       break;
//     }
//   }

//   // If not clicked on an image, add text to the canvas background
//   if (!clickedOnImage) {
//     addTextToCanvas("Your text here", currentX, currentY);
//   }
// });



// Add a variable to store the current x and y coordinates -- 20 working bessst!
// let currentX = 0;
// let currentY = 0;

// // Add an event listener for a click on the canvas -- working without img
// canvas.addEventListener('click', function (event) {
//   // Get the mouse coordinates relative to the canvas
//   const rect = canvas.getBoundingClientRect();
//   currentX = event.clientX;
//   currentY = event.clientY;

//   // Create a text input element dynamically
//   const textBox = document.createElement('input');
//   textBox.type = 'text';
//   textBox.style.position = 'absolute';
//   textBox.style.left = currentX + 'px';
//   textBox.style.top = currentY + 'px';
//   textBox.id = 'dialogue-text'; // Assign an id
//   textBox.placeholder = 'Enter text...';

//   // Append the text box to the body
//   document.body.appendChild(textBox);

//   // Focus on the text box
//   textBox.focus();

//   // Add an event listener for the text box to handle adding text to the canvas
//   textBox.addEventListener('blur', function () {
//     // addTextToCanvas(textBox.value);
//     addDialogueToCanvas(textBox.value, currentX, currentY);
//     console.log("Text box will be removed");
//     // Remove the text box when it loses focus (e.g., when the user is done typing)
//     // textBox.remove();
//     // Hide the text box when it loses focus
//     textBox.style.display = 'none';
//   });

// });

//mouse click
// let clickX, clickY; // Variables to store click coordinates

// // Add an event listener for mouse clicks on the canvas
// canvas.addEventListener('click', function (e) {
//   // Retrieve the click coordinates relative to the canvas
//   clickX = e.clientX - canvas.getBoundingClientRect().left;
//   clickY = e.clientY - canvas.getBoundingClientRect().top;
  
//   if (isAddingDialogue) {
//     // Set the position and dimensions of the textarea
//     dialogueText.style.left = clickX + 'px';
//     dialogueText.style.top = clickY + 'px';

//     // Display the textarea
//     dialogueText.style.display = 'block';

//     // Focus on the textarea for text input
//     dialogueText.focus();
//   }
// });

// // Function to add dialogue to the canvas as an image
// function addDialogueToCanvas(text, font = '48px Arial', textColor = 'black') {
//   // Set the font and color on the context
//   context.font = font;
//   context.fillStyle = textColor;

//   // Measure the text size
//   const textMetrics = context.measureText(text);

//   // Draw the text directly on the canvas at the click coordinates
//   context.fillText(text, clickX, clickY);

//   // Save the canvas portion containing the text as an image
//   const textImage = new Image();
//   textImage.src = canvas.toDataURL();

//   // Now you have an image representation of the text
//   // You can add this image to the canvasImages array
//   addImageToCanvasImages(textImage, clickX, clickY, textMetrics.width, parseInt(font, 10));

//   // Draw the canvas with the new image
//   drawCanvas();
// }

// draws text as text not img -- 20 use this
// function drawCanvas() {
//   // context.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw any text elements
//   for (const textElement of textElementsArray) {
//       context.font = textElement.font;
//       context.fillStyle = textElement.color;
//       context.fillText(textElement.text, textElement.x, textElement.y);
//   }

  
// }

// Function to add dialogue to the canvas as an image --> not drawing imgs (empty imgs)
// function addDialogueToCanvas(text, font = '48px Arial', textColor = 'black') {
//   // Create an offscreen canvas to render the text
//   const offscreenCanvas = document.createElement('canvas');
//   const offscreenContext = offscreenCanvas.getContext('2d');
//   const x = 50; // X-coordinate
//   const y = 50; // Y-coordinate
  
//   // Set the font and color on the offscreen context
//   offscreenContext.font = font;
//   offscreenContext.fillStyle = textColor;

//   // Measure the text size
//   const textMetrics = offscreenContext.measureText(text);
//   const textWidth = textMetrics.width;
//   const textHeight = parseInt(font, 10); // Convert font size to an integer for the text height
  
//   // Create an image from the offscreen canvas
//   const textImage = new Image();

//   // When the image is loaded, set the canvas size and draw the text
//   textImage.onload = () => {
//       // Set the canvas size to fit the loaded image
//       offscreenCanvas.width = textImage.width;
//       offscreenCanvas.height = textImage.height;

//       // Draw the text on the offscreen canvas
//       offscreenContext.drawImage(textImage, 0, 0);

//       // Log the image data (URL)
//       console.log("Image data:", textImage.src);

//       // Now you have an image representation of the text
//       // You can draw this image on the main canvas
//       // context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
//       context.drawImage(textImage, 50, 50); // Adjust the position as needed
//   };

//   // Set the image source
//   textImage.src = offscreenCanvas.toDataURL();

//   console.log(`Offscreen canvas created: ${offscreenCanvas}`);
//   console.log(`Offscreen canvas size set: ${offscreenCanvas.width} ${offscreenCanvas.height}`);
//   console.log('Text drawn on offscreen canvas');

//   // You can add this image to the canvasImages array
// // addImageToCanvasImages(textImage, 50, 50);
// addImageToCanvasImages(textImage,x, y);
// console.log("Text img added to array");

// }

// Function to add dialogue to the canvas as an image -- now
// function addDialogueToCanvas(text, font = '48px Arial', textColor = 'black', x = 50, y = 50) {
//   // Set the font and color on the context
//   context.font = font;
//   context.fillStyle = textColor;

//   // Measure the text size
//   const textMetrics = context.measureText(text);

//   // Draw the text directly on the canvas
//   context.fillText(text, x, y);

//   // Save the canvas portion containing the text as an image
//   const textImage = new Image();
//   textImage.src = canvas.toDataURL();
//   console.log(textImage);
//   const link = textImage.src;
//   console.log(link);

//   // Now you have an image representation of the text
//   // You can add this image to the canvasImages array
//   addImageToCanvasImages(textImage, x, y, textMetrics.width, parseInt(font, 10));
//   console.log("Text img added to array",addImageToCanvasImages);

//   // Draw the canvas with the new image
//   drawCanvas();
// }




//draw text as img --now
// function drawCanvas() {
//   // Clear the canvas
//   // context.clearRect(0, 0, canvas.width, canvas.height);

//   // Redraw all images with their new positions from the canvasImages array
//   for (const imageObject of canvasImages) {
//     context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);

//   }
  
//   // Now, draw the textImage (if it exists)
//   if (textImage) {
//     context.drawImage(textImage, x, y, textMetrics.width, parseInt(font, 10));
//     console.log(textImage.src);

//   }
// }