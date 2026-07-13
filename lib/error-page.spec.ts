import { renderErrorPage } from './error-page';

describe('renderErrorPage', () => {
  it('devuelve un HTML completo', () => {
    const html = renderErrorPage();

    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<title>This page didn\'t load</title>');
    expect(html).toContain('Try again');
    expect(html).toContain('Go home');
  });

  it('incluye estilos inline', () => {
    const html = renderErrorPage();

    expect(html).toContain('<style>');
    expect(html).toContain('font: 15px/1.5 system-ui');
  });

  it('incluye boton de recargar y link a home', () => {
    const html = renderErrorPage();

    expect(html).toContain('location.reload()');
    expect(html).toContain('href="/"');
  });
});
