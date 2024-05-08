const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

resize();
canvas.addEventListener("mousedown", () => {
  document.addEventListener("mousedown", startPaint);
  document.addEventListener("mouseup", stopPaint);
  document.addEventListener("mousemove", sketch);
  document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }); // clear canvas

  document
    .getElementById("customColor")
    .addEventListener("mouseleave", customColor);
  document.getElementById("range").addEventListener("mouseout", penWidth);

  document.getElementById("eraserBtn").addEventListener("click", () => {
    activeTool = "eraser";
  });
  document.getElementById("penBtn").addEventListener("click", () => {
    activeTool = "pen";
  });

  document.getElementById("squareBtn").addEventListener("click", () => {
    activeTool = "square";
  });
  document.getElementById("circleBtn").addEventListener("click", () => {
    activeTool = "circle";
  });
  document.getElementById("triangleBtn").addEventListener("click", () => {
    activeTool = "triangle";
  });
  document.getElementById("fillBtn").addEventListener("click", (e) => {
    isFilled = !isFilled;
    console.log(isFilled);
  });
});
canvas.addEventListener("click",()=>{
 prevX = mouse.x
prevY = mouse.y
})
let prevX 
  let prevY 
// initial active tool = pen
let activeTool = "pen";
//initial fill value
let isFilled = false;
// stroke color
let color = "";
//stroke width for pen and eraser
let penSize;
// let eraserLine;

// Stores the initial position of the cursor
let mouse = { x: 0, y: 0 };

// initial paint state
let paint = false;

// ----------------------resize canvas on load-----------------------
function resize() {
  canvas.width = window.innerWidth - 500;
  canvas.height = window.innerHeight - 100;
}

//------------------custom color function--------------------
function customColor(e) {
  color = e.target.value;
}

// -----------------line width function for pen and eraser-------------
function penWidth(e) {
  penSize = e.target.value;
  document.getElementById("penSizeValue").innerText = penSize; // display pen size
}

// -----------------mouse position--------------------
function getPosition(e) {
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

// ----------------------------starts sketching-----------------------
function sketch(e) {
  if (!paint) return;

  ctx.beginPath();
  // ctx.lineCap = "round";
  ctx.lineWidth = penSize;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  // pen mode
  if (activeTool === "pen") {
    ctx.globalCompositeOperation = "source-over";
    ctx.moveTo(mouse.x, mouse.y);
    getPosition(e);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }

  // square mode
  else if (activeTool === "square") {
    // alert(prevX+"::" +prevY)
    mouse.x > 300 || mouse.y > 300
      ? ctx.clearRect(
          mouse.x,
          mouse.y,
          e.offsetX + mouse.x,
          e.offsetY + mouse.y
        )
      : ctx.clearRect(
          mouse.x,
          mouse.y,
          e.offsetX - mouse.x,
          e.offsetY - mouse.y
        );
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    // mouse.x > prevX || mouse.y > prevY
    //   ? ctx.rect(mouse.x, mouse.y, e.offsetX - mouse.x, e.offsetY - mouse.y)
    //   : ctx.rect(mouse.x, mouse.y, e.offsetX + mouse.x, e.offsetY + mouse.y);
    ctx.rect(mouse.x, mouse.y, e.offsetX - mouse.x, e.offsetY - mouse.y);
    isFilled ? ctx.fill() : ctx.stroke(); // check if fill is active
  }
  // circle mode
  else if (activeTool === "circle") {
    ctx.globalCompositeOperation = "source-over";
    // ctx.clearCircle(mouse.x, mouse.y, e.offsetX - mouse.x, e.offsetY - mouse.y, 0, 2 * Math.PI);
    ctx.arc(
      mouse.x,
      mouse.y,
      e.offsetX - mouse.x,
      e.offsetY - mouse.y,
      0,
      2 * Math.PI
    );
    isFilled ? ctx.fill() : ctx.stroke(); // check if fill is active
  }
  // triangle mode
  else if (activeTool === "triangle") {
    ctx.globalCompositeOperation = "source-over";
    // ctx.clearCircle(mouse.x, mouse.y, e.offsetX - mouse.x, e.offsetY - mouse.y, 0, 2 * Math.PI);
    ctx.moveTo(mouse.x, mouse.y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(mouse.x * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    isFilled ? ctx.fill() : ctx.stroke(); // check if fill is active
  }
  // eraser mode
  else if (activeTool === "eraser") {
    // ctx.lineWidth = eraserLine;
    ctx.globalCompositeOperation = "destination-out";
    ctx.moveTo(mouse.x, mouse.y);
    getPosition(e);
    ctx.lineTo(mouse.x, mouse.y);
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
