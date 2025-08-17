// src/components/GameCard.ts
class GameCard extends HTMLElement {
  constructor() {
    super();
    // Você pode anexar um Shadow DOM para encapsular o estilo
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Chamado quando o elemento é inserido no DOM
    this.render();
  }

  render() {
    const tipos = this.getAttribute('tipos');
    const valor = this.getAttribute('valor');

    // Mapear tipos para símbolos Unicode
    const suitMap: { [key: string]: string } = {
      'ouros': '♦',
      'copas': '♥',
      'espadas': '♠',
      'paus': '♣'
    };

    const suitSymbol = tipos ? suitMap[tipos] || tipos : '?';
    // Definir cor do naipe
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

// Exporta a classe para poder ser importada
export default GameCard;