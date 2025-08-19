// DialogueBox.ts - Componente para caixas de diálogo
export default class DialogueBox extends HTMLElement {
  private dialogueShadow: ShadowRoot;
  private currentDialogueIndex = 0;
  private dialogues: string[] = [];
  private character: string = '🧔';
  private characterName: string = 'Bartender';

  constructor() {
    super();
    this.dialogueShadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.updateFromAttributes();
  }

  static get observedAttributes() {
    return ['dialogues', 'character', 'character-name', 'current-index'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.updateFromAttributes();
    }
  }

  private updateFromAttributes() {
    const dialoguesAttr = this.getAttribute('dialogues');
    const characterAttr = this.getAttribute('character');
    const characterNameAttr = this.getAttribute('character-name');
    const currentIndexAttr = this.getAttribute('current-index');

    if (dialoguesAttr) {
      try {
        this.dialogues = JSON.parse(dialoguesAttr);
      } catch (error) {
        console.warn('⚠️ Erro ao parsear dialogues:', error);
      }
    }

    if (characterAttr) {
      this.character = characterAttr;
    }

    if (characterNameAttr) {
      this.characterName = characterNameAttr;
    }

    if (currentIndexAttr) {
      this.currentDialogueIndex = parseInt(currentIndexAttr) || 0;
    }

    this.updateDialogue();
  }

  // Método público para definir diálogos
  setDialogues(dialogues: string[], character?: string, characterName?: string) {
    this.dialogues = dialogues;
    this.currentDialogueIndex = 0;
    
    if (character) this.character = character;
    if (characterName) this.characterName = characterName;
    
    this.updateDialogue();
  }

  // Avançar para próximo diálogo
  nextDialogue(): boolean {
    if (this.currentDialogueIndex < this.dialogues.length - 1) {
      this.currentDialogueIndex++;
      this.updateDialogue();
      return true;
    }
    return false; // Fim dos diálogos
  }

  // Voltar para diálogo anterior
  previousDialogue(): boolean {
    if (this.currentDialogueIndex > 0) {
      this.currentDialogueIndex--;
      this.updateDialogue();
      return true;
    }
    return false;
  }

  // Ir para diálogo específico
  goToDialogue(index: number): boolean {
    if (index >= 0 && index < this.dialogues.length) {
      this.currentDialogueIndex = index;
      this.updateDialogue();
      return true;
    }
    return false;
  }

  // Verificar se é o último diálogo
  isLastDialogue(): boolean {
    return this.currentDialogueIndex >= this.dialogues.length - 1;
  }

  // Obter progresso atual
  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentDialogueIndex + 1,
      total: this.dialogues.length,
      percentage: ((this.currentDialogueIndex + 1) / this.dialogues.length) * 100
    };
  }

  private updateDialogue() {
    const container = this.dialogueShadow.querySelector('.dialogue-container');
    if (container && this.dialogues.length > 0) {
      const currentDialogue = this.dialogues[this.currentDialogueIndex] || '';
      const progress = this.getProgress();
      
      container.innerHTML = `
        <div class="character-container">
          <div class="character-sprite">${this.character}</div>
          <div class="character-name">${this.characterName}</div>
        </div>
        
        <div class="dialogue-content">
          <div class="dialogue-text" id="dialogueText">${currentDialogue}</div>
          
          <div class="dialogue-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress.percentage}%"></div>
            </div>
            <span class="progress-text">${progress.current}/${progress.total}</span>
          </div>
          
          <div class="dialogue-controls">
            <button class="dialogue-btn prev-btn" id="prevBtn" ${this.currentDialogueIndex === 0 ? 'disabled' : ''}>
              ◀ Anterior
            </button>
            
            <button class="dialogue-btn next-btn" id="nextBtn">
              ${this.isLastDialogue() ? '✓ Aceitar Desafio' : 'Próximo ▶'}
            </button>
            
            ${this.dialogues.length > 1 ? '<button class="dialogue-btn skip-btn" id="skipBtn">⏭ Pular</button>' : ''}
          </div>
        </div>
      `;

      // Configurar event listeners
      this.setupDialogueListeners();
      
      // Animar entrada do texto
      this.animateTextEntry();
    }
  }

  private setupDialogueListeners() {
    const prevBtn = this.dialogueShadow.querySelector('#prevBtn');
    const nextBtn = this.dialogueShadow.querySelector('#nextBtn');
    const skipBtn = this.dialogueShadow.querySelector('#skipBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.previousDialogue();
        this.dispatchEvent(new CustomEvent('dialoguePrevious', {
          bubbles: true,
          detail: { index: this.currentDialogueIndex }
        }));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.isLastDialogue()) {
          // Último diálogo - aceitar desafio
          this.dispatchEvent(new CustomEvent('dialogueComplete', {
            bubbles: true,
            detail: { action: 'accept-challenge' }
          }));
        } else {
          // Próximo diálogo
          this.nextDialogue();
          this.dispatchEvent(new CustomEvent('dialogueNext', {
            bubbles: true,
            detail: { index: this.currentDialogueIndex }
          }));
        }
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('dialogueSkip', {
          bubbles: true,
          detail: { action: 'skip-dialogue' }
        }));
      });
    }
  }

  private animateTextEntry() {
    const textElement = this.dialogueShadow.querySelector('#dialogueText') as HTMLElement;
    if (textElement) {
      textElement.style.opacity = '0';
      textElement.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        textElement.style.transition = 'all 0.5s ease';
        textElement.style.opacity = '1';
        textElement.style.transform = 'translateY(0)';
      }, 100);
    }
  }

  private render() {
    this.dialogueShadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Arial', sans-serif;
        }

        .dialogue-container {
          background: linear-gradient(145deg, #2c1810, #3d2817);
          border: 3px solid #DAA520;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 
            0 15px 35px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
          animation: dialogue-enter 0.6s ease-out;
        }

        @keyframes dialogue-enter {
          0% {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .dialogue-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #DAA520, transparent);
          animation: shimmer-dialogue 3s infinite;
        }

        @keyframes shimmer-dialogue {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .character-container {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(218, 165, 32, 0.3);
        }

        .character-sprite {
          font-size: 3.5em;
          background: linear-gradient(145deg, #F4A460, #DEB887);
          border-radius: 50%;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #DAA520;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          animation: character-bounce 2s infinite ease-in-out;
        }

        @keyframes character-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .character-name {
          font-size: 1.4em;
          font-weight: bold;
          color: #DAA520;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          letter-spacing: 1px;
        }

        .dialogue-content {
          color: #fff;
        }

        .dialogue-text {
          background: rgba(0,0,0,0.3);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          font-size: 1.2em;
          line-height: 1.6;
          border: 1px solid rgba(218, 165, 32, 0.2);
          min-height: 60px;
          display: flex;
          align-items: center;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
        }

        .dialogue-progress {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid rgba(218, 165, 32, 0.3);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #DAA520, #FFD700);
          transition: width 0.5s ease;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .progress-text {
          color: #DAA520;
          font-weight: bold;
          font-size: 0.9em;
          min-width: 40px;
          text-align: center;
        }

        .dialogue-controls {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .dialogue-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-weight: bold;
          font-size: 1em;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
          min-width: 120px;
        }

        .dialogue-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .dialogue-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .prev-btn {
          background: linear-gradient(145deg, #6c757d, #495057);
          color: white;
          border: 2px solid #adb5bd;
        }

        .prev-btn:hover:not(:disabled) {
          background: linear-gradient(145deg, #5a6268, #3d4043);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(108, 117, 125, 0.3);
        }

        .prev-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .next-btn {
          background: linear-gradient(145deg, #28a745, #20c997);
          color: white;
          border: 2px solid #6f42c1;
          animation: pulse-accept 2s infinite;
        }

        @keyframes pulse-accept {
          0%, 100% { 
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3), 0 0 0 0 rgba(40, 167, 69, 0.7); 
          }
          50% { 
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3), 0 0 0 10px rgba(40, 167, 69, 0); 
          }
        }

        .next-btn:hover {
          background: linear-gradient(145deg, #218838, #1e7e34);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(40, 167, 69, 0.4);
          animation: none;
        }

        .skip-btn {
          background: linear-gradient(145deg, #fd7e14, #e8590c);
          color: white;
          border: 2px solid #fd7e14;
        }

        .skip-btn:hover {
          background: linear-gradient(145deg, #e8590c, #d63384);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(253, 126, 20, 0.3);
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .dialogue-container {
            padding: 20px;
          }
          
          .character-container {
            flex-direction: column;
            text-align: center;
          }
          
          .dialogue-text {
            font-size: 1em;
            padding: 15px;
          }
          
          .dialogue-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .dialogue-btn {
            min-width: auto;
          }
        }

        /* Animações extras */
        .dialogue-btn:active:not(:disabled) {
          transform: translateY(0);
          transition: transform 0.1s ease;
        }

        .character-sprite:hover {
          animation-duration: 0.5s;
        }
      </style>
      
      <div class="dialogue-container">
        <!-- Conteúdo será inserido dinamicamente -->
      </div>
    `;
  }
}

// Registrar o componente
customElements.define('dialogue-box', DialogueBox);
