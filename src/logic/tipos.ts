// src/logic/tipos.ts

export type Tipo = 'ouros' | 'paus' | 'espadas' | 'copas';
export type Valor = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Carta {
  tipo: Tipo;
  valor: Valor;
};