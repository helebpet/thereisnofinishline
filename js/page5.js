// This sketch was organized and partially developed with the help of ChatGPT
// ===== GLOBAL VARIABLES =====

// Asset variables
let bgImage;               // Background image
let nikeLogoImage;         // Nike logo image
let cursorDiv;             // Custom cursor element
let canvasReady = false;   // Flag to check if canvas is ready to display

// Movement variables
let timeX, timeY;          // Time variables for animation
let timeSpeedX = 2;        // Speed of horizontal time movement
let timeSpeedY = 1.5;      // Speed of vertical time movement
let quoteX, quoteY;        // Position of quote container
let targetX, targetY;      // Target position for smooth movement
let easing = 0.05;         // Easing factor for smooth movement

// Text display variables
let quoteContainer;        // Container for all text elements
let quoteElements = [];    // Array to store quote paragraph elements
let typewriterElement;     // Element for typewriter effect text
let currentSentenceIndex = 0;  // Index of current sentence being displayed
let sentenceStartTime;     // Timestamp when current sentence started displaying
let sentenceDisplayDuration = 4000;  // How long each sentence displays (ms)
let transitionDuration = 1200;       // Duration of fade transitions (ms)
let lineOffsetY = 0;       // Offset for moving scan lines
let lineSpeed = 0.05;      // Speed of scan lines movement

// Nike logo animation properties
let nikeLogoVisible = false;         // Flag for logo visibility
let nikeLogoX = -200;                // Logo X position (starts offscreen)
let nikeLogoY = 0;                   // Logo Y position
let nikeLogoSize = 150;              // Base size of the logo
let nikeLogoSpeed = 5;               // Logo movement speed
let nikeLogoRotation = 0;            // Logo rotation angle
let nikeLogoRotationSpeed = 0.02;    // Logo rotation speed
let logoAnimationActive = false;     // Flag for active logo animation
let logoFadeOpacity = 0;             // Opacity for logo fading effect
let fadeOutSpeed = 0.02;             // Speed of logo fade out
let fadeInSpeed = 0.05;              // Speed of logo fade in

// Text content
const quoteText = [
  "The  EXPERIENCE  is  UNIQUE",
  "to  each  of  us,",
  "but  when  it  HAPPENS",
  "you  BREAK  THROUGH  a  BARRIER",
  "that  SEPARATES  you",
  "from  CASUAL  RUNNERS."
];

// Asset loading tracking
let imagesLoaded = 0;
let totalImages = 2;       // Total number of images to load

// Typewriter effect variables
let typewriterText = "FOREVER.";
let typedLength = 0;
let lastTypeTime = 0;
let typeSpeed = 200;       // Milliseconds between character typing
let typewriterStarted = false;
let typewriterDelay = 4000;
let typewriterStartTime;


// ===== ASSET LOADING =====

/**
 * Preload assets before setup
 */
function preload() {
  // Load background image
  bgImage = loadImage('img/page5.jpg', () => imageLoaded('background'), loadError);
  bgImage.alt = "Runners in a race wearing competition bibs, showing the intensity of competitive running";
  
  // Load Nike logo
  loadNikeLogo();
}

/**
 * Attempts to load the Nike logo from multiple possible paths
 */
function loadNikeLogo() {
  const pathsToTry = [
    './img/nikelogogreen.png',
    '/img/nikelogogreen.png',
    'img/nikelogogreen.png'
  ];
  
  tryNextPath(0);
  
  // Recursively try loading from different paths
  function tryNextPath(index) {
    if (index >= pathsToTry.length) {
      console.error("Failed to load Nike logo from all paths");
      imagesLoaded++; // Still increment to avoid blocking
      return;
    }
    
    const path = pathsToTry[index];
    
    try {
      loadImage(
        path,
        (img) => {
          nikeLogoImage = img;
          nikeLogoImage.alt = "Nike swoosh logo in green color";
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

/**
 * Callback when an image is successfully loaded
 * @param {string} name - Name of the loaded image for logging
 */
function imageLoaded(name) {
  imagesLoaded++;
  if (imagesLoaded >= totalImages) {
    canvasReady = true;
    select('#loader').hide();
    createTextElements();
    sentenceStartTime = millis();
  }
}

/**
 * Callback when an image fails to load
 * @param {Error} err - Error that occurred during loading
 */
function loadError(err) {
  console.error("Image failed to load:", err);
  imagesLoaded++; // Still increment to avoid blocking
}


// ===== UI CREATION =====

/**
 * Creates and styles all text elements used in the animation
 */
function createTextElements() {
  // Create main container for all text
  quoteContainer = createDiv();
  quoteContainer.class('quote-container');
  quoteContainer.position(0, 0);
  quoteContainer.style('position', 'absolute');
  quoteContainer.style('width', '100%');
  quoteContainer.style('height', '100%');
  quoteContainer.style('pointer-events', 'none');
  quoteContainer.style('display', 'flex');
  quoteContainer.style('flex-direction', 'column');
  quoteContainer.style('align-items', 'center');
  quoteContainer.style('justify-content', 'center');
  quoteContainer.style('overflow', 'visible');
  // Add role and aria attributes for accessibility
  quoteContainer.attribute('role', 'region');
  quoteContainer.attribute('aria-label', 'Motivational running quotes');

  // Create elements for each quote line
  for (let i = 0; i < quoteText.length; i++) {
    let textP = createP(quoteText[i]);
    textP.parent(quoteContainer);
    textP.class('quote-line');

    // Style quote lines
    textP.style('font-weight', '600');
    textP.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
    textP.style('line-height', '1.6');
    textP.style('letter-spacing', '-0.11em');
    textP.style('word-spacing', '0.15em');
    textP.style('color', '#FCFCEC');
    textP.style('font-family', 'Termina, sans-serif');
    textP.style('margin', '0');
    textP.style('padding', '0');
    textP.style('transform-origin', 'center');
    textP.style('opacity', '0');
    textP.style('transition', 'opacity 0.8s ease-in-out');
    textP.style('position', 'absolute');
    textP.style('text-align', 'center');

    quoteElements.push(textP);
  }

  // Create and style the final typewriter text element
  typewriterElement = createP('');
  typewriterElement.parent(quoteContainer);
  typewriterElement.class('typewriter-text');

  // Style typewriter text with gradient effect
  typewriterElement.style('font-weight', '900');
  typewriterElement.style('font-size', 'clamp(4rem, 8vw, 6rem)'); 
  typewriterElement.style('line-height', '1.2'); 
  typewriterElement.style('letter-spacing', '-0.05em');
  typewriterElement.style('word-spacing', '0.15em');
  typewriterElement.style('padding', '0.2em 0.4em');
  typewriterElement.style('font-family', 'Termina, sans-serif');
  typewriterElement.style('margin', '0');
  typewriterElement.style('opacity', '0');
  typewriterElement.style('position', 'absolute');
  typewriterElement.style('text-align', 'center');
  typewriterElement.style('transition', 'opacity 1s ease-in-out');
  typewriterElement.style('background', 'linear-gradient(90deg, #D7DA1B 0%, #04AD74 100%)');
  typewriterElement.style('background-clip', 'text');
  typewriterElement.style('-webkit-background-clip', 'text');
  typewriterElement.style('color', 'transparent');
  typewriterElement.style('overflow', 'visible');
}


// ===== P5.JS CORE FUNCTIONS =====

/**
 * p5.js setup function - runs once at the beginning
 */
function setup() {
  // Create canvas and hide it initially
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none');
  // Add accessibility attributes to canvas
  cnv.attribute('aria-label', 'Nike motivational running animation');
  cnv.attribute('role', 'img');
  
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');

  // Initialize position variables
  timeX = width / 4;
  timeY = height / 4;
  quoteX = width / 2;
  quoteY = height / 2;
  
  // Center Nike logo vertically
  nikeLogoY = height / 2;
}

/**
 * p5.js draw function - loops continuously
 */
function draw() {
  // Skip drawing if canvas is not ready
  if (!canvasReady) return;

  // Show canvas once ready
  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  // Draw elements in order
  drawBackground();
  drawMovingLines();
  updateTextPositions();
  updateSentenceDisplay();
  
  // Handle Nike logo animation
  if (logoAnimationActive || logoFadeOpacity > 0) {
    updateNikeLogoAnimation();
    drawNikeLogo();
  }
  
  // Update custom cursor position
  updateCursor();
}


// ===== DRAWING FUNCTIONS =====

/**
 * Draws the background image with responsive sizing
 */
function drawBackground() {
  // Calculate proportional dimensions to fill canvas while maintaining aspect ratio
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

  // Center the image on canvas
  let offsetX = (width - drawWidth) / 2;
  let offsetY = (height - drawHeight) / 2;

  image(bgImage, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Creates animated horizontal scan lines across the screen
 */
function drawMovingLines() {
  // Update line position for animation effect
  lineOffsetY += lineSpeed;
  if (lineOffsetY >= 10) lineOffsetY = 0;
  
  stroke(0);
  strokeWeight(1);

  // Draw lines at regular intervals
  for (let y = -lineOffsetY; y < height; y += 10) {
    line(0, y, width, y);
  }
}

/**
 * Updates text container position with smooth mouse following
 */
function updateTextPositions() {
  if (!quoteElements.length) return;

  // Set target position to mouse X, centered vertically
  targetX = mouseX;
  targetY = height / 2;

  // Apply easing for smooth movement
  quoteX += (targetX - quoteX) * easing;
  quoteY += (targetY - quoteY) * easing;

  // Position quote container
  quoteContainer.style('transform', `translate(${quoteX - windowWidth/2}px, ${quoteY - windowHeight/2}px)`);
}

/**
 * Manages the display sequence of text sentences and typewriter effect
 */
function updateSentenceDisplay() {
  let currentTime = millis();
  let elapsedTime = currentTime - sentenceStartTime;

  // Handle quote sentences display
  if (currentSentenceIndex < quoteText.length) {
    let fadeInComplete = elapsedTime > transitionDuration;
    let fadeOutStart = sentenceDisplayDuration - transitionDuration;
    let shouldFadeOut = elapsedTime > fadeOutStart;

    // Control fade in/out of current sentence
    if (!fadeInComplete) {
      quoteElements[currentSentenceIndex].style('opacity', '1');
    } else if (shouldFadeOut) {
      quoteElements[currentSentenceIndex].style('opacity', '0');
    }

    // Ensure other sentences are hidden
    for (let i = 0; i < quoteElements.length; i++) {
      if (i !== currentSentenceIndex) {
        quoteElements[i].style('opacity', '0');
      }
    }
    
    // Activate Nike logo animation specifically during the 4th sentence
    if (currentSentenceIndex === 3 && !logoAnimationActive) {
      logoAnimationActive = true;
      nikeLogoX = -nikeLogoSize; // Start just offscreen
      logoFadeOpacity = 0; // Start with zero opacity
    }
    
    // Deactivate Nike logo when we're no longer on the 4th sentence
    if (currentSentenceIndex !== 3 && logoAnimationActive && currentSentenceIndex > 3) {
      logoAnimationActive = false;
    }

    // Move to next sentence after display duration
    if (elapsedTime > sentenceDisplayDuration) {
      currentSentenceIndex++;
      sentenceStartTime = currentTime;
      
      // Set typewriter start time when all quotes are done
      if (currentSentenceIndex >= quoteText.length) {
        typewriterStartTime = currentTime + 1000;
      }
    }
  } else {
    // Hide all quotes once sequence is complete
    for (let i = 0; i < quoteElements.length; i++) {
      quoteElements[i].style('opacity', '0');
    }

    // Start typewriter effect after delay
    if (currentTime > typewriterStartTime) {
      if (!typewriterStarted) {
        typewriterStarted = true;
        lastTypeTime = currentTime;
        typewriterElement.style('opacity', '1');
      }

      // Add one character at a time
      if (currentTime - lastTypeTime > typeSpeed && typedLength < typewriterText.length) {
        typedLength++;
        lastTypeTime = currentTime;
      }

      // Update displayed text
      let displayText = typewriterText.substring(0, typedLength);
      typewriterElement.html(displayText);

      // Ensure full visibility once typing is complete
      if (typedLength >= typewriterText.length) {
        typewriterElement.style('opacity', '1');
      }
    }
  }
}

/**
 * Updates Nike logo animation parameters
 */
function updateNikeLogoAnimation() {
  // Update Nike logo position with natural movement
  if (logoAnimationActive) {
    // Move logo across screen
    nikeLogoX += nikeLogoSpeed;
    
    // Add vertical oscillation for more natural movement
    nikeLogoY = height/2 + sin(frameCount * 0.03) * 20;
    
    // Update rotation
    nikeLogoRotation += nikeLogoRotationSpeed;
  } else {
    // Continue rotation and movement even during fade-out for smoother effect
    nikeLogoRotation += nikeLogoRotationSpeed * 0.5; // Slower rotation during fade-out
    nikeLogoX += nikeLogoSpeed * 0.8; // Slower movement during fade-out
  }
  
  // Handle fading logic
  if (currentSentenceIndex === 3 && logoAnimationActive) {
    // Fade in when on 4th sentence
    logoFadeOpacity = min(logoFadeOpacity + fadeInSpeed, 1);
  } else if (logoFadeOpacity > 0) {
    // Fade out gradually when not on 4th sentence
    logoFadeOpacity = max(logoFadeOpacity - fadeOutSpeed, 0);
  }
  
  // Reset logo position when it moves offscreen
  if (nikeLogoX > width + nikeLogoSize) {
    // Only reset if we're still on 4th sentence or the logo is still visible
    if (currentSentenceIndex === 3 || logoFadeOpacity > 0) {
      nikeLogoX = -nikeLogoSize;
      // Randomize rotation speed for variation
      nikeLogoRotationSpeed = random(0.01, 0.03);
    }
  }
}

/**
 * Draws the Nike logo with current animation parameters
 */
function drawNikeLogo() {
  if (!nikeLogoImage || logoFadeOpacity <= 0) return;
  
  // Calculate size while maintaining aspect ratio
  let aspectRatio = nikeLogoImage.width / nikeLogoImage.height;
  let logoWidth = nikeLogoSize * 2;
  let logoHeight = logoWidth / aspectRatio;
  
  // Draw the Nike logo with rotation and fade effect
  push();
  imageMode(CENTER);
  translate(nikeLogoX, nikeLogoY);
  rotate(nikeLogoRotation);
  tint(255, 255 * logoFadeOpacity); // Apply fade effect
  image(nikeLogoImage, 0, 0, logoWidth, logoHeight);
  // Add equivalent alt text information through aria-label on the canvas
  let cnv = select('canvas');
  if (cnv) {
    cnv.attribute('aria-label', cnv.attribute('aria-label') + 
      (logoFadeOpacity > 0.5 ? '. A green Nike swoosh logo is currently visible' : ''));
  }
  pop();
}

/**
 * Updates the position of the custom cursor
 */
function updateCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

/**
 * Handles window resize events
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  timeX = width / 4;
  timeY = height / 4;
  nikeLogoY = height / 2; // Update logo Y position on resize
  nikeLogoSize = width * 0.1; // Make logo size responsive
}