import styled from "styled-components";
import { Li } from "../Andamento/style";

export const LiTarefa = styled(Li)`
    text-decoration: none;
    color: black;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 1px solid lightgray;
    margin-bottom: 10px;
    border-radius: 8px;
    -webkit-box-shadow: inset 0px -2px 0px 0px gray; 
    box-shadow: inset 0px -2px 0px 0px gray;

    :hover {
        transform: scale(1.05);
        border: 1px solid lightgray;
    }
    :active {
        transform: scale(1);
    }
`