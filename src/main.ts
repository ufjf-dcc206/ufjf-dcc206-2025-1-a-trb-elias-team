// main.ts - BAR-latro Game - Usando componentes existentes
import { createDeck, shuffle } from './logic/baralho';
import { gameManager } from './logic/gameManager'; // Usar a instância singleton

// Importar todos os componentes
import './components/GameCard';
import './components/PlayerHand';
import './components/ScoreBoard';
import './components/BarScene';
import './components/DialogueBox';

console.log('🎮 BAR-latro iniciando...');

class BARLatroGameApp {
  private gameArea: HTMLElement;
  private barScene?: HTMLElement;
  private playerHand?: HTMLElement;
  private scoreBoard?: HTMLElement;

  constructor() {
    this.gameArea = document.getElementById('game-area')!;
    this.init();
  }

  private async init() {
    try {
      console.log('🎮 Inicializando jogo...');
      
      // Criar e embaralhar baralho
      const deck = createDeck();
      const shuffledDeck = shuffle(deck);
      console.log('🃏 Deck criado e embaralhado:', shuffledDeck.length, 'cartas');
      
      // Inicializar GameManager com o baralho
      gameManager.initialize(shuffledDeck);
      
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
    gameManager.on('sceneChange', (data: any) => {
      console.log('🎭 Mudança de cena:', data);
      this.handleSceneChange(data.to);
    });

    // Evento de início de rodada
    gameManager.on('roundStart', (data: any) => {
      console.log('🎲 Nova rodada:', data);
      this.updateBarSceneForNewRound(data);
    });

    // Eventos de vitória e derrota
    gameManager.on('victory', (data: any) => {
      console.log('🏆 Vitória!', data);
      this.showVictoryScreen(data);
    });

    gameManager.on('defeat', (data: any) => {
      console.log('💔 Derrota!', data);
      this.showDefeatScreen(data);
    });

    // Evento de atualização do GameState
    gameManager.on('gameStateUpdated', (data: any) => {
      console.log('🔄 GameState atualizado:', data);
      this.updatePlayerHand();
      this.updateScoreBoard();
    });
  }

  private showBarScene() {
    this.gameArea.innerHTML = '';
    
    // Criar BarScene component
    this.barScene = document.createElement('bar-scene');
    
    // Configurar informações da rodada atual
    const rodadaInfo = {
      numero: gameManager.getRodadaAtual(),
      metaDePontos: gameManager.getGameState()?.getMetaDePontos() || 100
    };
    
    this.barScene.setAttribute('rodada-info', JSON.stringify(rodadaInfo));
    
    // Event listener para quando quiser iniciar o jogo
    this.barScene.addEventListener('startGame', (event: any) => {
      console.log('✅ Evento startGame recebido:', event.detail);
      gameManager.irParaMesaDeJogo();
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
    title.textContent = '🎮 BAR-latro - Mesa de Jogo';
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
      gameManager.changeScene('bar-scene');
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
      const gameState = gameManager.getGameState();
      if (gameState) {
        // Remover cartas jogadas da mão (SEM reposição automática)
        gameState.jogarCartas(event.detail.cards);
        
        // Processar a pontuação da mão jogada
        const pontos = event.detail.pontos || 0;
        gameState.adicionarPontos(pontos);
        gameState.jogarMao();
        
        // Emitir atualização do GameState
        gameManager.emitGameStateUpdate();
        
        // Verificar resultado
        const result = gameManager.processarAcaoJogador('playHand', event.detail);
        this.handleGameResult(result);
      }
    });

    // Evento de descarte
    this.playerHand.addEventListener('cards-discarded', (event: any) => {
      console.log('🗑️ Cartas descartadas:', event.detail);
      const gameState = gameManager.getGameState();
      if (gameState) {
        // Descartar cartas SEM reposição automática
        gameState.descartarCartas(event.detail.cards);
        gameState.usarDescarte();
        gameManager.emitGameStateUpdate(); // Emitir atualização
      }
    });

    // Evento de compra de cartas
    this.playerHand.addEventListener('cards-drawn', (event: any) => {
      console.log('🃏 Cartas compradas:', event.detail);
      const gameState = gameManager.getGameState();
      if (gameState) {
        gameState.sacarCartas(event.detail.quantidade || 1);
        gameManager.emitGameStateUpdate(); // Emitir atualização
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
    
    const gameState = gameManager.getGameState();
    if (gameState) {
      const cards = gameState.getPlayerHand();
      const stats = gameState.getEstatisticas();
      console.log('🃏 Atualizando PlayerHand com cartas:', cards.length, cards);
      this.playerHand.setAttribute('cards', JSON.stringify(cards));
      this.playerHand.setAttribute('stats', JSON.stringify(stats));
    } else {
      console.warn('⚠️ GameState não encontrado ao atualizar PlayerHand');
    }
  }

  private updateScoreBoard() {
    if (!this.scoreBoard) return;
    
    const gameState = gameManager.getGameState();
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
    // O GameManager e eventos gameStateUpdated cuidam das atualizações automaticamente
    const gameCondition = gameManager.verificarCondicoesJogo();
    
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
      const novaRodada = gameManager.iniciarProximaRodada();
      gameManager.changeScene('bar-scene');
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

  private restartGame() {
    // Reinicializar tudo do zero
    const deck = createDeck();
    const shuffledDeck = shuffle(deck);
    gameManager.reiniciarJogo(shuffledDeck);
    gameManager.changeScene('bar-scene');
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
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado - iniciando BAR-latro App');
  new BARLatroGameApp();
});

export default BARLatroGameApp;
