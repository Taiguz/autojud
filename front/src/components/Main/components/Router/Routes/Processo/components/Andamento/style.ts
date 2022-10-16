import styled from "styled-components";

export const  Li = styled.li`
    text-decoration: none;
    color: black;
    padding: 15px;
    border-bottom: 1px solid ${(props: {situacao?: boolean} ) => props.situacao ? 'green' : 'lightgray'};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    transition: transform 0.2s ease;
    cursor: pointer;
    border: 1px solid lightgray;
    margin-bottom: 10px;
    border-radius: 8px;
    -webkit-box-shadow: inset 0px -2px 0px 0px gray; 
    box-shadow: inset 0px -2px 0px 0px gray;

    span:nth-child(2) {
        margin-right: 10px;
        width: 80%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    :active {
        transform: scale(1);
    }

    :hover {
        transform: scale(1.05);
    }
`
