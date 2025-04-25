import { Analytics } from '@segment/analytics-node';

// Initialize Segment Analytics with the server-side write key
const analytics = new Analytics({ writeKey: process.env.SEGMENT_WRITE_KEY! });

/**
 * Identify a user in Segment with given traits.
 */
export async function identifyUser(userId: string, traits: Record<string, any>) {
  return new Promise<void>((resolve, reject) => {
    analytics.identify({ userId, traits }, (err) => {
      if (err) {
        console.error('Segment identify error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}

/**
 * Track an event in Segment for a user.
 */
export async function trackEvent(
  userId: string,
  event: string,
  properties: Record<string, any> = {},
) {
  return new Promise<void>((resolve, reject) => {
    analytics.track({ userId, event, properties }, (err) => {
      if (err) {
        console.error('Segment track error:', err);
        return reject(err);
      }
      resolve();
    });
  });
}
