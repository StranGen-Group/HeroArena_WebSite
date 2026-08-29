import { track as vercelTrack } from '@vercel/analytics';

/**
 * Thin wrapper so components never import the vendor SDK directly, and so a
 * blocked or failing analytics script can never break a click handler.
 */
export const track = (event, props = {}) => {
  try {
    vercelTrack(event, props);
  } catch (e) {
    // an ad blocker ate the script — the user's click still has to work
  }
};

export default track;
