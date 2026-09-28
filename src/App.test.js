jest.mock('./component/slider/HeroSectionSlider', () => () => null);
jest.mock('@vercel/analytics', () => ({ track: jest.fn() }));
jest.mock('@vercel/analytics/react', () => ({ Analytics: () => null }), { virtual: true });
jest.mock('@vercel/speed-insights/react', () => ({ SpeedInsights: () => null }), { virtual: true });

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the site header once loading finishes', async () => {
  render(<App />);
  expect(await screen.findByRole('banner')).toBeInTheDocument();
});
