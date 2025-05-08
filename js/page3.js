let bgImage;
let nikeLogoImage;
let cursorDiv;
let canvasReady = false;
let quoteX, quoteY;
let targetX, targetY;
let easing = 0.05;

let nikeX, nikeY;
let nikeTargetY;
let nikeSize;

const quoteText = [
  "Some call it EUPHORIA,",
  "Others say it's a new kind of",
  "MYSTICAL EXPERIENCE",
  "that propels you into an elevated",
  "state of consciousness."
];

let imagesLoaded = 0;
const totalImages = 2;

function preload() {
  bgImage = loadImage('./img/page3.jpg', 
    () => { imageLoaded('background'); }, 
    () => { loadError('background'); }
  );
  
  loadNikeLogo();
}

function loadNikeLogo() {
  const pathsToTry = [
    './img/nikelogogreen.png',
    '/img/nikelogogreen.png',
    'img/nikelogogreen.png'
  ];
  
  tryNextPath(0);
  
  function tryNextPath(index) {
    if (index >= pathsToTry.length) {
      window.nikeLogoFailed = true;
      imagesLoaded++;
      return;
    }
    
    const path = pathsToTry[index];
    
    try {
      loadImage(
        path,
        (img) => {
          nikeLogoImage = img;
          imageLoaded('nike logo');
        },
        () => {
          tryNextPath(index + 1);
        }
      );
    } catch (e) {
      tryNextPath(index + 1);
    }
  }
}

function imageLoaded(imageName) {
  imagesLoaded++;
  if (imagesLoaded >= totalImages) {
    canvasReady = true;
    select('#loader').hide();
  }
}

function loadError(imageName) {
  imagesLoaded++;
  if (imagesLoaded >= totalImages) {
    canvasReady = true;
    select('#loader').hide();
  }
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none');
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');

  quoteX = width / 2;
  quoteY = height / 2;

  nikeX = width / 2;
  nikeY = height / 2;
  nikeTargetY = nikeY;

  updateNikeSize();
  createAndStyleTextElements();
}

function createAndStyleTextElements() {
  let textContainer = createDiv('');
  textContainer.id('text-container');
  textContainer.position(0, 0);
  textContainer.style('width', '100%');
  textContainer.style('height', '100%');
  textContainer.style('position', 'absolute');
  textContainer.style('display', 'flex');
  textContainer.style('justify-content', 'center');
  textContainer.style('align-items', 'center');
  textContainer.style('pointer-events', 'none');
  textContainer.style('transition', 'transform 0.8s ease');
  
  let quoteDiv = createDiv('');
  quoteDiv.class('quote-text');
  quoteDiv.parent(textContainer);
  
  quoteDiv.style('font-weight', '600');
  quoteDiv.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
  quoteDiv.style('line-height', '1.6');
  quoteDiv.style('letter-spacing', '-0.11em');
  quoteDiv.style('word-spacing', '0.15em');
  quoteDiv.style('color', '#FCFCEC');
  quoteDiv.style('font-family', 'Termina, sans-serif');
  quoteDiv.style('text-align', 'center');
  quoteDiv.style('transition', 'transform 0.8s ease, opacity 0.8s ease');
  quoteDiv.style('transform', 'translateX(0)');
  quoteDiv.style('opacity', '1');
  
  let textContent = '';
  quoteText.forEach((line) => {
    textContent += line + '<br>';
  });
  quoteDiv.html(textContent);
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  clear();
  
  drawBackground();
  drawGradientLines();
  updateNikeLogo();
  drawNikeLogo();
  updateDOMText();
  updateCursor();
}

function drawBackground() {
  if (!bgImage) return;
  
  background(0);
  
  push();
  imageMode(CENTER);
  
  let scaleX = width / bgImage.width;
  let scaleY = height / bgImage.height;
  let scale = max(scaleX, scaleY);
  
  let newWidth = bgImage.width * scale;
  let newHeight = bgImage.height * scale;
  
  image(bgImage, width/2, height/2, newWidth, newHeight);
  pop();
}

function drawGradientLines() {
  stroke(0);
  strokeWeight(1);
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

function updateNikeLogo() {
  let centerThreshold = width * 0.3;
  
  let logoAspectRatio = nikeLogoImage ? (nikeLogoImage.width / nikeLogoImage.height) : 1;
  let logoHeight = (nikeSize * 2) / logoAspectRatio;
  
  if (mouseX > width / 2 + centerThreshold) {
    nikeTargetY = -logoHeight/2;
  } else if (mouseX < width / 2 - centerThreshold) {
    nikeTargetY = height + logoHeight/2;
  } else {
    nikeTargetY = height / 2;
  }
  
  nikeY += (nikeTargetY - nikeY) * easing;
}

function drawNikeLogo() {
  if (!nikeLogoImage) {
    if (window.nikeLogoFailed) {
      push();
      fill(255, 165, 0);
      noStroke();
      ellipse(nikeX, nikeY, nikeSize, nikeSize/2);
      textAlign(CENTER, CENTER);
      fill(0);
      textSize(16);
      text("NIKE", nikeX, nikeY);
      pop();
    }
    return;
  }
  
  imageMode(CENTER);
  
  let logoAspectRatio = nikeLogoImage.width / nikeLogoImage.height;
  let logoWidth = nikeSize * 2;
  let logoHeight = logoWidth / logoAspectRatio;
  
  image(nikeLogoImage, nikeX, nikeY, logoWidth, logoHeight);
}

function updateDOMText() {
  targetX = mouseX;
  targetY = mouseY;

  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  let centerThreshold = width * 0.3;
  let container = select('#text-container');
  let quoteDiv = select('.quote-text');
  
  if (!container || !quoteDiv) return;
  
  let distanceFromCenterX = abs(mouseX - width/2) / (width/2);
  let distanceFromCenterY = abs(mouseY - height/2) / (height/2);
  let distanceFromCenter = constrain(max(distanceFromCenterX, distanceFromCenterY), 0, 1);
  
  if (distanceFromCenter < 0.3) {
    container.style('transform', 'translate(0, 0)');
  } else {
    let offsetX = map(quoteX, 0, width, -width/4, width/4);
    let offsetY = map(quoteY, 0, height, -height/4, height/4);
    container.style('transform', `translate(${offsetX}px, ${offsetY}px)`);
  }
  
  if (mouseX > width / 2 + centerThreshold) {
    quoteDiv.style('transform', 'translateX(-10%)');
  } else if (mouseX < width / 2 - centerThreshold) {
    quoteDiv.style('transform', 'translateX(10%)');
  } else {
    quoteDiv.style('transform', 'translateX(0)');
  }
}

function updateCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  nikeX = width / 2;
  nikeY = height / 2;
  updateNikeSize();
}

function updateNikeSize() {
  nikeSize = width * 0.3;
}