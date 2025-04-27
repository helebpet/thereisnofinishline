let cursorDiv;
let canvasReady = false;
let isMobile = false;

let textToDraw = "A FLASH OF JOY. A SENSE OF FLOATING AS YOU RUN. ";
let spacing;
let scrollOffset = 0;
let path = [];
let radius;
let angleOffset = 0;
let kerningPairs = {};

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '10');
  cnv.style('pointer-events', 'none');
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');
  checkDevice();
  canvasReady = true;

  // Hide the loader once ready
  let loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }

  textFont("Termina", 600);  // Font Termina, weight 600
  textStyle(BOLD);

  // Dynamically adjust text size to fit screen width
  let desiredWidth = windowWidth * 0.9; // 90% of screen
  spacing = desiredWidth / textToDraw.length;
  
  // Calculate spacing for the text
  textSize(spacing * 0.9);
  
  // Define kerning pairs for specific letter combinations
  // Find the position of "IN" in "FLOATING"
  let floatingIndex = textToDraw.indexOf("FLOATING");
  if (floatingIndex !== -1) {
    let iPosition = floatingIndex + 5; // Position of "I" in "FLOATING"
    kerningPairs[iPosition] = 0.6; // Reduce spacing after "I" by 40%
  }
}

function checkDevice() {
  isMobile = windowWidth <= 768;
}

function draw() {
  if (!canvasReady) return;

  const color1 = color('#D7DA1B');
  const color2 = color('#FCFCEC');
  const lerpAmt = map(mouseY, 0, height, 0, 1);
  const lerpedColor = lerpColor(color1, color2, lerpAmt);

  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, color1.toString());
  grad.addColorStop(1, lerpedColor.toString());
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);

  // Update the scrollOffset for animation
  let cycleLength = spacing * textToDraw.length;
  scrollOffset = (scrollOffset + 2) % cycleLength;
  
  // Generate the floating wave path
  path = [];
  generatePath(frameCount * 0.05);
  
  // Draw only one instance of text along the path
  drawTextAlongPath(textToDraw, path, spacing, scrollOffset);

  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function generatePath(offset) {
  for (let x = -400; x < width + 400; x += 10) {
    let y = height / 2 + sin(x * 0.01 + offset) * (height / 10);
    path.push(createVector(x, y));
  }
}

function drawTextAlongPath(txt, path, spacing, horizontalOffset) {
  let distance = -horizontalOffset;
  let charCount = 0;
  let totalPathLength = path[path.length - 1].x - path[0].x;
  
  noStroke();
  fill('#04AD74');
  textStyle(BOLD);

  while (distance < totalPathLength) {
    let currentChar = txt[charCount % txt.length];
    let charPosition = charCount % txt.length;
    
    let { pos, angle } = getPosAndAngleOnPath(distance);
    
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    text(currentChar, 0, 0);
    pop();
    
    // Apply custom kerning if defined for this position
    let adjustmentFactor = kerningPairs[charPosition] || 1;
    distance += spacing * adjustmentFactor;
    
    charCount++;
  }
}

function getPosAndAngleOnPath(distance) {
  let dRemaining = distance;
  for (let i = 1; i < path.length; i++) {
    let p1 = path[i - 1];
    let p2 = path[i];
    let segmentLength = p5.Vector.dist(p1, p2);
    if (dRemaining <= segmentLength) {
      let inter = p5.Vector.lerp(p1, p2, dRemaining / segmentLength);
      let angle = atan2(p2.y - p1.y, p2.x - p1.x);
      return { pos: inter, angle };
    }
    dRemaining -= segmentLength;
  }
  return { pos: path[path.length - 1], angle: 0 };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // Recalculate sizes
}