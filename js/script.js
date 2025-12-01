/* ARQUIVO: script.js */

// --- ESTADO DO JOGO --- //
let rollCount = 0; 
let isRolling = false;
let currentOpenApp = null; // Rastreia o app aberto na V3

const uglyOverlay = document.getElementById('ugly-overlay');
const appRoot = document.getElementById('app-root');
const d20Icon = document.getElementById('d20-icon');
const d20Result = document.getElementById('d20-result');
const diceContainer = document.getElementById('destiny-dice-container');
const chaosPage = document.getElementById('page-chaos');
const critOverlay = document.getElementById('crit-overlay');

// Fontes para o Frankenstein
const sources = {
    headers: ['source-v1-header', 'source-v2-header'],
    bodies: ['template-certificados', 'template-projetos', 'template-sobre'],
    footers: ['source-v3-dock']
};

function rollDestiny() {
    if (isRolling) return;
    isRolling = true;
    d20Result.style.opacity = '0';
    d20Icon.style.opacity = '1';
    d20Icon.classList.add('rolling');
    
    setTimeout(() => {
        d20Icon.classList.remove('rolling');
        let roll;
        
        // Lógica de "Sorte Forçada"
        if (rollCount < 2) {
            // Nas 2 primeiras rolagens, garante erro (nunca 20)
            roll = Math.floor(Math.random() * 19) + 1; 
        } else if (rollCount === 2) {
            // Na 3ª rolagem, garante sucesso (20)
            roll = 20; 
        } else {
            // Da 4ª em diante, sorte real (1-20)
            roll = Math.floor(Math.random() * 20) + 1;
        }
        
        rollCount++;
        d20Icon.style.opacity = '0.2';
        d20Result.innerText = roll;
        d20Result.style.opacity = '1';

        setTimeout(() => {
            revealDestiny(roll);
            isRolling = false;
        }, 800);
    }, 1000);
}

function revealDestiny(roll) {
    uglyOverlay.style.opacity = "0";
    setTimeout(() => uglyOverlay.style.display = "none", 1000);
    appRoot.classList.remove('hidden');

    if (roll === 20) {
        triggerCriticalSuccess();
    } else {
        triggerChaosMode(roll);
    }
}

function triggerCriticalSuccess() {
    // Overlay de Sucesso
    critOverlay.classList.remove('hidden');
    critOverlay.style.visibility = 'visible';
    critOverlay.style.opacity = '1';
    initConfetti();
    
    critOverlay.style.animation = 'none';
    critOverlay.offsetHeight; 
    critOverlay.style.animation = 'fadeOutCrit 2.5s forwards 1.5s';

    // Carrega V3 (Perfect Form)
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden-page'));
    document.getElementById('page-3').classList.remove('hidden-page');
    document.getElementById('version-label').innerText = "V3 (Perfect Form)";
    document.getElementById('nav-pill').classList.remove('hidden');
    
    // Esconde o dado
    diceContainer.style.opacity = '0';
    setTimeout(() => diceContainer.style.display = 'none', 500);
}

function triggerChaosMode(roll) {
    diceContainer.style.opacity = '0';
    setTimeout(() => diceContainer.style.display = 'none', 500);

    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden-page'));
    chaosPage.classList.remove('hidden-page');
    document.getElementById('version-label').innerText = `Chaos Mix (Roll: ${roll})`;
    document.getElementById('nav-pill').classList.remove('hidden');
    generateChaosContent();
}

function generateChaosContent() {
    chaosPage.innerHTML = ''; 
    
    // MENSAGEM DE FALHA DIVERTIDA
    const failMsg = document.createElement('div');
    failMsg.className = "w-full max-w-2xl mx-auto bg-red-500/20 border border-red-500/50 p-4 rounded-lg text-center mb-8";
    failMsg.innerHTML = `
        <h3 class="text-red-400 font-pixel text-sm mb-2">⚠ GLITCH DETECTED ⚠</h3>
        <p class="text-white/80 font-mono text-xs">
            O resultado não foi o esperado... O sistema falhou em carregar a interface perfeita.
            <br>
            <span class="text-yellow-400 font-bold">Tente rolar o dado novamente para ver a mágica acontecer!</span>
        </p>
    `;
    chaosPage.appendChild(failMsg);

    const randomHeaderId = sources.headers[Math.floor(Math.random() * sources.headers.length)];
    const randomBodyId = sources.bodies[Math.floor(Math.random() * sources.bodies.length)];
    
    appendClone(randomHeaderId, 'chaos-filter-1 chaos-ugly-effect');
    appendClone(randomBodyId, 'chaos-filter-2 chaos-ugly-effect');
    
    const msg = document.createElement('div');
    msg.className = "text-center text-gray-500 mt-10 font-mono text-xs";
    msg.innerHTML = `System Roll: ${rollCount} | Chaos Seed: ${Math.random().toFixed(4)}<br>Re-assembling fragments...`;
    chaosPage.appendChild(msg);
}

function appendClone(elementId, filterClass) {
    const original = document.getElementById(elementId);
    if (original) {
        const clone = original.cloneNode(true);
        clone.id = ""; 
        clone.classList.remove('hidden');
        
        const wrapper = document.createElement('div');
        wrapper.className = `w-full ${Math.random() > 0.5 ? filterClass : ''}`;
        wrapper.style.margin = "20px 0";
        
        // Hack para consertar o layout do marquee no modo chaos
        if(elementId.includes('template-certificados')) {
            const marquees = clone.querySelectorAll('.marquee-content');
            marquees.forEach(m => m.style.justifyContent = 'center');
        }
        
        wrapper.appendChild(clone);
        chaosPage.appendChild(wrapper);
    }
}

// --- RESET / REROLL LOGIC (MODIFICADA) ---
function resetDice() {
    // 1. Esconde elementos de sobreposição, mas MANTÉM a página atual visível
    critOverlay.classList.add('hidden');
    document.getElementById('nav-pill').classList.add('hidden'); // Esconde o botão para não clicar 2x

    // 2. Reseta o visual do dado
    d20Icon.style.opacity = '1';
    d20Icon.classList.remove('rolling'); 
    d20Result.style.opacity = '0';
    
    // 3. Traz o dado de volta (em cima do conteúdo atual)
    diceContainer.style.display = 'block';
    setTimeout(() => diceContainer.style.opacity = '1', 10);
    
    // 4. Fecha janelas abertas (V3) para limpar a visão
    closeV3App();

    // 5. ROLA AUTOMATICAMENTE após um breve delay visual
    setTimeout(() => {
        rollDestiny();
    }, 100);
}

// --- V3 LOGIC (APP WINDOWS) ---
function openV3App(appId) {
    const windowEl = document.getElementById('v3-app-window');
    const bodyEl = document.getElementById('v3-app-body');
    const titleEl = document.getElementById('v3-app-title');
    const heroEl = document.getElementById('v3-hero');
    
    // LÓGICA DE TOGGLE: Se clicar no mesmo app aberto, fecha
    if (!windowEl.classList.contains('hidden') && currentOpenApp === appId) {
        closeV3App();
        return;
    }

    currentOpenApp = appId; // Atualiza app atual

    // Fade out hero
    heroEl.style.opacity = '0';
    heroEl.style.transform = 'scale(0.9)';

    // Clear previous content
    bodyEl.innerHTML = '';
    
    // Load Content
    let contentId = '';
    if (appId === 'certificados') { contentId = 'template-certificados'; titleEl.innerText = 'Certificados.app'; }
    else if (appId === 'projetos') { contentId = 'template-projetos'; titleEl.innerText = 'Projetos.exe'; }
    else if (appId === 'sobre') { contentId = 'template-sobre'; titleEl.innerText = 'Bio.txt'; }
    else if (appId === 'curriculo') { contentId = 'template-curriculo'; titleEl.innerText = 'Curriculo.pdf'; }

    if (contentId) {
        const content = document.getElementById(contentId).cloneNode(true);
        content.classList.remove('hidden');
        bodyEl.appendChild(content);
        
        // Se for certificados, re-inicializar o drag logic para os novos elementos clonados
        if(appId === 'certificados') {
            setTimeout(() => {
                createDraggableMarquee(bodyEl.querySelector('#marquee-cert-1'), -0.8);
                createDraggableMarquee(bodyEl.querySelector('#marquee-cert-2'), 0.8);
            }, 100);
        }
    }

    // Show Window
    windowEl.classList.remove('hidden');
}

function closeV3App() {
    const windowEl = document.getElementById('v3-app-window');
    const heroEl = document.getElementById('v3-hero');
    
    windowEl.classList.add('hidden');
    heroEl.style.opacity = '1';
    heroEl.style.transform = 'scale(1)';
    currentOpenApp = null; // Reseta estado
}

// --- DRAG MARQUEE LOGIC (Refactored to accept elements directly) ---
function createDraggableMarquee(container, initialSpeed) {
    if (!container) return;
    const content = container.querySelector('.marquee-content');
    if(!content) return;
    
    // Clone items for infinite scroll
    const originalChildren = Array.from(content.children);
    if(originalChildren.length === 0) return;
    
    originalChildren.forEach(child => content.appendChild(child.cloneNode(true)));
    originalChildren.forEach(child => content.appendChild(child.cloneNode(true)));

    let xPos = 0;
    let speed = initialSpeed;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;

    function animate() {
        // Check if element is still in DOM (important for closing windows)
        if(!document.body.contains(container)) return;

        if (!isDragging) xPos += speed;
        const totalWidth = content.scrollWidth / 3;
        
        if (xPos <= -totalWidth) xPos += totalWidth;
        else if (xPos > 0) xPos -= totalWidth;
        
        content.style.transform = `translate3d(${xPos}px, 0, 0)`;
        requestAnimationFrame(animate);
    }

    const handleDown = (clientX) => { isDragging = true; lastX = clientX; container.style.cursor = 'grabbing'; };
    const handleMove = (clientX) => { if (!isDragging) return; const delta = clientX - lastX; xPos += delta * 1.5; lastX = clientX; };
    const handleUp = () => { isDragging = false; container.style.cursor = 'grab'; };

    container.addEventListener('mousedown', e => handleDown(e.clientX));
    window.addEventListener('mousemove', e => handleMove(e.clientX));
    window.addEventListener('mouseup', handleUp);
    container.addEventListener('touchstart', e => handleDown(e.touches[0].clientX));
    window.addEventListener('touchmove', e => handleMove(e.touches[0].clientX));
    window.addEventListener('touchend', handleUp);

    requestAnimationFrame(animate);
}

// --- CONFETTI ---
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    for(let i=0; i<300; i++) {
        particles.push({
            x: canvas.width/2,
            y: canvas.height/2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 5 + 2
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; 
            p.size *= 0.99; 
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            if(p.size < 0.5) particles.splice(index, 1);
        });
        if(particles.length > 0) requestAnimationFrame(draw);
    }
    draw();
}