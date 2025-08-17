// src/logic/baralho.ts
import { Carta, Tipo, Valor } from './tipos';

// Função que cria um baralho padrão de 52 cartas
export function createDeck(): Carta[] {
  const deck: Carta[] = [];
  for (const tipo of ['ouros', 'paus', 'espadas', 'copas'] as Tipo[]) {
    for (const valor of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as Valor[]) {
      deck.push({ tipo, valor });
    }
  }
  return deck;
}

// Função que embaralha um array de cartas
export function shuffle(deck: Carta[]): Carta[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}