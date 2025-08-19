// main.ts
import GameCard from './components/GameCard'; // Importa a classe
import { createDeck, shuffle } from './logic/baralho'; // Importa as funções de baralho

customElements.define('game-card', GameCard);

// Cria e embaralha o baralho
const deck = createDeck();
const shuffledDeck = shuffle(deck);
console.log('Baralho embaralhado:', shuffledDeck);

// Exemplo de uso do componente GameCard
const gameCard = document.createElement('game-card');
gameCard.setAttribute('tipos', 'ouros');
gameCard.setAttribute('valor', 'A');
document.body.appendChild(gameCard); // Adiciona o componente ao corpo do documento


