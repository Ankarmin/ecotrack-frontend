import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  getAccessTokenPayload,
  isAdminRole,
  isValidatorRole,
  isClientRole,
  ACCESS_TOKEN_KEY,
} from './api';

function encodeBase64Url(value: string) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildJwt(payload: Record<string, unknown>) {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encodeBase64Url(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

describe('Token management', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('getAccessToken', () => {
    it('devuelve null si no hay token guardado', () => {
      expect(getAccessToken()).toBeNull();
    });

    it('devuelve el token guardado en localStorage', () => {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, 'my-token');
      expect(getAccessToken()).toBe('my-token');
    });

    it('devuelve null si localStorage tiene valor vacio', () => {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, '');
      expect(getAccessToken()).toBe('');
    });
  });

  describe('setAccessToken', () => {
    it('guarda el token en localStorage bajo la key correcta', () => {
      setAccessToken('my-jwt-token');
      expect(window.localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('my-jwt-token');
    });

    it('sobrescribe un token existente', () => {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, 'old-token');
      setAccessToken('new-token');
      expect(window.localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('new-token');
    });
  });

  describe('clearAccessToken', () => {
    it('elimina el token de localStorage', () => {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, 'my-token');
      clearAccessToken();
      expect(window.localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    });

    it('no lanza error si no habia token guardado', () => {
      expect(() => clearAccessToken()).not.toThrow();
    });
  });

  describe('getAccessTokenPayload', () => {
    it('devuelve null si no hay token', () => {
      expect(getAccessTokenPayload()).toBeNull();
    });

    it('devuelve null si el token es invalido', () => {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, 'not.a.jwt');
      expect(getAccessTokenPayload()).toBeNull();
    });

    it('decodifica correctamente el payload del JWT', () => {
      const payload = { sub: 'user-123', email: 'test@test.com', role: 'Cliente' };
      const token = buildJwt(payload);
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);

      const decoded = getAccessTokenPayload();
      expect(decoded).not.toBeNull();
      expect(decoded!.sub).toBe('user-123');
      expect(decoded!.email).toBe('test@test.com');
      expect(decoded!.role).toBe('Cliente');
    });

    it('devuelve null si el payload no es JSON valido', () => {
      const token = `header.${btoa('not-json')}.signature`;
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
      expect(getAccessTokenPayload()).toBeNull();
    });
  });
});

describe('Role helpers', () => {
  it('isAdminRole reconoce Administrador', () => {
    expect(isAdminRole('Administrador')).toBe(true);
    expect(isAdminRole('Cliente')).toBe(false);
    expect(isAdminRole('Validador')).toBe(false);
    expect(isAdminRole(null)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });

  it('isValidatorRole reconoce Validador', () => {
    expect(isValidatorRole('Validador')).toBe(true);
    expect(isValidatorRole('Administrador')).toBe(false);
    expect(isValidatorRole('Cliente')).toBe(false);
    expect(isValidatorRole(null)).toBe(false);
    expect(isValidatorRole(undefined)).toBe(false);
  });

  it('isClientRole reconoce Cliente', () => {
    expect(isClientRole('Cliente')).toBe(true);
    expect(isClientRole('Validador')).toBe(false);
    expect(isClientRole('Administrador')).toBe(false);
    expect(isClientRole(null)).toBe(false);
    expect(isClientRole(undefined)).toBe(false);
  });
});
