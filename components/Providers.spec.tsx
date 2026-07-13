import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Providers } from './Providers';

jest.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="mock-toaster" />,
}));

describe('Providers', () => {
  it('renderiza los children dentro del QueryClientProvider', () => {
    render(
      <Providers>
        <div data-testid="child">Hola</div>
      </Providers>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });

  it('renderiza el Toaster', () => {
    render(
      <Providers>
        <div />
      </Providers>,
    );

    expect(screen.getByTestId('mock-toaster')).toBeInTheDocument();
  });
});
