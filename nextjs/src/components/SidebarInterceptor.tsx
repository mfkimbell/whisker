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
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";

type AnalyticsInfo = {
  userId?: string;
  anonymousId?: string;
  traits?: Record<string, any>;
};

export function SidebarInterceptor() {
  const items = useSelector((s: RootState) => s.cart.items);
  const [analyticsInfo, setAnalyticsInfo] = useState<AnalyticsInfo>({
    userId: undefined,
    anonymousId: undefined,
    traits: {},
  });

  const trackingData = useTracking();

  const eventPayloads = trackingData;

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

  const handleCartAbandon = () => {
    analytics.track("Cart Abandoned", {
      title: "Cart Abandoned",
      properties: { items },
      type: "track",
      timestamp: new Date().toISOString(),
    });
  };

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
      <Button className="m-4" onClick={handleCartAbandon}>
        Abandon Cart
      </Button>

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
                .filter((event) => event.obj.properties)
                .map((event, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-3 rounded-md shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600 px-2 py-1 bg-green-50 rounded-md">
                        {event.obj.name || event.obj.event}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.obj.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-mono">{event.obj.type}</span>
                      </div>

                      {event.obj.properties.path && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Path:</span>
                          <span className="font-mono">
                            {event.obj.properties.path}
                          </span>
                        </div>
                      )}

                      {event.obj.properties.category && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category:</span>
                          <span>{event.obj.properties.category}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          {event.obj.properties.title ? "Title" : "Event"}
                        </span>
                        <span className="truncate max-w-32">
                          {event.obj.properties.title || event.obj.event}
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
                            : `${event.obj.messageId.slice(0, 8)}...`}
                        </span>
                      </div>

                      {showFullMessageId[idx] && (
                        <div className="flex mt-1">
                          <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                            {event.obj.messageId}
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
