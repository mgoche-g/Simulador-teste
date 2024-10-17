// Constantes
const k = 0.5; // Constante da mola (N/m)
const mass = 1.0; // Massa (kg)
const damping = 0.05; // Coeficiente de amortecimento

// Variáveis de estado
let position = 1.0; // Posição inicial (m)
let velocity = 0.0; // Velocidade inicial (m/s)
let timeStep = 0.1; // Passo de tempo (s)
let amplitude = 1.0; // Amplitude inicial (m)
const frequency = Math.sqrt(k / mass) / (2 * Math.PI); // Frequência (Hz)

// Elementos DOM
const massElement = document.getElementById('mass');
const springElement = document.getElementById('spring');
const amplitudeElement = document.getElementById('amplitude');
const frequencyElement = document.getElementById('frequency');
const velocityElement = document.getElementById('velocity');
const containerHeight = document.getElementById('container').clientHeight;
const initialBottom = parseFloat(getComputedStyle(massElement).bottom);

// Função para atualizar o sistema
function updateSystem() {
  let force = -k * position - damping * velocity; // Força resultante
  let acceleration = force / mass; // Aceleração (F = m * a)

  // Atualiza velocidade e posição
  velocity += acceleration * timeStep;
  position += velocity * timeStep;

  // Atualiza posição do elemento gráfico
  let newBottom = initialBottom + (position * 100); // Converte metros para pixels
  massElement.style.bottom = `${newBottom}px`;

  // Atualiza altura e posição da mola
  let newHeight = containerHeight - newBottom - massElement.clientHeight;
  springElement.style.height = `${newHeight}px`;
  springElement.style.top = `${newBottom + massElement.clientHeight}px`;

  // Atualiza amplitude (valor absoluto da posição)
  amplitude = Math.max(amplitude, Math.abs(position));

  // Atualiza elementos de informação
  amplitudeElement.textContent = amplitude.toFixed(2);
  frequencyElement.textContent = frequency.toFixed(2);
  velocityElement.textContent = velocity.toFixed(2);
}

// Simulação
setInterval(() => {
  updateSystem();
  console.log(`Posição: ${position.toFixed(2)} m, Velocidade: ${velocity.toFixed(2)} m/s`);
}, timeStep * 1000);

// Inicializa elementos de informação
frequencyElement.textContent = frequency.toFixed(2);
amplitudeElement.textContent = amplitude.toFixed(2);
