const kInput = document.getElementById('k');
const massInput = document.getElementById('mass');
const amplitudeDisplay = document.getElementById('amplitude');
const velocityDisplay = document.getElementById('velocity');
const startButton = document.getElementById('start');
const energyChartCanvas = document.getElementById('energyChart');
const ctx = energyChartCanvas.getContext('2d');

const springCanvas = document.getElementById('springCanvas');
const springCtx = springCanvas.getContext('2d');

let massPosition = 0; // posição inicial
let isDragging = false;
let massValue = 1;
let kValue = 10;

const massDiv = document.getElementById('massDiv');
massDiv.style.width = '30px';
massDiv.style.height = '30px';
massDiv.style.backgroundColor = 'red';
massDiv.style.borderRadius = '50%';
massDiv.style.position = 'absolute';
massDiv.style.left = '0px';

massDiv.addEventListener('mousedown', (event) => {
    isDragging = true;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const rect = springCanvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        massPosition = Math.min(Math.max(offsetX - 15, 0), springCanvas.width - 30);
        massDiv.style.left = `${massPosition}px`;
        updateResults();
    }
});

startButton.addEventListener('click', () => {
    massValue = parseFloat(massInput.value);
    kValue = parseFloat(kInput.value);
    updateResults();
});

function updateResults() {
    const displacement = massPosition / 100; // distância em metros
    const amplitude = Math.abs(displacement);
    const velocity = Math.sqrt((kValue / massValue) * amplitude); // v = √(k/m) * A

    amplitudeDisplay.textContent = amplitude.toFixed(2);
    velocityDisplay.textContent = velocity.toFixed(2);

    drawEnergyChart(amplitude, velocity);
    drawSpringAndMass(displacement);
}

function drawEnergyChart(amplitude, velocity) {
    ctx.clearRect(0, 0, energyChartCanvas.width, energyChartCanvas.height);
    
    const potentialEnergy = 0.5 * kValue * Math.pow(amplitude, 2);
    const kineticEnergy = 0.5 * massValue * Math.pow(velocity, 2);
    
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, energyChartCanvas.height - potentialEnergy, 100, potentialEnergy);
    
    ctx.fillStyle = 'green';
    ctx.fillRect(150, energyChartCanvas.height - kineticEnergy, 100, kineticEnergy);
    
    ctx.fillStyle = 'black';
    ctx.fillText('Energia Potencial', 10, energyChartCanvas.height - potentialEnergy - 10);
    ctx.fillText('Energia Cinética', 160, energyChartCanvas.height - kineticEnergy - 10);
}

function drawSpringAndMass(displacement) {
    springCtx.clearRect(0, 0, springCanvas.width, springCanvas.height);
    
    const springY = 100; // posição Y da mola

    // Desenha a mola
    springCtx.beginPath();
    springCtx.moveTo(20, springY);
    for (let i = 0; i <= 100; i += 10) {
        const offsetY = (i % 20 === 0) ? 10 : -10; // cria a forma da mola
        springCtx.lineTo(20 + i, springY + offsetY);
    }
    springCtx.lineTo(20 + displacement * 100, springY);
    springCtx.strokeStyle = 'black';
    springCtx.stroke();

    // Desenha a massa
    springCtx.fillStyle = 'red';
    springCtx.fillRect(20 + displacement * 100 - 15, springY - 15, 30, 30); // massa como um quadrado
}

// Inicializa a posição da massa
massDiv.style.left = '0px';
drawSpringAndMass(0);
