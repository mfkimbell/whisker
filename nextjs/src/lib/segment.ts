// lib/segment.ts
import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load({
  writeKey: "QGYxeIMTlFwyoviAgidLEyaVAq4oWltc",
});

analytics.addSourceMiddleware(({ payload, next }) => {
  const events = localStorage.getItem("segment_events");
  const parsedEvents = events ? JSON.parse(events) : [];
  parsedEvents.push(payload);

  if (payload) {
    localStorage.setItem("segment_events", JSON.stringify(parsedEvents));
  }

  next(payload);
});
