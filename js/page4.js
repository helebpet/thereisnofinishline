let cursorDiv;
let canvasReady = false;
let isMobile = false;
let textToDraw = "A FLASH OF JOY. A SENSE OF FLOATING AS YOU RUN. ";
let spacing;
let scrollOffset = 0;
let path = [];
let kerningPairs = {};
let waveSineOffset = 0;
let waveSpeed = 0.05; // Controls the speed of the wave movement
let textWidth = 0; // Total width of the text

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
  
  textFont("Termina", 600); // Font Termina, weight 600
  textStyle(BOLD);
  
  // Dynamically adjust text size to fit screen width
  updateTextDimensions();
  
  // Define kerning pairs for specific letter combinations
  // Find the position of "IN" in "FLOATING"
  let floatingIndex = textToDraw.indexOf("FLOATING");
  if (floatingIndex !== -1) {
    let iPosition = floatingIndex + 5; // Position of "I" in "FLOATING"
    kerningPairs[iPosition] = 0.6; // Reduce spacing after "I" by 40%
  }
}

function updateTextDimensions() {
  let desiredWidth = windowWidth * 0.9; // 90% of screen
  
  // Calculate spacing and font size based on device
  if (isMobile) {
    spacing = desiredWidth / (textToDraw.length * 0.7); // Fewer visible characters on mobile
    textSize(spacing * 1.5);
  } else {
    spacing = desiredWidth / textToDraw.length;
    textSize(spacing * 0.9);
  }
  
  // Calculate total text width (important for non-overlapping marquee)
  textWidth = 0;
  for (let i = 0; i < textToDraw.length; i++) {
    let adjustmentFactor = kerningPairs[i] || 1;
    textWidth += spacing * adjustmentFactor;
  }
}

function checkDevice() {
  isMobile = windowWidth <= 768;
}

function draw() {
  if (!canvasReady) return;
  
  // Background gradient
  const color1 = color('#D7DA1B');
  const color2 = color('#FCFCEC');
  const lerpAmt = map(mouseY, 0, height, 0, 1);
  const lerpedColor = lerpColor(color1, color2, lerpAmt);
  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, color1.toString());
  grad.addColorStop(1, lerpedColor.toString());
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);
  
  // Update the wave sine offset for animation
  waveSineOffset += waveSpeed;
  
  // Generate the floating wave path
  generatePath(waveSineOffset);
  
  // Update scroll position with smooth animation
  let scrollSpeed = 2; // Fixed scroll speed (pixels per frame)
  scrollOffset = (scrollOffset + scrollSpeed);
  
  // Reset scrollOffset when a full text width has passed to prevent overflow
  if (scrollOffset > textWidth) {
    scrollOffset = 0;
  }
  
  // Draw text along the path
  drawNonOverlappingText(textToDraw, path, spacing, scrollOffset);
  
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function generatePath(offset) {
  path = [];
  
  // Create more points for smoother curves
  let step = 5; // Small step for smooth curves
  let extraPadding = windowWidth * 0.5; // Extra padding for smooth rendering
  
  for (let x = -extraPadding; x < width + extraPadding; x += step) {
    // Use the original sine wave formula with controlled offset
    let waveHeight = height / 10;
    let y = height / 2 + sin(x * 0.01 + offset) * waveHeight;
    path.push(createVector(x, y));
  }
}

function drawNonOverlappingText(txt, path, spacing, offset) {
  if (path.length < 2) return;
  
  noStroke();
  fill('#04AD74');
  textStyle(BOLD);
  
  // Calculate visible area with padding
  let visibleStart = -textWidth; // Start one text width before screen
  let visibleEnd = width + textWidth; // End one text width after screen
  
  // Calculate how many complete copies of the text we need
  // to fill the screen plus padding on both sides
  let visibleWidth = visibleEnd - visibleStart;
  let repetitions = Math.ceil(visibleWidth / textWidth) + 1;
  
  // Draw multiple instances of the text to create a continuous marquee
  for (let rep = 0; rep < repetitions; rep++) {
    let repOffset = rep * textWidth - offset;
    
    // Draw one instance of the text
    drawTextInstance(txt, path, spacing, repOffset);
  }
}

function drawTextInstance(txt, path, spacing, startX) {
  let xPos = startX;
  
  for (let i = 0; i < txt.length; i++) {
    let currentChar = txt[i];
    let pathInfo = getPosAndAngleOnPath(xPos);
    
    if (pathInfo) {
      push();
      translate(pathInfo.pos.x, pathInfo.pos.y);
      rotate(pathInfo.angle);
      text(currentChar, 0, 0);
      pop();
    }
    
    // Apply custom kerning if defined for this position
    let adjustmentFactor = kerningPairs[i] || 1; 
    xPos += spacing * adjustmentFactor;
  }
}

function getPosAndAngleOnPath(xPosition) {
  if (path.length < 2) return null;
  
  // Find the path points that surround this x position
  for (let i = 1; i < path.length; i++) {
    let p1 = path[i - 1];
    let p2 = path[i];
    
    if (p1.x <= xPosition && p2.x > xPosition) {
      // Calculate the fraction between the two points
      let fraction = (xPosition - p1.x) / (p2.x - p1.x);
      
      // Interpolate position
      let x = lerp(p1.x, p2.x, fraction);
      let y = lerp(p1.y, p2.y, fraction);
      
      // Calculate angle tangent to the path
      let angle = atan2(p2.y - p1.y, p2.x - p1.x);
      
      return {
        pos: createVector(x, y),
        angle: angle
      };
    }
  }
  
  // If position is outside the path range
  // For positions before start of path
  if (xPosition < path[0].x) {
    return {
      pos: path[0],
      angle: atan2(path[1].y - path[0].y, path[1].x - path[0].x)
    };
  }
  
  // For positions after end of path
  return {
    pos: path[path.length - 1],
    angle: atan2(
      path[path.length - 1].y - path[path.length - 2].y,
      path[path.length - 1].x - path[path.length - 2].x
    )
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  checkDevice();
  updateTextDimensions();
}