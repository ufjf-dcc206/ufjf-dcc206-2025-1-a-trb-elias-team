import { describe, it, expect } from 'vitest';
import { createDeck } from './deck';

describe('createDeck', () => {
  it('should return an array with 4 cards', () => {
    const deck = createDeck();
    expect(deck).toBeInstanceOf(Array);
    expect(deck.length).toBe(4);
  });

  it('should contain the card "K"', () => {
    const deck = createDeck();
    expect(deck).toContain('K');
  });
});