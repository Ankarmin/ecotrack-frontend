import type { Route } from '@playwright/test';

export function buildJwt(payload: Record<string, unknown>) {
  const encode = (value: string) => Buffer.from(value).toString('base64url');

  return [
    encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    encode(JSON.stringify(payload)),
    'playwright-signature',
  ].join('.');
}

export async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}
