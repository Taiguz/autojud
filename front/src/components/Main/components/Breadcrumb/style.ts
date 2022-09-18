import { Breadcrumb } from "react-bootstrap";
import styled from "styled-components";
import { mainBackgroundColor } from "../../../../constants";


export const CustomBreadcrumb = styled(Breadcrumb)`
    height: 45px;
    background-color: ${mainBackgroundColor};
    padding-left: 20px;
    padding: 10px;
    border-radius: 8px;
    width: 80%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    max-width: 1320px;
    .breadcrumb {
        margin-bottom: unset;
    }
`