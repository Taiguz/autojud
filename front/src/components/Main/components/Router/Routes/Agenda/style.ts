import styled from "styled-components";

export const CustomContainer = styled.div`
    height: 100%;
    width: 100%;
    padding: 15px;
    .mensal {
        padding: 2px;
        cursor: pointer;
        margin: 2px;
        transition: transform 0.2s ease;

        :hover {
            transform: scale(1.1);
        }
        :active {
            transform: scale(1);
        }
    }
    .normal {
        padding: 2px;
        margin: 2px;
        cursor: pointer;
    }
`