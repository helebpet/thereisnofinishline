// Function to handle clicking on the stopwatch
function handleStopwatchClick() {
  // Calculate distance from mouse to stopwatch center (accounting for hover growth)
  // This allows clicks to be detected on the enlarged stopwatch
  let hoverRadius = stopwatchSize/2 * hoverGrowth;
  
  // Check if click is within the main stopwatch body (adjusted for hover size)
  if (dist(mouseX, mouseY, stopwatchX, stopwatchY) <= hoverRadius) {
    // Start/stop the stopwatch when the main body is clicked
    toggleStopwatch();
    return;
  }
  
  // Check if top button was clicked (reset) - adjust for hover scaling
  let topButtonX = stopwatchX;
  let topButtonY = stopwatchY - (stopwatchSize/2 + 10) * hoverGrowth;
  if (dist(mouseX, mouseY, topButtonX, topButtonY) <= 10 * hoverGrowth) {
    resetStopwatch();
    return;
  }
  
  // Check if side button was clicked (lap/split - not implemented) - adjust for hover scaling
  let sideButtonX = stopwatchX + (stopwatchSize/2 + 5) * hoverGrowth;
  let sideButtonY = stopwatchY - (stopwatchSize/6) * hoverGrowth;
  if (dist(mouseX, mouseY, sideButtonX, sideButtonY) <= 7.5 * hoverGrowth) {
    // Lap functionality could be added here
    return;
  }
}

// Toggle stopwatch between running and paused
function toggleStopwatch() {
  if (isRunning) {
    // Pause the stopwatch
    isRunning = false;
    pausedTime = elapsedTime;
  } else {
    // Start/resume the stopwatch
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
}let bgImage, bgImageMobile;
let cursorDiv;
let canvasReady = false;
let currentLine = 0;
let lineProgress = 0;

// Variables for the bouncing digital stopwatch
let stopwatchX, stopwatchY;
let stopwatchSpeedX = 2;
let stopwatchSpeedY = 1.5;
let stopwatchSize = 120; // Base size of the stopwatch
let currentStopwatchSize = 120; // Current size with hover effect
let isMobile = false;
let isHovering = false; // Track if mouse is hovering over stopwatch
let hoverGrowth = 1.0; // Current scale factor for hover effect
const MAX_HOVER_GROWTH = 1.15; // Maximum growth when hovering (15% larger)

// Variables for tracking time
let startTime;
let elapsedTime = 0;
let isRunning = false; // Track if stopwatch is running
let pausedTime = 0; // Time accumulated before pause

function preload() {
  // Load both images
  bgImage = loadImage('img/page1.jpg', imageLoaded, loadError);
  bgImageMobile = loadImage('img/page1mobile.jpg', imageLoaded, loadError);
}

// Counter for loaded images
let imagesLoaded = 0;

function imageLoaded() {
  imagesLoaded++;
  // When both images are loaded, we're ready
  if (imagesLoaded >= 2) {
    console.log("All images loaded successfully.");
    canvasReady = true;
    select('#loader').hide(); // hide loading screen
    
    // Initialize time variables but don't start automatically
    startTime = null;
    elapsedTime = 0;
  }
}

function loadError(err) {
  console.error("Image failed to load:", err);
}

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

function checkDevice() {
  // Simple check for mobile - you might want to use a more robust method
  isMobile = windowWidth <= 768; // Common breakpoint for mobile devices
}

function draw() {
  if (!canvasReady) return;
  
  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block'); // show canvas once image is ready
  }
  
  // Set background to match the cream color from image
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
    // Keep within bounds
    if (stopwatchX < padding) stopwatchX = padding;
    if (stopwatchX > width - padding) stopwatchX = width - padding;
  }
  
  if (stopwatchY < padding || stopwatchY > height - padding) {
    stopwatchSpeedY *= -1;
    // Keep within bounds
    if (stopwatchY < padding) stopwatchY = padding;
    if (stopwatchY > height - padding) stopwatchY = height - padding;
  }
  
  // Draw digital stopwatch
  drawDigitalStopwatch();
}

function drawDigitalStopwatch() {
  push();
  translate(stopwatchX, stopwatchY);
  
  // Apply hover scale effect
  scale(hoverGrowth);
  
  // Calculate button positions for click detection later
  let topButtonX = 0;
  let topButtonY = -stopwatchSize/2 - 10;
  let sideButtonX = stopwatchSize/2 + 5;
  let sideButtonY = -stopwatchSize/6;
  
  // Draw buttons first (behind the main watch face)
  // Draw stopwatch button with black outline
  stroke(0); // Black outline
  strokeWeight(1);
  fill('#EF5C26'); // Orange fill
  ellipse(topButtonX, topButtonY, 20, 20);
  
  // Draw side button with black outline
  stroke(0); // Black outline
  strokeWeight(1);
  fill('#EF5C26'); // Orange fill
  ellipse(sideButtonX, sideButtonY, 15, 15);
  
  // Draw 1px black outline for the stopwatch
  stroke(0);
  strokeWeight(1);
  fill('#04AD74');
  ellipse(0, 0, stopwatchSize + 20, stopwatchSize + 20);
  
  // Create gradient for stopwatch body - similar to original
  let from = color('#FCFCEC'); // Cream color
  let to = color('#D7DA1B');   // Lime-yellow color
  
  // Main stopwatch face with gradient (cream to lime) - like original
  noStroke();
  for (let i = stopwatchSize; i > 0; i -= 2) {
    let inter = map(i, 0, stopwatchSize, 0, 1);
    let c = lerpColor(from, to, inter);
    fill(c);
    ellipse(0, 0, i, i);
  }
  
  // Format the time
  let totalSeconds = Math.floor(elapsedTime / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let milliseconds = Math.floor((elapsedTime % 1000) / 10); // Get hundredths of seconds
  
  // Format as MM:SS:cc (cc = centiseconds)
  let timeString = nf(minutes, 2) + ":" + nf(seconds, 2) + ":" + nf(milliseconds, 2);
  
  // Draw digital display with teal background
  fill('#04AD74'); // Teal background for the digital screen
  stroke(0);
  strokeWeight(1);
  rectMode(CENTER);
  let displayWidth = stopwatchSize * 0.7;
  let displayHeight = stopwatchSize * 0.3;
  rect(0, 0, displayWidth, displayHeight, 5);
  
  // Draw time text - made bold with weight 700
  noStroke();
  fill('#FCFCEC'); // Cream color for text
  textAlign(CENTER, CENTER);
  
  // Calculate optimal font size to fit the display
  // Make font size smaller to ensure it always fits
  let fontSize = min(displayHeight * 0.6, displayWidth / timeString.length * 1.2);
  
  // Apply bold font weight (700)
  textFont('Termina', fontSize);
  textStyle(BOLD); // Apply bold style
  text(timeString, 0, 0);
  
  // Add action label text based on stopwatch state
  let labelText = "START"; // Default text when not started
  
  if (startTime !== null) {
    if (isRunning) {
      labelText = "STOP"; // Text when stopwatch is running
    } else {
      labelText = "RESUME"; // Text when stopwatch is paused
    }
  }
  
  // Draw the label text above the digital display
  fill('#04AD74'); // Teal color for text
  textStyle(BOLD);
  textFont('Termina', stopwatchSize * 0.08);
  text(labelText, 0, -stopwatchSize * 0.22);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Check device type again on resize
  checkDevice();
  
  // Reset stopwatch position on resize
  stopwatchX = width / 4;
  stopwatchY = height / 4;
}