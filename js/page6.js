// This sketch was organized and partially developed with the help of ChatGPT
// ===== GLOBAL VARIABLES =====

// UI Elements
let cursorDiv;             // Custom cursor element
let canvasReady = false;   // Flag to check if canvas is ready
let isMobile = false;      // Flag to check if device is mobile

// Text and Path Variables
let textToDraw = "AND FROM THAT POINT ON, ...  ";  // Text to display in circle
let spacing;               // Normal spacing between characters
let reducedSpacing;        // Reduced spacing for specific letter combinations
let path = [];             // Array to store points along the circular path
let radius;                // Radius of the circular path
let angleOffset = 0;       // Angle offset for rotating the circular path


// ===== P5.JS CORE FUNCTIONS =====

/**
 * p5.js setup function - runs once at the beginning
 * Initializes canvas, styles, and calculates initial path
 */
function setup() {
  // Create and position canvas
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '10');
  cnv.style('pointer-events', 'none');
  
  // Set rendering parameters
  frameRate(60);
  noCursor();  // Hide default cursor
  cursorDiv = select('.custom-cursor');
  
  // Check if device is mobile
  checkDevice();
  canvasReady = true;

  // Hide loader if present
  let loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }

  // Set text properties
  textFont("Termina", 600);
  textStyle(BOLD);
  fill('#FCFCEC');  // Off-white color

  // Calculate responsive font size and radius
  let baseFontSize = min(windowWidth, windowHeight) * 0.04;
  textSize(baseFontSize);
  radius = baseFontSize * 5.5;  // Circle radius proportional to font size

  // Initialize circular path
  path = [];
  angleOffset = map(mouseX, 0, width, 0, TWO_PI);
  generateFullCircularPath(width / 2, height / 2, radius, 400, angleOffset);

  // Calculate character spacing based on circle circumference
  let circleLength = getTotalPathLength();
  spacing = (circleLength / textToDraw.length) * 0.89;
  reducedSpacing = spacing * 0.6;  // For letter combinations that need tighter spacing
}

/**
 * p5.js draw function - runs continuously
 * Updates and renders all visual elements
 */
function draw() {
  // Skip drawing if canvas is not ready
  if (!canvasReady) return;

  // Create dynamic background gradient based on mouse Y position
  const color1 = color('#D7DA1B');  // Yellow/green
  const color2 = color('#FCFCEC');  // Off-white
  const lerpAmt = map(mouseY, 0, height, 0, 1);
  const lerpedColor = lerpColor(color1, color2, lerpAmt);

  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, color1.toString());
  grad.addColorStop(1, lerpedColor.toString());
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);

  // Draw horizontal lines in bottom portion of screen
  let startY = windowHeight * 0.6 + sin(mouseY * 0.05) * 50;  // Starting Y with slight wave effect
  let endY = windowHeight;  // End at bottom of screen
  let lineGap = 20;  // Space between lines
  
  // Line color changes based on mouse X position
  const colors = ["#04AD74", "#EF5C26", "#EFBD06"];  // Green, Orange, Yellow
  let colorIndex = floor(map(mouseX, 0, windowWidth, 0, colors.length));
  colorIndex = constrain(colorIndex, 0, colors.length - 1);
  let lineColor = colors[colorIndex];
  
  stroke(lineColor);
  
  // Line thickness changes based on mouse Y position
  let strokeWeightFactor = map(mouseY, 0, windowHeight, 1, 10);
  strokeWeight(strokeWeightFactor);

  // Draw the lines
  for (let y = startY; y <= endY; y += lineGap) {
    line(0, y, windowWidth, y);
  }

  // Update and draw the circular text
  path = [];
  angleOffset = map(mouseX, 0, width, 0, TWO_PI);  // Rotate circle based on mouse X
  generateFullCircularPath(width / 2, height / 2, radius, 400, angleOffset);
  drawTextAlongPath(textToDraw, path);

  // Update custom cursor position
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}


// ===== UTILITY FUNCTIONS =====

/**
 * Checks if the device is mobile based on window width
 */
function checkDevice() {
  isMobile = windowWidth <= 768;
}

/**
 * Handles window resize events by adjusting canvas and recalculating elements
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();  // Recalculate all size-dependent variables
}


// ===== PATH GENERATION AND TEXT RENDERING =====

/**
 * Generates points along a circular path
 * 
 * @param {number} centerX - X coordinate of circle center
 * @param {number} centerY - Y coordinate of circle center
 * @param {number} radius - Radius of the circle
 * @param {number} resolution - Number of points to generate (higher = smoother)
 * @param {number} angleStart - Starting angle for the circle in radians
 */
function generateFullCircularPath(centerX, centerY, radius, resolution, angleStart) {
  let angleStep = TWO_PI / resolution;  // Angle between each point
  for (let i = 0; i < resolution; i++) {
    let angle = angleStart + angleStep * i;
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    path.push(createVector(x, y));  // Add point to path
  }
}

/**
 * Calculates the total length of the path
 * 
 * @returns {number} The sum of distances between consecutive points
 */
function getTotalPathLength() {
  let len = 0;
  for (let i = 1; i < path.length; i++) {
    len += p5.Vector.dist(path[i - 1], path[i]);
  }
  return len;
}

/**
 * Gets position and angle at a specific distance along the path
 * 
 * @param {number} distance - Distance along the path
 * @returns {Object} Object containing position vector and angle in radians
 */
function getPosAndAngleOnPath(distance) {
  let dRemaining = distance;
  
  // Iterate through path segments
  for (let i = 1; i < path.length; i++) {
    let p1 = path[i - 1];
    let p2 = path[i];
    let segmentLength = p5.Vector.dist(p1, p2);
    
    // If we've found the right segment
    if (dRemaining <= segmentLength) {
      // Interpolate position between points
      let inter = p5.Vector.lerp(p1, p2, dRemaining / segmentLength);
      // Calculate angle for proper character orientation
      let angle = atan2(p2.y - p1.y, p2.x - p1.x);
      return { pos: inter, angle };
    }
    
    dRemaining -= segmentLength;
  }
  
  // If we've gone beyond path length, return the last point
  return { pos: path[path.length - 1], angle: 0 };
}

/**
 * Draws text characters along the calculated path
 * 
 * @param {string} txt - Text to draw
 * @param {Array} path - Array of points defining the path
 */
function drawTextAlongPath(txt, path) {
  let distance = 0;       // Current distance along path
  let charIndex = 0;      // Current character index
  
  noStroke();
  fill('#FCFCEC');        // Off-white text color
  textStyle(BOLD);

  // Place each character along the path
  while (charIndex < txt.length && distance < getTotalPathLength()) {
    let currentChar = txt[charIndex];
    let nextChar = txt[charIndex + 1];

    // Get position and angle for current character
    let { pos, angle } = getPosAndAngleOnPath(distance);

    // Draw the character with proper orientation
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    text(currentChar, 0, 0);
    pop();

    // Adjust spacing based on character combinations
    if (currentChar === 'I' && nextChar === 'N') {
      // Use reduced spacing for "IN" combination
      distance += reducedSpacing;
    } else if (currentChar === ' ') {
      // Add extra space after words
      distance += spacing * 1.15; // word-spacing: 0.15em
    } else {
      // Normal spacing for most characters
      distance += spacing;
    }

    charIndex++;
  }
}