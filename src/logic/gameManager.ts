/**
 * GameManager.ts - Gerenciador central do jogo BAR-latro
 * Controla fluxo de jogo, cenas, rodadas e eventos do sistema
 */

import GameState from './gameState';

export type GameScene = 'bar-scene' | 'game-board' | 'victory' | 'defeat';

export interface RodadaInfo {
  numero: number;
  metaDePontos: number;
  dificuldade: string;
}

/**
 * Classe principal que gerencia o estado global do jogo
 * Controla transições de cena, eventos e progresso das rodadas
 */
export class GameManager {
  private gameState: GameState | null = null;
  private currentScene: GameScene = 'bar-scene';
  private rodadaAtual: number = 0;
  private callbacks: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeCallbacks();
  }

  /**
   * Inicializa sistema de callbacks para eventos do jogo
   */
  private initializeCallbacks() {
    this.callbacks.set('sceneChange', []);
    this.callbacks.set('roundStart', []);
    this.callbacks.set('roundEnd', []);
    this.callbacks.set('victory', []);
    this.callbacks.set('defeat', []);
  }

  /**
   * Registra callback para evento específico
   */
  on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  /**
   * Emite evento para todos os callbacks registrados
   */
  private emit(event: string, data?: any) {
    const eventCallbacks = this.callbacks.get(event) || [];
    eventCallbacks.forEach(callback => callback(data));
  }

  /**
   * Inicializa o jogo com baralho embaralhado
   */
  initialize(deck: any[]) {
    this.gameState = new GameState(deck);
    this.currentScene = 'bar-scene';
    this.rodadaAtual = 0;
  }

  /**
   * Altera a cena atual do jogo e emite evento de mudança
   */
  changeScene(newScene: GameScene) {
    const oldScene = this.currentScene;
    this.currentScene = newScene;
    
    this.emit('sceneChange', { from: oldScene, to: newScene });
  }

  /**
   * Inicia a próxima rodada do jogo
   * Gerencia transição da rodada 0 para 1 e dobramento de pontos
   */
  iniciarProximaRodada(): RodadaInfo {
    if (!this.gameState) {
      throw new Error('GameState não inicializado');
    }

    if (this.rodadaAtual === 0) {
      this.rodadaAtual = 1;
      const rodadaInfo: RodadaInfo = {
        numero: this.rodadaAtual,
        metaDePontos: this.gameState.getMetaDePontos(),
        dificuldade: this.getDificuldadeText(this.rodadaAtual)
      };
      
      this.emit('roundStart', rodadaInfo);
      return rodadaInfo;
    }

    const novaMetaDePontos = this.gameState.getMetaDePontos() * 2;
    
    this.gameState.resetarRodada(novaMetaDePontos);
    
    this.rodadaAtual++;
    if(this.rodadaAtual >= 6){
      this.rodadaAtual = 6;
    }

    const rodadaInfo: RodadaInfo = {
      numero: this.rodadaAtual,
      metaDePontos: novaMetaDePontos,
      dificuldade: this.getDificuldadeText(this.rodadaAtual)
    };

    this.emit('roundStart', rodadaInfo);
    
    return rodadaInfo;
  }

  /**
   * Retorna texto de dificuldade baseado no número da rodada
   */
  private getDificuldadeText(rodada: number): string {
    if (rodada === 1) return 'Iniciante';
    if (rodada === 2) return 'Fácil';
    if (rodada === 3) return 'Médio';
    if (rodada === 4) return 'Difícil';
    if (rodada === 5) return 'Muito Difícil';
    return 'Mestre';
  }

  /**
   * Verifica condições de vitória/derrota da rodada atual
   */
  verificarCondicoesJogo(): 'playing' | 'victory' | 'defeat' {
    if (!this.gameState) return 'playing';

    const stats = this.gameState.getEstatisticas();
    
    if (stats.pontuacaoAtual >= stats.metaDePontos) {
      this.emit('victory', { 
        rodada: this.rodadaAtual,
        pontuacao: stats.pontuacaoAtual,
        meta: stats.metaDePontos
      });
      return 'victory';
    }
    
    if (stats.maosRestantes === 0 && stats.pontuacaoAtual < stats.metaDePontos) {
      this.emit('defeat', {
        rodada: this.rodadaAtual,
        pontuacao: stats.pontuacaoAtual,
        meta: stats.metaDePontos
      });
      return 'defeat';
    }
    
    return 'playing';
  }

  /**
   * Processa ação do jogador e verifica resultado da rodada
   */
  processarAcaoJogador(action: string, data?: any): 'continue' | 'victory' | 'defeat' {
    if (!this.gameState) return 'continue';

    this.emit('gameStateUpdated', {
      cards: this.gameState.getPlayerHand(),
      stats: this.gameState.getEstatisticas()
    });

    const resultado = this.verificarCondicoesJogo();
    
    if (resultado === 'victory') return 'victory';
    if (resultado === 'defeat') return 'defeat';
    return 'continue';
  }

  /**
   * Retorna a cena atual do jogo
   */
  getCurrentScene(): GameScene {
    return this.currentScene;
  }

  /**
   * Retorna o número da rodada atual
   */
  getRodadaAtual(): number {
    return this.rodadaAtual;
  }

  /**
   * Retorna instância do GameState
   */
  getGameState(): GameState | null {
    return this.gameState;
  }

  /**
   * Emite evento de atualização do estado do jogo
   */
  emitGameStateUpdate() {
    if (this.gameState) {
      this.emit('gameStateUpdated', {
        cards: this.gameState.getPlayerHand(),
        stats: this.gameState.getEstatisticas()
      });
    }
  }

  /**
   * Reinicia o jogo completamente com novo baralho
   */
  reiniciarJogo(deck: any[]) {
    this.gameState = new GameState(deck);
    this.currentScene = 'bar-scene';
    this.rodadaAtual = 0;
  }

  /**
   * Continua para próxima rodada após vitória
   */
  continuarParaProximaRodada() {
    const rodadaInfo = this.iniciarProximaRodada();
    this.changeScene('bar-scene');
    return rodadaInfo;
  }

  /**
   * Transiciona para a mesa de jogo e inicializa mão do jogador
   */
  irParaMesaDeJogo() {
    this.changeScene('game-board');
    
    if (this.gameState) {
      const cartas = this.gameState.inicializarMao(7);
      
      this.emit('gameStateUpdated', {
        cards: cartas,
        stats: this.gameState.getEstatisticas()
      });
    }
  }

  /**
   * Aceita o desafio inicial e transiciona da rodada 0 para 1
   */
  aceitarDesafioInicial() {
    if (this.rodadaAtual === 0) {
      const rodadaInfo = this.iniciarProximaRodada();
      return rodadaInfo;
    }
    return null;
  }
}

/**
 * Instância singleton do GameManager para uso global
 */
export const gameManager = new GameManager();

export default GameManager;
