"use client";
import React, { createContext, useEffect, useState, useContext } from 'react';
import { get, ENDPOINT_USERS, ENDPOINT_EVENTS, METHOD, PARAMETER } from '../api/consumer';
import themes from "../Context/theme";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [selectedTheme, setSelectedTheme] = useState(0);
    const theme = themes[selectedTheme];
    const [ isLoading, setIsLoading ] = useState(false);
    const [ activeModal, setActiveModal ] = useState(null);
    const [ modalDialog, setModalDialog ] = useState(null);
    const [ allEvents, setAllEvents ] = useState(false);
    const [ events, setEvents ] = useState(null);
    const [ users, setUsers ] = useState(null);

    const switchTheme = () => {
        if (selectedTheme == 0) {
            setSelectedTheme(1);
            document.body.style.backgroundColor = "#fff"
            document.body.style.color = "#181818"
        }
        else {
            setSelectedTheme(0);
            document.body.style.backgroundColor = "#181818"
            document.body.style.color = "#fff"
        }
    }

    const openModal = (id, dialog) => {
        setActiveModal(id);
        setModalDialog(dialog);
    };
    
    const closeModal = () => {
        setActiveModal(null);
        setModalDialog(null);
    };

    const updateAllEvents = async (value) => {
        setAllEvents(value);
        await get(ENDPOINT_EVENTS, METHOD.GET, 0, PARAMETER.ALLEVENTS, value).then((result) => {
            setEvents(result) ;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const updateEvents = async () => {
        await get(ENDPOINT_EVENTS, METHOD.GET, 0, PARAMETER.ALLEVENTS, allEvents).then((result) => {
            setEvents(result) ;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const changeEvent = (data) => {
        const newEvents = events.map(event => {
            if (event.id !== data.id) 
                return event; // No change
            else {
              return {
                ...event,
                teamTypeId: data.teamTypeId,
                round: data.round,
                matchNumber: data.matchNumber,
                date: data.date,
                time: data.time,
                place: data.place,
                opponents: data.opponents,
                status: data.status,
              };
            }
        });
        setEvents(newEvents);
    }

    const removeEvent = (id) => {
        const newEvents = events.map(event => {
            if (event.id !== id) 
                return event; // No change
        });
        setEvents(newEvents);
    }

    const updateUsers = async () => {
        await get(ENDPOINT_USERS, METHOD.GET, 0).then((result) => {
            setUsers(result) ;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        updateEvents();
        updateUsers();
        document.body.style.backgroundColor = "#181818"
        document.body.style.color = "#fff"
}, []);

    return (
        <GlobalContext.Provider 
            value={{ 
                theme, 
                events,
                users,
                isLoading,
                activeModal,
                modalDialog,
                allEvents,
                switchTheme,
                changeEvent,
                removeEvent,
                updateAllEvents,
                updateEvents,
                updateUsers,
                openModal,
                closeModal,
            }}
        >
        <GlobalUpdateContext.Provider value={{}}>
            {children}
        </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
    );
}

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);
