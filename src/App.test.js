jest.mock('./component/slider/HeroSectionSlider', () => () => null);

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the site header once loading finishes', async () => {
  render(<App />);
  expect(await screen.findByRole('banner')).toBeInTheDocument();
});
