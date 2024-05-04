const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const square = document.getElementById("square");

window.addEventListener("load", () => {
  resize();
  document.addEventListener("mousedown", startPaint);
  document.addEventListener("mouseup", stopPaint);
  document.addEventListener("mousemove", sketch);
  document
    .getElementById("reset")
    .addEventListener("click", () => location.reload()); // reset canvas

  document
    .getElementById("customColor")
    .addEventListener("mouseout", customColor);
  document.getElementById("penRange").addEventListener("mouseout", penWidth);
  document
    .getElementById("eraserRange")
    .addEventListener("mouseout", eraserWidth);
  document
    .getElementById("eraser")
    .addEventListener("click", () => (isPenInUse = false));
  document
    .getElementById("pen")
    .addEventListener("click", () => (isPenInUse = true));
});

// initial mode = pen
let isPenInUse = true;
// stroke color
let color;
//stroke width for pen and eraser
let penLine;
let eraserLine;

// Stores the initial position of the cursor
let mouse = { x: 0, y: 0 };

// initial paint state
let paint = false;

// resize canvas on load
function resize() {
  canvas.width = window.innerWidth - 500;
  canvas.height = window.innerHeight - 100;
}

//custom color function
function customColor(e) {
  color = e.target.value;
}

// line width function for pen and eraser
function penWidth(e) {
  penLine = e.target.value;
}
function eraserWidth(e) {
  eraserLine = e.target.value;
}

// mouse position
function getPosition(e) {
  // position change on scroll
  if (window.scrollY >= 50) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    return;
  }
  mouse.x = e.clientX - canvas.offsetLeft;
  mouse.y = e.clientY - canvas.offsetTop;
}

function startPaint(e) {
  paint = true;
  getPosition(e);
}

function stopPaint() {
  paint = false;
}

// starts sketching
function sketch(e) {
  if (!paint) return;

  ctx.beginPath();
  ctx.lineCap = "round";

  // pen mode
  if (isPenInUse) {
    ctx.lineWidth = penLine;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = "source-over";
    ctx.moveTo(mouse.x, mouse.y);
    getPosition(e);
    ctx.lineTo(mouse.x, mouse.y);

    ctx.stroke();
  }
  // eraser mode
  else {
    ctx.lineWidth = eraserLine;
    ctx.globalCompositeOperation = "destination-out";
    ctx.moveTo(mouse.x, mouse.y);
    getPosition(e);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }
}

// -------------save as image-------------------------

// Convert canvas to image
document.getElementById('saveImg').addEventListener("click", function() {

  var dataURL = canvas.toDataURL("image/png");

  saveAsImg(dataURL, 'untitled.png');
});

// Save | Download image
function saveAsImg(data, filename = 'untitled.png') {
  var a = document.createElement('a');
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}
