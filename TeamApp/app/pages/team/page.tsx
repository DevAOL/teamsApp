"use client"
import React from 'react';
import { useSearchParams  } from 'next/navigation'
import { useGlobalState } from "../../Providers/globalProvider";
import Items from "../../Components/events";

function page () {
    const { events } = useGlobalState();
    
    const searchParams = useSearchParams();
    const id = parseInt(searchParams.get('id') as string);
    const title = searchParams.get('title')?.toString();

    const items = events.filter((events:any) => events.teamTypeId === id);
    return (
      <div className="teams">
        <Items 
          title = { title }
          events = { items } 
          showTeam = { false }
        />
      </div>
    );
}

export default page;