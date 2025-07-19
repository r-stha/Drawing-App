let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let pencilBtn = document.getElementById("pencil");
let circleBtn = document.getElementById("circle");
let rectangleBtn = document.getElementById("rectangle");
let triangleBtn = document.getElementById("triangle");
let squareBtn = document.getElementById("square");
let lineBtn = document.getElementById("line");
let color = document.getElementById("inputColor");
let eraserBtn = document.getElementById("eraser");
let downloadBtn = document.getElementById("download");
let uploadBtn = document.getElementById("upload")

let isDrawing = false;
let prevX = 0;
let prevY = 0;
let selectedTool = "pencil";
let snapshot;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


function getXY(e) {
    if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            x: e.offsetX,
            y: e.offsetY
        };
    }
}

const startDrawing = (e) => {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getXY(e);
    [prevX, prevY] = [x, y];
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.strokeStyle = color.value;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.beginPath();
};

const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;


    const { x, y } = getXY(e);
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "pencil") {
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (selectedTool === "circle") {
        const radius = Math.hypot(prevX - x, prevY - y);
        ctx.beginPath();
        ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        const width = prevX - x;
        const height = prevY - y;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
    } else if (selectedTool === "triangle") {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.lineTo(2 * prevX - x, y);
        ctx.closePath();
        ctx.stroke();
    } else if (selectedTool === "square") {
        const side = prevX - x;
        ctx.beginPath();
        ctx.rect(x, y, side, side);
        ctx.stroke();
    } else if (selectedTool === "line") {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (selectedTool == "eraser") {


        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 20;
        ctx.lineTo(x, y);
        ctx.stroke();
        [prevX, prevY] = [x, y];
    }
};

const setActiveTool = (tool) => {
    selectedTool = tool;
    document.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("bg-red-500");
    });
    document.getElementById(tool).classList.add("bg-red-500");
    if (tool === "eraser") {
        canvas.style.cursor = 'url("Image/image.png") ,auto';
    } else {
        canvas.style.cursor = 'crosshair';
        ctx.lineWidth = 1;
    }
};


pencilBtn.addEventListener("click", () => setActiveTool("pencil"));
circleBtn.addEventListener("click", () => setActiveTool("circle"));
rectangleBtn.addEventListener("click", () => setActiveTool("rectangle"));
triangleBtn.addEventListener("click", () => setActiveTool("triangle"));
squareBtn.addEventListener("click", () => setActiveTool("square"));
lineBtn.addEventListener("click", () => setActiveTool("line"));
eraserBtn.addEventListener("click", () => setActiveTool("eraser"));

downloadBtn.addEventListener("click", () => {
    let tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.fillStyle = "#fff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(canvas, 0, 0);


    let a = document.createElement("a");
    a.download = `image.jpg`;
    a.href = tempCanvas.toDataURL();
    a.click();
    console.log("clicked")
});

uploadBtn.addEventListener("click", ()=>{
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.addEventListener("change", (e)=>{ 
    const file = e.target.files[0];
    if(!file) return;

    const image = new Image();

    image.onload = ()=>{
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(image,0,0);
    }
    image.src=URL.createObjectURL(file);
})

});



canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);


canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);

