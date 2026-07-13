import { renderHook } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  let matchMediaMock: jest.MockedFunction<(query: string) => MediaQueryList>;

  function createMediaQueryList(query: string, matches: boolean): MediaQueryList {
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    } as MediaQueryList;
  }

  beforeEach(() => {
    matchMediaMock = jest
      .fn<MediaQueryList, [string]>()
      .mockImplementation((query: string) => createMediaQueryList(query, false));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  it('devuelve false para viewport grande', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('devuelve true para viewport menor a 768px', () => {
    matchMediaMock.mockImplementation((query: string) => createMediaQueryList(query, true));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('llama a matchMedia con el query correcto', () => {
    renderHook(() => useIsMobile());
    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)');
  });
});
