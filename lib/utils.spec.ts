import { cn } from './utils';

describe('cn', () => {
  it('concatena clases simples', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('maneja undefined y null', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra');
  });

  it('maneja condicionales (falsy values)', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('resuelve conflictos Tailwind con twMerge', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8');
  });

  it('resuelve clases condicionales con objetos', () => {
    expect(cn('base', { 'bg-red-500': true, 'bg-blue-500': false })).toBe('base bg-red-500');
  });

  it('retorna string vacio sin argumentos', () => {
    expect(cn()).toBe('');
  });
});
