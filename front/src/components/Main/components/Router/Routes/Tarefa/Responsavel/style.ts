import styled from "styled-components";

interface Props {
    situacao: boolean
}
export const Li = styled.li`
    background-color: 'white'};
    border: 1px solid lightgray;
    margin-bottom: 20px;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.2s ease;
    border-radius: 8px;
    -webkit-box-shadow: inset 0px -2px 0px 0px gray; 
    box-shadow: inset 0px -2px 0px 0px gray;
    width: 100%;
    display: flex; 
    flex-direction: row;
    align-items: center;

    :hover {
        transform: scale(1.05);
    }
    :active {
        transform: scale(1);
    }

    
`