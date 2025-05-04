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
  noCursor();

  // Create DOM elements with the required styling
  createDomQuote();
  
  // Create interactive navigation controls
  createNavigationControls();
  
  // Set initial interaction time
  lastInteractionTime = millis();
  
  // Add ambient animation to the entire page
  document.body.style.overflow = 'hidden';
  
  // Apply initial progress
  setTimeout(() => {
    showQuote(1);
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
  
  // Custom cursor
  noStroke();
  fill(252, 252, 236, 180); // #FCFCEC with transparency
  circle(mouseX, mouseY, 15);
  fill(252, 252, 236);
  circle(mouseX, mouseY, 6);
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
  container.style('top', '20%');
  container.style('left', '10%');
  container.style('max-width', '80%');
  container.style('font-family', 'Termina, sans-serif');
  container.style('z-index', '10');
  container.style('cursor', 'none');
  
  // Title (first quote)
  const h1 = createElement('h1', quoteText[0]);
  h1.parent(container);
  h1.style('color', '#FCFCEC');
  h1.style('font-size', 'clamp(3rem, 7vw, 6rem)');
  h1.style('line-height', '1.2');
  h1.style('font-weight', '900');
  h1.style('margin-bottom', '1em');
  
  // Container for paragraph quotes (will be displayed one at a time)
  const paragraphContainer = createDiv().id('paragraph-container');
  paragraphContainer.parent(container);
  
  // Create all paragraph elements but initially hide them except the first one
  for (let i = 1; i < quoteText.length; i++) {
    const p = createElement('p', quoteText[i]);
    p.parent(paragraphContainer);
    p.style('color', '#FCFCEC');
    p.style('font-weight', '600');
    p.style('font-size', 'clamp(1.2rem, 2.5vw, 2rem)');
    p.style('line-height', '1.6');
    p.style('letter-spacing', '-0.11em');
    p.style('text-align', 'left');
    p.style('margin-bottom', '1rem');
    p.style('opacity', i === 1 ? '1' : '0'); // Only show the first paragraph
    p.style('transition', 'opacity 0.5s ease');
    p.style('display', i === 1 ? 'block' : 'none');
    p.class('quote-paragraph');
  }
}

function createNavigationControls() {
  // Create a timeline that serves as navigation
  const navContainer = createDiv().id('nav-container');
  navContainer.style('position', 'fixed');
  navContainer.style('bottom', '10%');
  navContainer.style('left', '50%');
  navContainer.style('transform', 'translateX(-50%)');
  navContainer.style('display', 'flex');
  navContainer.style('align-items', 'center');
  navContainer.style('gap', '15px');
  navContainer.style('z-index', '20');
  navContainer.style('cursor', 'none');
  
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
  
  // Create markers for each quote
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
    });
    
    marker.mouseOut(() => {
      marker.style('transform', 'translate(-50%, -50%) scale(1)');
      marker.style('opacity', '0.6');
    });
    
    marker.mousePressed(() => {
      showQuote(i);
      updateProgress();
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
    
    showQuote(quoteIndex);
    updateProgress();
    updateInteractionTime();
  });
  
  // Quote counter text
  const counter = createDiv().id('quote-counter');
  counter.parent(navContainer);
  counter.style('color', '#FCFCEC');
  counter.style('font-family', 'Termina, sans-serif');
  counter.style('font-size', '14px');
  counter.style('font-weight', '600');
  counter.html(`<span id="current-quote">1</span>/${quoteText.length - 1}`);
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

function prevQuote() {
  if (activeQuoteIndex > 1) {
    showQuote(activeQuoteIndex - 1);
  } else {
    // Cycle to the last quote if at the beginning
    showQuote(quoteText.length - 1);
  }
  updateInteractionTime();
}

function nextQuote() {
  if (activeQuoteIndex < quoteText.length - 1) {
    showQuote(activeQuoteIndex + 1);
  } else {
    // Cycle to the first quote if at the end
    showQuote(1);
  }
  updateInteractionTime();
}

function showQuote(index) {
  // Hide current quote
  selectAll('.quote-paragraph').forEach((p, i) => {
    if (i + 1 === activeQuoteIndex) {
      p.style('opacity', '0');
      p.style('transform', 'translateY(20px)');
      setTimeout(() => {
        p.style('display', 'none');
      }, 500);
    }
  });
  
  // Show new quote
  selectAll('.quote-paragraph').forEach((p, i) => {
    if (i + 1 === index) {
      p.style('display', 'block');
      p.style('transform', 'translateY(20px)');
      setTimeout(() => {
        p.style('opacity', '1');
        p.style('transform', 'translateY(0)');
      }, 50);
    }
  });
  
  // Update the progress bar and timeline markers
  updateProgress();
  
  activeQuoteIndex = index;
  
  // Create burst of particles for transition
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
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