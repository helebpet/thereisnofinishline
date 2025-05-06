let bgImage, bgImageMobile;
let canvasReady = false;
let imagesLoaded = 0;
let activeQuoteIndex = 0;
let targetRotation = 0;
let currentRotation = 0;
let cursorDiv;

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

function preload() {
  bgImage = loadImage('img/page1.jpg', imageLoaded, loadError);
  bgImageMobile = loadImage('img/page1mobile.jpg', imageLoaded, loadError);
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
  
  // Hide cursor and use custom cursor
  noCursor();
  
  // Create DOM elements with the required styling
  createDomQuote();
  
  // Add ambient animation to the entire page
  document.body.style.overflow = 'hidden';
  
  // Apply initial progress
  setTimeout(() => {
    showAllQuotes(); // Show all quotes at once
  }, 500);
  
  // Set up the custom cursor
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

function draw() {
  if (!canvasReady) return;

  // Show the canvas if it was hidden
  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block');
  }

  // Drawing functions
  push();
  // Smooth rotation effect based on mouse position
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    targetRotation = map(mouseX, 0, width, -0.02, 0.02);
    currentRotation = lerp(currentRotation, targetRotation, 0.05);
  } else {
    currentRotation = lerp(currentRotation, 0, 0.05);
  }
  
  translate(width/2, height/2);
  rotate(currentRotation);
  translate(-width/2, -height/2);
  
  drawBackground();
  pop();
  
  drawGradientLines();
  
  // Update custom cursor position
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function drawBackground() {
  // Select appropriate background image based on device width
  let bgImageToUse = width <= 768 ? bgImageMobile : bgImage;
  
  // Enlarge background to prevent white edges when rotating
  let aspectRatio = bgImageToUse.width / bgImageToUse.height;
  let canvasRatio = width / height;
  let drawWidth, drawHeight;
  
  // Add extra size to prevent white edges (20% extra)
  const scaleFactor = 1.2;

  if (canvasRatio > aspectRatio) {
    drawWidth = width * scaleFactor;
    drawHeight = (width * scaleFactor) / aspectRatio;
  } else {
    drawHeight = height * scaleFactor;
    drawWidth = (height * scaleFactor) * aspectRatio;
  }

  let offsetX = (width - drawWidth) / 2;
  let offsetY = (height - drawHeight) / 2;

  image(bgImageToUse, offsetX, offsetY, drawWidth, drawHeight);
}

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

function createParticle() {
  particles.push(new Particle(mouseX, mouseY));
}

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

// --- DOM CREATION ---
function createDomQuote() {
  const container = createDiv().id('quote-container');
  container.style('position', 'absolute');
  container.style('top', '15%'); // Moved down from 10% to 15%
  container.style('left', '10%');
  container.style('max-width', '80%');
  container.style('font-family', 'Termina, sans-serif');
  container.style('z-index', '10');
  
  // Title (first quote)
  const h1 = createElement('h1', quoteText[0]);
  h1.parent(container);
  h1.style('color', '#FCFCEC');
  h1.style('font-size', 'clamp(3rem, 7vw, 6rem)');
  h1.style('line-height', '1.1'); // Decreased line height for the title as requested
  h1.style('font-weight', '900');
  h1.style('margin-bottom', '0.7em'); // Reduced bottom margin to move text up
  h1.style('transition', 'opacity 0.5s ease, transform 0.5s ease');
  h1.id('main-title'); // Add ID for targeting the title
  
  // Create scrollable container for all quotes
  const textContainer = createDiv().id('text-container');
  textContainer.parent(container);
  textContainer.style('max-height', '40vh'); // Reduced height from 50vh to 40vh
  textContainer.style('overflow-y', 'auto');
  textContainer.style('scrollbar-width', 'thin');
  textContainer.style('scrollbar-color', '#FCFCEC rgba(252, 252, 236, 0.2)');
  textContainer.style('padding-right', '20px');
  textContainer.style('padding', '15px'); // Added padding inside the scrolling area to prevent cut-off on hover
  
  // Custom scrollbar styling
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
  
  // We don't need the title in the scrollable area anymore
  
  // Create all paragraph elements in one scrollable view
  for (let i = 1; i < quoteText.length; i++) {
    const p = createElement('p', quoteText[i]);
    p.parent(textContainer);
    p.style('color', '#FCFCEC');
    p.style('font-weight', '600');
    p.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
    p.style('line-height', '1.6'); // Set line height to 1.6 as requested
    p.style('letter-spacing', '-0.11em'); // Set letter spacing as requested
    p.style('word-spacing', '0.15em'); // Add larger spaces between words
    p.style('text-align', 'left');
    p.style('margin-bottom', '1.6rem'); // Set paragraph spacing to match line height (1.6)
    p.style('opacity', '0'); // Start invisible
    p.style('transform', 'translateY(15px)');
    p.style('transition', 'opacity 0.8s ease, transform 0.8s ease');
    p.class('quote-paragraph');
    p.attribute('data-index', i);
    
    // Simple hover effect - only change opacity without scaling
    p.mouseOver(() => {
      p.style('opacity', '1');
    });
    
    p.mouseOut(() => {
      p.style('opacity', '1');
    });
  }
  
  // Add indicator to encourage scrolling
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
  
  // Hide scroll indicator when scrolling starts
  textContainer.elt.addEventListener('scroll', () => {
    scrollIndicator.style('opacity', '0');
    
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
  
  // Removed "Back to Top" button
}

// Helper function to calculate how visible an element is in the viewport
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

function nextQuote() {
  if (activeQuoteIndex < quoteText.length - 1) {
    scrollToQuote(activeQuoteIndex + 1);
  } else {
    // Scroll back to title when at the end by scrolling to the top
    const scrollContainer = select('#text-container');
    scrollContainer.elt.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

function prevQuote() {
  if (activeQuoteIndex > 1) {
    scrollToQuote(activeQuoteIndex - 1);
  } else {
    // When at the beginning (first paragraph), cycle to the last quote
    scrollToQuote(quoteText.length - 1);
  }
}

// Show all quotes with staggered animation
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

// Scroll smoothly to a specific quote
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
    
    // Simple highlight without scaling effects
    targetP.style('color', '#ffffff');
    setTimeout(() => {
      targetP.style('color', '#FCFCEC');
    }, 800);
  }
}

// Add keyboard navigation
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

// Add tilt interaction for mobile
window.addEventListener('deviceorientation', (event) => {
  if (event.gamma) {
    const tilt = constrain(event.gamma, -20, 20);
    targetRotation = map(tilt, -20, 20, -0.05, 0.05);
  }
});

// Update on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Re-check which background image to use
  drawBackground();
}

// Add scroll navigation with smooth animation
function mouseWheel(event) {
  // Let the native scrolling handle this
  return true;
}