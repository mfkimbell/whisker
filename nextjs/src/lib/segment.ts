// lib/segment.ts
import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load({
  writeKey: "QGYxeIMTlFwyoviAgidLEyaVAq4oWltc",
});

analytics.addSourceMiddleware((event) => {
  const events = localStorage.getItem("segment_events");
  const parsedEvents = events ? JSON.parse(events) : [];
  parsedEvents.push(event);

  if (event) {
    localStorage.setItem("segment_events", JSON.stringify(parsedEvents));
  }

  return undefined;
});
