// src/logic/pontuacao.ts
import { TipoMao } from './tipos';

// Sistema de pontuação baseado no Balatro
export interface PontuacaoInfo {
  pontos: number;
  multiplicador: number;
  tipoMao: TipoMao;
  descricao: string;
}

// Pontos base para cada tipo de mão
export const PONTOS_BASE: Record<TipoMao, number> = {
  'Royal Flush': 100,
  'Straight Flush': 80,
  'Four of a Kind': 60,
  'Full House': 40,
  'Flush': 35,
  'Straight': 30,
  'Three of a Kind': 25,
  'Two Pair': 20,
  'One Pair': 15,
  'High Card': 5
};

// Multiplicadores base para cada tipo de mão
export const MULTIPLICADORES_BASE: Record<TipoMao, number> = {
  'Royal Flush': 8,
  'Straight Flush': 6,
  'Four of a Kind': 5,
  'Full House': 4,
  'Flush': 4,
  'Straight': 3,
  'Three of a Kind': 3,
  'Two Pair': 2,
  'One Pair': 2,
  'High Card': 1
};

// Descrições das mãos
export const DESCRICOES_MAOS: Record<TipoMao, string> = {
  'Royal Flush': 'A sequência real mais poderosa!',
  'Straight Flush': 'Cinco cartas em sequência do mesmo naipe',
  'Four of a Kind': 'Quatro cartas do mesmo valor',
  'Full House': 'Três cartas iguais + um par',
  'Flush': 'Cinco cartas do mesmo naipe',
  'Straight': 'Cinco cartas em sequência',
  'Three of a Kind': 'Três cartas do mesmo valor',
  'Two Pair': 'Dois pares diferentes',
  'One Pair': 'Um par de cartas iguais',
  'High Card': 'Carta mais alta'
};

/**
 * Calcula a pontuação final de uma mão
 */
export function calcularPontuacao(tipoMao: TipoMao, cartasJogadas: number = 5): PontuacaoInfo {
  const pontosBase = PONTOS_BASE[tipoMao];
  const multiplicadorBase = MULTIPLICADORES_BASE[tipoMao];
  const descricao = DESCRICOES_MAOS[tipoMao];
  
  // Bônus por jogar com menos cartas (estilo Balatro)
  const bonusCartas = cartasJogadas < 5 ? Math.floor((5 - cartasJogadas) * 2) : 0;
  
  const pontos = pontosBase + bonusCartas;
  const multiplicador = multiplicadorBase;
  
  return {
    pontos,
    multiplicador,
    tipoMao,
    descricao
  };
}

/**
 * Calcula a pontuação total (pontos × multiplicador)
 */
export function calcularPontuacaoTotal(pontuacaoInfo: PontuacaoInfo): number {
  return pontuacaoInfo.pontos * pontuacaoInfo.multiplicador;
}

/**
 * Formatação de pontuação para exibição
 */
export function formatarPontuacao(pontuacaoInfo: PontuacaoInfo): string {
  const total = calcularPontuacaoTotal(pontuacaoInfo);
  return `${pontuacaoInfo.pontos} × ${pontuacaoInfo.multiplicador} = ${total}`;
}

/**
 * Obter todas as informações de pontuação de uma vez
 */
export function obterInformacoesPontuacao(tipoMao: TipoMao, cartasJogadas: number = 5) {
  const info = calcularPontuacao(tipoMao, cartasJogadas);
  const total = calcularPontuacaoTotal(info);
  const formatado = formatarPontuacao(info);
  
  return {
    ...info,
    total,
    formatado
  };
}

export default {
  calcularPontuacao,
  calcularPontuacaoTotal,
  formatarPontuacao,
  obterInformacoesPontuacao,
  PONTOS_BASE,
  MULTIPLICADORES_BASE,
  DESCRICOES_MAOS
};
