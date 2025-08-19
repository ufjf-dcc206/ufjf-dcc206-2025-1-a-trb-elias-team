// main.ts - ICE-latro Game - Usando componentes existentes
import { createDeck, shuffle } from './logic/baralho';
import { GameManager } from './logic/gameManager';

// Importar todos os componentes
import './components/GameCard';
import './components/PlayerHand';
import './components/ScoreBoard';
import './components/BarScene';
import './components/DialogueBox';

console.log('🎮 ICE-latro iniciando...');

class ICELatroGameApp {
  private gameArea: HTMLElement;
  private gameManager: GameManager;
  private barScene?: HTMLElement;
  private playerHand?: HTMLElement;
  private scoreBoard?: HTMLElement;

  constructor() {
    this.gameArea = document.getElementById('game-area')!;
    this.gameManager = new GameManager();
    this.init();
  }

  private async init() {
    try {
      console.log('🎮 Inicializando jogo...');
      
      // Criar e embaralhar baralho
      const deck = createDeck();
      const shuffledDeck = shuffle(deck);
      
      // Inicializar GameManager com o baralho
      this.gameManager.initialize(shuffledDeck);
      
      // Configurar eventos do GameManager
      this.setupGameManagerEvents();
      
      // Iniciar com a cena do bar
      this.showBarScene();
      
      console.log('✅ Jogo inicializado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      this.showError(error);
    }
  }

  private setupGameManagerEvents() {
    // Evento de mudança de cena
    this.gameManager.on('sceneChange', (data: any) => {
      console.log('🎭 Mudança de cena:', data);
      this.handleSceneChange(data.to);
    });

    // Evento de início de rodada
    this.gameManager.on('roundStart', (data: any) => {
      console.log('🎲 Nova rodada:', data);
      this.updateBarSceneForNewRound(data);
    });

    // Eventos de vitória e derrota
    this.gameManager.on('victory', (data: any) => {
      console.log('🏆 Vitória!', data);
      this.showVictoryScreen(data);
    });

    this.gameManager.on('defeat', (data: any) => {
      console.log('💔 Derrota!', data);
      this.showDefeatScreen(data);
    });
  }

  private showBarScene() {
    this.gameArea.innerHTML = '';
    
    // Criar BarScene component
    this.barScene = document.createElement('bar-scene');
    
    // Configurar informações da rodada atual
    const rodadaInfo = {
      numero: this.gameManager.getRodadaAtual(),
      metaDePontos: this.gameManager.getGameState()?.getMetaDePontos() || 100
    };
    
    this.barScene.setAttribute('rodada-info', JSON.stringify(rodadaInfo));
    
    // Event listener para quando o diálogo terminar
    this.barScene.addEventListener('dialogue-complete', () => {
      console.log('✅ Diálogo do bar completo, indo para mesa');
      this.gameManager.changeScene('game-board');
    });
    
    this.gameArea.appendChild(this.barScene);
  }

  private showGameBoard() {
    this.gameArea.innerHTML = '';
    
    // Container principal da mesa de jogo
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

    // Título
    const title = document.createElement('h1');
    title.textContent = '🎮 ICE-latro - Mesa de Jogo';
    title.style.cssText = `
      color: #ffd700;
      text-align: center;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    `;

    // ScoreBoard - usa o componente existente
    this.scoreBoard = document.createElement('score-board');
    this.updateScoreBoard();

    // PlayerHand - usa o componente existente  
    this.playerHand = document.createElement('player-hand');
    this.setupPlayerHandEvents();
    this.updatePlayerHand();

    // Botão para voltar ao bar (temporário para testes)
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
      this.gameManager.changeScene('bar-scene');
    });

    gameBoard.appendChild(title);
    gameBoard.appendChild(this.scoreBoard);
    gameBoard.appendChild(this.playerHand);
    gameBoard.appendChild(backButton);
    
    this.gameArea.appendChild(gameBoard);
  }

  private setupPlayerHandEvents() {
    if (!this.playerHand) return;

    // Evento de jogar mão
    this.playerHand.addEventListener('hand-played', (event: any) => {
      console.log('🎮 Mão jogada:', event.detail);
      const gameState = this.gameManager.getGameState();
      if (gameState) {
        // Processar a pontuação da mão jogada
        const pontos = event.detail.pontos || 0;
        gameState.adicionarPontos(pontos);
        gameState.jogarMao();
        
        // Verificar resultado
        const result = this.gameManager.processarAcaoJogador('playHand', event.detail);
        this.handleGameResult(result);
      }
    });

    // Evento de descarte
    this.playerHand.addEventListener('cards-discarded', (event: any) => {
      console.log('🗑️ Cartas descartadas:', event.detail);
      const gameState = this.gameManager.getGameState();
      if (gameState) {
        gameState.descartarCartas(event.detail.cards);
        gameState.usarDescarte();
        this.updatePlayerHand();
        this.updateScoreBoard();
      }
    });

    // Evento de compra de cartas
    this.playerHand.addEventListener('cards-drawn', (event: any) => {
      console.log('🃏 Cartas compradas:', event.detail);
      const gameState = this.gameManager.getGameState();
      if (gameState) {
        gameState.sacarCartas(event.detail.quantidade || 1);
        this.updatePlayerHand();
      }
    });

    // Evento de mudança de seleção
    this.playerHand.addEventListener('selectionChange', (event: any) => {
      console.log('🎯 Seleção mudou:', event.detail);
      // Aqui podemos mostrar preview da avaliação da mão
    });
  }

  private updatePlayerHand() {
    if (!this.playerHand) return;
    
    const gameState = this.gameManager.getGameState();
    if (gameState) {
      const cards = gameState.getPlayerHand();
      this.playerHand.setAttribute('cards', JSON.stringify(cards));
    }
  }

  private updateScoreBoard() {
    if (!this.scoreBoard) return;
    
    const gameState = this.gameManager.getGameState();
    if (gameState) {
      const stats = gameState.getEstatisticas();
      this.scoreBoard.setAttribute('stats', JSON.stringify(stats));
    }
  }

  private updateBarSceneForNewRound(rodadaInfo: any) {
    if (this.barScene) {
      this.barScene.setAttribute('rodada-info', JSON.stringify(rodadaInfo));
    }
  }

  private handleSceneChange(newScene: string) {
    switch (newScene) {
      case 'bar-scene':
        this.showBarScene();
        break;
      case 'game-board':
        this.showGameBoard();
        break;
      case 'victory':
        // será implementado via eventos separados
        break;
      case 'defeat':
        // será implementado via eventos separados
        break;
    }
  }

  private handleGameResult(result: string) {
    this.updateScoreBoard();
    this.updatePlayerHand();
    
    // O GameManager vai automaticamente emitir eventos de vitória/derrota se necessário
    const gameCondition = this.gameManager.verificarCondicoesJogo();
    
    if (gameCondition === 'victory') {
      // GameManager já vai emitir o evento
    } else if (gameCondition === 'defeat') {
      // GameManager já vai emitir o evento
    }
  }

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

    // Event listeners
    document.getElementById('continue-btn')?.addEventListener('click', () => {
      const novaRodada = this.gameManager.iniciarProximaRodada();
      this.gameManager.changeScene('bar-scene');
    });

    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.restartGame();
    });
  }

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
        <p style="font-size: 1.2em; margin-bottom: 30px; color: #ffcccb;">
          Não desista! Cada tentativa te torna mais forte!
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

    // Event listeners
    document.getElementById('retry-btn')?.addEventListener('click', () => {
      const gameState = this.gameManager.getGameState();
      if (gameState) {
        const metaAtual = gameState.getMetaDePontos();
        gameState.resetarRodada(metaAtual);
      }
      this.gameManager.changeScene('game-board');
    });

    document.getElementById('restart-full-btn')?.addEventListener('click', () => {
      this.restartGame();
    });
  }

  private restartGame() {
    // Reinicializar tudo do zero
    const deck = createDeck();
    const shuffledDeck = shuffle(deck);
    this.gameManager.reiniciarJogo(shuffledDeck);
    this.gameManager.changeScene('bar-scene');
  }

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
        <h1 style="color: #ff6b6b;">❌ Erro no ICE-latro</h1>
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
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado - iniciando ICE-latro App');
  new ICELatroGameApp();
});

export default ICELatroGameApp;
