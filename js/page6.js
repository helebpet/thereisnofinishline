let cursorDiv;
let canvasReady = false;
let isMobile = false;

let textToDraw = "AND FROM THAT POINT ON, ...  ";
let spacing;
let reducedSpacing;
let path = [];
let radius;
let angleOffset = 0;

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

  textFont("Termina", 600);  // Font Termina, váha 600
  textStyle(BOLD);

  radius = min(windowWidth, windowHeight) * 0.2;

  path = [];
  angleOffset = map(mouseX, 0, width, 0, TWO_PI);
  generateFullCircularPath(width / 2, height / 2, radius, 400, angleOffset);

  let circleLength = getTotalPathLength();
  spacing = circleLength / textToDraw.length;
  reducedSpacing = spacing * 0.6; // Zmenšený spacing jen mezi "I" a "N"

  textSize(spacing * 0.9);

  fill('#FCFCEC');
}

function checkDevice() {
  isMobile = windowWidth <= 768;
}

function draw() {
  if (!canvasReady) return;

  const color1 = color('#D7DA1B');
  const color2 = color('#FCFCEC');
  const lerpAmt = map(mouseY, 0, height, 0, 1);
  const lerpedColor = lerpColor(color1, color2, lerpAmt);

  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, color1.toString());
  grad.addColorStop(1, lerpedColor.toString());
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);

  let startY = windowHeight * 0.6 + sin(mouseY * 0.05) * 50;
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

  path = [];
  angleOffset = map(mouseX, 0, width, 0, TWO_PI);
  generateFullCircularPath(width / 2, height / 2, radius, 400, angleOffset);
  drawTextAlongPath(textToDraw, path);

  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function generateFullCircularPath(centerX, centerY, radius, resolution, angleStart) {
  let angleStep = TWO_PI / resolution;
  for (let i = 0; i < resolution; i++) {
    let angle = angleStart + angleStep * i;
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    path.push(createVector(x, y));
  }
}

function drawTextAlongPath(txt, path) {
  let distance = 0;
  let charIndex = 0;
  noStroke();
  fill('#FCFCEC');
  textStyle(BOLD);

  while (charIndex < txt.length && distance < getTotalPathLength()) {
    let currentChar = txt[charIndex];
    let nextChar = txt[charIndex + 1];

    let { pos, angle } = getPosAndAngleOnPath(distance);

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    text(currentChar, 0, 0);
    pop();

    // Pokud je aktuální písmeno "I" a následuje "N", zmenšíme spacing
    if (currentChar === 'I' && nextChar === 'N') {
      distance += reducedSpacing;
    } else {
      distance += spacing;
    }

    charIndex++;
  }
}

function getTotalPathLength() {
  let len = 0;
  for (let i = 1; i < path.length; i++) {
    len += p5.Vector.dist(path[i - 1], path[i]);
  }
  return len;
}

function getPosAndAngleOnPath(distance) {
  let dRemaining = distance;
  for (let i = 1; i < path.length; i++) {
    let p1 = path[i - 1];
    let p2 = path[i];
    let segmentLength = p5.Vector.dist(p1, p2);
    if (dRemaining <= segmentLength) {
      let inter = p5.Vector.lerp(p1, p2, dRemaining / segmentLength);
      let angle = atan2(p2.y - p1.y, p2.x - p1.x);
      return { pos: inter, angle };
    }
    dRemaining -= segmentLength;
  }
  return { pos: path[path.length - 1], angle: 0 };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
