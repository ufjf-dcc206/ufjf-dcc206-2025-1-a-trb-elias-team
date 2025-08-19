// src/components/PlayerHand.ts
import { Carta } from '../logic/tipos';
import { avaliarMao } from '../logic/avaliarMao';

class PlayerHand extends HTMLElement {
  private selectedCards: Set<HTMLElement> = new Set();
  private maxSelections = 5;
  private gameStateCallback?: (action: string, data?: any) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  // Método para definir callback de comunicação com o estado do jogo
  setGameStateCallback(callback: (action: string, data?: any) => void) {
    this.gameStateCallback = callback;
  }

  get cards(): Carta[] {
    try {
      const cardsData = this.getAttribute('cards');
      return cardsData ? JSON.parse(cardsData) : [];
    } catch {
      return [];
    }
  }

  // Atualizar cartas da mão
  updateCards(newCards: Carta[]) {
    this.setAttribute('cards', JSON.stringify(newCards));
    this.clearSelection(); // Limpar seleção ao atualizar cartas
    this.render();
  }

  setupEventListeners() {
    this.shadowRoot!.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Verificar clique em carta
      const gameCard = target.closest('game-card');
      if (gameCard) {
        this.toggleCardSelection(gameCard as HTMLElement);
        return;
      }

      // Verificar clique no botão de descarte
      if (target.classList.contains('discard-btn')) {
        this.handleDiscard();
        return;
      }

      // Verificar clique no botão de sacar
      if (target.classList.contains('draw-btn')) {
        this.handleDraw();
        return;
      }

      // Verificar clique no botão de jogar mão
      if (target.classList.contains('play-hand-btn')) {
        this.handlePlayHand();
        return;
      }
    });
  }

  toggleCardSelection(card: HTMLElement) {
    if (this.selectedCards.has(card)) {
      // Desselecionar carta
      this.selectedCards.delete(card);
      card.classList.remove('selected');
    } else if (this.selectedCards.size < this.maxSelections) {
      // Selecionar carta (se não atingiu o limite)
      this.selectedCards.add(card);
      card.classList.add('selected');
    }
    
    // Avaliar cartas selecionadas
    const selectedCardData = this.getSelectedCardsData();
    if (selectedCardData.length > 0) {
      const evaluation = avaliarMao(selectedCardData);
      this.updateSelectionEvaluation(evaluation);
    } else {
      this.clearSelectionEvaluation();
    }
    
    // Disparar evento customizado com as cartas selecionadas
    this.dispatchEvent(new CustomEvent('selectionChange', {
      detail: {
        selectedCards: Array.from(this.selectedCards),
        count: this.selectedCards.size,
        maxReached: this.selectedCards.size === this.maxSelections,
        evaluation: selectedCardData.length > 0 ? avaliarMao(selectedCardData) : null
      }
    }));

    // Atualizar estado dos botões
    this.updateButtons();
  }

  // Lidar com descarte de cartas
  handleDiscard() {
    if (this.selectedCards.size === 0) {
      this.showMessage('⚠️ Selecione pelo menos uma carta para descartar', 'warning');
      return;
    }

    // Obter dados das cartas selecionadas
    const selectedCardData = this.getSelectedCardsData();
    
    if (this.gameStateCallback) {
      this.gameStateCallback('discard', selectedCardData);
      this.showMessage(`🗑️ ${selectedCardData.length} carta(s) descartada(s)`, 'success');
    }
  }

  // Lidar com sacar cartas
  handleDraw() {
    if (this.gameStateCallback) {
      this.gameStateCallback('draw', { quantity: 1 });
      this.showMessage('🃏 Carta sacada!', 'success');
    }
  }

  // Lidar com jogar mão
  handlePlayHand() {
    if (this.selectedCards.size === 0) {
      this.showMessage('⚠️ Selecione pelo menos uma carta para jogar', 'warning');
      return;
    }

    // Obter dados das cartas selecionadas
    const selectedCardData = this.getSelectedCardsData();
    
    if (this.gameStateCallback) {
      this.gameStateCallback('playHand', selectedCardData);
      this.showMessage(`🎯 Mão jogada com ${selectedCardData.length} carta(s)!`, 'success');
    }
  }

  // Obter dados das cartas selecionadas
  getSelectedCardsData(): Carta[] {
    const cards = this.cards;
    const selectedIndices: number[] = [];
    
    // Encontrar índices das cartas selecionadas
    this.selectedCards.forEach(selectedCard => {
      const cardElements = Array.from(this.shadowRoot!.querySelectorAll('game-card'));
      const index = cardElements.indexOf(selectedCard);
      if (index !== -1) {
        selectedIndices.push(index);
      }
    });

    // Retornar as cartas correspondentes
    return selectedIndices.map(index => cards[index]).filter(Boolean);
  }

  // Mostrar mensagens temporárias
  showMessage(text: string, type: 'success' | 'warning' | 'error' = 'success') {
    const messageEl = this.shadowRoot!.querySelector('.message') as HTMLElement;
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.className = `message ${type}`;
      messageEl.style.opacity = '1';
      
      setTimeout(() => {
        messageEl.style.opacity = '0';
      }, 2000);
    }
  }

  getSelectedCards() {
    return Array.from(this.selectedCards);
  }

  clearSelection() {
    this.selectedCards.forEach(card => {
      card.classList.remove('selected');
    });
    this.selectedCards.clear();
    this.updateButtons();
  }

  // Atualizar estado dos botões
  updateButtons() {
    const discardBtn = this.shadowRoot!.querySelector('.discard-btn') as HTMLButtonElement;
    const playHandBtn = this.shadowRoot!.querySelector('.play-hand-btn') as HTMLButtonElement;
    
    if (discardBtn) {
      discardBtn.disabled = this.selectedCards.size === 0;
    }
    
    if (playHandBtn) {
      playHandBtn.disabled = this.selectedCards.size === 0;
    }
  }

  // Atualizar avaliação da seleção
  updateSelectionEvaluation(evaluation: any) {
    const evalContainer = this.shadowRoot!.querySelector('.selection-evaluation');
    if (evalContainer) {
      // Determinar cor baseada no tipo de mão
      const colors = {
        'Quadra': '#9b59b6',
        'Full House': '#e74c3c',
        'Flush': '#3498db',
        'Trinca': '#e67e22',
        'Dois Pares': '#f39c12',
        'Um Par': '#27ae60',
        'Carta Alta': '#95a5a6'
      };
      
      const color = colors[evaluation.tipo as keyof typeof colors] || '#95a5a6';
      
      evalContainer.innerHTML = `
        <div class="eval-header">🎯 Combinação Selecionada</div>
        <div class="eval-type" style="color: ${color};">${evaluation.tipo}</div>
        <div class="eval-description">${evaluation.descricao}</div>
        <div class="eval-strength">Força: ${evaluation.valor}</div>
      `;
      evalContainer.classList.remove('hidden');
    }
  }

  // Limpar avaliação da seleção
  clearSelectionEvaluation() {
    const evalContainer = this.shadowRoot!.querySelector('.selection-evaluation');
    if (evalContainer) {
      evalContainer.classList.add('hidden');
    }
  }

  render() {
    const cards = this.cards;
    const statsData = this.getAttribute('stats');
    const stats = statsData ? JSON.parse(statsData) : {};

    this.shadowRoot!.innerHTML = `
      <style>
        .hand-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding: 20px;
          background-color: #2d5a27;
          border-radius: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          max-width: 100%;
          animation: hand-enter 0.8s ease-out;
        }

        @keyframes hand-enter {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .hand-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hand-title {
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          margin: 0;
          animation: title-glow 2s infinite alternate;
        }

        @keyframes title-glow {
          0% { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }
          100% { text-shadow: 2px 2px 8px rgba(255, 215, 0, 0.3); }
        }

        .hand-stats {
          display: flex;
          gap: 15px;
          font-size: 12px;
          color: #ccc;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .cards-container {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          min-height: 120px;
        }

        game-card {
          cursor: pointer;
          transition: all 0.3s ease;
          animation: card-enter 0.6s ease-out both;
        }

        game-card:nth-child(1) { animation-delay: 0.1s; }
        game-card:nth-child(2) { animation-delay: 0.2s; }
        game-card:nth-child(3) { animation-delay: 0.3s; }
        game-card:nth-child(4) { animation-delay: 0.4s; }
        game-card:nth-child(5) { animation-delay: 0.5s; }
        game-card:nth-child(6) { animation-delay: 0.6s; }
        game-card:nth-child(7) { animation-delay: 0.7s; }
        game-card:nth-child(8) { animation-delay: 0.8s; }

        @keyframes card-enter {
          0% {
            transform: translateX(-100px) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: translateX(10px) rotate(2deg);
            opacity: 0.8;
          }
          100% {
            transform: translateX(0) rotate(0deg);
            opacity: 1;
          }
        }

        game-card:hover {
          transform: translateY(-8px) scale(1.05);
          filter: brightness(1.1);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
          z-index: 10;
        }

        game-card.selected {
          transform: translateY(-10px);
          border: 3px solid #ffd700 !important;
          box-shadow: 0 8px 16px rgba(255, 215, 0, 0.4), 
                      0 0 20px rgba(255, 215, 0, 0.3) !important;
          filter: brightness(1.2);
        }

        .hand-controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 20px;
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8));
          border-radius: 15px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          margin-top: 20px;
          backdrop-filter: blur(10px);
        }

        .selection-evaluation {
          background: linear-gradient(135deg, #1a1a1a, #2d3748);
          border-radius: 8px;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #4a5568;
          text-align: center;
          transition: all 0.3s ease;
        }

        .selection-evaluation.hidden {
          display: none;
        }

        .eval-header {
          color: #e2e8f0;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .eval-type {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 3px;
          text-shadow: 0 0 8px currentColor;
        }

        .eval-description {
          color: #cbd5e0;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .eval-strength {
          color: #a0aec0;
          font-size: 10px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .btn:active:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .discard-btn {
          background: linear-gradient(145deg, #ff6b6b, #e63946);
          color: white;
          border: 2px solid #ff8e8e;
        }

        .discard-btn:hover:not(:disabled) {
          background: linear-gradient(145deg, #ff5252, #d32f2f);
          border-color: #ff6b6b;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .draw-btn {
          background: linear-gradient(145deg, #4dabf7, #339af0);
          color: white;
          border: 2px solid #74c0fc;
        }

        .draw-btn:hover:not(:disabled) {
          background: linear-gradient(145deg, #3b82f6, #2563eb);
          border-color: #4dabf7;
          box-shadow: 0 8px 25px rgba(77, 171, 247, 0.4);
        }

        .play-hand-btn {
          background: linear-gradient(145deg, #51cf66, #37b24d);
          color: white;
          border: 2px solid #69db7c;
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 4px 15px rgba(0,0,0,0.2), 0 0 0 0 rgba(81, 207, 102, 0.7); 
          }
          50% { 
            box-shadow: 0 4px 15px rgba(0,0,0,0.2), 0 0 0 10px rgba(81, 207, 102, 0); 
          }
        }

        .play-hand-btn:hover:not(:disabled) {
          background: linear-gradient(145deg, #40c057, #2b8a3e);
          border-color: #51cf66;
          box-shadow: 0 8px 25px rgba(81, 207, 102, 0.4);
          animation: none;
        }

        .selection-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
          font-size: 14px;
          padding: 0 10px;
        }

        .selection-counter {
          opacity: 0.8;
        }

        .max-reached {
          color: #ff6b6b;
          font-weight: bold;
        }

        .message {
          text-align: center;
          padding: 8px;
          border-radius: 6px;
          font-weight: bold;
          transition: opacity 0.3s ease;
          opacity: 0;
        }

        .message.success {
          background: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
          border: 1px solid #2ecc71;
        }

        .message.warning {
          background: rgba(241, 196, 15, 0.2);
          color: #f1c40f;
          border: 1px solid #f1c40f;
        }

        .message.error {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: 1px solid #e74c3c;
        }

        .empty-hand {
          text-align: center;
          color: #ccc;
          font-style: italic;
          padding: 40px;
        }
      </style>
      <div class="hand-container">
        <div class="hand-header">
          <h3 class="hand-title">🎴 Sua Mão</h3>
          <div class="hand-stats">
            <div class="stat">
              <span>🃏</span>
              <span>Cartas: ${cards.length}/8</span>
            </div>
            <div class="stat">
              <span>📚</span>
              <span>Baralho: ${stats.deckSize || 0}</span>
            </div>
            <div class="stat">
              <span>🗑️</span>
              <span>Descarte: ${stats.discardSize || 0}</span>
            </div>
          </div>
        </div>
        
        <div class="cards-container">
          ${cards.length === 0 ? 
            '<div class="empty-hand">🎴 Nenhuma carta na mão</div>' :
            cards.map(card => `
              <game-card 
                tipos="${card.tipo}" 
                valor="${card.valor}"
              ></game-card>
            `).join('')
          }
        </div>

        <div class="selection-info">
          <div class="selection-counter">
            Selecionadas: <span id="count">0</span>/${this.maxSelections}
          </div>
          <div class="hand-actions">
            <span style="font-size: 12px; opacity: 0.7;">
              💡 Clique nas cartas para selecioná-las
            </span>
          </div>
        </div>

        <div class="selection-evaluation hidden">
          <!-- Avaliação da seleção aparecerá aqui -->
        </div>

        <div class="hand-controls">
          <button class="btn discard-btn" disabled>
            🗑️ Descartar Selecionadas
          </button>
          <button class="btn draw-btn">
            🃏 Sacar Carta
          </button>
          <button class="btn play-hand-btn" disabled>
            🎯 Jogar Mão
          </button>
        </div>

        <div class="message"></div>
      </div>
    `;

    this.updateSelectionCounter();
    this.updateButtons();
  }

  updateSelectionCounter() {
    const countElement = this.shadowRoot!.querySelector('#count');
    if (countElement) {
      countElement.textContent = this.selectedCards.size.toString();
      
      const counter = this.shadowRoot!.querySelector('.selection-counter');
      if (this.selectedCards.size === this.maxSelections) {
        counter!.classList.add('max-reached');
      } else {
        counter!.classList.remove('max-reached');
      }
    }
  }

  // Sobrescrever o método de addEventListener para atualizar o contador
  dispatchEvent(event: Event): boolean {
    const result = super.dispatchEvent(event);
    if (event.type === 'selectionChange') {
      this.updateSelectionCounter();
    }
    return result;
  }
}

// Registrar o componente
customElements.define('player-hand', PlayerHand);

// Exporta a classe para poder ser importada
export default PlayerHand;  