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

describe('Edit Visualization Modal', () => {
  let testStore;
  beforeEach(() => {
    const { store } = renderWithProviders(<Home />, {
      preloadedState: initialStateWithVisualizations,
    });
    testStore = store;
  });

  it('updates state to match visualization data for a table', async () => {
    let visualizationData =
      testStore.getState().visualizations.entities['1234'];

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]);

    const typeInput = await await screen.findByLabelText(/Visualization Type/i);
    const startDateInput = await screen.findByLabelText(/Start Date/i);
    const endDateInput = await screen.findByLabelText(/End Date/i);
    const titleInput = await screen.findByLabelText(/Title/i);
    const languageInput = await screen.findByLabelText(/Language/i);
    const decimalsInput = await screen.findByLabelText(/Decimals/i);
    const dateFormatInput = await screen.findByLabelText(/Date Format/i);

    expect(typeInput.value).toBe(visualizationData.type);
    expect(startDateInput.value).toBe(visualizationData.startDate);
    expect(endDateInput.value).toBe(visualizationData.endDate);
    expect(titleInput.value).toBe(visualizationData.title);
    expect(languageInput.value).toBe(visualizationData.language);
    expect(dateFormatInput.value).toBe(visualizationData.dateFormat);
    expect(decimalsInput.value).toBe(visualizationData.decimals);
  });

  it('updates state to match visualization data for a graph', async () => {
    const visualizationData =
      testStore.getState().visualizations.entities['5678'];

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[1]);

    const typeInput = await await screen.findByLabelText(/Visualization Type/i);
    const startDateInput = await screen.findByLabelText(/Start Date/i);
    const endDateInput = await screen.findByLabelText(/End Date/i);
    const titleInput = await screen.findByLabelText(/Title/i);
    const languageInput = await screen.findByLabelText(/Language/i);
    const colorsInput = screen.getByText(/Series colors/i);
    const graphTypeInput = screen.getByLabelText(/Graph Type/i);

    expect(typeInput.value).toBe(visualizationData.type);
    expect(startDateInput.value).toBe(visualizationData.startDate);
    expect(endDateInput.value).toBe(visualizationData.endDate);
    expect(titleInput.value).toBe(visualizationData.title);
    expect(languageInput.value).toBe(visualizationData.language);
    expect(colorsInput).toBeInTheDocument();
    expect(graphTypeInput).toBeInTheDocument();
  });
});
