const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

//----global variables-----
let activeTool = "pen";
let isFilled = false;
let color = "black";
let penSize = 5;
let isPainting = false;
let mouse = { x: 0, y: 0 };
let startX, startY, snapshot;

// ------------------Event listeners----------------
document
  .querySelectorAll(".mode")
  .forEach((mode) => mode.addEventListener("click", activateMode));
document
  .querySelectorAll(".color")
  .forEach((colorEl) => colorEl.addEventListener("click", selectColor));
document
  .querySelector(".customColor input")
  .addEventListener("input", selectCustomColor);
document.getElementById("lineWidth").addEventListener("input", changePenSize);
document.getElementById("fill").addEventListener("change", toggleFill);
document.getElementById("clearCanvas").addEventListener("click", clearCanvas);
document.getElementById("saveImg").addEventListener("click", saveAsImage);
// canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

function resizeCanvas() {
  canvas.width = window.innerWidth -500;
  canvas.height = window.innerHeight -100;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function activateMode(e) {
  document
    .querySelectorAll(".mode")
    .forEach((mode) => mode.classList.remove("active"));
  e.target.closest("li").classList.add("active");
  activeTool = e.target.closest("li").id.replace("Btn", "");
}

// default color
function selectColor(e) {
  color = e.target.style.backgroundColor;
}
// custom color
function selectCustomColor(e) {
  color = e.target.value;
}

function changePenSize(e) {
  penSize = e.target.value;
  document.getElementById("penSizeValue").innerText = penSize;
}

function toggleFill() {
  isFilled = !isFilled;
}

function getMousePosition(e) {
  // getting the position of canvas element relative to the viewport
  const rect = canvas.getBoundingClientRect();
  return {
    // ensure the mouse position is mapped to canvas even after resize
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function startDrawing(e) {
  isPainting = true;
  const pos = getMousePosition(e);
  startX = pos.x;
  startY = pos.y;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  // copying canvas data and passing it as snapshot value to avoid image dragging
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function stopDrawing() {
  isPainting = false;
  ctx.closePath();
}

function draw(e) {
  if (!isPainting) return;
  const pos = getMousePosition(e);
  ctx.linecap = "round";
  ctx.lineWidth = penSize;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  // adding canvas data
  ctx.putImageData(snapshot, 0, 0);

  switch (activeTool) {
    case "pen":
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      break;
    case "eraser":
      ctx.strokeStyle = "white";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      break;
    case "square":
      //-----------------------(x, y, width, height)
      if (isFilled) ctx.fillRect(pos.x, pos.y, startX - pos.x, startY - pos.y);
      else ctx.strokeRect(pos.x, pos.y, startX - pos.x, startY - pos.y);
      break;
    case "circle":
      // creates new path for circle
      ctx.beginPath();
      // getting radius according to mouse pointer
      let radius = Math.sqrt(
        Math.pow(startX - pos.x, 2) + Math.pow(startY - pos.y, 2)
      );
      // --------  arc(x, y, radius, startAngle, endAngle, counterclockwise)
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      if (isFilled) ctx.fill();
      else ctx.stroke();
      break;
    case "triangle":
        // creates new path for triangle
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineTo(startX * 2 - pos.x, pos.y);
      ctx.closePath();
      if (isFilled) ctx.fill();
      else ctx.stroke();
      break;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveAsImage() {
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = canvas.toDataURL();
  link.click();
}
