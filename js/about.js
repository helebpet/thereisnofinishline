let bgImage;
let cursorDiv;
let canvasReady = false;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

let imagesLoaded = 0;

let currentLineIndex = 0;
let currentCharIndex = 0;
let lastTypeTime = 0;
let typeSpeed = 40; // milliseconds per character
let typewriterDone = false;

const quoteText = [
  "THERE IS\nNO FINISH LINE.",
  "THIS SLOGAN, INTRODUCED IN 1977,",
  "was one of NIKE'S EARLIEST and most INFLUENTIAL advertising campaigns.",
  "It symbolized the idea of CONTINUOUS SELF-IMPROVEMENT,",
  "emphasizing that the journey of personal growth and excellence",
  "NEVER TRULY ENDS.",
  "The campaign featured imagery of a LONE RUNNER on an EMPTY ROAD,",
  "portraying running as both a PHYSICAL and EMOTIONAL experience.",
  "It transcended sports,",
  "resonating with broader themes of PERSEVERANCE in life and business.",
  "The message:",
  "SUCCESS is not about DEFEATING OTHERS,",
  "but about CONSTANTLY CHALLENGING ONESELF.",
  "This idea became a cornerstone of NIKE'S philosophy.",
  "It reminds us that the path to greatness is endless,",
  "and the true victory lies in the journey itself."
];

function preload() {
  bgImage = loadImage('img/page5.jpg', imageLoaded, loadError);
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded >= 1) {
    canvasReady = true;
    select('#loader')?.hide();
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

  quoteX = width / 2;
  quoteY = height / 2; // Centered vertically
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
  stroke(0);
  strokeWeight(1);
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

function drawText() {
  targetX = mouseX;
  targetY = quoteY;

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  noStroke();
  fill('#FCFCEC');
  textAlign(LEFT, CENTER); // Center text horizontally
  textFont('Termina');

  let baseFontSize = min(windowWidth / 45, 22);
  let titleFontSize = baseFontSize * 3; // Bigger title
  let paragraphFontSize = baseFontSize * 0.8; // Smaller paragraph text
  
  let titleSpacing = 120; // Bigger space between title and paragraph
  let paragraphLineHeight = paragraphFontSize * 1.4; // Reduced line spacing for paragraphs

  let yOffsetDown = 40; // <<< Move everything DOWN by 40px

  let yStart = quoteY - ((quoteText.length - 1) * paragraphLineHeight) / 2 + yOffsetDown;

  for (let i = 0; i < quoteText.length; i++) {
    if (i > currentLineIndex) continue;

    let line = quoteText[i];
    let x = quoteX;
    let y;

    if (i === 0) {
      textSize(titleFontSize);
      textStyle('bold'); // Ensure bold for title
      y = yStart; // Title position

      // No rectangle behind the title
      fill('#FCFCEC');
      text(line, x, y);

    } else {
      textSize(paragraphFontSize);
      textStyle(NORMAL); // Paragraph normal boldness
      y = yStart + titleSpacing + (i - 1) * paragraphLineHeight; // Paragraph lines position

      // Draw background color only for paragraph lines
      let maxChars = i < currentLineIndex ? line.length : currentCharIndex;
      for (let j = 0; j < maxChars; j++) {
        let charWidth = textWidth(line.charAt(j));

        // Set the background color for paragraphs only
        fill('#EF5C26');
        rect(x, y - paragraphFontSize / 2, charWidth, paragraphFontSize);

        // Draw the character on top of the rectangle
        fill('#FCFCEC');
        text(line.charAt(j), x, y);

        // Update the x position for the next character
        x += charWidth;
      }
    }
  }

  // Update typewriter effect
  if (millis() - lastTypeTime > typeSpeed && !typewriterDone) {
    lastTypeTime = millis();
    currentCharIndex++;

    if (currentCharIndex > quoteText[currentLineIndex].length) {
      currentCharIndex = 0;
      currentLineIndex++;
      if (currentLineIndex >= quoteText.length) {
        typewriterDone = true;
      }
    }
  }
}



function updateCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
