"use client"
import React from 'react';
import styled from 'styled-components';
import { useGlobalState } from '../Providers/globalProvider';

interface Props {
  content: React.ReactNode;
  size: string;
};

function Modal ({ content, size }: Props) {
    const { theme } = useGlobalState();

    const getClasses = () => {
      return "modal-overlay " + size;
    }

    return (
      <ModalStyle theme={theme} className={getClasses()}>
        <div className="modal-content">{content}</div>
      </ModalStyle>
  );
} 

const ModalStyle = styled.div`
  background-color: ${(props) => props.theme.frontColor1};
  border: 1px solid ${(props) => props.theme.backgroundColor3};
  box-shadow: 1px 1px ${(props) => props.theme.greyColo4};
  border-radius: 2rem;
  color: ${(props) => props.theme.backgroundColor1};
`;

export default Modal;