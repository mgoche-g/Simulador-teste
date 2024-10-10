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
