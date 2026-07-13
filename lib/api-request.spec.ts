import '@testing-library/jest-dom';
import {
  registerUser,
  loginUser,
  getProfile,
  getMaterials,
  getRecyclingCenters,
  createRecyclingRecord,
  getClientWeeklyRanking,
  getMyRecyclingRecords,
  getValidatorCenter,
  getValidatorRecyclingRecords,
  getAdminDashboard,
  getAdminCenters,
  getAdminCoupons,
  getWallet,
  redeemCoupon,
  ApiError,
} from './api';

const API_BASE_URL = 'http://localhost:3001';

describe('API request functions', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('registerUser', () => {
    it('envia los datos de registro al endpoint correcto', async () => {
      const mockResponse = {
        accessToken: 'jwt-token',
        user: { id: 'u1', firstNames: 'Ana', lastNames: 'Lopez', name: 'Ana Lopez', email: 'ana@test.com', phone: '987654321', role: 'Cliente', createdAt: '2025-01-01' },
        wallet: { balance: 0, redeemedCount: 0 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await registerUser({
        firstNames: 'Ana',
        lastNames: 'Lopez',
        email: 'ana@test.com',
        phone: '987654321',
        password: 'password123',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/register`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            firstNames: 'Ana',
            lastNames: 'Lopez',
            email: 'ana@test.com',
            phone: '987654321',
            password: 'password123',
          }),
        }),
      );
      expect(result.accessToken).toBe('jwt-token');
    });

    it('lanza ApiError si la respuesta no es ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ message: 'Ya existe' }),
      });

      await expect(
        registerUser({
          firstNames: 'Ana',
          lastNames: 'Lopez',
          email: 'ana@test.com',
          phone: '987654321',
          password: 'password123',
        }),
      ).rejects.toThrow(ApiError);
    });
  });

  describe('loginUser', () => {
    it('envia credenciales al endpoint de login', async () => {
      const mockResponse = {
        accessToken: 'jwt-login',
        user: { id: 'u1', firstNames: 'Ana', lastNames: 'Lopez', name: 'Ana Lopez', email: 'ana@test.com', phone: '987654321', role: 'Cliente', createdAt: '2025-01-01' },
        wallet: { balance: 100, redeemedCount: 3 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await loginUser({ email: 'ana@test.com', password: 'password123' });

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'ana@test.com', password: 'password123' }),
        }),
      );
      expect(result.accessToken).toBe('jwt-login');
    });
  });

  describe('getProfile', () => {
    it('solicita el perfil con token de autorizacion', async () => {
      const mockResponse = {
        user: { id: 'u1', firstNames: 'Ana', lastNames: 'Lopez', email: 'ana@test.com', phone: '987654321', role: 'Cliente', createdAt: '2025-01-01', updatedAt: '2025-01-01' },
        wallet: { walletId: 'w1', availablePoints: 100, totalPoints: 200 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getProfile('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/users/me`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        }),
      );
      expect(result.user.email).toBe('ana@test.com');
    });
  });

  describe('getMaterials', () => {
    it('obtiene la lista de materiales sin token', async () => {
      const mockMaterials = [
        { id: 'm1', name: 'Plastico', co2PerKg: 2.5, pointsPerKg: 10, isActive: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMaterials),
      });

      const result = await getMaterials();

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/materials`,
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getRecyclingCenters', () => {
    it('obtiene centros de reciclaje', async () => {
      const mockCenters = [
        { recyclingCenterId: 'c1', name: 'Centro A', address: 'Calle 1', phone: '123', isActive: true, createdAt: '2025-01-01', updatedAt: '2025-01-01' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCenters),
      });

      const result = await getRecyclingCenters();

      expect(result).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/recycling-centers`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('createRecyclingRecord', () => {
    it('envia los datos del reciclaje con token', async () => {
      const mockRecord = {
        id: 'r1', userId: 'u1', materialId: 'm1', recyclingCenterId: 'c1',
        weightKg: 2.5, savedCo2: 6.25, earnedPoints: 25, qrCode: 'QR-001',
        status: 'Pendiente', createdAt: '2025-01-01',
        user: { id: 'u1', firstNames: 'Ana', lastNames: 'Lopez', name: 'Ana Lopez' },
        material: { id: 'm1', name: 'Plastico' },
        recyclingCenter: { id: 'c1', name: 'Centro A' },
        validation: null,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecord),
      });

      await createRecyclingRecord('my-token', {
        materialId: 'm1',
        recyclingCenterId: 'c1',
        weightKg: 2.5,
        qrCode: 'QR-001',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/recycling-records`,
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });
  });

  describe('getClientWeeklyRanking', () => {
    it('solicita el ranking semanal con token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ period: {}, ranking: [] }),
      });

      await getClientWeeklyRanking('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/users/ranking/weekly`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('getWallet', () => {
    it('solicita la billetera con token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ wallet: {}, coupons: [], recentRedemptions: [] }),
      });

      await getWallet('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/wallet`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('redeemCoupon', () => {
    it('canea un cupon con token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'OK', wallet: {}, redemption: {} }),
      });

      await redeemCoupon('my-token', 'coupon-1');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/wallet/redeem`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ couponId: 'coupon-1' }),
        }),
      );
    });
  });

  describe('getMyRecyclingRecords', () => {
    it('obtiene los registros de reciclaje del usuario', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getMyRecyclingRecords('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/recycling-records/me`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('getValidatorCenter', () => {
    it('obtiene el centro del validador con token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ center: {}, records: [] }),
      });

      await getValidatorCenter('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/recycling-centers/me`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('getValidatorRecyclingRecords', () => {
    it('envia filtros como query params', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ center: {}, records: [] }),
      });

      await getValidatorRecyclingRecords('my-token', {
        status: 'Pendiente',
        search: 'QR-001',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/recycling-centers/me/recycling-records?'),
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('omite parametros vacios del query', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ center: {}, records: [] }),
      });

      await getValidatorRecyclingRecords('my-token', {});

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).not.toContain('?');
    });
  });

  describe('admin API', () => {
    it('getAdminDashboard con token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await getAdminDashboard('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/admin/dashboard`,
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('getAdminCenters con token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getAdminCenters('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/admin/recycling-centers`,
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('getAdminCoupons con token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await getAdminCoupons('my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/admin/coupons`,
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('error handling', () => {
    it('maneja respuesta de error con mensaje string', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Bad request' }),
      });

      await expect(
        getMaterials(),
      ).rejects.toThrow(ApiError);
    });

    it('maneja respuesta de error con message array', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: ['Campo requerido'] }),
      });

      await expect(
        getMaterials(),
      ).rejects.toThrow(ApiError);
    });

    it('maneja respuesta de error con formato error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal error' }),
      });

      await expect(
        getMaterials(),
      ).rejects.toThrow(ApiError);
    });

    it('maneja respuesta no-JSON en error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(
        getMaterials(),
      ).rejects.toThrow(ApiError);
    });

    it('maneja respuesta de error sin json() method', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => { throw new Error('no json'); },
      });

      await expect(
        getMaterials(),
      ).rejects.toThrow(ApiError);
    });
  });
});

describe('ApiError', () => {
  it('tiene las propiedades name, message y status', () => {
    const error = new ApiError('Not Found', 404);

    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
  });
});
