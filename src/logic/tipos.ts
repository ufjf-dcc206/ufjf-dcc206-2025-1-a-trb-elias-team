/**
 * tipos.ts - Definições de tipos TypeScript para o jogo
 * Interfaces e tipos utilizados em todo o sistema
 */

export type Tipo = 'ouros' | 'paus' | 'espadas' | 'copas';
export type Valor = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

/**
 * Interface que representa uma carta do baralho
 */
export interface Carta {
  tipo: Tipo;
  valor: Valor;
}

/**
 * Tipos de mãos de poker válidas no jogo
 */
export type TipoMao = 
  | 'Royal Flush'
  | 'Straight Flush'
  | 'Four of a Kind'
  | 'Full House'
  | 'Flush'
  | 'Straight'
  | 'Three of a Kind'
  | 'Two Pair'
  | 'One Pair'
  | 'High Card';

/**
 * Interface que representa o resultado da avaliação de uma mão
 */
export interface AvaliacaoMao {
  tipo: TipoMao;
  pontos: number;
  cartas: Carta[];
}