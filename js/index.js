let offset = 0;
let lineSpacing = 20; // Space between lines
let cursorDiv;

function setup() {
  createCanvas(windowWidth, windowHeight); // still needed for background
  noCursor();

  // Create and style the custom cursor div
  cursorDiv = createDiv('');
  cursorDiv.addClass('custom-cursor');

  // Main content
  let container = createDiv().addClass('centered-wrapper');
  createP('THERE IS NO<br>FINISH LINE.').addClass('main-text').parent(container);
  createP("Nike's 1977 Campaign").addClass('subtext').parent(container);
  let buttonEl = createA('page1.html', 'ENTER').addClass('enter-button').parent(container);

  buttonEl.mouseOver(() => cursorDiv.addClass('cursor-grow'));
  buttonEl.mouseOut(() => cursorDiv.removeClass('cursor-grow'));
}

function draw() {
  // Define the two colors (FCFCEC and D7DA1B)
  let color1 = color('#FCFCEC'); // light cream 
  let color2 = color('#D7DA1B'); // yellow-green 

  // Use mouseY to control the interpolation between the two colors
  let lerpedColor = lerpColor(color1, color2, map(mouseY, 0, height, 0, 1)); // map Y to transition

  // Create a vertical gradient that goes from top (0) to bottom (height)
  let grad = drawingContext.createLinearGradient(0, 0, 0, height); // Vertical gradient
  grad.addColorStop(0, color1); // Start with the light cream color at the top
  grad.addColorStop(1, lerpedColor); // End with the lerped color based on mouseY at the bottom
  drawingContext.fillStyle = grad;

  // Fill the background with the vertical moving gradient
  rect(0, 0, width, height);

  // Draw the lines (if necessary)
  drawLines();

  // Position the custom cursor
  cursorDiv.position(mouseX, mouseY);
}

function drawLines() {
  stroke('#000000');
  strokeWeight(1);

  // Move lines up slowly
  offset -= 0.2;

  // Reset offset when it moves past one full line spacing
  if (offset <= -lineSpacing) {
    offset += lineSpacing;
  }

  // Start drawing lines slightly above the canvas to ensure full coverage
  for (let y = offset; y < height; y += lineSpacing) {
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
