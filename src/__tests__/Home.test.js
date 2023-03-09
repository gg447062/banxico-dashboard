import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../lib/utils/test_utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Home from '../pages';
import { initialStateWithVisualizations } from '../lib/utils/test_utils';

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

const handlers = [
  rest.get(
    `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            { variable: '1', display_name: 'one' },
            { variable: '2', display_name: 'two' },
            { variable: '3', display_name: 'three' },
            { variable: '4', display_name: 'four' },
          ],
        }),
        ctx.delay(150)
      );
    }
  ),
];
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Add Visualization Modal', () => {
  beforeEach(() => {
    renderWithProviders(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
  });

  it('renders initial state correctly', () => {
    const typeInput = screen.getByLabelText(/Visualization Type/i);
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);
    const titleInput = screen.getByLabelText(/Title/i);
    const languageInput = screen.getByLabelText(/Language/i);
    const decimalsInput = screen.getByLabelText(/Decimals/i);
    const dateFormatInput = screen.getByLabelText(/Date Format/i);

    expect(typeInput.value).toBe('table');
    expect(startDateInput.value).toBe('');
    expect(endDateInput.value).toBe(new Date().toISOString().split('T')[0]);
    expect(titleInput.value).toBe('');
    expect(languageInput.value).toBe('es');
    expect(dateFormatInput).toBeInTheDocument();
    expect(dateFormatInput.value).toBe('');
    expect(decimalsInput).toBeInTheDocument();
    expect(decimalsInput.value).toBe('1');
  });

  it('fetches the series catalog on load', async () => {
    const series = await screen.findAllByLabelText('series-catalog-item');
    series.forEach((el) => expect(el).toBeInTheDocument());
  });

  it('updates state', () => {
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const titleInput = screen.getByLabelText(/Title/i);
    const languageInput = screen.getByLabelText(/Language/i);
    const decimalsInput = screen.getByLabelText(/Decimals/i);
    const dateFormatInput = screen.getByLabelText(/Date Format/i);

    fireEvent.change(startDateInput, { target: { value: '2022-03-02' } });
    fireEvent.change(titleInput, { target: { value: 'title-one' } });
    fireEvent.change(languageInput, { target: { value: 'en' } });
    fireEvent.change(dateFormatInput, { target: { value: 'mm/dd/yyyy' } });
    fireEvent.change(decimalsInput, { target: { value: '0' } });

    expect(startDateInput.value).toBe('2022-03-02');
    expect(titleInput.value).toBe('title-one');
    expect(languageInput.value).toBe('en');
    expect(dateFormatInput.value).toBe('mm/dd/yyyy');
    expect(decimalsInput.value).toBe('0');
  });

  it('updates the data options when the visualization type is changed', () => {
    const typeInput = screen.getByLabelText(/Visualization Type/i);
    const decimalsInput = screen.getByLabelText(/Decimals/i);
    const dateFormatInput = screen.getByLabelText(/Date Format/i);

    expect(dateFormatInput).toBeInTheDocument();
    expect(decimalsInput).toBeInTheDocument();

    fireEvent.change(typeInput, { target: { value: 'graph' } });

    const colorsInput = screen.getByText(/Series colors/i);
    const graphTypeInput = screen.getByLabelText(/Graph Type/i);

    expect(colorsInput).toBeInTheDocument();
    expect(graphTypeInput).toBeInTheDocument();
    expect(dateFormatInput).not.toBeInTheDocument();
    expect(decimalsInput).not.toBeInTheDocument();
  });

  it('displays color select for selected series items when visualization type is graph', async () => {
    fireEvent.change(screen.getByLabelText(/Visualization Type/i), {
      target: { value: 'graph' },
    });
    const seriesItems = await screen.findAllByLabelText('series-catalog-item');

    fireEvent.click(seriesItems[0]);
    fireEvent.click(seriesItems[1]);

    const selectedSeriesItems = screen.getAllByTestId('selected-series-item');

    const colorSelect = screen.getByLabelText(selectedSeriesItems[0].innerHTML);
    const colorSelectTwo = screen.getByLabelText(
      selectedSeriesItems[1].innerHTML
    );

    expect(colorSelect).toBeInTheDocument();
    expect(colorSelect.value).toBe('');
    expect(colorSelectTwo).toBeInTheDocument();
    expect(colorSelectTwo.value).toBe('');
  });

  it('updates color selection for selected series', async () => {
    fireEvent.change(screen.getByLabelText(/Visualization Type/i), {
      target: { value: 'graph' },
    });
    const seriesItems = await screen.findAllByLabelText('series-catalog-item');
    fireEvent.click(seriesItems[0]);
    const selectedSeriesItem = screen.getByTestId('selected-series-item');
    expect(screen.getByLabelText(selectedSeriesItem.innerHTML).value).toBe('');
    fireEvent.change(screen.getByLabelText(selectedSeriesItem.innerHTML), {
      target: { value: 'pink' },
    });
    expect(screen.getByLabelText(selectedSeriesItem.innerHTML).value).toBe(
      'pink'
    );
  });

  it('adds the selected series item to state when clicked', async () => {
    const seriesItems = await screen.findAllByLabelText('series-catalog-item');
    fireEvent.click(seriesItems[0]);
    const selectedSeriesItems = screen.getAllByTestId('selected-series-item');
    expect(selectedSeriesItems.length).toEqual(1);
  });

  it('removes the selected series item from state when clicked twice', async () => {
    const seriesItems = await screen.findAllByLabelText('series-catalog-item');
    fireEvent.click(seriesItems[0]);
    expect(screen.getAllByTestId('selected-series-item').length).toEqual(1);
    fireEvent.click(seriesItems[0]);
    expect(screen.queryAllByTestId('selected-series-item').length).toEqual(0);
  });

  it('is hidden when cancel button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    const h2 = screen.queryByText(/Add a visualization/i);
    expect(h2).not.toBeInTheDocument();
  });
});
