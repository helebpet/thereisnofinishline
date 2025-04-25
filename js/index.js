let offset = 0;
let lineSpacing = 20;
let cursorDiv;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();

  cursorDiv = select('.custom-cursor');

  const container = createDiv().addClass('centered-wrapper');
  createP('THERE IS NO<br>FINISH LINE.').addClass('main-text').parent(container);
  createP("Nike's 1977 Campaign").addClass('subtext').parent(container);
  createA('page1.html', 'ENTER').addClass('enter-button').parent(container);
}

function draw() {
  const color1 = color('#FCFCEC'); // light cream
  const color2 = color('#D7DA1B'); // yellow-green

  const lerpAmt = map(mouseY, 0, height, 0, 1);
  const lerpedColor = lerpColor(color1, color2, lerpAmt);

  const grad = drawingContext.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, color1.toString());
  grad.addColorStop(1, lerpedColor.toString());
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(0, 0, width, height);

  drawLines();
  cursorDiv.position(mouseX, mouseY);
}

function drawLines() {
  stroke('#000');
  strokeWeight(1);

  offset -= 0.2;
  if (offset <= -lineSpacing) offset += lineSpacing;

  for (let y = offset; y < height; y += lineSpacing) {
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
