let bgImage, bgImageMobile;
let cursorDiv;
let canvasReady = false;
let currentLine = 0;
let lineProgress = 0;

// Variables for the bouncing stopwatch
let stopwatchX, stopwatchY;
let stopwatchSpeedX = 2;
let stopwatchSpeedY = 1.5;
let stopwatchSize = 120; // Size of the stopwatch
let isMobile = false;

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
  
  // Check if device is mobile
  checkDevice();
  
  // Initialize stopwatch position
  stopwatchX = width / 4;
  stopwatchY = height / 4;
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
  
  // Move the stopwatch display
  stopwatchX += stopwatchSpeedX;
  stopwatchY += stopwatchSpeedY;
  
  // Simple boundary checking for stopwatch
  let padding = stopwatchSize / 2 + 10; // Add padding based on stopwatch size
  
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
  
  // Draw stopwatch
  drawStopwatch();
}

function drawStopwatch() {
  push();
  translate(stopwatchX, stopwatchY);
  
  // Draw stopwatch face
  fill(0);
  noStroke();
  ellipse(0, 0, stopwatchSize + 20, stopwatchSize + 20); // Outer black circle
  
  // Draw stopwatch button
  ellipse(0, -stopwatchSize/2 - 10, 20, 20);
  
  // Draw side button
  ellipse(stopwatchSize/2 + 5, -stopwatchSize/6, 15, 15);
  
  // Draw white face
  fill(255);
  ellipse(0, 0, stopwatchSize, stopwatchSize);
  
  // Draw tick marks
  stroke(0);
  strokeWeight(1);
  for (let i = 0; i < 60; i++) {
    let angle = map(i, 0, 60, 0, TWO_PI) - HALF_PI;
    let tickLength = i % 5 === 0 ? 10 : 5; // Longer ticks for every 5 seconds
    
    let x1 = (stopwatchSize/2 - 5) * cos(angle);
    let y1 = (stopwatchSize/2 - 5) * sin(angle);
    let x2 = (stopwatchSize/2 - tickLength - 5) * cos(angle);
    let y2 = (stopwatchSize/2 - tickLength - 5) * sin(angle);
    
    line(x1, y1, x2, y2);
    
    // Add numbers for the main 5-second intervals
    if (i % 5 === 0) {
      push();
      noStroke();
      fill(0);
      textSize(12);
      textAlign(CENTER, CENTER);
      textFont('Courier New, monospace'); // Terminal-style font
      
      // Position for the numbers (slightly inward from the tick marks)
      let textX = (stopwatchSize/2 - 24) * cos(angle);
      let textY = (stopwatchSize/2 - 24) * sin(angle);
      
      // Draw the second number
      text(i, textX, textY);
      pop();
    }
  }
  
  // Get current seconds and milliseconds for ultra-smooth hand movement
  // Use frameCount for continuous smooth movement without ticking
  let currentTime = millis() / 1000; // Get current time in seconds (including fractions)
  let smoothSeconds = currentTime % 60; // Get just the seconds part (0-60)
  
  // Calculate angle for seconds hand
  let secondsAngle = map(smoothSeconds, 0, 60, 0, TWO_PI) - HALF_PI;
  
  // Draw seconds hand
  stroke(0);
  strokeWeight(2);
  let handLength = stopwatchSize/2 - 15;
  line(0, 0, handLength * cos(secondsAngle), handLength * sin(secondsAngle));
  
  // Draw center pin
  fill(0);
  noStroke();
  ellipse(0, 0, 8, 8);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Check device type again on resize
  checkDevice();
  
  // Reset stopwatch position on resize to center
  stopwatchX = width / 2;
  stopwatchY = height / 2;
}