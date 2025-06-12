let stripes = [];           // Array to store all LineStripe objects
let currentStripe = 0;      // Index of the current stripe being animated
let mode = 1;               // Drawing mode: 0 = cross pattern, 1 = parallel lines
let index = 0;              // Index to track drawing progress within a stripe

let mic;                    // Microphone input
let micLevel;               // Level from the microphone


function setup() {
  let cnv = createCanvas(windowWidth, windowHeight); // Create canvas the size of the window
  angleMode(DEGREES);                                // Use degrees for angle calculations
  background(240, 240, 225);                         // Set background color

  // Define ranges for stripe placement
  let rangeX = windowWidth / 2;
  let rangeY = windowHeight / 2;
  let rangeLength = windowWidth * 0.6;

  // Define base angles depending on drawing mode
  let baseAngles;
  if (mode == 0) {
    baseAngles = [0, 90, -90]; // Cross pattern
  } else if (mode == 1) {
    baseAngles = [0];          // Horizontal lines only
  }

  // Generate 100 stripes depending on mode
  for (let i = 0; i < 100; i++) {
    stripes.push(new LineStripe(
      mode === 1 ? random(-width/2, 0) : random(-width/2, width/2),  // x position
      i * 30 - height/3,                                             // y position
      random(mode === 1 ? 200 : 100, rangeLength),                   // length
      random(4, 12),                                                 // spacing
      floor(random(mode === 1 ? 1 : 1, mode === 1 ? 5 : 3)),         // line count
      random(baseAngles),                                           // angle
      random(0.1, 1)                                                // stroke weight
    ));
  }
  
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  translate(width / 2, height / 2); // Center the coordinate system
  
  // Calculate opacity based on mic input
  opacity = map(mic.getLevel(),0,0.2,30,230);
  
  // Animate one stripe at a time
  if (currentStripe < stripes.length) {
    stripes[currentStripe].displayStep();
    if (stripes[currentStripe].done) {
      currentStripe++;
    }
  } else {
    noLoop(); // Stop the loop when all stripes are finished
  }

  drawModeButton();  // Draw toggle button for drawing mode
}

// Draw button to switch drawing mode
function drawModeButton() {
  push();
  resetMatrix(); // Reset transform so button is drawn in screen coords
  let margin = 0.025 * min(width, height); 
  let btnW = 0.25 * width;   
  let btnH = 0.06 * height;  
  let x = margin;
  let y = height - btnH - margin;

  fill(255, 230, 180, 220);
  stroke(120);
  strokeWeight(2);
  rect(x, y, btnW, btnH, 12);

  fill(60);
  noStroke();
  textSize(btnH * 0.45);
  textAlign(CENTER, CENTER);
  text(
    mode === 1 ? "Switch to cross" : "Switch to parallel",
    x + btnW / 2,
    y + btnH / 2
  );
  pop();
}


// Handle mouse press to toggle mode/sound mode
function mousePressed() {
  let margin = 0.025 * min(width, height);
  let btnW = 0.25 * width;
  let btnH = 0.06 * height;
  let x = margin;
  let y = height - btnH - margin;

  // Check if drawing mode button clicked
  if (
    mouseX >= x && mouseX <= x + btnW &&
    mouseY >= y && mouseY <= y + btnH
  ) {
    mode = mode === 1 ? 0 : 1;
    stripes = [];
    currentStripe = 0;
    loop();
    setup();
    loop();
  }
  
}

// Resize canvas and regenerate when window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
  background(240, 240, 225); 
  stripes = [];
  currentStripe = 0;
  setup(); 
  loop();
}

// Class representing one group of lines (stripe)
class LineStripe {
  constructor(x, y, len, spacing, count, angle, baseWeight) {   
    this.x = x;                  // Position x
    this.y = y;                  // Position y
    this.len = len;              // Total line length
    this.spacing = spacing;      // Spacing between lines
    this.count = count;          // Number of lines in this stripe
    this.angle = angle;          // Angle to rotate lines
    this.baseWeight = baseWeight; // Base stroke weight
    this.lines = [];             // Store individual line details
    this.done = false;           // Whether the stripe animation is complete
    this.currentLen = 0;         // Current animated length
    this.gray = 100;             // Base grayscale color

    // Create parameters for each individual line
    for (let i = 0; i < this.count; i++) {
      let offsetY = i * this.spacing;
      let opacity = random(2, 100);
      let weight = this.baseWeight + random(-0.1, 0.5);
      this.lines.push({ offsetY, opacity, weight });
    }
  }

  // Step-by-step display method (animation)
  displayStep() {
    push();
    translate(this.x, this.y);
    rotate(-this.angle);

    let l = this.lines[index];
      
    
    noStroke();
    fill(this.gray, opacity);
    
    // Calculate point size based on mic input
    let volume = mic.getLevel();
    ellipse(this.currentLen + index * 10, index * 10, 60 * volume, 60 * volume);
    
    // Animate the line growing until it reaches target length
    if (this.currentLen < this.len) {
      this.currentLen += 2;
    } else {
      index += 1;
      this.currentLen = 0;
      if (index >= this.count) {
        index = 0;
        this.done = true; // Mark as done so draw() moves to next stripe
      }
    }
    pop();
  }
}