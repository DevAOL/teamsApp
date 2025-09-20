"use client"
import React, { useState } from 'react';
import { useGlobalState } from '@/app/Providers/globalProvider';
import { edit, trash } from "../Utils/icons";
import styled from 'styled-components';
import toast from "react-hot-toast";
import readXlsxFile from 'read-excel-file';
import Modal from "../Modals/modal";
import EditUser from "../Modals/editUser";
import { update, ENDPOINT_USERS, METHOD } from '../api/consumer';

interface Props {
    title: string;
    users: any[];
}

function Users ({title, users }:Props) {
    const { theme, openModal, activeModal } = useGlobalState();
    const [userId, setUserId] = useState([]);

    const handleFileChange = (e: any) => {
      const file = e.target.files[0];
      // Read the Excel file
      readXlsxFile(file).then((rows) => {
        addUsers(rows);      
      });
    };

    const addUsers = async (rows: any) => {
      {rows.map(async (row: any) => {
          const data = {
            fullName: row[0], 
            name: row[1],
            license: row[3],
            average: row[2],
            mobile: row[4],
            email: row[5],
            defaultTeams: row[6].toString(),
          };
          update(ENDPOINT_USERS, METHOD.POST, data, 0);
        }
      )}
      toast.success('Users are now added');
    };

    const editUser = (id:any) => {
      setUserId(id);
      openModal(id, "edit");
    }

    const deleteUser = (id: number) => {
      const answer = window.confirm("Ønsker du at  slette spilleren?");
      if (answer) {
        deleteUser(id);
        toast.success("Spilleren har blevet slettet.");
      }      
    }

    return (
      <ContentStyle theme={theme}>
        {activeModal === userId && (<Modal content={<EditUser id = { userId } />} size = 'w-l' />)}
        <div className="header">
          <div className="create-items">
            <div className="import-file">
              <input type="file" id="input" className="custom-file-input" placeholder="Upload file"
                     accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                     onChange={handleFileChange} /> 
            </div>
          </div>
          <div key="UserTitle" className="title">
            <h1>{title}</h1>
            <div className="title-footer"></div>
          </div>
        </div>
        <div className="grid">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Navn</th>
                <th>License</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Snitt</th>
                <th className="th-none"></th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user) => {
                return (
                <tr key={user.id} className="user">
                  <td>
                    <button type="button" title="Editere" className="btn" onClick={() => editUser(user.id)}>{edit}</button>
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.license}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email}</td>
                  <td>{user.average}</td>
                  <td>
                    <button type="button" title="Slet" className="btn" onClick={() => deleteUser(user.id)}>{trash}</button>
                  </td>
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
    background-color: ${(props) => props.theme.backgroundColor2};
    border-radius: 1rem;
    color: ${(props) => props.theme.frontColor2};
    margin: 0rem;
    padding: 0rem 1rem 2rem 1.2rem;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 1rem;
    }
    &::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }
    &::-webkit-scrollbar-thumb {
        background: #888; 
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }

    h1 {
        color: ${(props) => props.theme.frontColor1};
    }

    .title-footer {
        border-bottom: 2px solid ${(props) => props.theme.submitColor1};
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
    
    i {
      color: ${(props) => props.theme.frontColor5};
    }
    
    .custom-file-input::before {
      content: 'Import';
      background: linear-gradient(40deg, ${(props) => props.theme.submitColor2}, ${(props) => props.theme.submitColor3});
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
      color: ${(props) => props.theme.frontColor3};;
    }

`;

export default Users;