"use client"
import React, { useState, useEffect } from 'react';
import { close, save, trash } from "../Utils/icons";
import { useGlobalState } from '../Providers/globalProvider';
import { update, ENDPOINT_EVENTS, METHOD } from '../api/consumer';
import styled from 'styled-components';
import toast from "react-hot-toast";

interface Props {
    id: any;
    events: any[];
};

function EditEvent({ id, events }: Props) {
    const { theme, closeModal, changeEvent, removeEvent  } = useGlobalState();
    const [ event, setEvent] = useState({
        id: id,
        teamTypeId: '',
        round: '',
        matchNumber: '',
        date: '',
        time: '',
        place: '',
        opponents: '',
        status: '',
    });

    const initEventData = () => {
        {events && events.filter((e) => e.id === id).map((event:any) => {
            setEvent({ ...event, "teamTypeId": event.teamTypeId });
            setEvent({ ...event, "round": event.round });
            setEvent({ ...event, "matchNumber": event.matchNumber });
            setEvent({ ...event, "date": event.date });
            setEvent({ ...event, "time": event.time });
            setEvent({ ...event, "place": event.place });
            setEvent({ ...event, "opponents": event.opponents });
            setEvent({ ...event, "status": event.status });
        })}
    };

    const handleChange = ({ target: { name, value } }) => {
        setEvent({ ...event, [name]: value });
    };

    const onSubmit = (e: any) => {
        update(ENDPOINT_EVENTS, METHOD.PUT, event, 0);
        changeEvent(event);
        closeModal();
    };

    const deleteEvent = (id: number) => {
        const answer = window.confirm("Ønsker du at slette kampen?");
        if (answer) {
            update(ENDPOINT_EVENTS, METHOD.DELETE, null, id);
            removeEvent(id);
           toast.success("Kampen har blevet slettet.");
           closeModal();
       }      
    }

    useEffect(() => {
        initEventData();
    }, []);

     return (
      <ContentStyle theme={theme} onSubmit={onSubmit}>
	    <div className="header">
            <button type="button" title="" className="btn close" onClick={closeModal}>{close}</button>
            <h1 key={id}>
                Opdatere kamp
            </h1>
        </div>
        <div className="event">
            <div className="btn">
                <button type="button" title="Fjern" className="btn" onClick={() => deleteEvent(id)}>{trash}</button>
                <button type="submit" title="Gem">{save}</button>
    	    </div>
            <div className="user">
                <div className="input-control">
                    <label htmlFor="round">Runde:</label>
                    <input id="round" value={event.round} name="round" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="matchNumber">Kamp nummer:</label>
                    <input id="matchNumber" value={event.matchNumber} name="matchNumber" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="date">Dato:</label>
                    <input type="date" id="date" value={event.date} name="date" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="time">Tidspunkt:</label>
                    <input id="time" value={event.time} name="time" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="place">Spillested:</label>
                    <input id="place" value={event.place} name="place" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="opponents">Modstandere:</label>
                    <input id="opponents" value={event.opponents} name="opponents" onChange={handleChange} />
                </div>
            </div>
        </div>
	  </ContentStyle>
    );
}

const ContentStyle = styled.form`
    background-color: ${(props) => props.theme.frontColor1};
    color: ${(props) => props.theme.backgroundColor1};
    
    h1 {
        color: ${(props) => props.theme.backgroundColor5} !important;
        font-size: 1.2rem;
    }

    input {
        border: 1px solid ${(props) => props.theme.frontColor4};
    }

    .close{
        color: ${(props) => props.theme.frontColor5} !important;
    }
`;

export default EditEvent;