import { Container } from 'react-bootstrap'
import styled from 'styled-components'
export const ClientesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

export const CustomContainer = styled(Container)`
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 10px;
`