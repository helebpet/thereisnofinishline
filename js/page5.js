let bgImage;
let cursorDiv;
let canvasReady = false;
let timeX, timeY;
let timeSpeedX = 2;
let timeSpeedY = 1.5;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

const quoteText = [
  "The  EXPERIENCE  is  UNIQUE",
  "to  each  of  us,",
  "but  when  it  HAPPENS",
  "you  BREAK  THROUGH  a  BARRIER",
  "that  SEPARATES  you",
  "from  CASUAL  RUNNERS."
];

let imagesLoaded = 0;

// Typewriter animation variables
let typewriterText = "FOREVER.";
let typedLength = 0;
let lastTypeTime = 0;
let typeSpeed = 200; // milliseconds between each character
let typewriterStarted = false;
let typewriterDelay = 4000; // 4 seconds
let typewriterStartTime;

function preload() {
  bgImage = loadImage('img/page5.jpg', imageLoaded, loadError);
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded >= 1) {
    console.log("Image loaded successfully.");
    canvasReady = true;
    select('#loader').hide();
    typewriterStartTime = millis() + typewriterDelay;
  }
}

function loadError(err) {
  console.error("Image failed to load:", err);
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none');
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');

  timeX = width / 4;
  timeY = height / 4;

  quoteX = width / 2;
  quoteY = height / 2;
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  drawBackground();
  drawGradientLines();
  drawText();
  updateCursor();
}

function drawBackground() {
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

  let offsetX = (width - drawWidth) / 2;
  let offsetY = (height - drawHeight) / 2;

  image(bgImage, offsetX, offsetY, drawWidth, drawHeight);
}

function drawGradientLines() {
  // Set the line color to black
  stroke(0); // Black color
  strokeWeight(1);

  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

function drawText() {
  targetX = mouseX;

  // Adjusted Y positioning to move the text a bit lower
  if (windowWidth <= 768) {
    targetY = height / 2; // Move it to the middle of the screen on smaller screens
  } else {
    targetY = height / 1.8; // Slightly lower on larger screens
  }

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  noStroke();
  fill('#FCFCEC');
  textAlign(LEFT, CENTER);
  textFont('Termina');
  textSize(windowWidth / 30);
  textStyle(BOLD);

  let fontSize = windowWidth / 30;
  let lineHeight = windowWidth / 20;
  let letterSpacing = -0.11 * fontSize;

  for (let i = 0; i < quoteText.length; i++) {
    let line = quoteText[i];
    let direction = i % 2 === 0 ? 1 : -1;
    let offsetX = direction * sin(frameCount * 0.02 + i) * 20;

    let x = quoteX + offsetX;
    let y = quoteY + (i - quoteText.length / 2) * lineHeight;

    let charX = x;
    for (let c = 0; c < line.length; c++) {
      text(line[c], charX, y);
      charX += textWidth(line[c]) + letterSpacing;
    }
  }

  // Start typewriter effect after delay
  if (millis() > typewriterStartTime) {
    drawTypewriterEffect(quoteY + (quoteText.length / 2) * lineHeight, fontSize, letterSpacing);
  }
}

function drawTypewriterEffect(yPosition, fontSize, letterSpacing) {
  if (!typewriterStarted) {
    typewriterStarted = true;
    lastTypeTime = millis();
  }

  let currentTime = millis();
  if (currentTime - lastTypeTime > typeSpeed && typedLength < typewriterText.length) {
    typedLength++;
    lastTypeTime = currentTime;
  }

  let displayText = typewriterText.substring(0, typedLength);

  fill('#FCFCEC');
  noStroke();
  textAlign(LEFT, CENTER);
  textFont('Termina');
  textSize(fontSize);
  textStyle(BOLD);

  let charX = quoteX;
  for (let c = 0; c < displayText.length; c++) {
    text(displayText[c], charX, yPosition);
    charX += textWidth(displayText[c]) + letterSpacing;
  }
}

function updateCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  timeX = width / 4;
  timeY = height / 4;
}
