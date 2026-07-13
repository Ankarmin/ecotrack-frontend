import { expect, test } from '@playwright/test';

import { buildJwt, fulfillJson } from './helpers';

const apiBaseUrl = 'http://localhost:3001';

test('permite iniciar sesión y cargar el dashboard del cliente', async ({ page }) => {
  const accessToken = buildJwt({
    sub: 'client-1',
    email: 'carla@example.com',
    role: 'Cliente',
  });

  await page.route(`${apiBaseUrl}/auth/login`, async (route) => {
    await fulfillJson(
      route,
      {
        accessToken,
        user: {
          id: 'client-1',
          firstNames: 'Carla',
          lastNames: 'Ramirez',
          name: 'Carla Ramirez',
          email: 'carla@example.com',
          phone: '+51987654321',
          role: 'Cliente',
          createdAt: '2026-07-01T10:00:00.000Z',
        },
        wallet: {
          walletId: 'wallet-1',
          availablePoints: 120,
          totalPoints: 180,
          balance: 120,
          redeemedCount: 1,
        },
      },
      201,
    );
  });

  await page.route(`${apiBaseUrl}/users/me`, async (route) => {
    await fulfillJson(route, {
      user: {
        id: 'client-1',
        firstNames: 'Carla',
        lastNames: 'Ramirez',
        email: 'carla@example.com',
        phone: '+51987654321',
        role: 'Cliente',
        createdAt: '2026-07-01T10:00:00.000Z',
        updatedAt: '2026-07-01T10:00:00.000Z',
      },
      wallet: {
        walletId: 'wallet-1',
        availablePoints: 120,
        totalPoints: 180,
      },
    });
  });

  await page.route(`${apiBaseUrl}/recycling-records/me`, async (route) => {
    await fulfillJson(route, [
      {
        id: 'record-1',
        userId: 'client-1',
        materialId: 'mat-1',
        recyclingCenterId: 'center-1',
        weightKg: 3.2,
        savedCo2: 5.76,
        earnedPoints: 45,
        qrCode: 'ECO-CLIENT-001',
        status: 'Validado',
        createdAt: '2026-07-10T14:30:00.000Z',
        user: null,
        material: { id: 'mat-1', name: 'PET' },
        recyclingCenter: { id: 'center-1', name: 'Centro Norte' },
        validation: null,
      },
    ]);
  });

  await page.goto('/auth/login');

  await page.locator('#login-email').fill('carla@example.com');
  await page.locator('#login-password').fill('SuperSeguro123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Tu impacto este mes' })).toBeVisible();
  await expect(page.getByText(/Hola, Carla/)).toBeVisible();
  await expect(page.getByText('Registros recientes')).toBeVisible();
});

test('muestra el ranking semanal del panel de gamificación para clientes', async ({ page }) => {
  const accessToken = buildJwt({
    sub: 'client-1',
    email: 'carla@example.com',
    role: 'Cliente',
  });

  await page.route(`${apiBaseUrl}/auth/login`, async (route) => {
    await fulfillJson(
      route,
      {
        accessToken,
        user: {
          id: 'client-1',
          firstNames: 'Carla',
          lastNames: 'Ramirez',
          name: 'Carla Ramirez',
          email: 'carla@example.com',
          phone: '+51987654321',
          role: 'Cliente',
          createdAt: '2026-07-01T10:00:00.000Z',
        },
        wallet: {
          walletId: 'wallet-1',
          availablePoints: 120,
          totalPoints: 180,
          balance: 120,
          redeemedCount: 1,
        },
      },
      201,
    );
  });

  await page.route(`${apiBaseUrl}/users/me`, async (route) => {
    await fulfillJson(route, {
      user: {
        id: 'client-1',
        firstNames: 'Carla',
        lastNames: 'Ramirez',
        email: 'carla@example.com',
        phone: '+51987654321',
        role: 'Cliente',
        createdAt: '2026-07-01T10:00:00.000Z',
        updatedAt: '2026-07-01T10:00:00.000Z',
      },
      wallet: {
        walletId: 'wallet-1',
        availablePoints: 120,
        totalPoints: 180,
      },
    });
  });

  await page.route(`${apiBaseUrl}/recycling-records/me`, async (route) => {
    await fulfillJson(route, []);
  });

  await page.route(`${apiBaseUrl}/users/ranking/weekly`, async (route) => {
    await fulfillJson(route, {
      period: {
        startAt: '2026-07-06T00:00:00.000Z',
        endAt: '2026-07-13T00:00:00.000Z',
      },
      ranking: [
        {
          rank: 1,
          userId: 'client-1',
          firstNames: 'Carla',
          lastNames: 'Ramirez',
          name: 'Carla Ramirez',
          totalRecords: 4,
          validatedRecords: 4,
          pendingRecords: 0,
          totalWeightKg: 8.5,
          totalPoints: 120,
          isCurrentUser: true,
        },
        {
          rank: 2,
          userId: 'client-2',
          firstNames: 'Luis',
          lastNames: 'Torres',
          name: 'Luis Torres',
          totalRecords: 3,
          validatedRecords: 3,
          pendingRecords: 0,
          totalWeightKg: 7.25,
          totalPoints: 98,
        },
      ],
    });
  });

  await page.goto('/auth/login');
  await page.locator('#login-email').fill('carla@example.com');
  await page.locator('#login-password').fill('SuperSeguro123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole('link', { name: 'Ranking', exact: true }).click();

  await expect(page.getByRole('heading', { name: /Ranking semanal de clientes/i })).toBeVisible();
  await expect(page.getByText(/Semana:/)).toBeVisible();
  await expect(page.getByRole('link', { name: '💰 Billetera' })).toBeVisible();
  await expect(page.getByText('Carla Ramirez')).toBeVisible();
  await expect(page.getByText('4 reciclajes').first()).toBeVisible();
});
