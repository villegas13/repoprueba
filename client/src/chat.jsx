import styled from 'styled-components';


const ULMensajes = styled.ul`
    max-width: 800px;
    margin: 10px auto;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const LIMessage = styled.li`
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    word-wrap: break-word;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
`;

export {ULMensajes, LIMessage};
