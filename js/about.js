let bgImage, bgImageMobile;
let cursorDiv;
let canvasReady = false;
let currentLine = 0;
let lineProgress = 0;
// Variables for the bouncing time
let timeX, timeY;
let timeSpeedX = 2;
let timeSpeedY = 1.5;
let timeText = "";
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
  
  // Initialize time position
  timeX = width / 4;
  timeY = height / 4;
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
  
  // Draw background first
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
  
  // Update time text with 12-hour format and AM/PM
  let currentHour = hour();
  let ampm = currentHour >= 12 ? 'PM' : 'AM';
  currentHour = currentHour > 12 ? currentHour - 12 : currentHour;
  if (currentHour === 0) currentHour = 12;
  timeText = nf(currentHour, 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2) + " " + ampm;
  
  // Move the time display
  timeX += timeSpeedX;
  timeY += timeSpeedY;
  
  // Simple boundary checking
  let padding = 20;
  let textW = textWidth(timeText);
  
  // Bounce off edges
  if (timeX < padding || timeX > width - textW - padding) {
    timeSpeedX *= -1;
    // Keep within bounds
    if (timeX < padding) timeX = padding;
    if (timeX > width - textW - padding) timeX = width - textW - padding;
  }
  
  if (timeY < padding || timeY > height - 32 - padding) {
    timeSpeedY *= -1;
    // Keep within bounds
    if (timeY < padding) timeY = padding;
    if (timeY > height - 32 - padding) timeY = height - 32 - padding;
  }
  
  // Display the time
  // Shadow for better contrast
  fill(0, 150);
  textSize(32);
  text(timeText, timeX + 2, timeY + 2);
  
  // Main time text
  fill(255);
  textSize(32);
  text(timeText, timeX, timeY);

  // === Add the "There is no finish line" text here ===
  // Color change based on mouse position
  let red = map(mouseX, 0, width, 0, 255);
  let green = map(mouseY, 0, height, 0, 255);
  let blue = map(mouseX + mouseY, 0, width + height, 0, 255);

  // Main Title Text
  textFont('Termina');  // Use 'Termina' font
  textSize(windowWidth / 30);  // Dynamically set text size based on window width
  textStyle(BOLD);  // Apply bold style
  fill(red, green, blue); // Color based on mouse position
  textAlign(CENTER, CENTER);
  text('THERE IS NO FINISH LINE.', width / 2, height / 4);

  // Body Text
  textSize(windowWidth / 40);  // Adjust size for body text
  fill(red, green, blue); // Color based on mouse position
  textAlign(CENTER, CENTER);
  text(`
    THIS SLOGAN, INTRODUCED IN 1977, was one of NIKE'S EARLIEST and most INFLUENTIAL advertising campaigns.\n
    It symbolized the idea of CONTINUOUS SELF-IMPROVEMENT, emphasizing that the journey of personal growth and excellence NEVER TRULY ENDS.\n\n
    The campaign featured imagery of a LONE RUNNER on an EMPTY ROAD, portraying running as both a PHYSICAL and EMOTIONAL experience.\n\n
    It transcended sports, resonating with broader themes of PERSEVERANCE in life and business.\n\n
    The message: SUCCESS is not about DEFEATING OTHERS but about CONSTANTLY CHALLENGING ONESELF.
  `, width / 2, height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Check device type again on resize
  checkDevice();
  
  // Reset time position on resize
  timeX = width / 4;
  timeY = height / 4;
}
