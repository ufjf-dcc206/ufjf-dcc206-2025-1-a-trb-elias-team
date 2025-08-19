/**
 * Sistema de Avaliação de Mãos de Poker - BAR-latro
 * 
 * Módulo responsável por identificar e avaliar combinações de cartas no poker.
 * Implementa algoritmos para reconhecer desde carta alta até sequência real,
 * calculando valores para comparação entre mãos.
 */

import { Carta, Valor, TipoMao } from './tipos';

/**
 * Mapeamento dos valores das cartas para ordenação
 */
const valorOrdem: { [key in Valor]: number } = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13
};

/**
 * Interface para resultado da avaliação de mão
 */
export interface ResultadoMao {
  tipo: TipoMao;
  valor: number;
  cartasUtilizadas: Carta[];
  descricao: string;
}

/**
 * Ordena as cartas pelo valor (menor para maior)
 * @param cartas Array de cartas a serem ordenadas
 * @returns Array de cartas ordenadas
 */
function ordenarCartas(cartas: Carta[]): Carta[] {
  return [...cartas].sort((a, b) => valorOrdem[a.valor] - valorOrdem[b.valor]);
}

/**
 * Conta quantas cartas de cada valor existem
 * @param cartas Array de cartas para contagem
 * @returns Map com valor das cartas e sua quantidade
 */
function contarValores(cartas: Carta[]): Map<Valor, number> {
  const contagem = new Map<Valor, number>();
  
  cartas.forEach(carta => {
    const atual = contagem.get(carta.valor) || 0;
    contagem.set(carta.valor, atual + 1);
  });
  
  return contagem;
}

/**
 * Conta quantas cartas de cada naipe existem
 * @param cartas Array de cartas para contagem
 * @returns Map com naipe das cartas e sua quantidade
 */
function contarNaipes(cartas: Carta[]): Map<string, number> {
  const contagem = new Map<string, number>();
  
  cartas.forEach(carta => {
    const atual = contagem.get(carta.tipo) || 0;
    contagem.set(carta.tipo, atual + 1);
  });
  
  return contagem;
}

/**
 * Verifica se há uma Quadra (4 cartas do mesmo valor)
 * @param cartas Array de cartas a verificar
 * @returns ResultadoMao se for Quadra, null caso contrário
 */
function eQuadra(cartas: Carta[]): ResultadoMao | null {
  const contagem = contarValores(cartas);
  
  for (const [valor, quantidade] of contagem) {
    if (quantidade >= 4) {
      const cartasQuadra = cartas.filter(carta => carta.valor === valor).slice(0, 4);
      return {
        tipo: 'Four of a Kind',
        valor: 8000 + valorOrdem[valor], // Alta prioridade + valor da carta
        cartasUtilizadas: cartasQuadra,
        descricao: `Quadra de ${valor}s`
      };
    }
  }
  
  return null;
}

/**
 * Verifica se há um Full House (trinca + par)
 * @param cartas Array de cartas a verificar
 * @returns ResultadoMao se for Full House, null caso contrário
 */
function eFullHouse(cartas: Carta[]): ResultadoMao | null {
  const contagem = contarValores(cartas);
  let trinca: Valor | null = null;
  let par: Valor | null = null;
  
  // Procurar trinca primeiro (maior valor se houver múltiplas)
  for (const [valor, quantidade] of contagem) {
    if (quantidade >= 3) {
      if (!trinca || valorOrdem[valor] > valorOrdem[trinca]) {
        trinca = valor;
      }
    }
  }
  
  // Se encontrou trinca, procurar par (diferente da trinca)
  if (trinca) {
    for (const [valor, quantidade] of contagem) {
      if (valor !== trinca && quantidade >= 2) {
        if (!par || valorOrdem[valor] > valorOrdem[par]) {
          par = valor;
        }
      }
    }
    
    // Se a trinca tem 4+ cartas, pode usar as extras como par
    if (!par && contagem.get(trinca)! >= 5) {
      par = trinca;
    }
  }
  
  if (trinca && par) {
    const cartasTrincas = cartas.filter(carta => carta.valor === trinca).slice(0, 3);
    const cartasPar = cartas.filter(carta => carta.valor === par && carta.valor !== trinca).slice(0, 2);
    
    // Se par é igual à trinca (caso de 5+ cartas iguais), usar as restantes
    if (par === trinca) {
      const cartasRestantes = cartas.filter(carta => carta.valor === trinca).slice(3, 5);
      cartasPar.push(...cartasRestantes);
    }
    
    return {
      tipo: 'Full House',
      valor: 7000 + valorOrdem[trinca] * 100 + valorOrdem[par],
      cartasUtilizadas: [...cartasTrincas, ...cartasPar],
      descricao: `Full House: ${trinca}s cheio de ${par}s`
    };
  }
  
  return null;
}

/**
 * Verifica se há um Flush (5 cartas do mesmo naipe)
 * @param cartas Array de cartas a verificar
 * @returns ResultadoMao se for Flush, null caso contrário
 */
function eFlush(cartas: Carta[]): ResultadoMao | null {
  const contagem = contarNaipes(cartas);
  
  for (const [naipe, quantidade] of contagem) {
    if (quantidade >= 5) {
      const cartasFlush = cartas
        .filter(carta => carta.tipo === naipe)
        .slice(-5); // Pegar as 5 maiores
      
      const maiorCarta = cartasFlush[cartasFlush.length - 1];
      
      return {
        tipo: 'Flush',
        valor: 6000 + valorOrdem[maiorCarta.valor],
        cartasUtilizadas: cartasFlush,
        descricao: `Flush de ${naipe}s`
      };
    }
  }
  
  return null;
}

/**
 * Verifica se há uma Sequência (Straight)
 * @param cartas Array de cartas a verificar
 * @returns ResultadoMao se for Straight, null caso contrário
 */
function eStraight(cartas: Carta[]): ResultadoMao | null {
  if (cartas.length < 5) return null;
  
  const valores = [...new Set(cartas.map(carta => valorOrdem[carta.valor]))].sort((a, b) => a - b);
  
  // Verificar sequência normal
  for (let i = 0; i <= valores.length - 5; i++) {
    let consecutivos = 1;
    for (let j = i + 1; j < valores.length; j++) {
      if (valores[j] === valores[j-1] + 1) {
        consecutivos++;
        if (consecutivos === 5) {
          const valorAlto = valores[j];
          return {
            tipo: 'Straight',
            valor: 5000 + valorAlto,
            cartasUtilizadas: cartas.filter(carta => {
              const val = valorOrdem[carta.valor];
              return val >= valorAlto - 4 && val <= valorAlto;
            }).slice(0, 5),
            descricao: `Sequência até ${Object.keys(valorOrdem).find(k => valorOrdem[k as Valor] === valorAlto)}`
          };
        }
      } else {
        consecutivos = 1;
      }
    }
  }
  
  // Verificar sequência especial A-2-3-4-5 (roda baixa)
  if (valores.includes(1) && valores.includes(2) && valores.includes(3) && valores.includes(4) && valores.includes(5)) {
    return {
      tipo: 'Straight',
      valor: 5000 + 5,
      cartasUtilizadas: cartas.filter(carta => ['A', '2', '3', '4', '5'].includes(carta.valor)).slice(0, 5),
      descricao: 'Sequência baixa (A-2-3-4-5)'
    };
  }
  
  return null;
}

/**
 * Verifica se há um Straight Flush (Sequência do mesmo naipe)
 */
function eStraightFlush(cartas: Carta[]): ResultadoMao | null {
  if (cartas.length < 5) return null;
  
  // Agrupar por naipe
  const porNaipe = new Map<string, Carta[]>();
  cartas.forEach(carta => {
    const naipe = carta.tipo;
    if (!porNaipe.has(naipe)) {
      porNaipe.set(naipe, []);
    }
    porNaipe.get(naipe)!.push(carta);
  });
  
  // Verificar cada naipe para straight
  for (const [naipe, cartasNaipe] of porNaipe) {
    if (cartasNaipe.length >= 5) {
      const straight = eStraight(cartasNaipe);
      if (straight) {
        // Verificar se é Royal Flush
        const valoresRoyal = straight.cartasUtilizadas.map(c => c.valor).sort();
        if (valoresRoyal.join(',') === 'A,J,K,Q,10' || valoresRoyal.join(',') === '10,A,J,K,Q') {
          return {
            tipo: 'Royal Flush',
            valor: 10000,
            cartasUtilizadas: straight.cartasUtilizadas,
            descricao: `Royal Flush de ${naipe}s`
          };
        }
        
        return {
          tipo: 'Straight Flush',
          valor: 9000 + straight.valor - 5000,
          cartasUtilizadas: straight.cartasUtilizadas,
          descricao: `Straight Flush de ${naipe}s`
        };
      }
    }
  }
  
  return null;
}

/**
 * Verifica se há uma Trinca (3 cartas do mesmo valor)
 */
function eTrinca(cartas: Carta[]): ResultadoMao | null {
  const contagem = contarValores(cartas);
  
  // Procurar a trinca de maior valor
  let melhorTrinca: Valor | null = null;
  for (const [valor, quantidade] of contagem) {
    if (quantidade >= 3) {
      if (!melhorTrinca || valorOrdem[valor] > valorOrdem[melhorTrinca]) {
        melhorTrinca = valor;
      }
    }
  }
  
  if (melhorTrinca) {
    const cartasTrincas = cartas.filter(carta => carta.valor === melhorTrinca).slice(0, 3);
    
    return {
      tipo: 'Three of a Kind',
      valor: 4000 + valorOrdem[melhorTrinca],
      cartasUtilizadas: cartasTrincas,
      descricao: `Trinca de ${melhorTrinca}s`
    };
  }
  
  return null;
}

/**
 * Verifica se há Dois Pares
 */
function eDoisPares(cartas: Carta[]): ResultadoMao | null {
  const contagem = contarValores(cartas);
  const pares: Valor[] = [];
  
  // Encontrar todos os pares
  for (const [valor, quantidade] of contagem) {
    if (quantidade >= 2) {
      pares.push(valor);
    }
  }
  
  if (pares.length >= 2) {
    // Ordenar pares por valor (maior primeiro)
    pares.sort((a, b) => valorOrdem[b] - valorOrdem[a]);
    
    const par1 = pares[0];
    const par2 = pares[1];
    
    const cartasPar1 = cartas.filter(carta => carta.valor === par1).slice(0, 2);
    const cartasPar2 = cartas.filter(carta => carta.valor === par2).slice(0, 2);
    
    return {
      tipo: 'Two Pair',
      valor: 3000 + valorOrdem[par1] * 100 + valorOrdem[par2],
      cartasUtilizadas: [...cartasPar1, ...cartasPar2],
      descricao: `Dois Pares: ${par1}s e ${par2}s`
    };
  }
  
  return null;
}

/**
 * Verifica se há Um Par
 */
function eUmPar(cartas: Carta[]): ResultadoMao | null {
  const contagem = contarValores(cartas);
  
  // Procurar o par de maior valor
  let melhorPar: Valor | null = null;
  for (const [valor, quantidade] of contagem) {
    if (quantidade >= 2) {
      if (!melhorPar || valorOrdem[valor] > valorOrdem[melhorPar]) {
        melhorPar = valor;
      }
    }
  }
  
  if (melhorPar) {
    const cartasPar = cartas.filter(carta => carta.valor === melhorPar).slice(0, 2);
    
    return {
      tipo: 'One Pair',
      valor: 2000 + valorOrdem[melhorPar],
      cartasUtilizadas: cartasPar,
      descricao: `Par de ${melhorPar}s`
    };
  }
  
  return null;
}

/**
 * Retorna Carta Alta (quando não há nenhuma combinação)
 */
function cartaAlta(cartas: Carta[]): ResultadoMao {
  const cartasOrdenadas = ordenarCartas(cartas);
  const maiorCarta = cartasOrdenadas[cartasOrdenadas.length - 1];
  
  return {
    tipo: 'High Card',
    valor: 1000 + valorOrdem[maiorCarta.valor],
    cartasUtilizadas: [maiorCarta],
    descricao: `Carta Alta: ${maiorCarta.valor} de ${maiorCarta.tipo}`
  };
}

/**
 * Função principal para avaliar uma mão de cartas
 * @param cartas Array de cartas a serem avaliadas
 * @returns Resultado da melhor combinação encontrada
 */
export function avaliarMao(cartas: Carta[]): ResultadoMao {
  if (!cartas || cartas.length === 0) {
    return {
      tipo: 'High Card',
      valor: 0,
      cartasUtilizadas: [],
      descricao: 'Nenhuma carta para avaliar'
    };
  }

  console.log('🎯 Avaliando mão:', cartas);
  
  // 1. Ordenar as cartas pelo valor
  const cartasOrdenadas = ordenarCartas(cartas);
  console.log('📊 Cartas ordenadas:', cartasOrdenadas);
  
  // 2. Verificar combinações da mais rara para a mais comum
  
  // Straight Flush e Royal Flush
  let resultado = eStraightFlush(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Quadra (Four of a Kind)
  resultado = eQuadra(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Full House (Trinca + Par)
  resultado = eFullHouse(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Flush (Todas do mesmo naipe)
  resultado = eFlush(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Straight (Sequência)
  resultado = eStraight(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Trinca (Three of a Kind)
  resultado = eTrinca(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Dois Pares
  resultado = eDoisPares(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Um Par
  resultado = eUmPar(cartasOrdenadas);
  if (resultado) {
    console.log('🎊 Encontrada:', resultado);
    return resultado;
  }
  
  // Carta Alta (padrão)
  resultado = cartaAlta(cartasOrdenadas);
  console.log('🎊 Encontrada:', resultado);
  return resultado;
}

/**
 * Compara duas mãos e retorna qual é melhor
 * @param mao1 Primeira mão
 * @param mao2 Segunda mão
 * @returns 1 se mao1 é melhor, -1 se mao2 é melhor, 0 se empate
 */
export function compararMaos(mao1: ResultadoMao, mao2: ResultadoMao): number {
  if (mao1.valor > mao2.valor) return 1;
  if (mao1.valor < mao2.valor) return -1;
  return 0;
}

export default avaliarMao;
