import { expect, test } from '@playwright/test';

import { buildJwt, fulfillJson } from './helpers';

const apiBaseUrl = 'http://localhost:3001';
const validatorRecordsUrl = new RegExp(
  `${apiBaseUrl}/recycling-centers/me/recycling-records(?:\\?.*)?$`,
);

type ValidatorRecord = {
  id: string;
  userId: string;
  materialId: string;
  recyclingCenterId: string;
  weightKg: number;
  savedCo2: number;
  earnedPoints: number;
  qrCode: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    firstNames: string;
    lastNames: string;
    name: string;
  };
  material: {
    id: string;
    name: string;
  };
  recyclingCenter: {
    id: string;
    name: string;
  };
  validation: {
    id: string;
    validatorUserId: string;
    validatedAt: string;
  } | null;
};

test('permite validar un reciclaje por QR manual desde el panel del centro', async ({ page }) => {
  const accessToken = buildJwt({
    sub: 'validator-1',
    email: 'validator@example.com',
    role: 'Validador',
  });

  let summary = {
    assignment: {
      id: 'assignment-1',
      assignedAt: '2026-07-01T10:00:00.000Z',
    },
    center: {
      id: 'center-1',
      name: 'Centro Eco Sur',
      address: 'Av. Primavera 500',
      district: 'Surco',
      isActive: true,
      schedules: [],
      createdAt: '2026-07-01T10:00:00.000Z',
      updatedAt: '2026-07-01T10:00:00.000Z',
    },
    stats: {
      totalRecords: 1,
      pendingRecords: 1,
      validatedRecords: 0,
      rejectedRecords: 0,
      todayRecords: 1,
    },
  };

  let records: ValidatorRecord[] = [
    {
      id: 'record-1',
      userId: 'client-1',
      materialId: 'mat-1',
      recyclingCenterId: 'center-1',
      weightKg: 2.5,
      savedCo2: 4.5,
      earnedPoints: 35,
      qrCode: 'ECO-VALIDAR-001',
      status: 'Pendiente',
      createdAt: '2026-07-10T14:30:00.000Z',
      user: {
        id: 'client-1',
        firstNames: 'Maria',
        lastNames: 'Lopez',
        name: 'Maria Lopez',
      },
      material: {
        id: 'mat-1',
        name: 'PET',
      },
      recyclingCenter: {
        id: 'center-1',
        name: 'Centro Eco Sur',
      },
      validation: null,
    },
  ];

  await page.route(`${apiBaseUrl}/auth/login`, async (route) => {
    await fulfillJson(
      route,
      {
        accessToken,
        user: {
          id: 'validator-1',
          firstNames: 'Valeria',
          lastNames: 'Perez',
          name: 'Valeria Perez',
          email: 'validator@example.com',
          phone: '+51911111111',
          role: 'Validador',
          createdAt: '2026-07-01T10:00:00.000Z',
        },
        wallet: null,
      },
      201,
    );
  });

  await page.route(`${apiBaseUrl}/users/me`, async (route) => {
    await fulfillJson(route, {
      user: {
        id: 'validator-1',
        firstNames: 'Valeria',
        lastNames: 'Perez',
        email: 'validator@example.com',
        phone: '+51911111111',
        role: 'Validador',
        createdAt: '2026-07-01T10:00:00.000Z',
        updatedAt: '2026-07-01T10:00:00.000Z',
      },
      wallet: null,
    });
  });

  await page.route(`${apiBaseUrl}/recycling-records/me`, async (route) => {
    await fulfillJson(route, []);
  });

  await page.route(`${apiBaseUrl}/recycling-centers/me`, async (route) => {
    await fulfillJson(route, summary);
  });

  await page.route(validatorRecordsUrl, async (route) => {
    await fulfillJson(route, {
      center: {
        id: summary.center.id,
        name: summary.center.name,
      },
      records,
    });
  });

  await page.route(`${apiBaseUrl}/recycling-centers/me/recycling-records/validate-qr`, async (route) => {
    const payload = JSON.parse(route.request().postData() ?? '{}') as {
      qrCode?: string;
      status?: string;
    };

    expect(payload).toMatchObject({
      qrCode: 'ECO-VALIDAR-001',
      status: 'Validado',
    });

    records = records.map((record) =>
      record.qrCode === payload.qrCode
        ? {
            ...record,
            status: 'Validado',
            validation: {
              id: 'validation-1',
              validatorUserId: 'validator-1',
              validatedAt: '2026-07-10T14:45:00.000Z',
            },
          }
        : record,
    );
    summary = {
      ...summary,
      stats: {
        ...summary.stats,
        pendingRecords: 0,
        validatedRecords: 1,
      },
    };

    await fulfillJson(route, records[0]);
  });

  await page.goto('/auth/login');
  await page.locator('#login-email').fill('validator@example.com');
  await page.locator('#login-password').fill('SuperSeguro123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole('link', { name: 'Centro', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Centro de Acopio' })).toBeVisible();
  await expect(page.getByText('1 pendientes por revisar en esta vista.')).toBeVisible();

  await page.getByPlaceholder('Ej. ECO-ABC123').fill('ECO-VALIDAR-001');
  await page.getByRole('button', { name: 'Confirmar llegada' }).click();

  await expect(page.getByText('Reciclaje validado correctamente.')).toBeVisible();
  await expect(page.getByText('0 pendientes por revisar en esta vista.')).toBeVisible();
  await expect(page.getByRole('link', { name: /ECO-VALIDAR-001/i })).toContainText('Validado');
});
