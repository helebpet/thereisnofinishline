let bgImage;
let cursorDiv;
let canvasReady = false;

let currentLine = 0;
let lineProgress = 0;

function preload() {
  bgImage = loadImage('img/page1.jpg',
    () => {
      console.log("Image loaded successfully.");
      canvasReady = true;
      select('#loader').hide(); // hide loading screen
    },
    (err) => console.error("Image failed to load:", err)
  );
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'none'); // hide canvas initially
  frameRate(60);
  noCursor();

  cursorDiv = select('.custom-cursor');
}

function draw() {
  if (!canvasReady) return;

  let cnv = select('canvas');
  if (cnv && cnv.style('display') === 'none') {
    cnv.style('display', 'block'); // show canvas once image is ready
  }

  // Draw background
  image(bgImage, 0, 0, width, height);

  // Draw animated black lines
  stroke(0);
  strokeWeight(1);

  for (let y = 0; y < currentLine * 10; y += 10) {
    line(0, y, width, y);
  }

  let y = currentLine * 10;
  if (y < height) {
    line(0, y, lineProgress, y);
    lineProgress += 10;

    if (lineProgress >= width) {
      currentLine++;
      lineProgress = 0;
    }
  }

  // Move custom cursor
  if (cursorDiv) {
    cursorDiv.position(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
