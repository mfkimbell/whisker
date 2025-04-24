// lib/segment-server.ts
import Analytics from '@segment/analytics-node';

export const segment = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY!,
});
