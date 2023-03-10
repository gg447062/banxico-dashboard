import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../lib/utils/test_utils';
import '@testing-library/jest-dom';
import Home from '../pages';
import { initialStateWithVisualizations } from '../lib/utils/test_utils';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Visualization component', () => {
  let testStore;
  beforeEach(() => {
    const { store } = renderWithProviders(<Home />, {
      preloadedState: initialStateWithVisualizations,
    });
    testStore = store;
  });
  it('renders visualizations from store', () => {
    const visualizations = screen.getAllByTestId('visualization');
    expect(visualizations.length).toBe(2);
  });

  it('renders edit and remove buttons', () => {
    const visualizations = screen.getAllByTestId('visualization');
    expect(visualizations.length).toBe(2);

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    const removeButtons = screen.getAllByRole('button', {
      name: /remove-visualization/i,
    });

    expect(editButtons.length).toBe(2);
    expect(removeButtons.length).toBe(2);
  });

  it('renders both tables and graphs', () => {
    const visualizations = screen.getAllByTestId('visualization');
    expect(visualizations.length).toBe(2);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const graph = screen.getByTestId('graph');
    expect(graph).toBeInTheDocument();
  });

  it('clicking remove button removes a visualization from the screen and the store', () => {
    const removeButtons = screen.getAllByRole('button', {
      name: /remove-visualization/i,
    });

    let visualizationsInStore = Object.values(
      testStore.getState().visualizations.entities
    );
    let visualizations = screen.getAllByTestId('visualization');

    expect(visualizations.length).toBe(2);
    expect(visualizationsInStore.length).toBe(2);

    fireEvent.click(removeButtons[1]);

    visualizationsInStore = Object.values(
      testStore.getState().visualizations.entities
    );
    visualizations = screen.getAllByTestId('visualization');
    expect(visualizations.length).toBe(1);
    expect(visualizationsInStore.length).toBe(1);
  });
});
