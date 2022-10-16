import styled from "styled-components";

interface Props {
    situacao: boolean
}
export const Li = styled.li`
    text-decoration: none;
    color: black;
    background-color: ${({ situacao }: Props) => situacao ? 'lightgreen' : 'white'};
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
    justify-content: space-between;
    align-items: center;

    .margin {
        > * {
            margin-right: 15px;
        }
    }

    span {
        margin-right: 10px;
    }

    :hover {
        transform: scale(1.05);
    }
    :active {
        transform: scale(1);
    }

    
`