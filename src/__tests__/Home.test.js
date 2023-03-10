import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../lib/utils/test_utils';
import '@testing-library/jest-dom';
import Home from '../pages';

describe('Home Screen', () => {
  beforeEach(() => {
    renderWithProviders(<Home />);
  });
  it('renders the add button', () => {
    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeInTheDocument();
  });

  it('renders the add visualization modal when a user clicks the add button', () => {
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    const h2 = screen.getByText(/Add a visualization/i);
    expect(h2).toBeInTheDocument();
    const options = screen.getAllByRole('option');
    options.forEach((option) => expect(option).toBeInTheDocument());
    const button = screen.getByRole('button', { name: /generate/i });
    expect(button).toBeInTheDocument();
  });
});
