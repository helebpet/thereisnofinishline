// This sketch was organized and partially developed with the help of ChatGPT
// Constants
const MAX_HOVER_GROWTH = 1.15; // Maximum growth when hovering (15% larger)

// Variables for the bouncing digital stopwatch
let stopwatchX, stopwatchY;
let stopwatchSpeedX = 2;
let stopwatchSpeedY = 1.5;
let stopwatchSize = 120; // Base size of the stopwatch
let currentStopwatchSize = 120; // Current size with hover effect
let isMobile = false;
let isHovering = false; // Track if mouse is hovering over stopwatch
let hoverGrowth = 1.0; // Current scale factor for hover effect

// Variables for tracking time
let startTime;
let elapsedTime = 0;
let isRunning = false; // Track if stopwatch is running
let pausedTime = 0; // Time accumulated before pause

// Image and Canvas Setup
let bgImage, bgImageMobile;
let cursorDiv;
let canvasReady = false;
let currentLine = 0;
let lineProgress = 0;

// Stopwatch click and state
let imagesLoaded = 0;

// Function to preload images
function preload() {
  bgImage = loadImage('img/page1.jpg', imageLoaded, loadError);
  bgImage.alt = "Orange-yellow gradient background showing silhouettes of runners in motion";
  
  bgImageMobile = loadImage('img/page1mobile.jpg', imageLoaded, loadError);
  bgImageMobile.alt = "Mobile version of orange-yellow gradient background with runner silhouettes";
}

// Counter for loaded images
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded >= 2) {
    canvasReady = true;
    select('#loader').hide(); // hide loading screen
    startTime = null;
    elapsedTime = 0;
  }
}

function loadError(err) {
  console.error("Image failed to load:", err);
}

// Device check
function checkDevice() {
  isMobile = windowWidth <= 768; // Simple check for mobile - common breakpoint
}

// Function to initialize the canvas and event listeners
function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none'); // hide canvas initially
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');
  
  // Set the background color to match the cream color from the image
  document.body.style.backgroundColor = '#FCFCEC';
  
  // Check if device is mobile
  checkDevice();
  
  // Initialize stopwatch position
  stopwatchX = width / 4;
  stopwatchY = height / 4;
  
  // Add mouse pressed event for stopwatch control
  cnv.mousePressed(handleStopwatchClick);
}

// Function to handle clicking on the stopwatch
function handleStopwatchClick() {
  let hoverRadius = stopwatchSize / 2 * hoverGrowth;
  
  // Check if click is within the main stopwatch body (adjusted for hover size)
  if (dist(mouseX, mouseY, stopwatchX, stopwatchY) <= hoverRadius) {
    toggleStopwatch();
    return;
  }
  
  // Check if top button was clicked (reset) - adjust for hover scaling
  let topButtonX = stopwatchX;
  let topButtonY = stopwatchY - (stopwatchSize / 2 + 10) * hoverGrowth;
  if (dist(mouseX, mouseY, topButtonX, topButtonY) <= 10 * hoverGrowth) {
    resetStopwatch();
    return;
  }
  
  // Check if side button was clicked (lap/split - not implemented) - adjust for hover scaling
  let sideButtonX = stopwatchX + (stopwatchSize / 2 + 5) * hoverGrowth;
  let sideButtonY = stopwatchY - (stopwatchSize / 6) * hoverGrowth;
  if (dist(mouseX, mouseY, sideButtonX, sideButtonY) <= 7.5 * hoverGrowth) {
    // Lap functionality could be added here
    return;
  }
}

// Toggle stopwatch between running and paused
function toggleStopwatch() {
  if (isRunning) {
    isRunning = false;
    pausedTime = elapsedTime;
  } else {
    isRunning = true;
    startTime = millis();
  }
}

// Reset the stopwatch
function resetStopwatch() {
  isRunning = false;
  elapsedTime = 0;
  pausedTime = 0;
  startTime = null;
}

// Main draw loop
function draw() {
  if (!canvasReady) return;
  
  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block'); // show canvas once image is ready
  }
  
  // Set background color
  background('#FCFCEC');
  
  // Choose the appropriate background image based on device
  let currentBg = isMobile ? bgImageMobile : bgImage;
  
  // Draw background
  let aspectRatio = currentBg.width / currentBg.height;
  let canvasRatio = width / height;
  let drawWidth, drawHeight;
  
  if (canvasRatio > aspectRatio) {
    drawWidth = width;
    drawHeight = width / aspectRatio;
  } else {
    drawHeight = height;
    drawWidth = height * aspectRatio;
  }
  
  // No shift for background - centered
  let offsetX = (width - drawWidth) / 2;
  let offsetY = (height - drawHeight) / 2;
  
  image(currentBg, offsetX, offsetY, drawWidth, drawHeight);
  
  // Draw animated black lines
  stroke(0);
  strokeWeight(1);
  for (let y = 0; y < currentLine * 10; y += 10) {
    line(0, y, width, y);
  }
  
  let y = currentLine * 10;
  if (y < height) {
    line(0, y, lineProgress, y);
    lineProgress += 10;
    if (lineProgress >= width) {
      currentLine++;
      lineProgress = 0;
    }
  }
  
  // Move custom cursor
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
  
  // Update elapsed time
  if (isRunning && startTime) {
    elapsedTime = pausedTime + (millis() - startTime);
  }
  
  // Check if mouse is hovering over stopwatch
  let mouseDistToStopwatch = dist(mouseX, mouseY, stopwatchX, stopwatchY);
  isHovering = mouseDistToStopwatch < stopwatchSize / 2 * hoverGrowth;
  
  // Update hover growth animation
  if (isHovering && hoverGrowth < MAX_HOVER_GROWTH) {
    hoverGrowth += 0.01; // Gradually grow
  } else if (!isHovering && hoverGrowth > 1.0) {
    hoverGrowth -= 0.01; // Gradually shrink back
  }
  
  // Calculate current size with hover effect
  currentStopwatchSize = stopwatchSize * hoverGrowth;
  
  // Move the stopwatch display
  stopwatchX += stopwatchSpeedX;
  stopwatchY += stopwatchSpeedY;
  
  // Simple boundary checking for stopwatch
  let padding = currentStopwatchSize / 2 + 10; // Add padding based on current stopwatch size
  
  // Bounce off edges
  if (stopwatchX < padding || stopwatchX > width - padding) {
    stopwatchSpeedX *= -1;
    if (stopwatchX < padding) stopwatchX = padding;
    if (stopwatchX > width - padding) stopwatchX = width - padding;
  }
  
  if (stopwatchY < padding || stopwatchY > height - padding) {
    stopwatchSpeedY *= -1;
    if (stopwatchY < padding) stopwatchY = padding;
    if (stopwatchY > height - padding) stopwatchY = height - padding;
  }
  
  // Draw digital stopwatch
  drawDigitalStopwatch();
}

// Draw the digital stopwatch
function drawDigitalStopwatch() {
  push();
  translate(stopwatchX, stopwatchY);
  
  // Apply hover scale effect
  scale(hoverGrowth);
  
  // Draw buttons first (behind the main watch face)
  drawStopwatchButtons();
  
  // Draw the main stopwatch body
  drawStopwatchBody();
  
  // Draw the time display
  drawTimeDisplay();
  
  pop();
}

// Draw the stopwatch body with gradient
function drawStopwatchBody() {
  stroke(0);
  strokeWeight(1);
  fill('#04AD74');
  ellipse(0, 0, stopwatchSize + 20, stopwatchSize + 20);
  
  let from = color('#FCFCEC');
  let to = color('#D7DA1B');
  
  noStroke();
  for (let i = stopwatchSize; i > 0; i -= 2) {
    let inter = map(i, 0, stopwatchSize, 0, 1);
    let c = lerpColor(from, to, inter);
    fill(c);
    ellipse(0, 0, i, i);
  }
}

// Draw the stopwatch buttons (reset and side)
function drawStopwatchButtons() {
  let topButtonX = 0;
  let topButtonY = -stopwatchSize / 2 - 10;
  let sideButtonX = stopwatchSize / 2 + 5;
  let sideButtonY = -stopwatchSize / 6;
  
  stroke(0);
  strokeWeight(1);
  fill('#EF5C26');
  ellipse(topButtonX, topButtonY, 20, 20); // Reset button
  ellipse(sideButtonX, sideButtonY, 15, 15); // Side button
}

// Draw the time display
function drawTimeDisplay() {
  let totalSeconds = Math.floor(elapsedTime / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let milliseconds = Math.floor((elapsedTime % 1000) / 10);
  
  let timeString = nf(minutes, 2) + ":" + nf(seconds, 2) + ":" + nf(milliseconds, 2);
  
  // Draw digital display with teal background
  fill('#04AD74');
  stroke(0);
  strokeWeight(1);
  rectMode(CENTER);
  let displayWidth = stopwatchSize * 0.7;
  let displayHeight = stopwatchSize * 0.3;
  rect(0, 0, displayWidth, displayHeight, 5);
  
  // Draw time text
  noStroke();
  fill('#FCFCEC');
  textAlign(CENTER, CENTER);
  let fontSize = min(displayHeight * 0.6, displayWidth / timeString.length * 1.2);
  textFont('Termina', fontSize);
  textStyle(BOLD);
  text(timeString, 0, 0);
  
  // Draw the label text (START, STOP, RESUME)
  let labelText = "START";
  if (startTime !== null) {
    labelText = isRunning ? "STOP" : "RESUME";
  }
  
  fill('#04AD74');
  textStyle(BOLD);
  textFont('Termina', stopwatchSize * 0.08);
  text(labelText, 0, -stopwatchSize * 0.22);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  checkDevice();
  stopwatchX = width / 4;
  stopwatchY = height / 4;
}
