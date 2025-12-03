/* ARQUIVO: script.js */

// --- ESTADO DO JOGO --- //
let rollCount = 0; 
let isRolling = false;
let currentOpenApp = null;

// Elementos (podem ser null dependendo da página)
const d20Icon = document.getElementById('d20-icon');
const d20Result = document.getElementById('d20-result');
const diceContainer = document.getElementById('destiny-dice-container');
const uglyOverlay = document.getElementById('ugly-overlay');
const critOverlay = document.getElementById('crit-overlay');
const chaosPage = document.getElementById('page-chaos');
const appRoot = document.getElementById('app-root');

// --- LÓGICA DO DADO (Só roda na index.html) --- //

function rollDestiny() {
    if (isRolling) return;
    isRolling = true;
    
    d20Result.style.opacity = '0';
    d20Icon.style.opacity = '1';
    d20Icon.classList.add('rolling');
    
    setTimeout(() => {
        d20Icon.classList.remove('rolling');
        let roll;
        
        // Rigged Logic
        if (rollCount < 2) roll = Math.floor(Math.random() * 19) + 1; 
        else if (rollCount === 2) roll = 20; 
        else roll = Math.floor(Math.random() * 20) + 1;
        
        rollCount++;
        d20Icon.style.opacity = '0.2';
        d20Result.innerText = roll;
        d20Result.style.opacity = '1';

        setTimeout(() => {
            if (roll === 20) {
                triggerCriticalSuccess();
            } else {
                triggerChaosMode(roll);
            }
            isRolling = false;
        }, 800);
    }, 1000);
}

function triggerCriticalSuccess() {
    // 1. Mostra animação de sucesso
    uglyOverlay.style.opacity = "0";
    setTimeout(() => uglyOverlay.style.display = "none", 500);
    
    critOverlay.classList.remove('hidden');
    critOverlay.style.opacity = '1';
    initConfetti(); // Chama a chuva de confetes

    diceContainer.style.opacity = '0';

    // 2. SALVA O TOKEN DE ACESSO
    sessionStorage.setItem('acessoPermitido', 'true');

    // 3. REDIRECIONA PARA O DASHBOARD (Após 2.5s) - Interface Perfeita!
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 2500);
}

function triggerChaosMode(roll) {
    uglyOverlay.style.opacity = "0";
    setTimeout(() => uglyOverlay.style.display = "none", 1500);
    
    diceContainer.style.opacity = '0';
    setTimeout(() => diceContainer.style.display = 'none', 500);

    appRoot.classList.remove('hidden');
    document.getElementById('page-chaos').classList.remove('hidden-page');
    document.getElementById('nav-pill').classList.remove('hidden');
    document.getElementById('version-label').innerText = `Chaos (Roll: ${roll})`;
    
    generateChaosContent(roll);
}

function resetDice() {
    // Apenas rola novamente sem resetar para tela inicial
    if (isRolling) return;
    rollDestiny();
}

function generateChaosContent(roll) {
    // Gera apenas uma mensagem de erro simples para o Chaos Mode
    chaosPage.innerHTML = `
        <div class="w-full max-w-2xl mx-auto bg-red-500/20 border border-red-500/50 p-6 rounded-lg text-center mt-20">
            <h3 class="text-red-400 font-bold text-xl mb-4">⚠ GLITCH DETECTED ⚠</h3>
            <p class="text-white/80 font-mono mb-4">O sistema falhou ao carregar a interface (Roll: ${roll}).</p>
            <p class="text-yellow-400 font-bold animate-pulse">Tente rolar novamente!</p>
        </div>
    `;
}


// --- LÓGICA DO DASHBOARD (V3) --- //
// Funções movidas para dashboard.html

// --- UTILITÁRIOS --- //

function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    
    for(let i=0; i<300; i++) {
        particles.push({
            x: canvas.width/2, y: canvas.height/2,
            vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 2
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.size *= 0.99; 
            ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size);
            if(p.size < 0.5) particles.splice(index, 1);
        });
        if(particles.length > 0) requestAnimationFrame(draw);
    }
    draw();
}

function createDraggableMarquee(container, initialSpeed) {
    if (!container) return;
    const content = container.querySelector('.marquee-content');
    if(!content) return;
    
    const items = Array.from(content.children);
    if(items.length === 0) return;
    items.forEach(child => content.appendChild(child.cloneNode(true))); // Duplica para loop

    let xPos = 0;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;

    function animate() {
        if(!document.body.contains(container)) return; // Para se o elemento sumir
        if (!isDragging) xPos += initialSpeed;
        
        // Loop infinito simples
        if (Math.abs(xPos) >= content.scrollWidth / 2) xPos = 0;
        
        content.style.transform = `translate3d(${xPos}px, 0, 0)`;
        requestAnimationFrame(animate);
    }

    container.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; container.style.cursor = 'grabbing'; });
    window.addEventListener('mousemove', e => { if(isDragging) { const delta = e.clientX - lastX; xPos += delta * 1.5; lastX = e.clientX; }});
    window.addEventListener('mouseup', () => { isDragging = false; container.style.cursor = 'grab'; });
    
    requestAnimationFrame(animate);
}