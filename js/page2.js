// This sketch was organized and partially developed with the help of ChatGPT

// Global Variables
let cursorDiv;
let canvasReady = false;
let isMobile = false;
let textP; // Text paragraph element

// Setup Function
function setup() {
  // Canvas Setup
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '10');
  cnv.style('pointer-events', 'none');

  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');

  // Create and style text paragraph
  textP = createP('SOONER or LATER<br />the serious runner<br />goes through a special,<br />very personal experience<br />that is unknown to most people.');
  styleTextParagraph(textP);

  // Position and device checks
  checkDevice();
  canvasReady = true;

  // Hide loader
  let loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

// Style Paragraph Function
function styleTextParagraph(p) {
  p.style('font-weight', '600');
  p.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
  p.style('line-height', '1.6');
  p.style('letter-spacing', '-0.11em');
  p.style('word-spacing', '0.15em');
  p.style('text-align', 'left');
  p.style('margin-bottom', '0');
  p.style('padding-bottom', '0');
  p.style('color', '#04AD74');
  p.style('z-index', '20');
  p.style('max-width', '80%');
  p.position(windowWidth * 0.1, windowHeight * 0.2);
}

// Device Type Check
function checkDevice() {
  isMobile = windowWidth <= 768;
}

// Main Draw Loop
function draw() {
  if (!canvasReady) return;

  clear();
  background(255, 255, 255, 0); // Transparent background

  drawGradientBackground();
  drawInteractiveLines();

  // Update custom cursor
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

// Draw Gradient Background
function drawGradientBackground() {
  const color2 = color('#FCFCEC'); // Cream
  const transparentColor = color(255, 255, 255, 0);

  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, transparentColor.toString());
  grad.addColorStop(1, color2.toString());

  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);
}

// Draw Interactive Lines
function drawInteractiveLines() {
  let startY = windowHeight * 0.6;
  let endY = windowHeight;
  let lineGap = 20;

  const colors = ["#04AD74", "#EF5C26", "#EFBD06"];
  let colorIndex = floor(map(mouseX, 0, windowWidth, 0, colors.length));
  colorIndex = constrain(colorIndex, 0, colors.length - 1);
  let lineColor = colors[colorIndex];

  let strokeWeightFactor = map(mouseY, 0, windowHeight, 1, 10);
  stroke(lineColor);
  strokeWeight(strokeWeightFactor);

  for (let y = startY; y <= endY; y += lineGap) {
    let waveAmplitude = map(mouseY, 0, height, 0, 20);
    let waveFreq = 0.02;

    beginShape();
    for (let x = 0; x < width; x += 5) {
      let yOffset = sin(x * waveFreq + frameCount * 0.05) * waveAmplitude;
      vertex(x, y + yOffset);
    }
    endShape();
  }
}

// Handle Window Resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  checkDevice();

  if (textP) {
    textP.position(windowWidth * 0.1, windowHeight * 0.25);
  }

  redraw();
}
