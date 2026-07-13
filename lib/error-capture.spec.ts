import { consumeLastCapturedError } from './error-capture';

describe('error-capture', () => {
  beforeEach(() => {
    consumeLastCapturedError();
  });

  it('devuelve undefined cuando no hay errores capturados', () => {
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it('captura un error via evento error y permite consumirlo', () => {
    const testError = new Error('test error');
    window.dispatchEvent(new ErrorEvent('error', { error: testError }));

    const consumed = consumeLastCapturedError();
    expect(consumed).toBe(testError);
  });

  it('captura un error via evento unhandledrejection', () => {
    const rejectionReason = 'rejection reason';
    const event = new Event('unhandledrejection') as any;
    event.reason = rejectionReason;
    window.dispatchEvent(event);

    const consumed = consumeLastCapturedError();
    expect(consumed).toBe('rejection reason');
  });

  it('solo permite consumir el error una vez', () => {
    const testError = new Error('once only');
    window.dispatchEvent(new ErrorEvent('error', { error: testError }));

    const first = consumeLastCapturedError();
    expect(first).toBe(testError);

    const second = consumeLastCapturedError();
    expect(second).toBeUndefined();
  });

  it('retorna undefined despues del TTL de 5 segundos', async () => {
    const mockNow = jest.spyOn(Date, 'now');
    mockNow.mockReturnValue(1000000);

    const testError = new Error('expired error');
    window.dispatchEvent(new ErrorEvent('error', { error: testError }));

    mockNow.mockReturnValue(1000000 + 6000);

    const consumed = consumeLastCapturedError();
    expect(consumed).toBeUndefined();

    mockNow.mockRestore();
  });
});
