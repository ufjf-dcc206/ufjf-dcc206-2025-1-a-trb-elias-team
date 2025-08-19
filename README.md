# � BAR-latro - Jogo de Cartas

## 📋 Sobre o Projeto

BAR-latro é um jogo de cartas inspirado no poker, desenvolvido em TypeScript com componentes web nativos. O jogo simula um ambiente de bar onde o jogador enfrenta desafios progressivos de pontuação usando mãos de poker.

## 🎯 Arquitetura e Integração

### 🏗️ Estrutura do Projeto

```
ICE-latro/
├── src/
│   ├── main.ts                 # Aplicação principal e integração
│   ├── main-debug.ts          # Versão de debug para testes
│   ├── components/            # Componentes Web Components
│   │   ├── BarScene.ts        # Cena do bar
│   │   ├── DialogueBox.ts     # Sistema de diálogos
│   │   ├── GameCard.ts        # Carta do jogo
│   │   ├── PlayerHand.ts      # Mão do jogador
│   │   └── ScoreBoard.ts      # Painel de pontuação
│   └── logic/                 # Lógica de negócio
│       ├── avaliarMao.ts      # Avaliação de mãos de poker
│       ├── baralho.ts         # Criação e embaralhamento
│       ├── deck.ts            # Estruturas do baralho
│       ├── gameManager.ts     # Gerenciador central
│       ├── gameState.ts       # Estado do jogo
│       ├── pontuacao.ts       # Sistema de pontuação
│       └── tipos.ts           # Definições de tipos
├── index.html                 # Página principal
├── demo.html                  # Página de demonstração
├── package.json               # Dependências e scripts
├── vite.config.ts             # Configuração do Vite
└── README.md                  # Documentação
```

## 🔧 Configuração do Ambiente

### Pré-requisitos
- Node.js (versão 16+)
- NPM ou Yarn

### Dependências

#### Dependências de Desenvolvimento
```json
{
  "devDependencies": {
    "@vitest/ui": "^3.2.4",
    "jsdom": "^26.1.0", 
    "vitest": "^3.2.4"
  }
}
```

#### Scripts Disponíveis
```json
{
  "scripts": {
    "dev": "vite",           # Servidor de desenvolvimento
    "build": "tsc && vite build",  # Build de produção
    "preview": "vite preview",     # Preview do build
    "test": "vitest",             # Executar testes
    "test:ui": "vitest --ui"      # Interface gráfica de testes
  }
}
```

### 🛠️ Configuração do Vite

O projeto utiliza Vite como bundler e servidor de desenvolvimento:

```typescript
// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',  // Simula ambiente do navegador
    globals: true,         // Disponibiliza globals de teste
  },
})
```

## 🎮 Sistema de Integração

### 1. Gerenciador Central (`GameManager`)

O `GameManager` atua como singleton centralizando toda a lógica do jogo:

```typescript
// Instância singleton
export const gameManager = new GameManager();

// Eventos principais
gameManager.on('sceneChange', handleSceneChange);
gameManager.on('roundStart', handleRoundStart); 
gameManager.on('victory', handleVictory);
gameManager.on('defeat', handleDefeat);
gameManager.on('gameStateUpdated', handleStateUpdate);
```

### 2. Arquitetura de Componentes

#### Web Components Nativos
Todos os componentes são implementados como Custom Elements:

```typescript
// Exemplo: BarScene.ts
export default class BarScene extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

// Registro do componente
customElements.define('bar-scene', BarScene);
```

#### Sistema de Comunicação
- **Props via Atributos**: Dados passados via `setAttribute()`
- **Eventos Customizados**: Comunicação entre componentes
- **Shadow DOM**: Encapsulamento de estilos

### 3. Fluxo de Inicialização

```typescript
class BARLatroGameApp {
  private async init() {
    // 1. Criar e embaralhar baralho
    const deck = createDeck();
    const shuffledDeck = shuffle(deck);
    
    // 2. Inicializar GameManager
    gameManager.initialize(shuffledDeck);
    
    // 3. Configurar eventos
    this.setupGameManagerEvents();
    
    // 4. Mostrar cena inicial
    this.showBarScene();
  }
}
```

## 🔧 Como Executar

### 1. Instalação
```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd ICE-latro

# Instalar dependências
npm install
```

### 2. Desenvolvimento
```bash
# Servidor de desenvolvimento
npm run dev

# Executar em http://localhost:5173
```

### 3. Build
```bash
# Build de produção
npm run build

# Testar build
npm run preview
```

### 4. Testes
```bash
# Executar testes
npm test

# Interface gráfica de testes
npm run test:ui
```

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Cenas
- **Bar Scene**: Ambiente inicial com diálogos
- **Game Board**: Mesa de jogo principal
- **Victory/Defeat**: Telas de resultado

### ✅ Componentes Interativos
- **PlayerHand**: Gerenciamento da mão do jogador
- **ScoreBoard**: Painel de pontuação em tempo real
- **GameCard**: Renderização de cartas
- **DialogueBox**: Sistema de narrativa

### ✅ Lógica de Jogo
- **Avaliação de Mãos**: Sistema completo de poker
- **Progressão**: Rodadas com dificuldade crescente
- **Estado Persistente**: Gerenciamento via GameState

## 🔄 Sistema de Estados

```typescript
// GameState gerencia:
- Mão do jogador
- Pontuação atual
- Meta de pontos
- Estatísticas (mãos, descartes, etc.)
- Deck disponível

// Eventos automáticos:
gameManager.emitGameStateUpdate(); // Atualiza todos os componentes
```

## 🎨 Sistema Visual

### Temas e Estilos
- **Gradientes**: Ambiente de bar com iluminação
- **Animações**: Transições suaves entre estados
- **Responsividade**: Adaptação para diferentes telas
- **Shadow DOM**: Isolamento de estilos por componente

## 🧪 Estratégia de Debug

### Arquivo de Debug (`main-debug.ts`)
```typescript
// Versão simplificada para testes
- Teste de DOM
- Verificação de imports
- Logs detalhados
- Interface de erro
```

### Logs do Sistema
```typescript
console.log('🎮 BAR-latro iniciando...');
console.log('🃏 Deck criado:', shuffledDeck.length);
console.log('✅ Jogo inicializado!');
```

## 📱 Responsividade

```css
@media (max-width: 768px) {
  .bar-content { padding: 10px; }
  .counter-surface { padding: 20px; }
  .background-elements { display: none; }
}
```

## 🚀 Deploy e Produção

### Build Otimizado
```bash
npm run build
# Gera: dist/ com arquivos otimizados
```

### Estrutura de Deploy
```
dist/
├── index.html
├── assets/
│   ├── main.[hash].js
│   └── main.[hash].css
```

## 🤝 Integração da Equipe

### Divisão de Responsabilidades
- **Integração & Ambiente**: Sistema de build, componentes, arquitetura
- **Lógica de Jogo**: Regras do poker, avaliação de mãos
- **Interface**: Design, animações, UX
- **Testes**: Casos de teste, validação

### Padrões de Código
- **TypeScript**: Tipagem forte
- **Modularização**: Separação clara de responsabilidades
- **Event-Driven**: Comunicação via eventos
- **Component-Based**: Reutilização de componentes

### Mecânicas

1. **Selecione até 5 cartas** clicando nelas
2. **Escolha sua ação:**
   - 🃏 **Sacar Carta** - Adiciona uma nova carta à sua mão
   - 🗑️ **Descartar** - Remove cartas selecionadas e saca novas (5 usos)
   - 🎯 **Jogar Mão** - Pontua com as cartas selecionadas (8 usos)
3. **Alcance a meta** antes de esgotar suas jogadas!

### Sistema de Pontuação

| Combinação | Multiplicador | Exemplo |
|------------|---------------|---------|
| 🎴 Carta Alta | 1x | Ás = 14 pontos |
| 👥 Par | 2x | Par de Reis = 26 × 2 = 52 |
| 👥👥 Dois Pares | 3x | Reis + Damas = 50 × 3 = 150 |
| 🎯 Trinca | 4x | Três Ases = 42 × 4 = 168 |
| 📈 Sequência | 5x | A-2-3-4-5 = 65 × 5 = 325 |
| 🌊 Flush | 6x | 5 cartas do mesmo naipe |
| 🏠 Full House | 8x | Trinca + Par |
| 🃏🃏🃏🃏 Quadra | 12x | Quatro cartas iguais |
| 🌊📈 Straight Flush | 50x | Sequência + Flush |
| 👑 Royal Flush | 100x | A-K-Q-J-10 do mesmo naipe |

### Progressão de Rodadas

| Rodada | Meta | Dificuldade |
|--------|------|-------------|
| 1 | 10.000 | 🟢 Iniciante |
| 2 | 20.000 | 🟡 Fácil |
| 3 | 40.000 | 🟠 Médio |
| 4 | 80.000 | 🔴 Difícil |
| 5+ | 160.000+ | ⚫ Impossível |

## 🛠️ Tecnologias Utilizadas

### Core
- **TypeScript** - Tipagem estática e desenvolvimento robusto
- **Vite** - Build tool moderno e desenvolvimento rápido
- **Web Components** - Componentes nativos reutilizáveis

### Arquitetura
- **Shadow DOM** - Encapsulamento de estilos
- **Custom Elements** - Componentes personalizados
- **Event-Driven** - Comunicação via eventos customizados
- **Modular Design** - Separação clara de responsabilidades

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos

1. **Clone o repositório** <br>
bash <br>
git clone https://github.com/seu-usuario/BAR-latro.git <br>
cd BAR-latro <br>


2. **Instale as dependências** <br>
bash <br>
npm install <br>


3. **Execute o servidor de desenvolvimento** <br>
bash <br>
npm run dev <br>


4. **Acesse no navegador** <br>

http://localhost:5173


### Build para Produção <br>
bash <br>
npm run build <br>
npm run preview <br>


## 🎨 Componentes Principais

### 🃏 GameCard
Componente individual de carta com:
- Símbolos Unicode autênticos (♠♥♦♣)
- Cores corretas para naipes
- Animações de hover e seleção
- Encapsulamento via Shadow DOM

### 🎯 PlayerHand
Interface principal do jogador:
- Seleção múltipla de cartas (máx. 5)
- Botões de ação contextuais
- Animações de entrada deslizante
- Feedback visual em tempo real

### 📊 ScoreBoard
Painel de estatísticas:
- Pontuação animada
- Barra de progresso
- Contadores de recursos
- Design responsivo

### 🍺 BarScene
Ambiente narrativo:
- Atmosfera imersiva
- Diálogos contextuais
- Transições suaves
- Elementos decorativos animados

### 💬 DialogueBox
Sistema de conversas:
- Navegação entre mensagens
- Barra de progresso
- Eventos customizados
- Interface responsiva

## 🎯 Funcionalidades Avançadas

### Sistema de Avaliação
typescript <br>
// Detecção automática da melhor combinação <br>
const resultado = avaliarMao(cartasSelecionadas); <br>
// Retorna: { tipo, valor, multiplicador, cartas } <br>


### Gerenciamento de Estado
typescript <br>
// Estado centralizado e reativo <br>
gameState.sacarCartas(quantidade); <br>
gameState.descartarCartas(cartas); <br>
gameState.jogarMao(cartas); <br>


### Eventos Customizados
typescript <br>
// Comunicação entre componentes <br>
component.dispatchEvent(new CustomEvent('selectionChange', { <br>
  detail: { selectedCards, count } <br>
})); <br>


## 🎮 Experiência do Usuário

### Animações e Transições
- **Cartas deslizantes** - Entrada cinematográfica
- **Pontuação crescente** - Contadores animados
- **Hover responsivo** - Feedback imediato
- **Transições suaves** - Movimentos fluidos

### Design Responsivo
- **Mobile-first** - Layouts adaptáveis
- **Touch-friendly** - Controles otimizados
- **Performance** - Animações otimizadas
- **Acessibilidade** - Suporte a leitores de tela

## 🎖️ Créditos

Desenvolvido como projeto acadêmico demonstrando:
- **Web Components modernos**
- **TypeScript avançado**
- **Arquitetura modular**
- **Design patterns**
- **UX/UI responsivo**

---

## 🔗 Links Úteis

- [📚 Documentação do TypeScript](https://www.typescriptlang.org/docs/)
- [🏗️ Guia de Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [⚡ Documentação do Vite](https://vitejs.dev/guide/)
- [🎮 Regras do Poker](https://www.pokerstars.com/poker/games/rules/)

