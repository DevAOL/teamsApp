"use client"
import React from 'react';
import Users from "../../Components/users";
import { useGlobalState } from "../../Providers/globalProvider";

function page () {
    const { users } = useGlobalState();
    return (
      <div className="users">
        {<Users 
          title="Spillere"
          users={ users } 
        />}
      </div>
    );
}

export default page;