import { useEffect, useState } from "react";

const useTracking = () => {
  const [events, setEvents] = useState<any[]>([]); // Use state to store events

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "segment_events") {
        console.log("The segment_events key has changed:", event.newValue);
        // Update the events state whenever segment_events changes in localStorage
        const updatedEvents = event.newValue ? JSON.parse(event.newValue) : [];
        setEvents(updatedEvents);
      }
    };

    // Add the event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    try {
      const eventsFromLocalStorage = localStorage.getItem("segment_events");

      if (eventsFromLocalStorage) {
        const parsedEvents = JSON.parse(eventsFromLocalStorage);
        setEvents(parsedEvents); // Set the updated events in state
      } else {
        setEvents([]); // Set the initial events in state
      }
    } catch (error) {
      console.error("Error tracking the page event:", error);
    }

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return events; 
};

export default useTracking;
