import { Button } from "react-bootstrap";
import styled from "styled-components";
import { mainBackgroundColor } from "../../../../constants";

const levels: any = {
    primary: {
        normal: '#97f58e',
        highlight: '#79c771',
        border: 'lightgreen',
        shadow: 'green'
    },
    normal: {
        normal: 'white',
        highlight: mainBackgroundColor,
        border: 'lightgray',
        shadow: 'gray'
    }
}
interface Props{
    level: string
}

const getStyle = (level: string, style: string) => {
    if(levels[level] !== undefined)
        return levels[level][style]
    else
        return levels.normal[style]    
}

export const CustomButton = styled.button<Props>`
    background-color: ${({ level }) => getStyle(level, 'normal')};
    border: 1px solid lightgray;
    -webkit-box-shadow: inset 0px -4px 0px 0px ${({ level }) => getStyle(level, 'shadow') }; 
    box-shadow: inset 0px -4px 0px 0px ${({ level }) => getStyle(level, 'shadow') };
    color: black;
    border-radius: 8px;
    padding: 10px;
    transition: * 0.5s ease;

    :hover {
        background-color: ${({ level }) => getStyle(level, 'highlight') };
    }
    :active {
        -webkit-box-shadow: inset 0px -1px 0px 0px ${({ level }) => getStyle(level, 'shadow') }; 
        box-shadow: inset 0px -1px 0px 0px ${({ level }) => getStyle(level, 'shadow') };
        transform: translateY(3px);
    }
`