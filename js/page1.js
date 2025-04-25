let bgImage;
let cursorDiv;
let canvasReady = false;

let currentLine = 0;
let lineProgress = 0;

// Variables for the bouncing time
let timeX, timeY;
let timeSpeedX = 3;
let timeSpeedY = 2;
let timeText = "";

function preload() {
  bgImage = loadImage('img/page1.jpg',
    () => {
      console.log("Image loaded successfully.");
      canvasReady = true;
      select('#loader').hide(); // hide loading screen
    },
    (err) => console.error("Image failed to load:", err)
  );
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none'); // hide canvas initially
  frameRate(60);
  noCursor();

  cursorDiv = select('.custom-cursor');

  // Initialize time position
  timeX = random(width);
  timeY = random(height);
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block'); // show canvas once image is ready
  }

  // Draw background
  let aspectRatio = bgImage.width / bgImage.height;
  let canvasRatio = width / height;
  let drawWidth, drawHeight;
  
  if (canvasRatio > aspectRatio) {
    drawWidth = width;
    drawHeight = width / aspectRatio;
  } else {
    drawHeight = height;
    drawWidth = height * aspectRatio;
  }
  
  // Bigger shift to the right on mobile
  let shiftRight = windowWidth <= 600 ? 25 : 0; // increase for more push
  let offsetX = (width - drawWidth) / 2 + shiftRight;
  let offsetY = (height - drawHeight) / 2;

  image(bgImage, offsetX, offsetY, drawWidth, drawHeight);

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

  // Update time and position with 12-hour format and AM/PM
  let currentHour = hour();
  let ampm = currentHour >= 12 ? 'PM' : 'AM';
  currentHour = currentHour > 12 ? currentHour - 12 : currentHour; // Convert to 12-hour format
  if (currentHour === 0) currentHour = 12; // Midnight is 12, not 0

  timeText = nf(currentHour, 2) + ":" + nf(minute(), 2) + ":" + nf(second(), 2) + " " + ampm;

  // Move the time display
  timeX += timeSpeedX;
  timeY += timeSpeedY;

  // Bounce off edges
  if (timeX <= 0 || timeX >= width - textWidth(timeText)) {
    timeSpeedX *= -1;
  }
  if (timeY <= 0 || timeY >= height - 20) {
    timeSpeedY *= -1;
  }

  // Display the time
  fill(255); // white text
  textSize(32);
  text(timeText, timeX, timeY);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
