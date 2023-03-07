import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../lib/utils/text_utils';
import '@testing-library/jest-dom';
import Home from '../pages';

describe('home screen', () => {
  it('renders the add button', () => {
    renderWithProviders(<Home />);
    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeInTheDocument();
  });
  it('renders the add visualization modal when a user clicks the add button', () => {
    renderWithProviders(<Home />);
    fireEvent.click(screen.getByRole('button'));
    const h2 = screen.getByText(/Add a visualization/i);
    expect(h2).toBeInTheDocument();
  });
});
