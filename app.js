const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let activeTool = "pen";
let isFilled = false;
let color = "black";
let penSize = 5;
let isPainting = false;
let mouse = { x: 0, y: 0 };
let startX, startY;

// Event listeners
document.querySelectorAll(".mode").forEach(mode => mode.addEventListener("click", activateMode));
document.querySelectorAll(".color").forEach(colorEl => colorEl.addEventListener("click", selectColor));
document.querySelector(".customColor input").addEventListener("input", selectCustomColor);
document.getElementById("lineWidth").addEventListener("input", changePenSize);
document.getElementById("fill").addEventListener("change", toggleFill);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);
document.getElementById("clearCanvas").addEventListener("click", clearCanvas);
document.getElementById("saveImg").addEventListener("click", saveAsImage);

function resizeCanvas() {
    canvas.width = window.innerWidth - 500;
    canvas.height = window.innerHeight - 100;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function activateMode(e) {
    document.querySelectorAll(".mode").forEach(mode => mode.classList.remove("active"));
    e.target.closest("li").classList.add("active");
    activeTool = e.target.closest("li").id.replace("Btn", "");
}

function selectColor(e) {
    color = e.target.style.backgroundColor;
}

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
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

function startDrawing(e) {
  isPainting = true;
  const pos = getMousePosition(e);
  startX = pos.x;
  startY = pos.y;
  ctx.beginPath();
}

function stopDrawing() {
  isPainting = false;
  ctx.closePath();
}

function draw(e) {
  if (!isPainting) return;
  const pos = getMousePosition(e);
  ctx.linecap ="round"
    ctx.lineWidth = penSize;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

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
    }
}

function drawShape(type, x, y, size) {
    ctx.beginPath();
    switch (type) {
        case "square":
            if (isFilled) ctx.fillRect(x, y, size, size);
            else ctx.strokeRect(x, y, size, size);
            break;
        case "circle":
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            if (isFilled) ctx.fill();
            else ctx.stroke();
            break;
        case "triangle":
            ctx.moveTo(x, y);
            ctx.lineTo(x + size / 2, y + size);
            ctx.lineTo(x - size / 2, y + size);
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

// Shape buttons
document.querySelector(".square").addEventListener("click", () => drawShape("square", mouse.x, mouse.y, 500));
document.querySelector(".circle").addEventListener("click", () => drawShape("circle", startX, startY, 100));
document.querySelector(".triangle").addEventListener("click", () => drawShape("triangle", startX, startY, 100));
