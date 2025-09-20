"use client"
import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import styled from 'styled-components';
import formatDate from "../Utils/formatDate";
import { plus, minus, close } from "../Utils/icons";
import { useGlobalState } from '../Providers/globalProvider';
import { get, update, remove, ENDPOINT_TEAM, ENDPOINT_GETTEAM, ENDPOINT_PLAYERS, ENDPOINT_EVENTSSTATUS, METHOD } from '../api/consumer';

interface Props {
    id: any;
    events: any[];
};

function TeamLineUp({ id, events }: Props) {
    const { theme, closeModal } = useGlobalState();
    const [members, setMembers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [event, setEvent] = useState({
        id: '',
        teamTypeId: 0,
        teamName: '',
        date: '',
        time: '',
        place: '',
        opponents: '',
        to: '',
        status: '',
    });

    const addUser = async (userId: number) => {
        const maxNumber = event.teamTypeId == 3 ? 4 : event.teamTypeId == 2 ? 5 : 7;
        if (members.length >= maxNumber)
        {
            toast.error("Der kan ikke tilføjes flere spillere")
            return;
        }   

        const memberData = {
            eventId: id,
            userId: userId
        };

        update(ENDPOINT_TEAM, METHOD.POST, memberData, 0);
        
        // update members
        getTeam();

        // update available players
        const newPlayers = players.filter((player:any) => player.userId !== userId);
        setPlayers(newPlayers);
    };

    const removeUser = (teamId: number) => {
        remove(ENDPOINT_TEAM, METHOD.DELETE, teamId);

        // update members
        const newMembers = members.filter((member:any) => member.id !== teamId);
        setMembers(newMembers);

        // update available players
        getPlayers();
    }

    const updateStatus = async (status: string) => {
        const data = {
            id: event.id,
            status: status
        };
        update(ENDPOINT_EVENTSSTATUS, METHOD.PUT, data, 0);
    }

    const closeTeam = (status: string) => {
        if (event.status == "Ikke sat") {
            if ((event.teamTypeId == 1 && members.length >= 6) ||
                (event.teamTypeId == 2 && members.length >= 4) ||
                (event.teamTypeId == 3 && members.length >= 3) ||
                (event.teamTypeId == 4 && members.length >= 4))
                updateStatus("Sat");
            else
                updateStatus(status);
        }
        else
            updateStatus(status);
        closeModal();
    }

    const getEvent = () => {
        {events && events.filter((a) => a.id === id).map((event:any) => {
            setEvent(event);
        })}
    }

    const getPlayers = async () => {
        await get(ENDPOINT_PLAYERS, METHOD.GET, id, "", "").then((result) => {
            console.log(result);
            if(result)
                setPlayers(result);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const getTeam = async () => {
            await get(ENDPOINT_GETTEAM, METHOD.GET, id, "", "").then((result) => {
            if (result)
                setMembers(result);
            else
                setMembers([]);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getEvent();
        getPlayers();
        getTeam();
    }, []);

     return (
      <ContentStyle theme={theme}>
	    <div className="header">
                <button type="button" title="" className="btn close" onClick={closeModal}>{close}</button>
                <h1 key={id}>
                {event.teamName} d. {formatDate(event.date, "DD-MM-YYYY")} kl. {event.time} i {event.place} mod {event.opponents}
            </h1>
        </div>
        <div className="teamLineUp">
            <div className="team">
                <div className="users">
                    <table>
                        <tbody>
                            {members && members.length > 0 && members.map((user:any) => {
                              return (
                                <tr key={user.id} className="user">
                                    <td>
                                        <button type="button" title="Fjern" className="btn" onClick={() => removeUser(user.id)}>{minus}</button>
                                    </td>
                                    <td  title="Fjern"  onClick={() => removeUser(user.id)}>{user.userName}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="players">
                <div className="users">
                    <table>
                        <tbody>
                            {players  && players.length > 0 && players.map((user:any) => {
                              return (
                                <tr key={user.userId} className="user">
                                    <td>
                                        <button type="button" title="Tilføj" className="btn" onClick={() => addUser(user.userId)}>{plus}</button>
                                    </td>
                                    <td title="Tilføj" onClick={() => addUser(user.userId)}>{user.userName}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div className="submit-btn">
            <button type="button" title="Luk" className="btn" onClick={() => closeTeam(event.status)}>Luk</button>
    	</div>
	  </ContentStyle>
    );
}

const ContentStyle = styled.div`
    background-color: {(props) => props.theme.frontColor1};
    color: ${(props) => props.theme.backgroundColor1};
    
    h1 {
        color: ${(props) => props.theme.backgroundColor5} !important;
    }
    .team, .players {
        border: 1px solid ${(props) => props.theme.frontColor4};
    }
    .users {
        background-color: ${(props) => props.theme.frontColor1};
        color: ${(props) => props.theme.backgroundColor1};
    }

    .submit-btn button{
        transition: all 0.35s ease;
        background: ${(props) => props.theme.backgroundColor3};
        color: ${(props) => props.theme.frontColor1};
        &:hover {
            background: ${(props) => props.theme.backgroundColor4};
            color: ${(props) => props.theme.frontColor1};
        }
    }
    .close{
        color: ${(props) => props.theme.backgroundColor1} !important;
    }
`;

export default TeamLineUp;