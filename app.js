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
  document.getElementById("range").addEventListener("mouseout", penWidth);

  document.getElementById("eraser").addEventListener("click", () => {
    isPenInUse = false;
    isSquare = false;
  });
  document.getElementById("pen").addEventListener("click", () => {
    isPenInUse = true;
    isSquare = false;
  });

  document.getElementById("square").addEventListener("click", () => {
    isSquare = true;
    isPenInUse = false;
  });
});

let isSquare = false;
// initial mode = pen
let isPenInUse = true;
// stroke color
let color;
//stroke width for pen and eraser
let penSize;
// let eraserLine;

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
  penSize = e.target.value;
}
// function eraserWidth(e) {
//   eraserLine = e.target.value;
// }

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
  ctx.lineWidth = penSize;

  ctx.strokeStyle = color;
  // pen mode
  if (isPenInUse === true && isSquare === false) {
    ctx.globalCompositeOperation = "source-over";
    ctx.moveTo(mouse.x, mouse.y);
    getPosition(e);
    ctx.lineTo(mouse.x, mouse.y);

    ctx.stroke();
  }
  // eraser mode
  else if (isPenInUse === false && isSquare === false) {
    // ctx.lineWidth = eraserLine;
    ctx.globalCompositeOperation = "destination-out";
    ctx.moveTo(mouse.x, mouse.y);
    getPosition(e);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }
  // square mode
  else if (isPenInUse === false && isSquare === true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.rect(mouse.x, mouse.y, e.offsetX - mouse.x, e.offsetY - mouse.y);
    ctx.stroke();
  }
}

// -------------save as image-------------------------

// Convert canvas to image
document.getElementById("saveImg").addEventListener("click", function () {
  var dataURL = canvas.toDataURL("image/png");

  saveAsImg(dataURL, "untitled.png");
});

// Save | Download image
function saveAsImg(data, filename = "untitled.png") {
  var a = document.createElement("a");
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}
