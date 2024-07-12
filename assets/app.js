const
    canvas = document.querySelector('canvas'), ctx = canvas.getContext("2d"),
    toolBtns = document.querySelectorAll('.tool'), fillColor = document.querySelector('#fill-color'),
    sizeSlider = document.getElementById('size-slider'),
    colorBtns = document.querySelectorAll('.colors .option'),
    colorPicker = document.querySelector('#color-picker'),
    clearCanvas = document.querySelector('.clear-canvas'),
    saveImg = document.querySelector('.save-img');

// Settings
let 
    isDrawing = false, 
    prevMouseX, 
    prevMouseY, 
    snapshot, 
    selectedTool = "brush", 
    brushWidth = 5,
    selectedColor = '#000000';

// Set canvas width programmatically else pointer don't work properly
window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackgroundColor();
})

// Tools functionality
toolBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;

        console.log(selectedTool)
    })
})

//Colors Btns & color picker functionality
colorPicker.addEventListener('change', function () {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
})

colorBtns.forEach((btn) => {

    btn.addEventListener('click', function () {
        document.querySelector('.colors .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color');
    })
})

// Clear canvas functionality

clearCanvas.addEventListener('click', function () {
    ctx.clearRect(0,0, canvas.width, canvas.height);
})
    
// Save canvas as image
saveImg.addEventListener('click', function () {
    const downloadLink = document.createElement('a');
    downloadLink.download = `${Date.now()}.jpg`;
    downloadLink.href = canvas.toDataURL();
    downloadLink.click();
})

// Listen event and set handler
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mousemove', drawing);
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);
function startDraw(e) {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Start drawing and enable new settings
function drawing(e) {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)
    if (selectedTool === "brush" || selectedTool === 'eraser') {

        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e)
    }
}

// End drawing
function endDraw() {
    isDrawing = false;
}

//set canvas background color
function setCanvasBackgroundColor() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}


// Draw filled & stroked rectangle
function drawRect(e) {

    if (fillColor.checked) {
        ctx.fillRect(e.offsetX, e.offsetY, (prevMouseX - e.offsetX), (prevMouseY - e.offsetY));
    } else {
        ctx.strokeRect(e.offsetX, e.offsetY, (prevMouseX - e.offsetX), (prevMouseY - e.offsetY));
    }
}

// draw the stroked & fill circle
function drawCircle(e) {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

// Draw filled or stroke triangle
function drawTriangle(e) {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

