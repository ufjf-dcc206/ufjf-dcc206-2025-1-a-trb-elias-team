// BarScene.ts - Componente para a cena do bar
export default class BarScene extends HTMLElement {
  private barShadow: ShadowRoot;
  private dialogues: { [key: number]: string[] } = {
    0: [ // Cena introdutória
      "🍺 Bem-vindo ao BAR-latro! Eu sou o dono deste estabelecimento.",
      "😊 Este é um bar comum e feliz onde todos gostam de festejar e estar à vontade.",
      "🎲 Mas temos uma regra especial aqui: quem me vencer no 'balatro' não paga a conta!",
      "😏 Claro, isso raramente acontece... afinal, eu me considero o MELHOR jogador da cidade.",
      "🃏 Você parece confiante. Que tal tentar sua sorte? 100 pontos e você bebe de graça!"
    ],
    1: [
      "👨‍💼 Ah, um novo desafiante! Seja bem-vindo ao meu reino das cartas.",
      "🎯 Você tem aquele olhar de quem acha que pode me derrotar... interessante.",
      "💰 A aposta é simples: 100 pontos em 4 mãos. Se conseguir, a primeira rodada é por minha conta!",
      "🃏 Mas não se iluda... sou imbatível há anos. Vamos ver se você tem o que é preciso!"
    ],
    2: [
      "😮 Impressionante! Você realmente conseguiu me vencer na primeira rodada!",
      "🔥 Mas calma lá, jovem. Uma andorinha só não faz verão. 200 pontos agora!",
      "👥 Os outros clientes estão observando... parece que temos um verdadeiro jogador aqui!",
      "😤 Não vou facilitar desta vez. Prepare-se para o verdadeiro desafio!"
    ],
    3: [
      "😱 Não pode ser! Você está realmente me dando trabalho!",
      "💎 400 pontos agora... apenas os lendários chegaram tão longe contra mim.",
      "⚡ O bar inteiro está em silêncio... todos querem ver se o 'imbatível' finalmente encontrou seu páreo!",
      "😠 Mas eu não vou desistir! Esta é a minha casa, e EU que mando aqui!"
    ],
    4: [
      "🤯 IMPOSSÍVEL! Como você conseguiu chegar até aqui?!",
      "🎖️ 800 pontos... nem os jogadores profissionais da capital conseguiram isso!",
      "😰 Estou começando a suar... será que finalmente encontrei alguém melhor que eu?",
      "🔥 Mas esta é a MINHA última cartada! Não vou perder meu título sem luta!"
    ],
    5: [
      "😱 EU... EU FUI DERROTADO! Em MEU próprio bar!",
      "👑 1600 pontos... você não é humano! É um MESTRE supremo das cartas!",
      "👏 O bar inteiro está aplaudindo! Você fez história aqui hoje!",
      "🏆 Parabéns... você oficialmente me destronaram. Todas as bebidas são por minha conta... para SEMPRE!",
      "😅 Talvez seja hora de eu aprender algumas coisas com VOCÊ!"
    ],
    6: [
      "🤝 Espera... já que você me ensinou tanto, que tal jogarmos mais uma rodada?",
      "📚 Quero aprender com o mestre! Cada partida com você é uma lição valiosa.",
      "♾️ Que comece nossa jornada infinita de aprendizado! Vamos ver até onde podemos chegar juntos!",
      "🎯 Sem pressa, sem pressão... apenas dois jogadores aperfeiçoando sua arte!",
      "🍺 Afinal, o que é um bar sem uma boa conversa e cartas na mesa? Vamos continuar!"
    ]
  };

  constructor() {
    super();
    this.barShadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.updateFromAttributes();
  }

  static get observedAttributes() {
    return ['rodada-info'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'rodada-info' && oldValue !== newValue) {
      this.updateFromAttributes();
    }
  }

  private updateFromAttributes() {
    const rodadaInfoAttr = this.getAttribute('rodada-info');
    if (rodadaInfoAttr) {
      try {
        const rodadaInfo = JSON.parse(rodadaInfoAttr);
        this.updateRodadaInfo(rodadaInfo);
      } catch (error) {
        console.warn('⚠️ Erro ao parsear rodada-info:', error);
      }
    }
  }

  updateRodadaInfo(rodadaInfo: any) {
    const content = this.barShadow.querySelector('.bar-content');
    if (content) {
      content.innerHTML = `
        <div class="bar-atmosphere">
          <!-- Elementos decorativos do bar -->
          <div class="bar-lights"></div>
          <div class="smoke-effect"></div>
        </div>

        <div class="bar-main">
          <div class="bar-counter">
            <div class="counter-surface">
              <!-- Informações da rodada -->
              <div class="round-info-panel">
                <h2>🎮 Rodada ${rodadaInfo.numero}</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Meta:</span>
                    <span class="info-value">${rodadaInfo.metaDePontos.toLocaleString()}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Dificuldade:</span>
                    <span class="info-value difficulty-${rodadaInfo.numero}">${rodadaInfo.dificuldade}</span>
                  </div>
                </div>
                ${rodadaInfo.numero > 1 ? '<div class="success-celebration">🎉 NÍVEL SUPERIOR DESBLOQUEADO! 🎉</div>' : ''}
              </div>

              <!-- Caixa de diálogo -->
              <dialogue-box id="mainDialogue"></dialogue-box>
            </div>
          </div>

          <div class="action-area">
            <button class="quick-start-btn" id="quickStartBtn">
              🚀 Ir Direto ao Jogo
            </button>
          </div>
        </div>

        <!-- Elementos de fundo -->
        <div class="background-elements">
          <div class="bottle bottle-1">🍺</div>
          <div class="bottle bottle-2">🍷</div>
          <div class="bottle bottle-3">🥃</div>
          <div class="cards-deck">🃏</div>
          <div class="coins">💰</div>
        </div>
      `;

      // Configurar o diálogo
      this.setupDialogue(rodadaInfo.numero);
      
      // Configurar event listeners
      this.setupEventListeners();
    }
  }

  private setupDialogue(roundNumber: number) {
    const dialogueBox = this.barShadow.querySelector('#mainDialogue') as any;
    if (dialogueBox) {
      const roundDialogues = this.dialogues[roundNumber] || this.dialogues[5]; // Default para rodadas muito altas
      
      // Aguardar o componente estar pronto
      setTimeout(() => {
        dialogueBox.setDialogues(roundDialogues, '🧔', 'Bartender');
      }, 100);

      // Event listeners do diálogo
      dialogueBox.addEventListener('dialogueComplete', () => {
        this.dispatchEvent(new CustomEvent('startGame', {
          bubbles: true,
          detail: { action: 'start-game' }
        }));
      });

      dialogueBox.addEventListener('dialogueSkip', () => {
        this.dispatchEvent(new CustomEvent('startGame', {
          bubbles: true,
          detail: { action: 'skip-dialogue' }
        }));
      });

      dialogueBox.addEventListener('dialogueNext', () => {
        // Adicionar efeito sonoro ou vibração aqui no futuro
        console.log('📖 Próximo diálogo');
      });
    }
  }

  private setupEventListeners() {
    const quickStartBtn = this.barShadow.querySelector('#quickStartBtn');

    if (quickStartBtn) {
      quickStartBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('startGame', {
          bubbles: true,
          detail: { action: 'quick-start' }
        }));
      });
    }
  }

  private render() {
    this.barShadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          font-family: 'Arial', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .bar-content {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .bar-atmosphere {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .bar-lights {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 60% 80%, rgba(255, 69, 0, 0.06) 0%, transparent 60%);
          animation: ambient-glow 8s infinite alternate;
        }

        @keyframes ambient-glow {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .smoke-effect {
          position: absolute;
          top: -50px;
          left: 0;
          width: 100%;
          height: 150%;
          background: 
            radial-gradient(ellipse at 10% 50%, rgba(255,255,255,0.02) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 20%, rgba(255,255,255,0.015) 0%, transparent 40%);
          animation: smoke-drift 15s infinite linear;
        }

        @keyframes smoke-drift {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(2deg); }
        }

        .bar-main {
          position: relative;
          z-index: 10;
          max-width: 900px;
          width: 100%;
        }

        .bar-counter {
          background: linear-gradient(145deg, #8B4513, #A0522D, #CD853F);
          border-radius: 25px;
          padding: 0;
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1),
            0 0 0 3px #DAA520;
          position: relative;
          overflow: hidden;
          animation: counter-enter 1s ease-out;
        }

        @keyframes counter-enter {
          0% {
            transform: scale(0.8) translateY(50px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .counter-surface {
          padding: 30px;
          background: linear-gradient(145deg, rgba(139, 69, 19, 0.9), rgba(160, 82, 45, 0.8));
          border-radius: 25px;
        }

        .round-info-panel {
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border: 3px solid #ffd700;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 25px;
          text-align: center;
          animation: info-glow 3s infinite alternate;
        }

        @keyframes info-glow {
          0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
        }

        .round-info-panel h2 {
          margin: 0 0 15px 0;
          color: #ffd700;
          font-size: 2em;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
          letter-spacing: 2px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .info-item {
          background: rgba(0,0,0,0.3);
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,215,0,0.2);
        }

        .info-label {
          display: block;
          color: #ccc;
          font-size: 0.9em;
          margin-bottom: 5px;
        }

        .info-value {
          display: block;
          color: #ffd700;
          font-weight: bold;
          font-size: 1.2em;
        }

        .difficulty-1 { color: #51cf66; }
        .difficulty-2 { color: #4dabf7; }
        .difficulty-3 { color: #ffd43b; }
        .difficulty-4 { color: #ff922b; }
        .difficulty-5 { color: #ff6b6b; }

        .success-celebration {
          background: linear-gradient(135deg, #51cf66, #37b24d);
          color: white;
          padding: 10px;
          border-radius: 8px;
          font-weight: bold;
          animation: celebration-pulse 1s infinite alternate;
        }

        @keyframes celebration-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .action-area {
          margin-top: 20px;
          text-align: center;
        }

        .quick-start-btn {
          padding: 15px 30px;
          background: linear-gradient(145deg, #ff6b6b, #e63946);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 3px solid #ff8787;
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }

        .quick-start-btn:hover {
          background: linear-gradient(145deg, #e63946, #dc2626);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4);
        }

        .background-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .bottle, .cards-deck, .coins {
          position: absolute;
          font-size: 2em;
          opacity: 0.3;
          animation: float 6s infinite ease-in-out;
        }

        .bottle-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .bottle-2 {
          top: 30%;
          right: 15%;
          animation-delay: 2s;
        }

        .bottle-3 {
          bottom: 25%;
          left: 20%;
          animation-delay: 4s;
        }

        .cards-deck {
          top: 15%;
          right: 25%;
          animation-delay: 1s;
        }

        .coins {
          bottom: 20%;
          right: 20%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .bar-content {
            padding: 15px;
          }
          
          .counter-surface {
            padding: 20px;
          }
          
          .round-info-panel h2 {
            font-size: 1.5em;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .background-elements {
            display: none;
          }
        }

        /* Animações de entrada */
        .bar-counter {
          animation: slide-up 0.8s ease-out;
        }

        @keyframes slide-up {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      </style>
      
      <div class="bar-content">
        <!-- Conteúdo será inserido dinamicamente -->
      </div>
    `;
  }
}

// Registrar o componente
customElements.define('bar-scene', BarScene);
