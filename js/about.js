let bgImage;
let canvasReady = false;
let imagesLoaded = 0;
let activeQuoteIndex = 0;
let particles = [];
let lastInteractionTime = 0;
let autoAdvanceInterval = 8000; // Time in ms to auto-advance quotes
let userInteracted = false;
let targetRotation = 0;
let currentRotation = 0;

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
  
  // Use custom CSS cursor instead of hiding the cursor
  select('body').style('cursor', 'inherit'); // Will use your custom cursor from CSS
  
  // Create DOM elements with the required styling
  createDomQuote();
  
  // Create smooth scrolling timeline
  createNavigationControls();
  
  // Set initial interaction time
  lastInteractionTime = millis();
  
  // Add ambient animation to the entire page
  document.body.style.overflow = 'hidden';
  
  // Apply initial progress
  setTimeout(() => {
    showAllQuotes(); // Show all quotes at once
    updateProgress();
  }, 500);
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
  if (userInteracted) {
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
  updateAndDrawParticles();
  
  // Auto-advance quotes if no interaction for a while
  if (millis() - lastInteractionTime > autoAdvanceInterval) {
    lastInteractionTime = millis();
    nextQuote();
  }
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

function updateAndDrawParticles() {
  // Create particles on movement
  if (userInteracted && frameCount % 3 === 0) {
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
  
  // We don't draw a custom cursor anymore, using CSS cursor instead
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
  container.style('top', '10%');
  container.style('left', '10%');
  container.style('max-width', '80%');
  container.style('font-family', 'Termina, sans-serif');
  container.style('z-index', '10');
  container.style('cursor', 'inherit'); // Will use your custom cursor from CSS
  
  // Title (first quote)
  const h1 = createElement('h1', quoteText[0]);
  h1.parent(container);
  h1.style('color', '#FCFCEC');
  h1.style('font-size', 'clamp(3rem, 7vw, 6rem)');
  h1.style('line-height', '1.2');
  h1.style('font-weight', '900');
  h1.style('margin-bottom', '1em');
  h1.style('transition', 'opacity 0.5s ease, transform 0.5s ease');
  
  // Create scrollable container for all quotes
  const textContainer = createDiv().id('text-container');
  textContainer.parent(container);
  textContainer.style('max-height', '60vh');
  textContainer.style('overflow-y', 'auto');
  textContainer.style('scrollbar-width', 'thin');
  textContainer.style('scrollbar-color', '#FCFCEC rgba(252, 252, 236, 0.2)');
  textContainer.style('padding-right', '20px');
  
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
  
  // Create all paragraph elements in one scrollable view
  for (let i = 1; i < quoteText.length; i++) {
    const p = createElement('p', quoteText[i]);
    p.parent(textContainer);
    p.style('color', '#FCFCEC');
    p.style('font-weight', '600');
    p.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
    p.style('line-height', '1.6');
    p.style('letter-spacing', '-0.11em');
    p.style('text-align', 'left');
    p.style('margin-bottom', '1.5rem');
    p.style('opacity', '0'); // Start invisible
    p.style('transform', 'translateY(15px)');
    p.style('transition', 'opacity 0.8s ease, transform 0.8s ease');
    p.class('quote-paragraph');
    p.attribute('data-index', i);
    
    // Add subtle highlight to paragraphs on hover
    p.mouseOver(() => {
      p.style('transform', 'translateY(0) scale(1.01)');
      p.style('opacity', '1');
    });
    
    p.mouseOut(() => {
      p.style('transform', 'translateY(0) scale(1)');
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
    let mostVisibleIndex = 1;
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
      updateProgress();
    }
  });
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

function createNavigationControls() {
  // Create a timeline that serves as navigation and progress indicator
  const navContainer = createDiv().id('nav-container');
  navContainer.style('position', 'fixed');
  navContainer.style('bottom', '5%');
  navContainer.style('left', '50%');
  navContainer.style('transform', 'translateX(-50%)');
  navContainer.style('display', 'flex');
  navContainer.style('align-items', 'center');
  navContainer.style('gap', '15px');
  navContainer.style('z-index', '20');
  navContainer.style('cursor', 'inherit'); // Will use your custom cursor from CSS
  
  // Timeline bar
  const timeline = createDiv().id('timeline');
  timeline.parent(navContainer);
  timeline.style('width', '60vw');
  timeline.style('height', '2px');
  timeline.style('background-color', 'rgba(252, 252, 236, 0.3)');
  timeline.style('position', 'relative');
  timeline.style('cursor', 'pointer');
  
  // Progress bar
  const progress = createDiv().id('progress');
  progress.parent(timeline);
  progress.style('position', 'absolute');
  progress.style('left', '0');
  progress.style('top', '0');
  progress.style('height', '100%');
  progress.style('width', '0%');
  progress.style('background-color', '#FCFCEC');
  progress.style('transition', 'width 0.5s ease');
  
  // Create markers for each quote section to help navigate
  for (let i = 1; i < quoteText.length; i++) {
    const percent = (i / (quoteText.length - 1)) * 100;
    
    const marker = createDiv();
    marker.parent(timeline);
    marker.style('position', 'absolute');
    marker.style('left', percent + '%');
    marker.style('top', '50%');
    marker.style('transform', 'translate(-50%, -50%)');
    marker.style('width', '8px');
    marker.style('height', '8px');
    marker.style('border-radius', '50%');
    marker.style('background-color', '#FCFCEC');
    marker.style('transition', 'transform 0.3s ease, opacity 0.3s ease');
    marker.style('opacity', '0.6');
    marker.class('timeline-marker');
    marker.attribute('data-index', i);
    
    // Marker hover effect and click
    marker.mouseOver(() => {
      marker.style('transform', 'translate(-50%, -50%) scale(1.5)');
      marker.style('opacity', '1');
      
      // Show tooltip with quote preview
      const tooltip = createDiv(quoteText[i].substring(0, 20) + '...');
      tooltip.parent(marker);
      tooltip.style('position', 'absolute');
      tooltip.style('bottom', '15px');
      tooltip.style('left', '50%');
      tooltip.style('transform', 'translateX(-50%)');
      tooltip.style('background-color', 'rgba(0, 0, 0, 0.7)');
      tooltip.style('color', '#FCFCEC');
      tooltip.style('padding', '5px 10px');
      tooltip.style('border-radius', '4px');
      tooltip.style('font-size', '12px');
      tooltip.style('white-space', 'nowrap');
      tooltip.style('pointer-events', 'none');
      tooltip.id('tooltip-' + i);
    });
    
    marker.mouseOut(() => {
      marker.style('transform', 'translate(-50%, -50%) scale(1)');
      marker.style('opacity', '0.6');
      select('#tooltip-' + i)?.remove();
    });
    
    marker.mousePressed(() => {
      // Smooth scroll to that paragraph when clicking on marker
      scrollToQuote(i);
      updateHighlightFromScroll(i);
      updateInteractionTime();
    });
  }
  
  // Make timeline clickable
  timeline.mousePressed(() => {
    const bounds = timeline.elt.getBoundingClientRect();
    const clickPos = mouseX - bounds.left;
    const percentage = clickPos / bounds.width;
    const quoteIndex = Math.max(1, Math.min(
      Math.floor(percentage * (quoteText.length - 1)) + 1,
      quoteText.length - 1
    ));
    
    scrollToQuote(quoteIndex);
    updateHighlightFromScroll(quoteIndex);
    updateInteractionTime();
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
    
    // Visual feedback
    targetP.style('transform', 'translateY(0) scale(1.02)');
    setTimeout(() => {
      targetP.style('transform', 'translateY(0) scale(1)');
    }, 800);
    
    // Create particle burst around the target paragraph
    const rect = targetP.elt.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      particles.push(new Particle(
        random(rect.left, rect.right),
        random(rect.top, rect.bottom)
      ));
    }
  }
}

function updateProgress() {
  // Update progress bar
  const progressPercent = (activeQuoteIndex - 1) / (quoteText.length - 2) * 100;
  select('#progress').style('width', progressPercent + '%');
  
  // Update counter
  select('#current-quote').html(activeQuoteIndex);
  
  // Update markers
  selectAll('.timeline-marker').forEach((marker) => {
    const index = parseInt(marker.attribute('data-index'));
    if (index <= activeQuoteIndex) {
      marker.style('background-color', '#FCFCEC');
      marker.style('opacity', '1');
    } else {
      marker.style('background-color', '#FCFCEC');
      marker.style('opacity', '0.4');
    }
  });
}

function nextQuote() {
  if (activeQuoteIndex < quoteText.length - 1) {
    scrollToQuote(activeQuoteIndex + 1);
  } else {
    // Scroll back to top when at the end
    scrollToQuote(1);
  }
  updateInteractionTime();
}

function prevQuote() {
  if (activeQuoteIndex > 1) {
    scrollToQuote(activeQuoteIndex - 1);
  } else {
    // Cycle to the last quote if at the beginning
    scrollToQuote(quoteText.length - 1);
  }
  updateInteractionTime();
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

// When user scrolls to a specific section, highlight it in the timeline
function updateHighlightFromScroll(index) {
  activeQuoteIndex = index;
  updateProgress();
}

function updateInteractionTime() {
  lastInteractionTime = millis();
}

// Track mouse movement
function mouseMoved() {
  userInteracted = true;
  updateInteractionTime();
  
  // Reset after inactivity
  setTimeout(() => {
    userInteracted = false;
  }, 5000);
}

// Add keyboard navigation
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    prevQuote();
  } else if (keyCode === RIGHT_ARROW) {
    nextQuote();
  } else if (keyCode === 32) { // Space bar
    nextQuote();
  } else if (keyCode >= 49 && keyCode <= 57) { // Number keys 1-9
    const quoteIndex = keyCode - 48;
    if (quoteIndex < quoteText.length) {
      showQuote(quoteIndex);
      updateProgress();
    }
  }
  updateInteractionTime();
}

// Add tilt interaction for mobile
window.addEventListener('deviceorientation', (event) => {
  if (event.gamma) {
    const tilt = constrain(event.gamma, -20, 20);
    targetRotation = map(tilt, -20, 20, -0.05, 0.05);
    userInteracted = true;
    
    // Create particles on tilt
    if (frameCount % 10 === 0) {
      particles.push(new Particle(random(width), random(height)));
    }
    
    // Reset after inactivity
    clearTimeout(window.tiltTimeout);
    window.tiltTimeout = setTimeout(() => {
      userInteracted = false;
    }, 5000);
  }
});

// Update on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateProgress();
}

// Add scroll navigation with smooth animation
function mouseWheel(event) {
  const direction = event.delta > 0 ? 1 : -1;
  let targetIndex = activeQuoteIndex + direction;
  
  // Keep within bounds
  targetIndex = constrain(targetIndex, 1, quoteText.length - 1);
  
  if (targetIndex !== activeQuoteIndex) {
    showQuote(targetIndex);
  }
  
  updateInteractionTime();
  // Prevent default scrolling
  return false;
}