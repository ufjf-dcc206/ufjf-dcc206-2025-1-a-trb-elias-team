/**
 * main.ts - Aplicação principal do BAR-latro
 * Gerencia a inicialização e orquestração geral do jogo de cartas
 */

import { createDeck, shuffle } from './logic/baralho';
import { gameManager } from './logic/gameManager';

import './components/GameCard';
import './components/PlayerHand';
import './components/ScoreBoard';
import './components/BarScene';
import './components/DialogueBox';

/**
 * Classe principal da aplicação BAR-latro
 * Responsável por gerenciar as cenas do jogo e coordenar componentes
 */
class BARLatroGameApp {
  private gameArea: HTMLElement;
  private barScene?: HTMLElement;
  private playerHand?: HTMLElement;
  private scoreBoard?: HTMLElement;

  constructor() {
    this.gameArea = document.getElementById('game-area')!;
    this.init();
  }

  /**
   * Inicializa o jogo criando o baralho e configurando eventos
   */
  private async init() {
    try {
      const deck = createDeck();
      const shuffledDeck = shuffle(deck);
      
      gameManager.initialize(shuffledDeck);
      this.setupGameManagerEvents();
      this.showBarScene();
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      this.showError(error);
    }
  }

  /**
   * Configura os event listeners do GameManager
   * Gerencia mudanças de cena, vitórias, derrotas e atualizações de estado
   */
  private setupGameManagerEvents() {
    gameManager.on('sceneChange', (data: any) => {
      this.handleSceneChange(data.to);
    });

    gameManager.on('roundStart', (data: any) => {
      this.updateBarSceneForNewRound(data);
    });

    gameManager.on('victory', (data: any) => {
      this.showVictoryScreen(data);
    });

    gameManager.on('defeat', (data: any) => {
      this.showDefeatScreen(data);
    });

    gameManager.on('gameStateUpdated', (data: any) => {
      this.updatePlayerHand();
      this.updateScoreBoard();
    });
  }

  /**
   * Exibe a cena do bar com diálogos e informações da rodada
   */
  private showBarScene() {
    this.gameArea.innerHTML = '';
    
    this.barScene = document.createElement('bar-scene');
    
    const rodadaAtual = gameManager.getRodadaAtual();
    const rodadaInfo = {
      numero: rodadaAtual,
      metaDePontos: gameManager.getGameState()?.getMetaDePontos() || 100,
      dificuldade: this.getDificuldadeTextLocal(rodadaAtual)
    };
    
    this.barScene.setAttribute('rodada-info', JSON.stringify(rodadaInfo));
    
    this.barScene.addEventListener('startGame', (event: any) => {
      if (rodadaAtual === 0) {
        const novaRodada = gameManager.aceitarDesafioInicial();
      }
      gameManager.irParaMesaDeJogo();
    });
    
    this.gameArea.appendChild(this.barScene);
  }

  /**
   * Exibe a mesa de jogo com componentes PlayerHand e ScoreBoard
   */
  private showGameBoard() {
    this.gameArea.innerHTML = '';
    
    const gameBoard = document.createElement('div');
    gameBoard.className = 'game-board';
    gameBoard.style.cssText = `
      background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
      min-height: 100vh;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    const title = document.createElement('h1');
    title.textContent = '🎮 BAR-latro - Mesa de Jogo';
    title.style.cssText = `
      color: #ffd700;
      text-align: center;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    `;

    this.scoreBoard = document.createElement('score-board');
    this.updateScoreBoard();

    this.playerHand = document.createElement('player-hand');
    this.setupPlayerHandEvents();

    const backButton = document.createElement('button');
    backButton.textContent = '🍺 Voltar ao Bar';
    backButton.style.cssText = `
      background: linear-gradient(45deg, #666, #888);
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      align-self: center;
    `;
    backButton.addEventListener('click', () => {
      gameManager.changeScene('bar-scene');
    });

    gameBoard.appendChild(title);
    gameBoard.appendChild(this.scoreBoard);
    gameBoard.appendChild(this.playerHand);
    gameBoard.appendChild(backButton);
    
    this.gameArea.appendChild(gameBoard);
  }

  /**
   * Configura os event listeners da mão do jogador
   * Gerencia jogadas, descartes e compra de cartas
   */
  private setupPlayerHandEvents() {
    if (!this.playerHand) return;

    this.playerHand.addEventListener('hand-played', (event: any) => {
      const gameState = gameManager.getGameState();
      if (gameState) {
        gameState.jogarCartas(event.detail.cards);
        
        const pontos = event.detail.pontos || 0;
        gameState.adicionarPontos(pontos);
        gameState.jogarMao();
        
        gameManager.emitGameStateUpdate();
        
        const result = gameManager.processarAcaoJogador('playHand', event.detail);
        this.handleGameResult(result);
      }
    });

    this.playerHand.addEventListener('cards-discarded', (event: any) => {
      const gameState = gameManager.getGameState();
      if (gameState) {
        gameState.descartarCartas(event.detail.cards);
        gameState.usarDescarte();
        gameManager.emitGameStateUpdate();
      }
    });

    this.playerHand.addEventListener('cards-drawn', (event: any) => {
      const gameState = gameManager.getGameState();
      if (gameState) {
        gameState.sacarCartas(event.detail.quantidade || 1);
        gameManager.emitGameStateUpdate();
      }
    });

    this.playerHand.addEventListener('selectionChange', (event: any) => {
      // Preview da avaliação da mão selecionada
    });
  }

  /**
   * Atualiza o componente PlayerHand com cartas e estatísticas atuais
   */
  private updatePlayerHand() {
    if (!this.playerHand) return;
    
    const gameState = gameManager.getGameState();
    if (gameState) {
      const cards = gameState.getPlayerHand();
      const stats = gameState.getEstatisticas();
      this.playerHand.setAttribute('cards', JSON.stringify(cards));
      this.playerHand.setAttribute('stats', JSON.stringify(stats));
    }
  }

  /**
   * Atualiza o componente ScoreBoard com estatísticas atuais
   */
  private updateScoreBoard() {
    if (!this.scoreBoard) return;
    
    const gameState = gameManager.getGameState();
    if (gameState) {
      const stats = gameState.getEstatisticas();
      this.scoreBoard.setAttribute('stats', JSON.stringify(stats));
    }
  }

  /**
   * Atualiza a cena do bar com informações da nova rodada
   */
  private updateBarSceneForNewRound(rodadaInfo: any) {
    if (this.barScene) {
      this.barScene.setAttribute('rodada-info', JSON.stringify(rodadaInfo));
    }
  }

  /**
   * Gerencia mudanças entre diferentes cenas do jogo
   */
  private handleSceneChange(newScene: string) {
    switch (newScene) {
      case 'bar-scene':
        this.showBarScene();
        break;
      case 'game-board':
        this.showGameBoard();
        break;
      case 'victory':
        break;
      case 'defeat':
        break;
    }
  }

  /**
   * Processa o resultado de uma ação do jogador
   * Verifica automaticamente condições de vitória/derrota
   */
  private handleGameResult(result: string) {
    const gameCondition = gameManager.verificarCondicoesJogo();
  }

  /**
   * Exibe tela de vitória com opções de continuar ou sair
   */
  private showVictoryScreen(data: any) {
    this.gameArea.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #2d5a27, #4a7c59);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        padding: 20px;
      ">
        <h1 style="font-size: 4em; color: #ffd700; margin-bottom: 30px;">
          🏆 VITÓRIA! 🏆
        </h1>
        <p style="font-size: 1.5em; margin-bottom: 30px;">
          Parabéns! Você conseguiu ${data.pontuacao} pontos na Rodada ${data.rodada}!
        </p>
        <div>
          <button id="continue-btn" style="
            background: linear-gradient(45deg, #ffd700, #ffed4a);
            border: none;
            padding: 20px 40px;
            font-size: 1.2em;
            border-radius: 10px;
            cursor: pointer;
            margin: 0 10px;
            color: #000;
            font-weight: bold;
          ">
            🚀 Próxima Rodada
          </button>
          <button id="restart-btn" style="
            background: linear-gradient(45deg, #666, #888);
            border: none;
            padding: 20px 40px;
            font-size: 1.2em;
            border-radius: 10px;
            cursor: pointer;
            margin: 0 10px;
            color: white;
            font-weight: bold;
          ">
            🔄 Reiniciar
          </button>
        </div>
      </div>
    `;

    document.getElementById('continue-btn')?.addEventListener('click', () => {
      const novaRodada = gameManager.iniciarProximaRodada();
      gameManager.changeScene('bar-scene');
    });

    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.restartGame();
    });
  }

  /**
   * Exibe tela de derrota com opção de tentar novamente
   */
  private showDefeatScreen(data: any) {
    this.gameArea.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #5a2727, #7c4a4a);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        text-align: center;
        padding: 20px;
      ">
        <h1 style="font-size: 4em; color: #ff6b6b; margin-bottom: 30px;">
          💔 DERROTA 💔
        </h1>
        <p style="font-size: 1.5em; margin-bottom: 30px;">
          Você fez ${data.pontuacao}/${data.meta} pontos na Rodada ${data.rodada}
        </p>
        <div>
          <button id="retry-btn" style="
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            border: none;
            padding: 20px 40px;
            font-size: 1.2em;
            border-radius: 10px;
            cursor: pointer;
            margin: 0 10px;
            color: white;
            font-weight: bold;
          ">
            ⚔️ Tentar Novamente
          </button>
          <button id="restart-full-btn" style="
            background: linear-gradient(45deg, #666, #888);
            border: none;
            padding: 20px 40px;
            font-size: 1.2em;
            border-radius: 10px;
            cursor: pointer;
            margin: 0 10px;
            color: white;
            font-weight: bold;
          ">
            🏠 Reiniciar Jogo
          </button>
        </div>
      </div>
    `;

    document.getElementById('retry-btn')?.addEventListener('click', () => {
      const gameState = gameManager.getGameState();
      if (gameState) {
        const metaAtual = gameState.getMetaDePontos();
        gameState.resetarRodada(metaAtual);
      }
      gameManager.changeScene('game-board');
    });

    document.getElementById('restart-full-btn')?.addEventListener('click', () => {
      this.restartGame();
    });
  }

  /**
   * Reinicia o jogo completamente com novo baralho
   */
  private restartGame() {
    const deck = createDeck();
    const shuffledDeck = shuffle(deck);
    gameManager.reiniciarJogo(shuffledDeck);
    gameManager.changeScene('bar-scene');
  }

  /**
   * Exibe tela de erro com opção de recarregar
   */
  private showError(error: any) {
    this.gameArea.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #5a2727, #7c4a4a);
        padding: 40px;
        border-radius: 15px;
        color: white;
        text-align: center;
        margin: 20px;
      ">
        <h1 style="color: #ff6b6b;">❌ Erro no BAR-latro</h1>
        <p>Ocorreu um erro durante a inicialização:</p>
        <pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">${error}</pre>
        <button onclick="location.reload()" style="
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          font-weight: bold;
          margin-top: 20px;
        ">🔄 Tentar Novamente</button>
      </div>
    `;
  }

  /**
   * Retorna o texto de dificuldade baseado no número da rodada
   */
  private getDificuldadeTextLocal(rodada: number): string {
    if (rodada === 0) return 'Apresentação';
    if (rodada === 1) return 'Iniciante';
    if (rodada === 2) return 'Fácil';
    if (rodada === 3) return 'Médio';
    if (rodada === 4) return 'Difícil';
    if (rodada === 5) return 'Muito Difícil';
    return 'Mestre';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BARLatroGameApp();
});

export default BARLatroGameApp;
