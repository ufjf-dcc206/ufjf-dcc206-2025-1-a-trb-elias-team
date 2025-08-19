/**
 * GameCard.ts - Componente Web para representação visual de cartas
 * Renderiza cartas de baralho com estilo e símbolos apropriados
 */

/**
 * Componente customizado que representa uma carta de baralho
 * Exibe valor, naipe e aplicação de cores baseada no tipo da carta
 */
class GameCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Callback executado quando o elemento é inserido no DOM
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Renderiza a carta com base nos atributos fornecidos
   */
  render() {
    const tipos = this.getAttribute('tipos');
    const valor = this.getAttribute('valor');

    const suitMap: { [key: string]: string } = {
      'ouros': '♦',
      'copas': '♥',
      'espadas': '♠',
      'paus': '♣'
    };

    const suitSymbol = tipos ? suitMap[tipos] || tipos : '?';
    const suitColor = (suitSymbol === '♥' || suitSymbol === '♦') ? '#e74c3c' : '#2c3e50';

    // HTML e CSS do componente vão aqui
    this.shadowRoot!.innerHTML = `
      <style>
        .card {
          border: 2px solid #34495e;
          border-radius: 12px;
          width: 80px;
          height: 112px;
          padding: 8px;
          background: linear-gradient(145deg, #ffffff, #f8f9fa);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          user-select: none;
          font-family: 'Arial', sans-serif;
          transition: all 0.2s ease;
        }

        .card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .rank {
          font-size: 16px;
          font-weight: bold;
          color: ${suitColor};
          text-align: left;
          line-height: 1;
        }

        .suit {
          font-size: 24px;
          color: ${suitColor};
          text-align: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .rank-bottom {
          font-size: 16px;
          font-weight: bold;
          color: ${suitColor};
          text-align: right;
          transform: rotate(180deg);
          line-height: 1;
        }
      </style>
      <div class="card">
        <div class="rank">${valor}</div>
        <div class="suit">${suitSymbol}</div>
        <div class="rank-bottom">${valor}</div>
      </div>
    `;
  }
}

/**
 * Registra o componente customizado no navegador
 */
customElements.define('game-card', GameCard);

export default GameCard;