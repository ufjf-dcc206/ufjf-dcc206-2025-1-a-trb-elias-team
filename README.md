# 🎲 BAR-latro

**Um jogo de poker moderno desenvolvido com Web Components e TypeScript**

## 📖 Sobre o Projeto

BAR-latro é um jogo de poker inovador que combina mecânicas clássicas de poker com uma progressão de dificuldade desafiadora. Desenvolvido inteiramente com **Web Components nativos** e **TypeScript** oferece uma experiência imersiva com narrativa envolvente em um ambiente de bar.

### ✨ Características Principais

- 🃏 **Sistema de Poker Completo** - Todas as combinações clássicas implementadas
- 🎭 **Narrativa Imersiva** - Diálogos contextuais entre rodadas
- 🔄 **Progressão de Dificuldade** - Metas que dobram a cada rodada
- 🎨 **Interface Moderna** - Animações suaves e design responsivo
- ⚡ **Performance Otimizada** - Web Components nativos sem frameworks

## 🎮 Como Jogar

### Objetivo
Alcance a meta de pontos em até **8 mãos** com apenas **5 descartes** disponíveis por rodada.

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
git clone https://github.com/seu-usuario/ICE-latro.git <br>
cd ICE-latro <br>


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

