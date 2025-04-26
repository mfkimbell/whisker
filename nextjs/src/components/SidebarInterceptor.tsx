"use client";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { analytics } from "@/lib/segment";
import useTracking from "@/app/hooks/useTracking";

type AnalyticsInfo = {
  userId?: string;
  anonymousId?: string;
  traits?: Record<string, any>;
};

type PageEvent = {
  type: string;
  name: string;
  timestamp: string;
  anonymousId: string;
  messageId: string;
  event: string;
  properties: {
    path: string;
    url: string;
    title: string;
    category: string;
  };
};

export function SidebarInterceptor() {
  const [analyticsInfo, setAnalyticsInfo] = useState<AnalyticsInfo>({
    userId: undefined,
    anonymousId: undefined,
    traits: {},
  });

  const trackingData = useTracking();

  const eventPayloads = trackingData
    .filter(
      (event): event is { payload: { raw: PageEvent } } => "payload" in event
    )
    .map((event) => event.payload.raw);

  const [showFullMessageId, setShowFullMessageId] = useState<boolean[]>(
    Array(eventPayloads.length).fill(false)
  );

  const toggleMessageIdVisibility = (index: number) => {
    setShowFullMessageId((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  useEffect(() => {
    getSegmentUserData().then(({ userId, anonymousId, traits }) =>
      setAnalyticsInfo({
        userId: userId || undefined,
        anonymousId: anonymousId || undefined,
        traits: traits || {},
      })
    );
  }, []);

  if (eventPayloads.length === 0) {
    return;
  }

  return (
    <Sidebar className="z-50">
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          <h3 className="text-xl font-semibold font-black">
            Whisker Analytics 🐈
          </h3>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-gray-500">
            User Information
          </SidebarGroupLabel>
          <div className="p-4 bg-gray-50 rounded-md mx-3 text-sm space-y-2 shadow-sm">
            <div className="flex flex-col">
              <span className="text-gray-500">User ID</span>
              <span className="font-mono text-xs bg-gray-100 p-1 rounded truncate">
                {analyticsInfo.userId || "Not identified"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500">Anonymous ID</span>
              <span className="font-mono text-xs bg-gray-100 p-1 rounded truncate">
                {analyticsInfo.anonymousId || "None"}
              </span>
            </div>

            {Object.keys(analyticsInfo.traits || {}).length > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-500">User Traits</span>
                <div className="pl-2 mt-1 space-y-1">
                  {Object.entries(analyticsInfo.traits || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-gray-500">{key}</span>
                        <span className="font-mono text-xs truncate">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </SidebarGroup>

        {eventPayloads.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-gray-500">
              Event Payloads
            </SidebarGroupLabel>
            <div className="p-3 space-y-2">
              {eventPayloads
                .slice(-5)
                .reverse()
                .map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-3 rounded-md shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600 px-2 py-1 bg-green-50 rounded-md">
                        {event.name || event.event}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-mono">{event.type}</span>
                      </div>

                      {event.properties.path && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Path:</span>
                          <span className="font-mono">
                            {event.properties.path}
                          </span>
                        </div>
                      )}

                      {event.properties.category && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category:</span>
                          <span>{event.properties.category}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          {event.properties.title ? "Title" : "Event"}
                        </span>
                        <span className="truncate max-w-32">
                          {event.properties.title || event.event}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Message ID:</span>
                        <span
                          className="font-mono cursor-pointer underline"
                          onClick={() => toggleMessageIdVisibility(idx)}
                        >
                          {showFullMessageId[idx]
                            ? "Show less"
                            : `${event.messageId.slice(0, 8)}...`}
                        </span>
                      </div>

                      {showFullMessageId[idx] && (
                        <div className="flex mt-1">
                          <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                            {event.messageId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-3 text-xs text-center text-gray-500 border-t">
          © 2025 Whisker Inc. • Analytics Dashboard
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export async function getSegmentUserData() {
  const [a] = await analytics;
  const user = a.user();
  const userId = user.id();
  const anonymousId = user.anonymousId();
  const traits = user.traits();
  return { userId, anonymousId, traits };
}
