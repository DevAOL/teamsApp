"use client"
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import formatDate from "../Utils/formatDate";
import { close } from "../Utils/icons";
import { useGlobalState } from '../Providers/globalProvider';
import { update, get, ENDPOINT_PLAYERSEVENTS, ENDPOINT_USERS, ENDPOINT_PLAYERS, METHOD } from '../api/consumer';

interface Props {
    id: any;
};

function EditUser({ id }: Props) {
    const { theme, closeModal, users, updateUsers } = useGlobalState();
    const [ teamTypeId, setTeamTypeId ] = useState(1);
    const [ events, setEvents ] = useState([]);
    const [ user, setUser] = useState({
        fullName: '',
        name: '',
        license: '',
        average: 0,
        mobile: '',
        email: '',
        defaultTeams: '',
    });

    const initUserData = () => {
        {users && users.filter((u) => u.id === id).map((user:any) => {
            setUser({ ...user, "fullName": user.fullName });
            setUser({ ...user, "name": user.name });
            setUser({ ...user, "license": user.license });
            setUser({ ...user, "mobile": user.mobile });
            setUser({ ...user, "email": user.email });
            setUser({ ...user, "average": user.average });
            setUser({ ...user, "defaultTeams": user.defaultTeams });
        })}
    };

    const handleChange = ({ target: { name, value } }) => {
        setUser({ ...user, [name]: value });
    };

    const changeEvents = (id: number) => {
        setTeamTypeId(id);
    };
    
    const getActiveTeamType = (value: number) => {
        return value == teamTypeId ? "teamType active" : "teamType";
    };

    const updateEvent = async (eventId: number) => {
        const data = {
            id: eventId
        };
        update(ENDPOINT_PLAYERS, METHOD.PUT, data, 0);
    };

    const onSubmit = (e: any) => {
        update(ENDPOINT_USERS, METHOD.PUT, user, 0);
        updateUsers();
        closeModal();
    };

    const getEvents = async () => {
        await get(ENDPOINT_PLAYERSEVENTS, METHOD.GET, id, "", "").then((result) => {
            console.log(result);
            setEvents(result);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect( () => {
        initUserData();
        getEvents();
    }, []);

     return (
      <ContentStyle theme={theme} onSubmit={onSubmit}>
	    <div className="header">
            <button type="button" title="" className="btn close" onClick={closeModal}>{close}</button>
            <h1 key={id}>
                Opdatere spillere
            </h1>
        </div>
        <div className="container">
            <div className="user">
                <div className="input-control">
                    <label htmlFor="fullName">Navn:</label>
                    <input id="fullName" value={user.fullName} name="fullName" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="name">Alias:</label>
                    <input id="name" value={user.name} name="name" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="license">License:</label>
                    <input id="license" value={user.license} name="license" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="mobile">Mobile:</label>
                    <input id="mobile" value={user.mobile} name="mobile" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="email">E-mail:</label>
                    <input id="email" value={user.email} name="email" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="average">Snitt:</label>
                    <input id="average" value={user.average} name="average" onChange={handleChange} />
                </div>
                <div className="input-control">
                    <label htmlFor="defaultTeams">Hold:</label>
                    <input id="defaultTeams" value={user.defaultTeams} name="defaultTeams" onChange={handleChange} />
                </div>
            </div>
            <div className="events">
                <div className="teamTypes">
                         <button type="button" title="Liga Damer" className={getActiveTeamType(1)} onClick={() => changeEvents(1)}>Liga Damer</button>
                    |
                         <button type="button" title="Øst 4-Damer" className={getActiveTeamType(2)} onClick={() => changeEvents(2)}>Øst 4-Damer</button>
                    |
                         <button type="button" title="Øst Række Damer" className={getActiveTeamType(3)} onClick={() => changeEvents(3)}>Øst Række Damer</button>
                    |
                         <button type="button" title="Den fri" className={getActiveTeamType(4)} onClick={() => changeEvents(4)}>Den Fri</button>
                </div>
                <div className="grid">
                  <table>
                    <thead>
                      <tr key="eventHeader">
                          <th></th>
                          <th>Runde</th>
                          <th>Dato</th>
                          <th>Tid</th>
                          <th>Spillested</th>
                      </tr>
                    </thead>
                    <tbody>
                        {events && events.filter((e:any) => e.teamTypeId === teamTypeId).map((event:any) => {
                            return (
                                <tr key={event.id}>
                                    <td className='chk w1'>
                                        <input type="checkbox" id={"chk_" + event.id} value={event.isAvailable} defaultChecked={event.isAvailable ? true : false} onChange={() => updateEvent(event.id)} />
                                    </td>
                                    <td>{event.round}</td>
                                    <td>{formatDate(event.date, "DD-MM-YYYY")}</td>
                                    <td>{event.time}</td>
                                    <td>{event.place}</td>
                                </tr>                  
                            );
                        })}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
        <div className="submit-btn">
    	    <button type="submit" title="Gem">Gem</button>
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

    .events {
        background-color: ${(props) => props.theme.frontColor1};
        color: ${(props) => props.theme.backgroundColor1};
        padding: 0.3rem;
    }

    .teamTypes {
        background-color: ${(props) => props.theme.frontColor3};
        color: ${(props) => props.theme.frontColor5};
    }

    .teamType {
        background-color: ${(props) => props.theme.frontColor3};
        color: ${(props) => props.theme.frontColor5};
        border: none;
    }

    .active {
        background-color: ${(props) => props.theme.frontColor3};
        color: ${(props) => props.theme.backgroundColor4};
        border-bottom: 1px solid ${(props) => props.theme.submitColor2};
    }

    .grid {
        background-color: ${(props) => props.theme.frontColor1};
        color: ${(props) => props.theme.backgroundColor2};
        border: 1px solid ${(props) => props.theme.frontColor4};
        border-top-left-radius: 0rem;
        border-top-right-radius: 0rem;
        border-bottom-left-radius: 0.2rem;
        border-bottom-right-radius: 0.2rem;
    }

    .grid {
        padding: 0rem;
    }

    .grid tr td {
        border-bottom: 1px solid ${(props) => props.theme.frontColor4};
        padding: 0.3rem;
    }

    .grid table tr .w1 {
        text-align: center;
        width: 3rem;
    }

    .submit-btn button{
        transition: all 0.35s ease;

        background: ${(props) => props.theme.submitColor3};
        color: ${(props) => props.theme.frontColor1};
        
        &:hover {
            background: ${(props) => props.theme.submitColor2};
            color: ${(props) => props.theme.frontColor2};
        }
    }
    .close{
        color: ${(props) => props.theme.frontColor5} !important;
    }
`;

export default EditUser;