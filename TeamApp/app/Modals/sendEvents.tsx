"use client"
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import formatDate from "../Utils/formatDate";
import { useGlobalState } from '../Providers/globalProvider';
import { format } from 'react-string-format';
import { send } from 'emailjs-com';
import { close } from "../Utils/icons";
import { update, ENDPOINT_EVENTSSTATUS, METHOD } from '../api/consumer';

interface Props {
    events: any[];
    members: any[];
};

function SendEvents({ events, members }: Props) {
    const { theme, closeModal } = useGlobalState();
    const [ templateId, setTemplateId ] = useState();
    const [ toSend, setToSend ] = useState({
        template: '',
        from: '',
        to: 'annikauolsen@gmail.com',
        message: '',
        replyTo: process.env.NEXT_PUBLIC_EMAILJS_REPLY,
    });

    //console.log("Members: ", members);

    const getTemplate = () => {
        let templateId;
        {events && events.map((event:any) => {
            if (event.teamTypeId == 4) 
                templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DEN_FRI_ID;
            else
                templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DAMER_ID;
           })};
        return templateId;
    }

    const getSubject = () => {
        let subject = '';
        {events && events.map((event:any) => {
            if (event.teamTypeId == 4)
                subject += format('Søndag d. {0} kl. {1}', formatDate(event.date, "DD MMMM").toLowerCase(), event.time);
        })};
        setToSend({ ...toSend, "from": subject });
    }

    const getMessage = () => {
        let message = '';
        {events && events.map((event:any) => {
            if (event.teamTypeId !== 4)
                message += format('<p><b>{0} d. {1} kl. {2} i {3} mod {4}</b></p><p></p>', event.teamName, formatDate(event.date, "DD-MM-YYYY"), event.time, event.place, event.opponents);
            else{
                message += format('<p><table>' +
                '<tr><td>Tidspunkt:</td><td>{0} d. {1} kl. {2}</td></tr>' +
                '<tr><td>Spillested:</td><td>{3}</td></tr>' +
                '<tr><td>Modstandere:</td><td>{4}</td></tr>' +
                '</table></p><div><b><u>Hold:</u></b></div>', event.weekDay, formatDate(event.date, "DD-MM-YYYY"), event.time, event.place, event.opponents);
            }
            {members && members.filter((member:any) => member.eventId === event.id).map((user:any) => {
                message += format('<div>{0}</div>', user.userName)
             })};
        })};
        return message;
    }

    const getSendTo = () => {
        let sendTo = '';
        {events && events.map((event:any) => {
            {members && members.filter((member:any) => member.eventId === event.id).map((user:any) => {
                if (sendTo.indexOf(user.email) === -1)
                    sendTo += ";" + user.email
             })};
        })};
        return sendTo.substring(1);
    }

    const updateStatus = async () => {
        {events && events.map( async (event:any) => {
            const data = {
                id: event.id,
                status: "Sent"
            };
            update(ENDPOINT_EVENTSSTATUS, METHOD.PUT, data, 0);
        })};
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        updateStatus();
        send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
            templateId ?? '',
            toSend,
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ''
          )
          .then((response) => {
              console.log('Successfully send e-mail', response.status, response.text);
          })
          .catch((error) => {
              console.log('Failed to sende e-mail, error', error);
          });
        closeModal();
    };

    useEffect(() => {
        setTemplateId(getTemplate());
        setToSend({ ...toSend, "message": getSendTo() + getMessage() });
        //setToSend({ ...toSend, "message": getMessage(), "to": getSendTo() });
    }, [toSend]);

     return (
      <ContentStyle theme={theme} onSubmit={onSubmit}>
	    <div className="header">
            <button type="button" title="" className="btn close" onClick={closeModal}>{close}</button>
            <h1></h1>
        </div>
        <div className="sendEvents">
            {events && events.map((event:any) => {
                if (event.teamTypeId == 4) {
                    return (
                        <div key={event.id}>
                            <p key='subject'>
                                <b>Den fri: {event.weekDay} d. {formatDate(event.date, "DD MMMM").toLowerCase()} kl. {event.time}</b>
                            </p>
                            <p key='time'>Hold og tidspunkt til vore næste kamp er:</p>
                            <table>
                                <tbody>
                                    <tr><td>Tidspunkt:</td><td>{event.weekDay} d. {formatDate(event.date, "DD-MM-YYYY")} kl. {event.time}</td></tr>
                                    <tr><td>Spillested:</td><td>{event.place}</td></tr>
                                    <tr><td>Modstandere:</td><td>{event.opponents}</td></tr>
                                </tbody>
                            </table>
                            <p></p>
                            <div  key='hold'>
                                <b><u>Hold:</u></b>
                            </div>
                            <div className="members">
                                {members && members.filter((e:any) => e.eventId == event.id).map((user:any) => {
                                    return (
                                        <div key={user.id} className="user">{user.userName}</div>
                                    );
                                })}
                            </div>
                            <p>---------------------------------------------------------------</p>
                            <p>
                               <b>Sæt subject inden send! <input type='checkbox' onChange={getSubject} /></b>
                            </p>
                        </div>
                )
                }
                return (
                    <div key={event.id}>
                        <h4 key={event.id}>
                            {event.teamName} d. {formatDate(event.date, "DD-MM-YYYY")} kl. {event.time} i {event.place} mod {event.opponents}
                        </h4>
                        <div className="members">
                            {members && members.filter((e:any) => e.eventId == event.id).map((user:any) => {
                                return (
                                    <div key={user.id} className="user">{user.userName}</div>
                                );
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
        <div className="submit-btn">
  		    <button type="submit" title="Send">Send</button>
    	</div>
	  </ContentStyle>
    );
}

const ContentStyle = styled.form`
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

        background: ${(props) => props.theme.submitColor3};
        color: ${(props) => props.theme.frontColor1};
        
        &:hover {
            background: ${(props) => props.theme.submitColor2};
            color: ${(props) => props.theme.frontColor2};
        }
    }

    .close{
        color: ${(props) => props.theme.backgroundColor1} !important;
    }
`;

export default SendEvents;