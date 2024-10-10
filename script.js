const spring = document.getElementById('spring');
const mass = document.getElementById('mass');
const kInput = document.getElementById('k');
const massInput = document.getElementById('mass');
const amplitudeDisplay = document.getElementById('amplitude');
const velocityDisplay = document.getElementById('velocity');
const startButton = document.getElementById('start');
const energyChartCanvas = document.getElementById('energyChart');
const ctx = energyChartCanvas.getContext('2d');

let massPosition = 0; // posição inicial
let isDragging = false;
let massValue = 1;
let kValue = 10;

mass.addEventListener('dragstart', (event) => {
    isDragging = true;
});

mass.addEventListener('dragend', (event) => {
    isDragging = false;
    massPosition = parseFloat(mass.style.left || 0);
    updateResults();
});

document.addEventListener('dragover', (event) => {
    if (isDragging) {
        event.preventDefault();
    }
});

document.addEventListener('drop', (event) => {
    if (isDragging) {
        const offsetX = event.clientX - event.target.getBoundingClientRect().left;
        mass.style.left = `${Math.min(Math.max(offsetX - 15, 0), 370)}px`; // Limita a posição do mass
        updateResults();
    }
});

startButton.addEventListener('click', () => {
    massValue = parseFloat(massInput.value);
    kValue = parseFloat(kInput.value);
    updateResults();
});

function updateResults() {
    const displacement = parseFloat(mass.style.left) / 100; // distância em metros
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
    const springLength = 100; // comprimento da mola
    const springStartX = 20; // posição inicial da mola
    const springEndX = springStartX + displacement * 100; // posição final com base no deslocamento
    const springY = 50; // posição Y da mola

    const springCanvas = document.createElement('canvas');
    springCanvas.width = spring.clientWidth;
    springCanvas.height = spring.clientHeight;
    const springCtx = springCanvas.getContext('2d');

    // Desenha a mola
    springCtx.clearRect(0, 0, springCanvas.width, springCanvas.height);
    springCtx.beginPath();
    springCtx.moveTo(springStartX, springY);
    for (let i = 0; i <= springLength; i += 10) {
        const offsetY = (i % 20 === 0) ? 10 : -10; // cria a forma da mola
        springCtx.lineTo(springStartX + i, springY + offsetY);
    }
    springCtx.lineTo(springEndX, springY);
    springCtx.strokeStyle = 'black';
    springCtx.stroke();

    // Desenha a massa
    springCtx.fillStyle = 'red';
    springCtx.fillRect(springEndX - 15, springY - 15, 30, 30); // massa como um quadrado

    // Adiciona a imagem da mola ao DOM
    spring.innerHTML = ''; // Limpa a área da mola
    spring.appendChild(springCanvas);
}

// Inicializa a posição da massa
mass.style.left = '0px';
drawSpringAndMass(0);
