let cursorDiv;
let canvasReady = false;
let isMobile = false;
let textP; // Text paragraph element

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '10');
  cnv.style('pointer-events', 'none');
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');
  
  // Create text paragraph
  textP = createP('SOONER or LATER<br />the serious runner<br />goes through a special,<br />very personal experience<br />that is unknown to most people.');
  
  // Style the paragraph
  textP.style('font-weight', '600');
  textP.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
  textP.style('line-height', '1.6');
  textP.style('letter-spacing', '-0.11em');
  textP.style('word-spacing', '0.15em');
  textP.style('text-align', 'left');
  textP.style('margin-bottom', '0'); // No extra paragraph spacing
  textP.style('padding-bottom', '0');
  
  // Position the text lower on the screen
  textP.position(windowWidth * 0.1, windowHeight * 0.25);
  textP.style('color', '#04AD74'); // Dark green text to match the theme
  textP.style('z-index', '20'); // Above the canvas
  textP.style('max-width', '80%'); // Limit width
  
  checkDevice();
  canvasReady = true;
  // Hide the loader once ready
  let loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

function checkDevice() {
  isMobile = windowWidth <= 768;
}

function draw() {
  if (!canvasReady) return;
  
  clear(); // Clear the canvas to make any HTML text visible
  
  // Create interactive gradient background - transparent top to cream bottom
  const color2 = color('#FCFCEC'); // Light cream color
  const transparentColor = color(255, 255, 255, 0); // Transparent
  const lerpAmt = map(mouseY, 0, height, 0, 1);
  const lerpedColor = lerpColor(transparentColor, color2, lerpAmt);
  
  // Apply gradient background
  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, transparentColor.toString());
  grad.addColorStop(1, color2.toString());
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);
  
  // Lines configuration
  let startY = windowHeight * 0.6;
  let endY = windowHeight;
  let lineGap = 20;
  
  // Create interactive colors that respond to mouse position
  const colors = ["#04AD74", "#EF5C26", "#EFBD06"];
  let colorIndex = floor(map(mouseX, 0, windowWidth, 0, colors.length));
  colorIndex = constrain(colorIndex, 0, colors.length - 1);
  let lineColor = colors[colorIndex];
  
  // Make stroke weight responsive to mouse Y position
  let strokeWeightFactor = map(mouseY, 0, windowHeight, 1, 10);
  stroke(lineColor);
  strokeWeight(strokeWeightFactor);
  
  // Draw horizontal lines
  for (let y = startY; y <= endY; y += lineGap) {
    // Add subtle wave effect based on mouseX
    let waveAmplitude = map(mouseY, 0, height, 0, 20);
    let waveFreq = 0.02;
    
    // Draw wavy line
    beginShape();
    for (let x = 0; x < width; x += 5) {
      let yOffset = sin(x * waveFreq + frameCount * 0.05) * waveAmplitude;
      vertex(x, y + yOffset);
    }
    endShape();
  }
  
  // Update cursor position
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  checkDevice();
  
  // Update text position on window resize
  if (textP) {
    textP.position(windowWidth * 0.1, windowHeight * 0.25);
  }
  
  redraw();
}