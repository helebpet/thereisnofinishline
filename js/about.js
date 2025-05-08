// This sketch was organized and partially developed with the help of ChatGPT

// =====================================================================
// GLOBAL VARIABLES
// =====================================================================

// Image assets
let bgImage, bgImageMobile;
let canvasReady = false;
let imagesLoaded = 0;

// Quote display variables
let activeQuoteIndex = 0;

// Animation variables
let targetRotation = 0;
let currentRotation = 0;

// DOM elements
let cursorDiv;

// Quote content array
const quoteText = [
  "THERE  IS\nNO  FINISH  LINE.",
  "THIS  SLOGAN,  INTRODUCED  IN  1977,",
  "was  one  of  NIKE'S  EARLIEST  and  most  INFLUENTIAL  advertising  campaigns.",
  "It  symbolized  the  idea  of  CONTINUOUS  SELF-IMPROVEMENT,",
  "emphasizing  that  the  journey  of  personal  growth  and  excellence",
  "NEVER  TRULY  ENDS.",
  "The  campaign  featured  imagery  of  a  LONE  RUNNER  on  an  EMPTY  ROAD,",
  "portraying  running  as  both  a  PHYSICAL  and  EMOTIONAL  experience.",
  "It  transcended  sports,",
  "resonating  with  broader  themes  of  PERSEVERANCE  in  life  and  business.",
  "The  message:",
  "SUCCESS  is  not  about  DEFEATING  OTHERS,",
  "but  about  CONSTANTLY   CHALLENGING  ONESELF.",
  "This  idea  became  a  cornerstone  of  NIKE'S  philosophy.",
  "It  reminds  us  that  the  path  to  greatness  is  endless,",
  "and  the  true  victory  lies  in  the  journey  itself."
];

// =====================================================================
// SETUP & CORE P5.JS FUNCTIONS
// =====================================================================

/**
 * Preload assets before setup
 */
function preload() {
  // Load desktop and mobile background images
  bgImage = loadImage('img/page1.jpg', imageLoaded, loadError);
  bgImage.alt = "Orange-yellow gradient background showing silhouettes of runners in motion";
  
  bgImageMobile = loadImage('img/page1mobile.jpg', imageLoaded, loadError);
  bgImageMobile.alt = "Mobile version of orange-yellow gradient background with runner silhouettes";
}

/**
 * Called when an image is successfully loaded
 */
function imageLoaded() {
  imagesLoaded++;
  // Once all images are loaded, mark canvas as ready and hide loader
  if (imagesLoaded >= 1) {
    canvasReady = true;
    select('#loader')?.hide();
  }
}

/**
 * Error handling for image loading
 */
function loadError(err) {
  console.error("Image failed to load:", err);
}

/**
 * Initial setup function
 */
function setup() {
  // Create canvas at window size
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none'); // Hide until loaded
  frameRate(60);
  
  // Hide default cursor and use custom cursor
  noCursor();
  
  // Create DOM elements for the quotes
  createDomQuote();
  
  // Prevent scrolling of the main page
  document.body.style.overflow = 'hidden';
  
  // Show all quotes with animation after a short delay
  setTimeout(() => {
    showAllQuotes();
  }, 500);
  
  // Set up the custom cursor
  setupCustomCursor();
}

/**
 * Main draw loop - runs continuously
 */
function draw() {
  // Don't render until assets are loaded
  if (!canvasReady) return;

  // Show the canvas once it's ready
  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  // Apply rotation effect based on mouse position
  applyRotationEffect();
  
  // Draw background and visual elements
  drawBackground();
  drawGradientLines();
  
  // Update custom cursor position
  updateCustomCursor();
}

/**
 * Handle window resizing
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawBackground(); // Re-check which background image to use
}

// =====================================================================
// VISUAL EFFECTS
// =====================================================================

/**
 * Apply rotation effect based on mouse or device movement
 */
function applyRotationEffect() {
  push();
  
  // Update rotation target based on mouse position
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    targetRotation = map(mouseX, 0, width, -0.02, 0.02);
    currentRotation = lerp(currentRotation, targetRotation, 0.05);
  } else {
    // Gradually return to center when mouse is still
    currentRotation = lerp(currentRotation, 0, 0.05);
  }
  
  // Apply rotation transformation
  translate(width/2, height/2);
  rotate(currentRotation);
  translate(-width/2, -height/2);
  
  pop();
}

/**
 * Draw the background image with responsive sizing
 */
function drawBackground() {
  // Select appropriate background image based on device width
  let bgImageToUse = width <= 768 ? bgImageMobile : bgImage;
  
  // Calculate aspect ratios for proper scaling
  let aspectRatio = bgImageToUse.width / bgImageToUse.height;
  let canvasRatio = width / height;
  let drawWidth, drawHeight;
  
  // Add extra size (20%) to prevent white edges when rotating
  const scaleFactor = 1.2;

  // Determine dimensions to maintain aspect ratio while filling canvas
  if (canvasRatio > aspectRatio) {
    drawWidth = width * scaleFactor;
    drawHeight = (width * scaleFactor) / aspectRatio;
  } else {
    drawHeight = height * scaleFactor;
    drawWidth = (height * scaleFactor) * aspectRatio;
  }

  // Center the image
  let offsetX = (width - drawWidth) / 2;
  let offsetY = (height - drawHeight) / 2;

  // Draw the background image
  image(bgImageToUse, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Draw horizontal and vertical scan lines for visual effect
 */
function drawGradientLines() {
  // Draw horizontal scan lines with varying opacity
  for (let y = 0; y < height; y += 20) {
    const opacity = map(sin(frameCount * 0.01 + y * 0.01), -1, 1, 20, 80);
    stroke(252, 252, 236, opacity); // #FCFCEC with transparency
    strokeWeight(1);
    line(0, y, width, y);
  }
  
  // Add vertical accent lines
  for (let x = 0; x < width; x += 120) {
    const opacity = map(sin(frameCount * 0.02 + x * 0.005), -1, 1, 10, 40);
    stroke(252, 252, 236, opacity);
    strokeWeight(0.5);
    line(x, 0, x, height);
  }
}

/**
 * Set up the custom cursor
 */
function setupCustomCursor() {
  cursorDiv = select('.custom-cursor');
  if (!cursorDiv) {
    // Create custom cursor if it doesn't exist
    cursorDiv = createDiv();
    cursorDiv.class('custom-cursor');
    cursorDiv.style('position', 'fixed');
    cursorDiv.style('width', '24px');
    cursorDiv.style('height', '24px');
    cursorDiv.style('border-radius', '50%');
    cursorDiv.style('background-color', 'rgba(252, 252, 236, 0.5)');
    cursorDiv.style('border', '1px solid rgba(252, 252, 236, 0.8)');
    cursorDiv.style('pointer-events', 'none');
    cursorDiv.style('transform', 'translate(-50%, -50%)');
    cursorDiv.style('z-index', '9999');
    cursorDiv.style('mix-blend-mode', 'difference');
  }
}

/**
 * Update the custom cursor position to follow the mouse
 */
function updateCustomCursor() {
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

// =====================================================================
// PARTICLE SYSTEM (currently unused but available)
// =====================================================================

/**
 * Update and draw all particles
 * Note: This function is defined but not currently called in draw()
 */
function updateParticles() {
  // Create particles on movement
  if (mouseX !== pmouseX || mouseY !== pmouseY && frameCount % 3 === 0) {
    createParticle();
  }
  
  // Draw and update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    // Remove dead particles
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
}

/**
 * Create a new particle at the mouse position
 * Note: This function is defined but not currently used
 */
function createParticle() {
  particles.push(new Particle(mouseX, mouseY));
}

/**
 * Particle class for visual effects
 * Note: This class is defined but not currently instantiated
 */
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = 255;
    this.size = random(3, 8);
    this.color = color(252, 252, 236); // #FCFCEC
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }
  
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    circle(this.x, this.y, this.size);
  }
  
  isDead() {
    return this.alpha <= 0;
  }
}

// =====================================================================
// DOM CREATION & QUOTE DISPLAY
// =====================================================================

/**
 * Create all DOM elements for the quote display
 */
function createDomQuote() {
  // Create main container
  const container = createDiv().id('quote-container');
  container.style('position', 'absolute');
  container.style('top', '15%');
  container.style('left', '10%');
  container.style('max-width', '80%');
  container.style('font-family', 'Termina, sans-serif');
  container.style('z-index', '10');
  
  // Create title (first quote)
  createMainTitle(container);
  
  // Create scrollable container for remaining quotes
  const textContainer = createScrollableContainer(container);
  
  // Add individual paragraphs for each quote
  createQuoteParagraphs(textContainer);
  
  // Add scroll indicator
  createScrollIndicator(container);
  
  // Add scroll event listener to track visible quotes
  setupScrollListener(textContainer);
}

/**
 * Create the main title element
 */
function createMainTitle(container) {
  const h1 = createElement('h1', quoteText[0]);
  h1.parent(container);
  h1.style('color', '#FCFCEC');
  h1.style('font-size', 'clamp(3rem, 7vw, 6rem)');
  h1.style('line-height', '1.1');
  h1.style('font-weight', '900');
  h1.style('margin-bottom', '0.7em');
  h1.style('transition', 'opacity 0.5s ease, transform 0.5s ease');
  h1.id('main-title');
}

/**
 * Create the scrollable container for quotes
 */
function createScrollableContainer(container) {
  const textContainer = createDiv().id('text-container');
  textContainer.parent(container);
  textContainer.style('max-height', '40vh');
  textContainer.style('overflow-y', 'auto');
  textContainer.style('scrollbar-width', 'thin');
  textContainer.style('scrollbar-color', '#FCFCEC rgba(252, 252, 236, 0.2)');
  textContainer.style('padding', '15px');
  
  // Add custom scrollbar styling
  const scrollbarStyle = document.createElement('style');
  scrollbarStyle.innerHTML = `
    #text-container::-webkit-scrollbar {
      width: 6px;
    }
    #text-container::-webkit-scrollbar-track {
      background: rgba(252, 252, 236, 0.1);
    }
    #text-container::-webkit-scrollbar-thumb {
      background-color: rgba(252, 252, 236, 0.5);
      border-radius: 6px;
    }
  `;
  document.head.appendChild(scrollbarStyle);
  
  return textContainer;
}

/**
 * Create paragraphs for each quote
 */
function createQuoteParagraphs(textContainer) {
  // Create paragraphs starting from index 1 (skip the title)
  for (let i = 1; i < quoteText.length; i++) {
    const p = createElement('p', quoteText[i]);
    p.parent(textContainer);
    p.style('color', '#FCFCEC');
    p.style('font-weight', '600');
    p.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
    p.style('line-height', '1.6');
    p.style('letter-spacing', '-0.11em');
    p.style('word-spacing', '0.15em');
    p.style('text-align', 'left');
    p.style('margin-bottom', '0');
    p.style('padding-bottom', '0');
    p.style('opacity', '0'); // Start invisible
    p.style('transform', 'translateY(15px)');
    p.style('transition', 'opacity 0.8s ease, transform 0.8s ease');
    p.class('quote-paragraph');
    p.attribute('data-index', i);
    
    // Simple hover effect
    p.mouseOver(() => {
      p.style('opacity', '1');
    });
    
    p.mouseOut(() => {
      p.style('opacity', '1');
    });
  }
}

/**
 * Create the scroll indicator
 */
function createScrollIndicator(container) {
  const scrollIndicator = createDiv().id('scroll-indicator');
  scrollIndicator.parent(container);
  scrollIndicator.style('margin-top', '10px');
  scrollIndicator.style('text-align', 'center');
  scrollIndicator.style('opacity', '0.7');
  scrollIndicator.style('transition', 'opacity 0.3s ease');
  
  const scrollText = createP('Scroll to explore').parent(scrollIndicator);
  scrollText.style('color', '#FCFCEC');
  scrollText.style('font-size', '0.9rem');
  scrollText.style('margin', '0');
  
  const scrollArrow = createDiv('↓').parent(scrollIndicator);
  scrollArrow.style('color', '#FCFCEC');
  scrollArrow.style('font-size', '1.2rem');
  scrollArrow.style('animation', 'bounce 2s infinite');
  
  // Add bounce animation
  const bounceStyle = document.createElement('style');
  bounceStyle.innerHTML = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
      40% {transform: translateY(-10px);}
      60% {transform: translateY(-5px);}
    }
  `;
  document.head.appendChild(bounceStyle);
}

/**
 * Setup the scroll event listener to track visible quotes
 */
function setupScrollListener(textContainer) {
  textContainer.elt.addEventListener('scroll', () => {
    // Hide scroll indicator when scrolling starts
    select('#scroll-indicator').style('opacity', '0');
    
    // Determine which quote is in view based on scroll position
    const scrollPosition = textContainer.elt.scrollTop;
    const paragraphs = selectAll('.quote-paragraph');
    
    // Find the most visible paragraph
    let mostVisibleIndex = 1; // Start from 1 since title is not in scroll area
    let maxVisibility = 0;
    
    paragraphs.forEach((p) => {
      const pIndex = parseInt(p.attribute('data-index'));
      const pTop = p.elt.offsetTop;
      const pHeight = p.elt.offsetHeight;
      
      // Calculate how visible this paragraph is
      const visibility = calculateVisibility(scrollPosition, pTop, pHeight, textContainer.elt.offsetHeight);
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleIndex = pIndex;
      }
    });
    
    // Update active quote index without animation
    if (mostVisibleIndex !== activeQuoteIndex) {
      activeQuoteIndex = mostVisibleIndex;
    }
  });
}

// =====================================================================
// INTERACTION & NAVIGATION
// =====================================================================

/**
 * Calculate how visible an element is in the viewport
 * @return {number} - Visibility ratio between 0 and 1
 */
function calculateVisibility(scrollPos, elemTop, elemHeight, viewportHeight) {
  const viewTop = scrollPos;
  const viewBottom = scrollPos + viewportHeight;
  
  // Element boundaries
  const elemBottom = elemTop + elemHeight;
  
  // Element is not visible at all
  if (elemBottom < viewTop || elemTop > viewBottom) {
    return 0;
  }
  
  // Calculate visible height of element
  const visibleTop = Math.max(elemTop, viewTop);
  const visibleBottom = Math.min(elemBottom, viewBottom);
  const visibleHeight = visibleBottom - visibleTop;
  
  // Return visibility as percentage of element height
  return visibleHeight / elemHeight;
}

/**
 * Navigate to the next quote
 */
function nextQuote() {
  if (activeQuoteIndex < quoteText.length - 1) {
    scrollToQuote(activeQuoteIndex + 1);
  } else {
    // Scroll back to title when at the end
    const scrollContainer = select('#text-container');
    scrollContainer.elt.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

/**
 * Navigate to the previous quote
 */
function prevQuote() {
  if (activeQuoteIndex > 1) {
    scrollToQuote(activeQuoteIndex - 1);
  } else {
    // When at the beginning, cycle to the last quote
    scrollToQuote(quoteText.length - 1);
  }
}

/**
 * Show all quotes with staggered animation
 */
function showAllQuotes() {
  selectAll('.quote-paragraph').forEach((p, i) => {
    p.style('display', 'block'); 
    
    // Staggered animation for each paragraph
    setTimeout(() => {
      p.style('opacity', '1');
      p.style('transform', 'translateY(0)');
    }, 100 + (i * 150)); // Stagger by 150ms per paragraph
  });
}

/**
 * Scroll smoothly to a specific quote
 */
function scrollToQuote(index) {
  const targetP = select('.quote-paragraph[data-index="' + index + '"]');
  if (targetP) {
    // Get the scroll container and target element's position
    const scrollContainer = select('#text-container');
    const targetTop = targetP.elt.offsetTop;
    
    // Smooth scroll to the target element
    scrollContainer.elt.scrollTo({
      top: targetTop - 20, // Offset to position it nicely
      behavior: 'smooth'
    });
    
    // Simple highlight effect
    targetP.style('color', '#ffffff');
    setTimeout(() => {
      targetP.style('color', '#FCFCEC');
    }, 800);
  }
}

/**
 * Handle keyboard navigation
 */
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    prevQuote();
  } else if (keyCode === RIGHT_ARROW) {
    nextQuote();
  } else if (keyCode === 32) { // Space bar
    nextQuote();
  } else if (keyCode === 27) { // Escape key
    // Scroll to the top of the container
    const scrollContainer = select('#text-container');
    scrollContainer.elt.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else if (keyCode >= 49 && keyCode <= 57) { // Number keys 1-9
    const quoteIndex = keyCode - 48;
    if (quoteIndex < quoteText.length && quoteIndex > 0) {
      scrollToQuote(quoteIndex);
    }
  }
}

/**
 * Handle mouse wheel scrolling
 */
function mouseWheel(event) {
  // Let the native scrolling handle this
  return true;
}

/**
 * Add tilt interaction for mobile devices
 */
window.addEventListener('deviceorientation', (event) => {
  if (event.gamma) {
    const tilt = constrain(event.gamma, -20, 20);
    targetRotation = map(tilt, -20, 20, -0.05, 0.05);
  }
});