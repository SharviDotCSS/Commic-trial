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


// export function initializeAddDialogue() {

//     const dialogueText = document.getElementById('dialogue-text');//textInput
//     const addDialogueBtn = document.getElementById('add-dialogue-btn');//addTextBtn

//     // Event listener for the "Add Dialogue" button
//     addDialogueBtn.addEventListener('click', () => {
//         console.log('Add Dialogue button clicked');
//         const text = dialogueText.value;
//         // Populate textElementsArray with text elements
//         textElementsArray.push({ text: text, x: 100, y: 100, font: "20px Arial", color: "black" });
//         addDialogueToCanvas(text);
//         console.log(dialogueText.value);
//     });

//     // Function to add dialogue to the canvas
//     function addDialogueToCanvas(text) {
//         // Logic to add the provided text as dialogue to the canvas
//         // You should use the canvas and context variables from your main.js

//         // For example:
//         context.font = '48px Arial'; // Set the font size and type
//         context.fillStyle = 'black'; // Set the text color
//         context.fillText(text, 50, 50); // Draw the text at specified coordinates
//         console.log("inside function addDialogueToCanvas");
//     }
// }

export function initializeAddDialogue() {
    const dialogueText = document.getElementById('dialogue-text'); // textInput
    const addDialogueBtn = document.getElementById('add-dialogue-btn'); // addTextBtn

    // Event listener for the "Add Dialogue" button
    // addDialogueBtn.addEventListener('click', () => {
    //     console.log('Add Dialogue button clicked');
    //     const text = dialogueText.value;
    //     // Populate textElementsArray with text elements
    //     textElementsArray.push({ text: text, x: 100, y: 100, font: "20px Arial", color: "black" });
    //     addDialogueToCanvas(text);
    //     console.log(dialogueText.value);
    // });

    // addDialogueBtn.addEventListener('click', () => {
    //     console.log('Add Dialogue button clicked');
    //     const text = dialogueText.value;
    //     const selectedFont = fontDropdown.value; // Get the selected font
    
    //     // Set the font property of the text element
    //     textElementsArray.push({ text: text, x: 100, y: 100, font: selectedFont, color: "black" });
    //     addDialogueToCanvas(text, selectedFont);
    //     console.log(dialogueText.value);
    //     drawCanvas(); // Call drawCanvas to update the canvas
    // });

    // Function to add dialogue to the canvas
    // function addDialogueToCanvas(text) {
    //     // Logic to add the provided text as dialogue to the canvas
    //     // You should use the canvas and context variables from your main.js

    //     // For example:
    //     context.font = '48px Arial'; // Set the font size and type
    //     context.fillStyle = 'black'; // Set the text color
    //     context.fillText(text, 50, 50); // Draw the text at specified coordinates
    //     console.log("inside function addDialogueToCanvas");
    // }
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



// Modify the event listener for the "Add Dialogue" button
// Modify the event listener for the "Add Dialogue" button
// addDialogueBtn.addEventListener('click', () => {
//     console.log('Add Dialogue button clicked');
//     const text = dialogueText.value;
//     const selectedFont = fontDropdown.value; // Get the selected font

//     // Set the font property of the text element
//     textElementsArray.push({ text: text, x: 100, y: 100, font: selectedFont, color: "black" });
//     addDialogueToCanvas(text, selectedFont);
//     console.log(dialogueText.value);
//     drawCanvas(); // Call drawCanvas to update the canvas
// });





// fontDropdown.addEventListener('change', () => {
//     const selectedFont = fontDropdown.value;
//     textDisplay.style.fontFamily = selectedFont; // Set the font based on the selected option
//     console.log(selectedFont);

// });

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



























// Function to add draggable text to the canvas
// export function addDraggableTextToCanvas(canvas, context) {


//     // Variables to store text position and dragging state
//     let isDragging = false;
//     let initialX, initialY;

//     // Event listener for mouse down on the canvas
//     canvas.addEventListener('mousedown', (e) => {
//         isDragging = true;
//         console.log("mousedown");
//         // Check if the mouse click is inside the text area
//         const mouseX = e.clientX - canvas.getBoundingClientRect().left;
//         const mouseY = e.clientY - canvas.getBoundingClientRect().top;

//         // Replace these coordinates with the position of your text
//         const textX = 100;
//         const textY = 100;
//         const textWidth = context.measureText("Your Text").width;
//         const textHeight = 20; // Adjust as needed

//         if (
//             mouseX >= textX &&
//             mouseX <= textX + textWidth &&
//             mouseY >= textY &&
//             mouseY <= textY + textHeight
//         ) {
//             isDragging = true;
//             initialX = mouseX - textX;
//             initialY = mouseY - textY;
//         }
//     });

    
//     // Event listener for mouse up on the canvas
//     canvas.addEventListener('mouseup', () => {
//         isDragging = false;
//         console.log("mouseup");
//     });


//     // Return any values or objects that need to be accessible from the main file
// }



// Event listener for mouse move on the canvas
// canvas.addEventListener('mousemove', (e) => {
//     if (isDragging) {
//         console.log("text is dragabble");
//         const mouseX = e.clientX - canvas.getBoundingClientRect().left;
//         const mouseY = e.clientY - canvas.getBoundingClientRect().top;

//         // Calculate the new position of the text
//         const newX = mouseX - initialX;
//         const newY = mouseY - initialY;

//         console.log(`Text Position: x=${newX}, y=${newY}`);
//         console.log(`isDragging: ${isDragging}`);

//         // Update the x and y properties of the text element you want to move
//         // let indexToUpdate = -1; // Initialize with an invalid value
//         // textElementsArray[indexToUpdate].x = newX;
//         // textElementsArray[indexToUpdate].y = newY;

//         console.log(textElementsArray);

//         // Clear the canvas and redraw the text at the new position
//         context.clearRect(0, 0, canvas.width, canvas.height);
//         context.fillText("Your Text", newX, newY);

//         // Redraw the canvas with the updated text position
//         drawCanvas(textElementsArray,newX,newY);
//     }
// });

// // Modified event listener with { passive: true }
// canvas.addEventListener('mousewheel', (e) => {
//     // Your event handling code here
// }, { passive: true });
