import { renderHook, act } from '@testing-library/react';
import useTheme from './useTheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

test('defaults to light when the system has no dark preference', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

test('restores the stored choice over the system preference', () => {
  localStorage.setItem('theme', 'dark');
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('toggling flips the theme, the attribute and storage', () => {
  const { result } = renderHook(() => useTheme());
  act(() => result.current.toggleTheme());
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('theme')).toBe('dark');
});
