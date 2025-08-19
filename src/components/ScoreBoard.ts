// ScoreBoard.ts - Componente para exibir informações do jogo
export default class ScoreBoard extends HTMLElement {
  private scoreboardShadow: ShadowRoot;

  constructor() {
    super();
    this.scoreboardShadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.updateFromAttributes();
  }

  static get observedAttributes() {
    return ['stats'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'stats' && oldValue !== newValue) {
      this.updateFromAttributes();
    }
  }

  private updateFromAttributes() {
    const statsAttr = this.getAttribute('stats');
    if (statsAttr) {
      try {
        const stats = JSON.parse(statsAttr);
        this.updateStats(stats);
      } catch (error) {
        console.warn('⚠️ Erro ao parsear stats:', error);
      }
    }
  }

  updateStats(stats: any) {
    const container = this.scoreboardShadow.querySelector('.score-container');
    if (container) {
      // Calcular percentual de progresso
      const progressPercent = Math.min((stats.pontuacaoAtual / stats.metaDePontos) * 100, 100);
      
      // Determinar cor do progresso baseado no percentual
      let progressColor = '#ff6b6b'; // Vermelho para baixo
      if (progressPercent >= 75) progressColor = '#51cf66'; // Verde para alto
      else if (progressPercent >= 50) progressColor = '#ffd43b'; // Amarelo para médio
      else if (progressPercent >= 25) progressColor = '#ff922b'; // Laranja para baixo-médio
      
      container.innerHTML = `
        <!-- Título do Placar -->
        <div class="title">
          <h2>🏆 PLACAR DE JOGO</h2>
        </div>

        <!-- Progresso Principal -->
        <div class="main-progress">
          <div class="progress-label">
            <span>💰 PONTUAÇÃO</span>
            <span class="score-value" id="scoreValue">0</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill" style="width: 0%; background-color: ${progressColor}"></div>
          </div>
          <div class="progress-target">
            🎯 Meta: ${stats.metaDePontos.toLocaleString()} pontos
          </div>
        </div>

        <!-- Grid de Estatísticas -->
        <div class="stats-grid">
          <div class="stat-card ${stats.maosRestantes <= 2 ? 'warning' : ''}">
            <div class="stat-icon">🎲</div>
            <div class="stat-value" id="handsValue">0</div>
            <div class="stat-label">Mãos Restantes</div>
          </div>

          <div class="stat-card ${stats.descartesRestantes === 0 ? 'warning' : ''}">
            <div class="stat-icon">♻️</div>
            <div class="stat-value" id="discardsValue">0</div>
            <div class="stat-label">Descartes Disponíveis</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🃏</div>
            <div class="stat-value" id="cardsValue">0</div>
            <div class="stat-label">Cartas na Mão</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value" id="progressValue">0%</div>
            <div class="stat-label">Progresso</div>
          </div>
        </div>

        <!-- Status do Jogo -->
        <div class="game-status">
          ${this.getGameStatusMessage(stats, progressPercent)}
        </div>
      `;

      // Animar valores
      setTimeout(() => {
        this.animateValue('scoreValue', 0, stats.pontuacaoAtual, 1000, true);
        this.animateValue('handsValue', 0, stats.maosRestantes, 500);
        this.animateValue('discardsValue', 0, stats.descartesRestantes, 500);
        this.animateValue('cardsValue', 0, stats.cartasNaMao || 0, 500);
        this.animateValue('progressValue', 0, Math.round(progressPercent), 800, false, '%');
        this.animateProgressBar(progressPercent);
      }, 100);
    }
  }

  // Animar valores numericos
  private animateValue(elementId: string, start: number, end: number, duration: number, useLocale: boolean = false, suffix: string = '') {
    const element = this.scoreboardShadow.querySelector(`#${elementId}`);
    if (!element) return;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.round(start + (end - start) * easeProgress);
      
      if (useLocale) {
        element.textContent = currentValue.toLocaleString() + suffix;
      } else {
        element.textContent = currentValue + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Animar barra de progresso
  private animateProgressBar(targetPercent: number) {
    const progressBar = this.scoreboardShadow.querySelector('#progressFill') as HTMLElement;
    if (!progressBar) return;

    const startTime = performance.now();
    const duration = 1200;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentPercent = targetPercent * easeProgress;
      
      progressBar.style.width = currentPercent + '%';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  private getGameStatusMessage(stats: any, progressPercent: number): string {
    if (stats.pontuacaoAtual >= stats.metaDePontos) {
      return '<div class="status-message victory">🎉 VITÓRIA! Meta atingida!</div>';
    }
    
    if (stats.maosRestantes === 0) {
      return '<div class="status-message defeat">💔 Game Over - Meta não atingida</div>';
    }
    
    if (stats.maosRestantes <= 2) {
      return '<div class="status-message warning">⚠️ Últimas chances! Jogue bem!</div>';
    }
    
    if (progressPercent >= 75) {
      return '<div class="status-message good">🔥 Excelente! Quase na meta!</div>';
    }
    
    if (progressPercent >= 50) {
      return '<div class="status-message neutral">💪 Bom progresso, continue assim!</div>';
    }
    
    return '<div class="status-message info">🎯 Foque em mãos de alto valor!</div>';
  }

  private render() {
    this.scoreboardShadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Arial', sans-serif;
        }

        .score-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border: 3px solid #ffd700;
          border-radius: 15px;
          padding: 20px;
          color: #fff;
          box-shadow: 
            0 10px 30px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .score-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffd700, transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
        }

        .title h2 {
          margin: 0;
          font-size: 1.5em;
          background: linear-gradient(45deg, #ffd700, #ffed4a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          letter-spacing: 2px;
        }

        .main-progress {
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          border: 1px solid rgba(255,215,0,0.3);
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .score-value {
          font-size: 1.4em;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;
          border: 1px solid rgba(255,215,0,0.2);
        }

        .progress-fill {
          height: 100%;
          transition: width 0.5s ease, background-color 0.5s ease;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
          animation: pulse 2s infinite alternate;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 10px rgba(255,255,255,0.3); }
          100% { box-shadow: 0 0 20px rgba(255,255,255,0.6); }
        }

        .progress-target {
          text-align: center;
          font-size: 0.9em;
          color: #ccc;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(255,215,0,0.3);
          border-radius: 10px;
          padding: 15px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: #ffd700;
          box-shadow: 0 10px 25px rgba(255,215,0,0.2);
        }

        .stat-card.warning {
          border-color: #ff6b6b;
          background: rgba(255,107,107,0.1);
          animation: warning-pulse 1.5s infinite;
        }

        @keyframes warning-pulse {
          0%, 100% { border-color: #ff6b6b; }
          50% { border-color: #ff922b; }
        }

        .stat-icon {
          font-size: 2em;
          margin-bottom: 8px;
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
        }

        .stat-value {
          font-size: 1.8em;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 5px;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .stat-label {
          font-size: 0.9em;
          color: #ccc;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .game-status {
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          font-weight: bold;
        }

        .status-message {
          padding: 12px;
          border-radius: 8px;
          font-size: 1.1em;
          letter-spacing: 1px;
        }

        .status-message.victory {
          background: linear-gradient(135deg, #51cf66, #37b24d);
          color: #fff;
          animation: victory-glow 1s infinite alternate;
        }

        .status-message.defeat {
          background: linear-gradient(135deg, #ff6b6b, #fa5252);
          color: #fff;
        }

        .status-message.warning {
          background: linear-gradient(135deg, #ff922b, #fd7e14);
          color: #fff;
          animation: warning-blink 1s infinite;
        }

        .status-message.good {
          background: linear-gradient(135deg, #69db7c, #51cf66);
          color: #fff;
        }

        .status-message.neutral {
          background: linear-gradient(135deg, #4dabf7, #339af0);
          color: #fff;
        }

        .status-message.info {
          background: linear-gradient(135deg, #a78bfa, #8b5cf6);
          color: #fff;
        }

        @keyframes victory-glow {
          0% { box-shadow: 0 0 20px rgba(81, 207, 102, 0.5); }
          100% { box-shadow: 0 0 30px rgba(81, 207, 102, 0.8); }
        }

        @keyframes warning-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.7; }
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .score-container {
            padding: 15px;
          }
          
          .title h2 {
            font-size: 1.2em;
          }
        }
      </style>
      
      <div class="score-container">
        <!-- Conteúdo será inserido dinamicamente -->
      </div>
    `;
  }
}
