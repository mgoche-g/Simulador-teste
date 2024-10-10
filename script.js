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
let isAnimating = false;
let massValue = 1;
let kValue = 10;
let amplitude = 0.5; // amplitude em metros
let angularFrequency = 0; // frequência angular
let startTime = 0;

const massDiv = document.getElementById('massDiv');
massDiv.style.width = '30px';
massDiv.style.height = '30px';
massDiv.style.backgroundColor = 'red';
massDiv.style.borderRadius = '50%';
massDiv.style.position = 'absolute';
massDiv.style.left = '0px';
massDiv.style.top = '80px'; // Ajuste a posição Y da massa

massDiv.addEventListener('mousedown', () => {
    isAnimating = false;
});

document.addEventListener('mouseup', () => {
    isAnimating = false;
});

document.addEventListener('mousemove', (event) => {
    if (!isAnimating) {
        const rect = springCanvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        massPosition = Math.min(Math.max(offsetX - 15, 0), springCanvas.width - 30); // Limita a posição da massa
        massDiv.style.left = `${massPosition}px`;
        updateResults();
    }
});

startButton.addEventListener('click', () => {
    massValue = parseFloat(massInput.value);
    kValue = parseFloat(kInput.value);
    amplitude = parseFloat(massPosition / 100); // Use a posição inicial como amplitude
    angularFrequency = Math.sqrt(kValue / massValue);
    startTime = performance.now();
    isAnimating = true;
    animate();
});

function updateResults() {
    const displacement = massPosition / 100; // distância em metros
    const amplitude = Math.abs(displacement);
    const velocity = Math.sqrt((kValue / massValue) * amplitude); // v = √(k/m) * A

    amplitudeDisplay.textContent = amplitude.toFixed(2);
    velocityDisplay.textContent = velocity.toFixed(2);

    drawEnergyChart(amplitude, velocity);
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

function animate() {
    if (isAnimating) {
        const currentTime = performance.now();
        const elapsedTime = (currentTime - startTime) / 1000; // tempo em segundos
        massPosition = amplitude * 100 * Math.sin(angularFrequency * elapsedTime); // MHS: A * sen(ωt)
        massDiv.style.left = `${massPosition + 20}px`; // Ajusta a posição da massa
        drawSpringAndMass(massPosition / 100);
        requestAnimationFrame(animate);
    }
}

// Inicializa a posição da massa
massDiv.style.left = '20px'; // Ajusta para que a massa comece na posição correta
drawSpringAndMass(0);
