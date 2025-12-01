# 🎲 Portfólio Gamificado (RPG Edition)

![Project Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

> "A interface gráfica falhou... Role um D20 para tentar recuperar o sistema."

Este é um projeto de **Portfólio Pessoal Interativo (SPA)** construído com **JavaScript Vanilla Moderno (ES Modules)**. O conceito foge do tradicional "rolar para baixo", transformando a navegação em uma experiência de RPG onde a sorte (simulada) define qual versão do site o usuário verá.

---

## ✨ Funcionalidades

### 1. Sistema de Sorte (D20 Mechanic)
Uma mecânica de dados controla a experiência do usuário.
- **Safe Mode:** Uma interface propositalmente "quebrada" e antiga (estilo anos 90) que serve como tela inicial.
- **Chaos Mode (Falha):** Se o dado rolar baixo, o site entra em colapso visual com efeitos de Glitch e Cyberpunk.
- **Perfect Form (Crítico/20):** O sucesso crítico carrega a interface real, inspirada em sistemas operacionais modernos (MacOS/Linux).

### 2. Interface "OS-Like" (Perfect Form)
- **Dock Dinâmica:** Barra de tarefas animada com efeito de magnificação (hover).
- **Janelas Modais:** Apps como "Projetos", "Certificados" e "Sobre Mim" abrem em janelas flutuantes.
- **Drag & Drop:** Carrossel de certificados arrastável com física de movimento.

### 3. Arquitetura Modular
O projeto não utiliza frameworks pesados (React/Vue), mas utiliza a arquitetura de **ES Modules** nativa do JavaScript para organização profissional:
- Separação clara entre **Dados** (`database.js`), **Lógica** (`modules/`) e **Renderização**.

---

## 🛠 Tech Stack

* **Core:** ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
* **Estilização:** ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) (Via CDN para desenvolvimento ágil)
* **Ícones:** FontAwesome 6.
* **Fontes:** Google Fonts (Montserrat, Inter, Fira Code, Press Start 2P).

---

## 📂 Estrutura do Projeto

```text
/
├── index.html            # Ponto de entrada (esqueleto)
├── css/
│   └── style.css         # Estilização global e animações
└── js/
    └── script.js           # Orquestrador principal
