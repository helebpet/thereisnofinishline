// This sketch was organized and partially developed with the help of ChatGPT 
let offset = 0; // Offset for the vertical line positions
let lineSpacing = 20; // Spacing between lines
let cursorDiv; // Reference to the custom cursor div

// Setup function, runs once when the sketch starts
function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window
  noCursor(); // Hide the default mouse cursor

  cursorDiv = select('.custom-cursor'); // Select the custom cursor element

  // Create a container div with a class 'centered-wrapper' and append it to the body
  const container = createDiv().addClass('centered-wrapper');
  
  // Create a heading paragraph and append it to the container
  createP('THERE IS NO<br>FINISH LINE.').addClass('main-text').parent(container);
  
  // Create a subheading paragraph and append it to the container
  createP("Nike's 1977 Campaign").addClass('subtext').parent(container);
  
  // Create a link (button) to 'page1.html' and append it to the container
  createA('page1.html', 'ENTER').addClass('enter-button').parent(container);
}

// Draw function, runs continuously to update the canvas
function draw() {
  const color1 = color('#FCFCEC'); // Define the first color (off-white)
  const color2 = color('#D7DA1B'); // Define the second color (yellow)

  // Calculate a linear interpolation amount based on the mouseY position
  const lerpAmt = map(mouseY, 0, height, 0, 1);
  
  // Get the interpolated color based on mouseY position
  const lerpedColor = lerpColor(color1, color2, lerpAmt);

  // Create a vertical gradient that goes from color1 to lerpedColor
  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, color1.toString()); // Start of gradient
  grad.addColorStop(1, lerpedColor.toString()); // End of gradient

  // Apply the gradient as the background fill
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);

  // Call the function to draw the horizontal lines
  drawLines();
  
  // Update the custom cursor position based on mouse position
  cursorDiv.position(mouseX, mouseY);
}

// Function to draw horizontal lines with offset
function drawLines() {
  stroke('#000'); // Set the line color to black
  strokeWeight(1); // Set the line thickness

  // Increment the offset, creating an animation effect for the lines
  offset -= 0.2; // Move the offset slowly upward
  if (offset <= -lineSpacing) offset += lineSpacing; // Reset offset when it exceeds the line spacing

  // Draw lines from top to bottom based on the current offset
  for (let y = offset; y < height; y += lineSpacing) {
    line(0, y, width, y); // Draw a line from the left to right of the canvas
  }
}

// Resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust the canvas size to match the new window size
}