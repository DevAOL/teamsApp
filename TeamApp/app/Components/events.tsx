"use client"
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import toast from "react-hot-toast";
import readXlsxFile from 'read-excel-file';
import formatDate from "../Utils/formatDate";
import Modal from "../Modals/modal";
import TeamLineUp from "../Modals/teamLineUp";
import EditEvent from "../Modals/editEvents";
import SendEvents from "../Modals/sendEvents";
import { useGlobalState } from '../Providers/globalProvider';
import { bars, calendar, envelope, list, people, plus } from "../Utils/icons";
import { get, update, ENDPOINT_EVENTS, ENDPOINT_ADDEVENTS, ENDPOINT_ADDPLAYERS, ENDPOINT_GETTEAM, METHOD } from '../api/consumer';

interface Props {
    title?: string;
    events: any[];
    showTeam?: boolean;
}

function Events ({title, events, showTeam }:Props) {
    const { theme, openModal, activeModal, modalDialog, allEvents, updateAllEvents } = useGlobalState();
    const [ showMore, setShowMore ] = useState(false);
    const [ eventId, setEventId ] = useState([]);
    const [ selEvents, setSelEvents ] = useState<any[]>([]);
    const [ members, setMembers ] = useState<any[]>([]);
   
    const handleFileChange = (e: any) => {
      const file = e.target.files[0];
    
      // Read the Excel file
      readXlsxFile(file).then((rows) => {
        createEvents(rows);      
      });
    };
    
    const createEvents = async (rows: any) => {
      {rows.map(async (row: any) => {
         const data = {
           teamTypeId: row[4],
           matchNumber: row[3].toString(),
           round: row[0],
           date: row[1],
           time: row[2],
           place: row[7],
           opponents: (row[5].startsWith("S.A.S.") ? row[6] : row[5]), 
           status: "Ikke sat",
         };
         await update(ENDPOINT_EVENTS, METHOD.POST, data, 0);
         }
      )}
      toast.success('Events are now added');
    };

    const teamLineUp = (id:any) => {
      setEventId(id);
      openModal(id, "team");
    }

    const editEvent = (id:any) => {
      setEventId(id);
      openModal(id, "edit");
    }

    const showList = () => {
      if (showMore)
        setShowMore(false);
      else
        setShowMore(true);
    }

    const getMembers = async (id: any): Promise<number> => {
      console.log(id);
        const result = await get(ENDPOINT_GETTEAM, METHOD.GET, id, "", "");
        console.log(result);
        // Map data to your required format
        const mappedMembers = result.map((user: any) => ({
          id: user.id,
          eventId: user.eventId,
          userId: user.userId,
          userName: user.userName,
          email: user.email,
        }));
        return mappedMembers.length;
    };
    
    const addDefaultEvents = () => {
      update(ENDPOINT_ADDEVENTS, METHOD.POST, null, 0);
      setShowMore(false);
      toast.success('Events are now added');
    }

    const setEvents = () => {
      update(ENDPOINT_ADDPLAYERS, METHOD.POST, null, 0);
      setShowMore(false);
      toast.success('Players are now added to the events');
    }

    const sendEvents = () => {
      setShowMore(false);
      openModal(0, "send");
    }

    const getEvents = () => {
      if (allEvents)
        updateAllEvents(false);
      else
        updateAllEvents(true);
      setShowMore(false);
    }

    const selectEvent = (e: any) => {
      if (e.target.checked) {
        {events.filter((event) => event.id == e.target.id.replace('chk_', '')).map((event:any) => {
            if (event.status != "Sent") {
              setSelEvents(current => [...current, {id: event.id, teamTypeId: event.teamTypeId, teamName: event.teamName, date: event.date, 
              time: event.time, weekDay: event.weekDay, place: event.place, opponents: event.opponents }]);
              get(ENDPOINT_GETTEAM, METHOD.GET, event.id, "", "").then((result) =>  result.map((user:any) => {
                setMembers(current => [...current, {id: user.id, eventId: user.eventId, userId: user.userId, userName: user.userName, 
                  email: user.email }])
              })
              );
            }
        })}        
      }
      else {
        setSelEvents(selEvents.filter((event) => event.id != e.target.id.replace('chk_', '')));
        setMembers(members.filter((user) => user.eventId != e.target.id.replace('chk_', '')));
      }
    }

    const getMaxPlayers = (teamTypeId: number) => {
      switch(teamTypeId) {
        case 1:
          return 7
        case 2:
          return 5
        case 3:
           return 4
        case 4:
          return 5
        default:
          0
      }
      return 0;
    }

    return (
      <ContentStyle theme={theme}>
        {activeModal === eventId && modalDialog === 'team' && (<Modal content={<TeamLineUp id = { eventId } events = { events } />} size = 'w-m' />)}
        {activeModal === eventId && modalDialog === 'edit' && (<Modal content={<EditEvent id = { eventId } events = { events } />} size = 'w-s' />)}
        {modalDialog === 'send' && (<Modal content={<SendEvents events = { selEvents } members = { members } />} size = 'w-m h-m' />)}
        <div className="header">
          <div className="create-items">
            <div className="import-file">
              <input type="file" id="input" className="custom-file-input" placeholder="Upload file"
                     accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                     onChange={handleFileChange} /> 
            </div>
          </div>
          <div key="EventTitle" className="title">
            <h1>{title}</h1>
            <div className="title-footer"></div>
          </div>
        </div>
        <div className="grid">
          <table>
            <thead>
              <tr key="eventHeader" className="eventHeader">
                <th className="th-none" onClick={() => showList()}>{bars}</th>
                <th className="th-none"></th>
                <th className="th-first">Runde</th>
                <th className={showTeam? 'visible th-underline' : 'hidden th-underline'}>Hold</th>
                <th>Dato</th>
                <th>Tid</th>
                <th>Modstandere</th>
                <th>Spillested</th>
                <th className="th-center">Spillere</th>
                <th className="th-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {showMore && <td className="more">
                  <ul>
                    <li onClick={() => addDefaultEvents()}>{plus} Opret spillere til kampene</li>
                    <li onClick={() => getEvents()} >{list} {allEvents ? "Se kommende kampe" : "Se alle kampe"} </li>
                    <li onClick={() => sendEvents()} >{envelope} Send e-mail</li>
                  </ul>
                </td>}
              </tr>
              {events && events.map((event) => {
                return (
                  <tr key={event.id}>
                    <td className='chk w1'>
                      <input type="checkbox" id={"chk_" + event.id} defaultValue='false' onChange={selectEvent} />
                    </td>
                    <td>
                      <button type="button" title="Team" className="btn" onClick={() => teamLineUp(event.id)}>{people}</button>
                    </td>
                    <td className="td-first" onClick={() => editEvent(event.id)}>{event.round}</td>
                    <td className={showTeam? 'visible' : 'hidden'} onClick={() => editEvent(event.id)}>{event.teamName}</td>
                    <td>{formatDate(event.date, "DD-MM-YYYY")}</td>
                    <td>{event.time}</td>
                    <td>{event.opponents}</td>
                    <td>{event.place}</td>
                    <td className={`td-center ${event.numberOfPlayers < getMaxPlayers(event.teamTypeId) ? "alert" : ""}`}>{`${event.numberOfPlayers} / ${getMaxPlayers(event.teamTypeId)}`}</td>
                    <td className="td-center">{event.status}</td>
                  </tr>                  
                );
              })}
            </tbody>
          </table>
        </div>
		  </ContentStyle>
    );
}

const ContentStyle = styled.div`
    color: ${(props) => props.theme.frontColor1};

    h1 {
        color: ${(props) => props.theme.frontColor1};
    }

    .title-footer {
        border-bottom: 2px solid ${(props) => props.theme.submitColor1};
    }

    .more {
      background-color: ${(props) => props.theme.backgroundColor4};
      border: 1px solid ${(props) => props.theme.frontColor5};
      box-shadow: 1px 1px ${(props) => props.theme.backgroundColor4};
    }

    .more ul li, .more i {
      color: ${(props) => props.theme.frontColor2};
    }

    .grid {
      background-color: ${(props) => props.theme.frontColor1};
      color: ${(props) => props.theme.backgroundColor2};
    }

    .grid table tr th {
      border-bottom: 1px solid ${(props) => props.theme.backgroundColor5};
    }    

    .grid table tr .th-none {
      border: none;
      width: 1.5rem;
    }

    .custom-file-input::before {
      content: 'Import';
      background: linear-gradient(40deg, ${(props) => props.theme.submitColor2}, ${(props) => props.theme.submitColor3});
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
      color: ${(props) => props.theme.frontColor3};;
    }

    i {
      color: ${(props) => props.theme.frontColor5};
    }

    .create-event {
        background-color: ${(props) => props.theme.backgroundColor2};
        border: 1px solid ${(props) => props.theme.backgroundColor4};
        border-radius: 1rem;
        color: ${(props) => props.theme.frontColor2};
    }
`;

export default Events;