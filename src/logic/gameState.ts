// src/logic/gameState.ts
import { Carta } from './tipos';
import { shuffle } from './baralho';

export class GameState {
  private playerHand: Carta[] = [];
  private deck: Carta[] = [];
  private discardPile: Carta[] = [];
  private originalDeck: Carta[] = []; // Referência ao deck original completo
  private maxHandSize = 8;

  // Variáveis do estado do jogo
  private pontuacaoAtual = 0;
  private metaDePontos = 100;
  private maosRestantes = 4;
  private descartesRestantes = 3;

  constructor(initialDeck: Carta[]) {
    this.originalDeck = [...initialDeck]; // Salvar deck original completo
    this.deck = [...initialDeck]; // Cópia do baralho para usar
  }

  // Getters para o estado do jogo
  getPontuacaoAtual(): number {
    return this.pontuacaoAtual;
  }

  getMetaDePontos(): number {
    return this.metaDePontos;
  }

  getMaosRestantes(): number {
    return this.maosRestantes;
  }

  getDescartesRestantes(): number {
    return this.descartesRestantes;
  }

  // Métodos para atualizar o estado do jogo
  adicionarPontos(pontos: number): void {
    this.pontuacaoAtual += pontos;
    console.log(`🎯 +${pontos} pontos! Total: ${this.pontuacaoAtual}/${this.metaDePontos}`);
  }

  jogarMao(): boolean {
    if (this.maosRestantes <= 0) {
      console.warn('⚠️ Não há mais mãos restantes!');
      return false;
    }
    
    this.maosRestantes--;
    this.descartesRestantes = 3; // Resetar descartes para a próxima mão
    console.log(`🎮 Mão jogada! Restantes: ${this.maosRestantes}`);
    return true;
  }

  usarDescarte(): boolean {
    if (this.descartesRestantes <= 0) {
      console.warn('⚠️ Não há mais descartes restantes!');
      return false;
    }
    
    this.descartesRestantes--;
    console.log(`🗑️ Descarte usado! Restantes: ${this.descartesRestantes}`);
    return true;
  }

  // Verificar se o jogo acabou
  isJogoAcabado(): boolean {
    return this.maosRestantes <= 0;
  }

  // Verificar se ganhou
  isVitoria(): boolean {
    return this.pontuacaoAtual >= this.metaDePontos;
  }

  // Resetar jogo
  resetarJogo(): void {
    this.pontuacaoAtual = 0;
    this.maosRestantes = 4;
    this.descartesRestantes = 3;
    console.log('🔄 Jogo resetado');
  }

  // Getter para acessar a mão do jogador
  getPlayerHand(): Carta[] {
    return [...this.playerHand]; // Retorna uma cópia para evitar mutação externa
  }

  // Getter para acessar o tamanho do baralho
  getDeckSize(): number {
    return this.deck.length;
  }

  // Getter para acessar o monte de descarte
  getDiscardPile(): Carta[] {
    return [...this.discardPile];
  }

  /**
   * Saca cartas do topo do baralho e adiciona à mão do jogador
   * @param quantidade - Número de cartas a sacar
   * @returns Array das cartas sacadas, ou array vazio se não houver cartas suficientes
   */
  sacarCartas(quantidade: number): Carta[] {
    // Verificar se há cartas suficientes no baralho
    if (quantidade <= 0) {
      console.warn('⚠️ Quantidade deve ser maior que zero');
      return [];
    }

    if (this.deck.length < quantidade) {
      console.warn(`⚠️ Baralho tem apenas ${this.deck.length} cartas, mas ${quantidade} foram solicitadas`);
      quantidade = this.deck.length; // Sacar apenas as cartas disponíveis
    }

    // Verificar se a mão não excederá o limite
    const cartasParaSacar = Math.min(quantidade, this.maxHandSize - this.playerHand.length);
    
    if (cartasParaSacar === 0) {
      console.warn(`⚠️ Mão já está no limite máximo de ${this.maxHandSize} cartas`);
      return [];
    }

    if (cartasParaSacar < quantidade) {
      console.warn(`⚠️ Só é possível sacar ${cartasParaSacar} cartas (limite da mão)`);
    }

    // Sacar cartas do topo do baralho
    const cartasSacadas = this.deck.splice(0, cartasParaSacar);
    
    // Adicionar à mão do jogador
    this.playerHand.push(...cartasSacadas);

    console.log(`🃏 Sacadas ${cartasSacadas.length} cartas. Mão: ${this.playerHand.length}/${this.maxHandSize}, Baralho: ${this.deck.length}`);
    
    return cartasSacadas;
  }

  /**
   * Descarta cartas selecionadas da mão SEM reposição automática
   * @param cartasParaDescartar - Array de cartas a serem descartadas
   * @returns Array das cartas descartadas
   */
  descartarCartas(cartasParaDescartar: Carta[]): Carta[] {
    if (!cartasParaDescartar || cartasParaDescartar.length === 0) {
      console.warn('⚠️ Nenhuma carta fornecida para descarte');
      return [];
    }

    const cartasDescartadas: Carta[] = [];
    
    // Remover cada carta da mão do jogador
    cartasParaDescartar.forEach(cartaParaDescartar => {
      const index = this.playerHand.findIndex(carta => 
        carta.tipo === cartaParaDescartar.tipo && carta.valor === cartaParaDescartar.valor
      );
      
      if (index !== -1) {
        const [cartaRemovida] = this.playerHand.splice(index, 1);
        cartasDescartadas.push(cartaRemovida);
        this.discardPile.push(cartaRemovida);
      } else {
        console.warn('⚠️ Carta não encontrada na mão:', cartaParaDescartar);
      }
    });

    console.log(`🗑️ Descartadas ${cartasDescartadas.length} cartas. Mão agora tem ${this.playerHand.length} cartas.`);

    return cartasDescartadas;
  }

  /**
   * Remove cartas jogadas da mão SEM reposição automática
   * @param cartasJogadas - Array de cartas que foram jogadas
   * @returns Array das cartas removidas
   */
  jogarCartas(cartasJogadas: Carta[]): Carta[] {
    if (!cartasJogadas || cartasJogadas.length === 0) {
      console.warn('⚠️ Nenhuma carta fornecida para jogar');
      return [];
    }

    const cartasRemovidas: Carta[] = [];
    
    // Remover cada carta da mão do jogador
    cartasJogadas.forEach(cartaJogada => {
      const index = this.playerHand.findIndex(carta => 
        carta.tipo === cartaJogada.tipo && carta.valor === cartaJogada.valor
      );
      
      if (index !== -1) {
        const [cartaRemovida] = this.playerHand.splice(index, 1);
        cartasRemovidas.push(cartaRemovida);
        this.discardPile.push(cartaRemovida);
      } else {
        console.warn('⚠️ Carta não encontrada na mão:', cartaJogada);
      }
    });

    console.log(`🎯 Jogadas ${cartasRemovidas.length} cartas. Mão agora tem ${this.playerHand.length} cartas.`);

    return cartasRemovidas;
  }

  /**
   * Inicializa a mão do jogador sacando cartas do baralho
   * @param quantidade - Número inicial de cartas (padrão: 7)
   */
  inicializarMao(quantidade: number = 7): Carta[] {
    console.log(`🎮 Inicializando mão com ${quantidade} cartas`);
    return this.sacarCartas(quantidade);
  }

  /**
   * Embaralha novamente as cartas do monte de descarte e adiciona ao baralho
   * Útil quando o baralho principal acabar
   */
  reembaralharDescarte(): void {
    if (this.discardPile.length === 0) {
      console.warn('⚠️ Monte de descarte está vazio');
      return;
    }

    console.log(`🔄 Reembaralhando ${this.discardPile.length} cartas do descarte`);
    
    // Embaralhar o monte de descarte
    for (let i = this.discardPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.discardPile[i], this.discardPile[j]] = [this.discardPile[j], this.discardPile[i]];
    }

    // Adicionar cartas embaralhadas ao baralho principal
    this.deck.push(...this.discardPile);
    this.discardPile = [];

    console.log(`✅ Baralho reabastecido. Total: ${this.deck.length} cartas`);
  }

  /**
   * Reinicia o jogo com um novo baralho
   */
  reiniciarJogo(novoDeck: Carta[]): void {
    this.deck = [...novoDeck];
    this.playerHand = [];
    this.discardPile = [];
    console.log('🔄 Jogo reiniciado');
  }

  /**
   * Retorna estatísticas do jogo atual
   */
  getEstatisticas() {
    return {
      // Estado da mão
      maoSize: this.playerHand.length,
      cartasNaMao: this.playerHand.length,
      maxMaoSize: this.maxHandSize,
      deckSize: this.deck.length,
      discardSize: this.discardPile.length,
      
      // Estado do jogo
      pontuacaoAtual: this.pontuacaoAtual,
      metaDePontos: this.metaDePontos,
      maosRestantes: this.maosRestantes,
      descartesRestantes: this.descartesRestantes,
      
      // Condições do jogo
      podeDescartar: this.playerHand.length > 0 && this.descartesRestantes > 0,
      podeSacar: this.deck.length > 0 && this.playerHand.length < this.maxHandSize,
      podeJogar: this.playerHand.length > 0 && this.maosRestantes > 0,
      jogoAcabado: this.isJogoAcabado(),
      vitoria: this.isVitoria()
    };
  }

  /**
   * Resetar para uma nova rodada - Restaura TODAS as cartas originais
   */
  resetarRodada(novaMetaDePontos: number) {
    console.log(`🔄 Iniciando reset da rodada - Meta anterior: ${this.metaDePontos}, Nova meta: ${novaMetaDePontos}`);
    
    // Resetar pontuação e configurações
    this.pontuacaoAtual = 0;
    this.metaDePontos = novaMetaDePontos;
    this.maosRestantes = 4; // Resetar mãos
    this.descartesRestantes = 3; // Resetar descartes
    
    // Limpar completamente a mão do jogador
    console.log(`🃏 Limpando mão do jogador (${this.playerHand.length} cartas)`);
    this.playerHand = [];
    
    // Restaurar deck original completo (todas as 52 cartas)
    console.log(`🔄 Restaurando deck original completo (${this.originalDeck.length} cartas)`);
    this.deck = [...this.originalDeck]; // Restaurar todas as cartas originais
    this.discardPile = []; // Limpar monte de descarte
    
    // Reembaralhar o deck completo
    this.deck = shuffle(this.deck);
    
    console.log(`✅ Rodada resetada - Nova meta: ${novaMetaDePontos}`);
    console.log(`📊 Estado após reset: Deck=${this.deck.length}, Mão=${this.playerHand.length}, Descarte=${this.discardPile.length}`);
  }
}

export default GameState;
