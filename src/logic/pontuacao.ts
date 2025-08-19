/**
 * Sistema de Pontuação do BAR-latro
 * 
 * Módulo responsável por calcular pontuações baseadas no sistema do Balatro.
 * Combina valores das cartas com multiplicadores baseados na raridade das mãos
 * para determinar a pontuação final de uma jogada.
 */

import { TipoMao, Carta, Valor } from './tipos';

/**
 * Interface para informações de pontuação calculada
 */
export interface PontuacaoInfo {
  pontos: number;
  multiplicador: number;
  tipoMao: TipoMao;
  descricao: string;
  total: number;
}

/**
 * Valores das cartas para cálculo de pontuação
 */
export const VALORES_CARTAS: Record<Valor, number> = {
  'A': 15,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10
};

/**
 * Multiplicadores base para cada tipo de mão baseado na raridade
 */
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
 * Calcula a soma dos valores das cartas
 * @param cartas Array de cartas para somar
 * @returns Soma total dos valores das cartas
 */
function calcularSomaCartas(cartas: Carta[]): number {
  return cartas.reduce((soma, carta) => soma + VALORES_CARTAS[carta.valor], 0);
}

/**
 * Calcula a pontuação final de uma mão
 * @param tipoMao Tipo da combinação encontrada
 * @param cartas Cartas que formam a combinação
 * @returns Informações completas da pontuação calculada
 */
export function calcularPontuacao(tipoMao: TipoMao, cartas: Carta[]): PontuacaoInfo {
  const pontos = calcularSomaCartas(cartas);
  const multiplicador = MULTIPLICADORES_BASE[tipoMao];
  const descricao = DESCRICOES_MAOS[tipoMao];
  const total = pontos * multiplicador;
  
  return {
    pontos,
    multiplicador,
    tipoMao,
    descricao,
    total
  };
}

/**
 * Calcula a pontuação total (pontos × multiplicador)
 */
export function calcularPontuacaoTotal(pontuacaoInfo: PontuacaoInfo): number {
  return pontuacaoInfo.total;
}

/**
 * Formatação de pontuação para exibição
 */
export function formatarPontuacao(pontuacaoInfo: PontuacaoInfo): string {
  return `${pontuacaoInfo.pontos} × ${pontuacaoInfo.multiplicador} = ${pontuacaoInfo.total}`;
}

/**
 * Obter todas as informações de pontuação de uma vez
 */
export function obterInformacoesPontuacao(tipoMao: TipoMao, cartas: Carta[]) {
  const info = calcularPontuacao(tipoMao, cartas);
  const formatado = formatarPontuacao(info);
  
  return {
    ...info,
    formatado
  };
}

export default {
  calcularPontuacao,
  calcularPontuacaoTotal,
  formatarPontuacao,
  obterInformacoesPontuacao,
  VALORES_CARTAS,
  MULTIPLICADORES_BASE,
  DESCRICOES_MAOS
};
