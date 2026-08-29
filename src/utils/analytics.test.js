import { track as vercelTrack } from '@vercel/analytics';
import { track } from './analytics';

jest.mock('@vercel/analytics', () => ({ track: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

test('forwards the event name and properties', () => {
  track('cta_click', { target: 'discord' });
  expect(vercelTrack).toHaveBeenCalledWith('cta_click', { target: 'discord' });
});

test('sends an event with no properties', () => {
  track('gallery_open');
  expect(vercelTrack).toHaveBeenCalledWith('gallery_open', {});
});

test('never throws when the SDK fails', () => {
  vercelTrack.mockImplementation(() => { throw new Error('blocked'); });
  expect(() => track('cta_click', { target: 'telegram' })).not.toThrow();
});
