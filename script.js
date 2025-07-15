let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let pencilBtn = document.getElementById("pencil");
let circleBtn = document.getElementById("circle");
let rectangleBtn = document.getElementById("rectangle");
let triangleBtn = document.getElementById("triangle");
let squareBtn = document.getElementById("square");
let lineBtn = document.getElementById("line");
let color =document.getElementById("inputColor");


let isDrawing = false;
let prevX = 0;
let prevY = 0;
let selectedTool = "pencil";
let snapshot;
let active = false;


canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let pencilMode = false;

const startDrawing = (e) => {
    isDrawing = true;
    [prevX, prevY] = [e.offsetX, e.offsetY];
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.strokeStyle = color.value;

    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.beginPath();
};




const setActiveTool = (tool) => {
    selectedTool = tool;

    document.querySelectorAll("button").forEach(btn => {
        btn.classList.remove("bg-red-500")
    })

    document.getElementById(tool).classList.add("bg-red-500");
}



const draw = (e) => {
    if (!isDrawing) return;

    ctx.putImageData(snapshot, 0, 0)

    if (selectedTool == "pencil") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool == "circle") {
        const radius = Math.sqrt(Math.pow((prevX - e.offsetX), 2) + Math.pow((prevY - e.offsetY), 2));
        ctx.beginPath();
        ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    } else if (selectedTool == "rectangle") {
        width = prevX - e.offsetX;
        height = prevY - e.offsetY
        ctx.beginPath();
        ctx.rect(e.offsetX, e.offsetY, width, height);
        ctx.stroke();
    } else if (selectedTool == "triangle") {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY); //For A
        ctx.lineTo(e.offsetX, e.offsetY); // For B
        ctx.lineTo(2 * prevX - e.offsetX, e.offsetY); // For C
        ctx.closePath();
        ctx.stroke();
    } else if (selectedTool == "square") {
        sideLength = prevX - e.offsetX
        ctx.beginPath();
        ctx.rect(e.offsetX, e.offsetY, sideLength, sideLength);
        ctx.stroke();
    }
    else if (selectedTool == "line") {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke();
    }
};

pencilBtn.addEventListener("click", () => setActiveTool("pencil"));
circleBtn.addEventListener("click", () => setActiveTool("circle"));
rectangleBtn.addEventListener("click", () => setActiveTool("rectangle"));
triangleBtn.addEventListener("click", () => setActiveTool("triangle"));
squareBtn.addEventListener("click", () => setActiveTool("square"));
lineBtn.addEventListener("click", () => setActiveTool("line"));

canvas.addEventListener("mousedown", (e) => {
    startDrawing(e);

});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
