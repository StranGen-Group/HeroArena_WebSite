import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

const Probe = () => {
  const { language, setLanguage } = useLanguage();
  return <button onClick={() => setLanguage('RU')}>{language}</button>;
};

const renderProbe = () => render(<LanguageProvider><Probe /></LanguageProvider>);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = '';
});

test('restores the stored language', () => {
  localStorage.setItem('language', 'UZ');
  renderProbe();
  expect(screen.getByRole('button')).toHaveTextContent('UZ');
});

test('picks up the browser language on a first visit', () => {
  jest.spyOn(navigator, 'language', 'get').mockReturnValue('ru-RU');
  renderProbe();
  expect(screen.getByRole('button')).toHaveTextContent('RU');
});

test('persists a change and syncs the html lang attribute', () => {
  renderProbe();
  act(() => { screen.getByRole('button').click(); });
  expect(localStorage.getItem('language')).toBe('RU');
  expect(document.documentElement.lang).toBe('ru');
});
