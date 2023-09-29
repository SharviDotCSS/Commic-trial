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

export function initializeAddDialogue() {
    const dialogueText = document.getElementById('dialogue-text'); // textInput
    const addDialogueBtn = document.getElementById('add-dialogue-btn'); // addTextBtn

}

function drawCanvas() {
    // Clear the canvas to start with a clean slate
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw any text elements on the canvas
    for (const textElement of textElementsArray) {
        context.font = textElement.font;
        context.fillStyle = textElement.color;
        context.fillText(textElement.text, textElement.x, textElement.y);
        console.log("drawcanvas was called");
    }
}

// Function to add dialogue to the canvas
export function addDialogueToCanvas(text, font = '48px Arial') {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    context.font = font; // Set the font (either custom or default)
    console.log("the font is",font);
    context.fillStyle = 'black'; // Set the text color
    context.fillText(text, 50, 50); // Draw the text at specified coordinates
    console.log("inside function addDialogueToCanvas");
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

// Modify the event listener for the "Add Dialogue" button
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
    addDialogueToCanvas(text, selectedFont, fontSize, textColor);
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






































//Dragging
// let isTextDragging = false;
// let selectedText = null;
// let textOffsetX, textOffsetY;

// canvas.addEventListener('mousedown', (e) => {
//     const x = e.clientX - canvas.getBoundingClientRect().left;
//     const y = e.clientY - canvas.getBoundingClientRect().top;
  
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
//         break;
//       }
//     }
//   });
  
//   canvas.addEventListener('mousemove', (e) => {
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
//     if (isTextDragging) {
//       isTextDragging = false;
//     }
//   });

//   function redrawCanvas() {
//     // Clear the canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);
  
//     // Redraw all images with their new positions from the canvasImages array
//     for (const imageObject of canvasImages) {
//       context.drawImage(imageObject.element, imageObject.x, imageObject.y, imageObject.width, imageObject.height);
//     }
  
//     // Redraw all text elements from the textElementsArray
//     for (const textElement of textElementsArray) {
//       context.font = textElement.font;
//       context.fillStyle = textElement.color;
//       context.fillText(textElement.text, textElement.x, textElement.y);
//     }
//   }
  
























