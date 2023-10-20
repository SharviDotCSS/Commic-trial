// AddDialogue.js

const canvas = document.getElementById('comic-canvas');
const context = canvas.getContext('2d');
const addDialogueBtn = document.getElementById('add-dialogue-btn');//addTextBtn
const dialogueText = document.getElementById('dialogue-text'); // Define dialogueText globally
const fontDropdown = document.getElementById('font-family');
const textDisplay = document.getElementById('text-display');
const content = document.getElementById('content');

// Declare and initialize textElementsArray
let textElementsArray = [];

// Declare textImage variable
let textImage;

export function initializeAddDialogue() {
    const dialogueText = document.getElementById('dialogue-text'); // textInput
    const addDialogueBtn = document.getElementById('add-dialogue-btn'); // addTextBtn

}

//working -- not drag
function drawCanvas() {
    // Clear the canvas to start with a clean slate
    // context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw any text elements on the canvas
    for (const textElement of textElementsArray) {
        context.font = textElement.font;
        context.fillStyle = textElement.color;
        context.fillText(textElement.text, textElement.x, textElement.y);
        // context.drawImage(textElement.text, textElement.x, textElement.y);
        console.log("drawcanvas was called");
    }
}

// function drawCanvas() {
//     // Clear the canvas to start with a clean slate
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw all elements on the canvas

//     // 1. Draw any images
//     // for (const imageObject of canvasImages) {
//     //     context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);
//     // }

//     // 2. Draw any text elements
//     for (const textElement of textElementsArray) {
//         context.font = textElement.font;
//         context.fillStyle = textElement.color;
//         context.fillText(textElement.text, textElement.x, textElement.y);
//     }

    
// }


//trial -- not using
// // Function to draw text elements on the canvas
// function drawCanvas() {
//     // Clear the canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);
  
//     // Draw text elements on the canvas
//     for (const textElement of textElementsArray) {
//       context.font = `${textElement.fontSize}px ${textElement.font}`;
//       context.fillStyle = textElement.color;
//       context.fillText(textElement.text, textElement.x, textElement.y);
//     }
//   }

// Function to add dialogue to the canvas --> working without drag
export function addDialogueToCanvas(text, font = '48px Arial') {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    context.font = font; // Set the font (either custom or default)
    console.log("the font is",font);
    context.fillStyle = 'black'; // Set the text color
    context.fillText(text, 50, 50); // Draw the text at specified coordinates // cmnt out for trial
    // context.drawImage(textImage, 50, 50); // Adjust the position as needed
    console.log("inside function addDialogueToCanvas");
}


// Function to add dialogue to the canvas as an image
// export function addDialogueToCanvas(text, font = '48px Arial', textColor = 'black') {
//     // Create an offscreen canvas to render the text
//     const offscreenCanvas = document.createElement('canvas');
//     const offscreenContext = offscreenCanvas.getContext('2d');
    
//     // Set the font and color on the offscreen context
//     offscreenContext.font = font;
//     offscreenContext.fillStyle = textColor;

//     // Measure the text size
//     const textMetrics = offscreenContext.measureText(text);
//     const textWidth = textMetrics.width;
//     const textHeight = parseInt(font, 10); // Convert font size to an integer for the text height
    
//     // Create an image from the offscreen canvas
//     const textImage = new Image();

//     // When the image is loaded, set the canvas size and draw the text
//     textImage.onload = () => {
//         // Set the canvas size to fit the loaded image
//         offscreenCanvas.width = textImage.width;
//         offscreenCanvas.height = textImage.height;

//         // Draw the text on the offscreen canvas
//         offscreenContext.drawImage(textImage, 0, 0);

//         // Log the image data (URL)
//         console.log("Image data:", textImage.src);

//         // Now you have an image representation of the text
//         // You can draw this image on the main canvas
//         // context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
//         context.drawImage(textImage, 50, 50); // Adjust the position as needed
//     };

//     // Set the image source
//     textImage.src = offscreenCanvas.toDataURL();

//     console.log(`Offscreen canvas created: ${offscreenCanvas}`);
//     console.log(`Offscreen canvas size set: ${offscreenCanvas.width} ${offscreenCanvas.height}`);
//     console.log('Text drawn on offscreen canvas');

//     // You can add this image to the canvasImages array
//   addImageToCanvasImages(textImage, 50, 50);

// }


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

// Event listener for page load
window.addEventListener('load', () => {
    // Call populateFontDropdown when the page loads
    populateFontDropdown();
});


// Add this function to update the font of the text area
function updateTextAreaFont(selectedFont) {
    const dialogueText = document.getElementById('dialogue-text');
    dialogueText.style.fontFamily = selectedFont;
}

// Modify the event listener for the "Add Dialogue" button --> working
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



// function drawCanvas() {
//   // Clear the canvas to start with a clean slate
//   context.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw any text elements on the canvas
//   for (const textElement of textElementsArray) {
//       context.font = textElement.font;
//       context.fillStyle = textElement.color;
//       context.drawImage(textElement.image, textElement.x, textElement.y);
//   }
// }

// // Function to add dialogue to the canvas
// export function addDialogueToCanvas(text, font = '48px Arial', color = 'black') {
//   // Set the text styles on the off-screen canvas
//   offScreenContext.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
//   offScreenContext.font = font;
//   offScreenContext.fillStyle = color;
//   offScreenContext.fillText(text, 0, 0); // Draw the text at (0, 0) on the off-screen canvas

//   // Convert the off-screen canvas to an image
//   const textImage = new Image();
//   textImage.src = offScreenCanvas.toDataURL();

//   // You can adjust the position as needed
//   const x = 50;
//   const y = 50;

//   // Add the text element to the array
//   textElementsArray.push({ text, x, y, font, color, image: textImage });

//   // Draw the canvas with the updated text element
//   drawCanvas();
// }





//draging same as comic.js
//Resize & Rearrage imgs on canvas
// function redrawCanvas() {
//     // Clear the canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);
    
//     // Redraw all images with their new positions from the canvasImages array
//     for (const imageObject of canvasImages) {
//       context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);
//       console.log(imageObject);
//     }
  
//     // Re-draw the text elements
//     for (const textElement of textElementsArray) {
//       context.font = textElement.font;
//       context.fillStyle = textElement.color;
//       context.fillText(textElement.text, textElement.x, textElement.y);
//     }
//   }
  
  
//   const canvasImages = []; // Array to store images placed on the canvas
  
//   // // Function to add an image to the canvasImages array with draggable property set to true
//   function addImageToCanvasImages(image, x, y) {
//     canvasImages.push({
//       x: x,
//       y: y,
//       width: image.width,
//       height: image.height,
//       draggable: true,
//       element: image,
//     });
//     console.log("from function addImageToCanvasImages",canvasImages);
//   }
  
//   let isResizing = false;
//   let resizingImage = null;
//   let clickedCorner = null;
//   let originalWidth, originalHeight;
  
//   let isDragging = false;
//   let selectedImage = null;
//   let offsetX, offsetY;
  
//   canvas.addEventListener('mousedown', (e) => {
//     const x = e.clientX - canvas.getBoundingClientRect().left;
//     const y = e.clientY - canvas.getBoundingClientRect().top;
  
//     for (const image of canvasImages) {
//       if (
//         x >= image.x &&
//         x <= image.x + image.width &&
//         y >= image.y &&
//         y <= image.y + image.height
//       ) {
//         const isNearLeftEdge = x <= image.x + 5;
//         const isNearRightEdge = x >= image.x + image.width - 5;
//         const isNearTopEdge = y <= image.y + 5;
//         const isNearBottomEdge = y >= image.y + image.height - 5;
  
//         if (isNearLeftEdge || isNearRightEdge || isNearTopEdge || isNearBottomEdge) {
//           isDragging = false;
//           isResizing = true;
//           selectedImage = null;
//           resizingImage = image;
//           offsetX = x - image.x;
//           offsetY = y - image.y;
//           originalWidth = image.width;
//           originalHeight = image.height;
  
//           // Determine which corner was clicked
//           const centerX = image.x + image.width / 2;
//           const centerY = image.y + image.height / 2;
//           if (x < centerX && y < centerY) {
//             clickedCorner = 'top-left';
//           } else if (x < centerX && y >= centerY) {
//             clickedCorner = 'bottom-left';
//           } else if (x >= centerX && y < centerY) {
//             clickedCorner = 'top-right';
//           } else {
//             clickedCorner = 'bottom-right';
//           }
//         } else {
//           isDragging = true;
//           isResizing = false;
//           selectedImage = image;
//           resizingImage = null;
//           offsetX = x - image.x;
//           offsetY = y - image.y;
//         }
//         break;
//       }
//     }

//     redrawCanvas();
//   });





































//Dragging
// let isTextDragging = false;
// let selectedText = null;
// let textOffsetX, textOffsetY;

// canvas.addEventListener('mousedown', (e) => {
//   console.log('Mouse down event triggered fromtext');
//     const x = e.clientX - canvas.getBoundingClientRect().left;
//     const y = e.clientY - canvas.getBoundingClientRect().top;
//     console.log(x,y);
  
//     // Check if the click occurred inside a text element
//     for (const textElement of textElementsArray) {
//       if (
//         x >= textElement.x &&
//         x <= textElement.x + textElement.width &&
//         y >= textElement.y &&
//         y <= textElement.y + textElement.height
//       ) {
//         isTextDragging = true;
//         selectedText = textElement;
//         textOffsetX = x - textElement.x;
//         textOffsetY = y - textElement.y;
//         console.log("selectedText",selectedText);
//         break;
//       }
//     }
//   });
  
//   canvas.addEventListener('mousemove', (e) => {
//     console.log('Mouse move event triggered fromtext');
//     if (isTextDragging && selectedText) {
//       const x = e.clientX - canvas.getBoundingClientRect().left;
//       const y = e.clientY - canvas.getBoundingClientRect().top;
  
//       selectedText.x = x - textOffsetX;
//       selectedText.y = y - textOffsetY;
  
//       // Redraw the canvas
//       redrawCanvas();
//     }
//   });
  
//   canvas.addEventListener('mouseup', () => {
//     console.log('Mouse up event triggered fromtext');
//     if (isTextDragging) {
//       isTextDragging = false;
//     }
//   });

//   function redrawCanvas() {
//     console.log('redraw called fromtext');
//     // Clear the canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);
  
//     // Redraw all images with their new positions from the canvasImages array
//     // for (const imageObject of canvasImages) {
//     //   context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);
//     // }
  
//     // Redraw all text elements from the textElementsArray
//     for (const textElement of textElementsArray) {
//       context.font = textElement.font;
//       context.fillStyle = textElement.color;
//       context.fillText(textElement.text, textElement.x, textElement.y);
//     }
//   }
  
























