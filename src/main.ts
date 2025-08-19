// main.ts - Versão de debug do ICE-latro
console.log('🎮 ICE-latro carregando...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado');
  
  const gameArea = document.getElementById('game-area');
  if (!gameArea) {
    console.error('❌ Elemento game-area não encontrado');
    return;
  }
  
  console.log('✅ Elemento game-area encontrado');
  
  // Criar interface de teste
  gameArea.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      padding: 40px;
      border-radius: 15px;
      color: white;
      text-align: center;
      font-family: Arial, sans-serif;
      margin: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    ">
      <h1 style="color: #ffd700; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
        🎮 ICE-latro
      </h1>
      <p style="font-size: 1.2em; margin-bottom: 30px; opacity: 0.9;">
        Sistema de debug funcionando!
      </p>
      <button id="test-card" style="
        background: linear-gradient(45deg, #ffd700, #ffed4a);
        border: none;
        padding: 15px 30px;
        font-size: 1.1em;
        border-radius: 8px;
        cursor: pointer;
        color: #000;
        font-weight: bold;
        margin: 0 10px;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        Testar GameCard
      </button>
      <button id="test-logic" style="
        background: linear-gradient(45deg, #4caf50, #66bb6a);
        border: none;
        padding: 15px 30px;
        font-size: 1.1em;
        border-radius: 8px;
        cursor: pointer;
        color: white;
        font-weight: bold;
        margin: 0 10px;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        Testar Lógica
      </button>
    </div>
    <div id="test-results" style="margin-top: 20px;"></div>
  `;
  
  // Configurar eventos dos botões
  const testCardBtn = document.getElementById('test-card');
  const testLogicBtn = document.getElementById('test-logic');
  const resultsDiv = document.getElementById('test-results');
  
  if (testCardBtn) {
    testCardBtn.addEventListener('click', async () => {
      console.log('🃏 Testando GameCard...');
      
      try {
        // Importar GameCard
        await import('./components/GameCard');
        console.log('✅ GameCard importado com sucesso');
        
        // Criar carta de teste
        const card = document.createElement('game-card');
        card.setAttribute('tipos', 'copas');
        card.setAttribute('valor', 'A');
        
        if (resultsDiv) {
          resultsDiv.innerHTML = `
            <div style="
              background: rgba(76, 175, 80, 0.1);
              border: 2px solid #4caf50;
              border-radius: 10px;
              padding: 20px;
              margin: 20px;
              text-align: center;
            ">
              <h3 style="color: #4caf50; margin-bottom: 15px;">✅ GameCard Funcionando!</h3>
              <p style="color: white; margin-bottom: 15px;">Carta de teste criada:</p>
            </div>
          `;
          resultsDiv.appendChild(card);
        }
        
      } catch (error) {
        console.error('❌ Erro ao testar GameCard:', error);
        if (resultsDiv) {
          resultsDiv.innerHTML = `
            <div style="
              background: rgba(255, 107, 107, 0.1);
              border: 2px solid #ff6b6b;
              border-radius: 10px;
              padding: 20px;
              margin: 20px;
              color: #ff6b6b;
              text-align: center;
            ">
              <h3>❌ Erro no GameCard</h3>
              <pre style="text-align: left; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">${error}</pre>
            </div>
          `;
        }
      }
    });
  }
  
  if (testLogicBtn) {
    testLogicBtn.addEventListener('click', async () => {
      console.log('🎲 Testando lógica do jogo...');
      
      try {
        // Testar baralho
        const { createDeck, shuffle } = await import('./logic/baralho');
        const deck = createDeck();
        const shuffledDeck = shuffle(deck);
        
        console.log('✅ Baralho criado:', deck.length, 'cartas');
        console.log('✅ Baralho embaralhado');
        
        // Testar avaliação de mão
        const { avaliarMao } = await import('./logic/avaliarMao');
        const testHand = shuffledDeck.slice(0, 5);
        const result = avaliarMao(testHand);
        
        console.log('✅ Mão avaliada:', result);
        
        if (resultsDiv) {
          resultsDiv.innerHTML = `
            <div style="
              background: rgba(76, 175, 80, 0.1);
              border: 2px solid #4caf50;
              border-radius: 10px;
              padding: 20px;
              margin: 20px;
              color: white;
            ">
              <h3 style="color: #4caf50; margin-bottom: 15px;">✅ Lógica Funcionando!</h3>
              <p><strong>Baralho:</strong> ${deck.length} cartas criadas</p>
              <p><strong>Mão de teste:</strong> ${testHand.map(c => c.valor + c.tipo).join(', ')}</p>
              <p><strong>Resultado:</strong> ${result.tipo} (${result.descricao})</p>
            </div>
          `;
        }
        
      } catch (error) {
        console.error('❌ Erro ao testar lógica:', error);
        if (resultsDiv) {
          resultsDiv.innerHTML = `
            <div style="
              background: rgba(255, 107, 107, 0.1);
              border: 2px solid #ff6b6b;
              border-radius: 10px;
              padding: 20px;
              margin: 20px;
              color: #ff6b6b;
              text-align: center;
            ">
              <h3>❌ Erro na Lógica</h3>
              <pre style="text-align: left; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">${error}</pre>
            </div>
          `;
        }
      }
    });
  }
  
  console.log('✅ Interface de debug criada');
});


