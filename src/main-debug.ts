// main-debug.ts - Versão simplificada para debug
console.log('🎮 Iniciando debug do ICE-latro...');

// Teste básico de DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado');
  
  const gameArea = document.getElementById('game-area');
  if (!gameArea) {
    console.error('❌ Elemento game-area não encontrado!');
    return;
  }
  
  console.log('✅ Elemento game-area encontrado:', gameArea);
  
  // Teste básico de exibição
  gameArea.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      padding: 40px;
      border-radius: 15px;
      color: white;
      text-align: center;
      font-family: Arial, sans-serif;
    ">
      <h1 style="color: #ffd700; margin-bottom: 30px;">🎮 ICE-latro Debug</h1>
      <p style="font-size: 1.2em; margin-bottom: 20px;">Sistema funcionando!</p>
      <button id="test-btn" style="
        background: linear-gradient(45deg, #ffd700, #ffed4a);
        border: none;
        padding: 15px 30px;
        font-size: 1.1em;
        border-radius: 8px;
        cursor: pointer;
        color: #000;
        font-weight: bold;
      ">Testar Componentes</button>
    </div>
  `;
  
  // Teste de evento
  const testBtn = document.getElementById('test-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      console.log('🔘 Botão clicado - eventos funcionando!');
      testBtn.textContent = 'Funcionou! ✅';
      testBtn.style.background = 'linear-gradient(45deg, #4caf50, #66bb6a)';
      
      // Testar imports
      setTimeout(() => {
        testImports();
      }, 1000);
    });
  }
});

async function testImports() {
  console.log('🔍 Testando imports...');
  
  try {
    // Testar baralho
    const { createDeck, shuffle } = await import('./logic/baralho');
    console.log('✅ Baralho importado com sucesso');
    
    const deck = createDeck();
    console.log('✅ Deck criado:', deck.length, 'cartas');
    
    const shuffled = shuffle(deck);
    console.log('✅ Deck embaralhado');
    
    // Testar GameCard
    await import('./components/GameCard');
    console.log('✅ GameCard importado');
    
    const gameCard = document.createElement('game-card');
    gameCard.setAttribute('tipos', 'copas');
    gameCard.setAttribute('valor', 'A');
    
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      gameArea.innerHTML += `
        <div style="margin-top: 20px; text-align: center;">
          <h3 style="color: #ffd700;">Teste do GameCard:</h3>
        </div>
      `;
      gameArea.appendChild(gameCard);
      console.log('✅ GameCard adicionado ao DOM');
    }
    
  } catch (error) {
    console.error('❌ Erro nos imports:', error);
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      gameArea.innerHTML += `
        <div style="color: #ff6b6b; margin-top: 20px; padding: 20px; border: 2px solid #ff6b6b; border-radius: 8px;">
          <h3>Erro encontrado:</h3>
          <pre>${error}</pre>
        </div>
      `;
    }
  }
}
