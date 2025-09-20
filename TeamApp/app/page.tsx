"use client"
import Events from "./Components/events";
import { useGlobalState } from "./Providers/globalProvider";

export default function Home() {
  const { events } = useGlobalState();
  return (
    <div className="teams">
      {<Events 
        title = "DwBF Kampe"
        events = { events } 
        showTeam = { true }
      />}
    </div>
  );
}