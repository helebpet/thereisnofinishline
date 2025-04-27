let cursorDiv;
let canvasReady = false;
let isMobile = false;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style('z-index', '10');
  cnv.style('pointer-events', 'none');
  frameRate(60);
  noCursor();
  cursorDiv = select('.custom-cursor');
  checkDevice();
  canvasReady = true;

  // Hide the loader once ready
  let loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
}

function checkDevice() {
  isMobile = windowWidth <= 768;
}

function draw() {
  if (!canvasReady) return;

  clear();

  let startY = windowHeight * 0.6;
  let endY = windowHeight;
  let lineGap = 20;
  const colors = ["#04AD74", "#EF5C26", "#EFBD06"];
  
  let colorIndex = floor(map(mouseX, 0, windowWidth, 0, colors.length));
  colorIndex = constrain(colorIndex, 0, colors.length - 1);
  let lineColor = colors[colorIndex];
  
  stroke(lineColor);
  let strokeWeightFactor = map(mouseY, 0, windowHeight, 1, 10);
  strokeWeight(strokeWeightFactor);

  for (let y = startY; y <= endY; y += lineGap) {
    line(0, y, windowWidth, y);
  }

  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  checkDevice();
  redraw();
}
