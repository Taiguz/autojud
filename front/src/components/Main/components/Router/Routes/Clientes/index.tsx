import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form, InputGroup, Row, DropdownButton, Dropdown } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'
import { MainContext } from '../../../..'
import Cliente from './components/Cliente'
import { ClientesContainer, CustomContainer } from './styles'
import { ICliente } from './types'

const Clientes: React.FC = () => {

    const { setBreadCumb } = useContext(MainContext)
    const [dropdown, setDropDown] = useState('Selecionar')
    const [clientes, setClientes] = useState<ICliente[]>([
        {
            nome: 'BRHC',
            principalDemanda: 'Recuperação Judicial',
            processosCadastrados: 120,
            prazosEmAberto: 10
        },
        {
            nome: 'ETP',
            principalDemanda: 'Recuperação Judicial',
            processosCadastrados: 70,
            prazosEmAberto: 5
        },
        {
            nome: 'Brandão',
            principalDemanda: 'Recuperação Judicial',
            processosCadastrados: 0,
            prazosEmAberto: 0
        },
        {
            nome: 'Ecobras',
            principalDemanda: 'Recuperação Judicial',
            processosCadastrados: 56,
            prazosEmAberto: 0
        },
        {
            nome: 'Cereais',
            principalDemanda: 'Falência',
            processosCadastrados: 10,
            prazosEmAberto: 0
        },
        {
            nome: 'Mesbla',
            principalDemanda: 'Falência',
            processosCadastrados: 15,
            prazosEmAberto: 0
        }
    ])

    useEffect(() => {
        setBreadCumb(breadCumb => [...breadCumb, { name: 'Clientes', path: '/clientes' }])
    }, [setBreadCumb])


    return (
        <CustomContainer>
              <InputGroup className="mb-3" style={{ width: '40%', minWidth: '300px'}}>
                <DropdownButton
                variant="outline-secondary"
                title="Selecionar"
                id="input-group-dropdown-1"
                >
                <Dropdown.Item href="#">Equipe verde</Dropdown.Item>
                <Dropdown.Item href="#">Equipe azul</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">Falência</Dropdown.Item>
                <Dropdown.Item href="#">Recuperação Judicial</Dropdown.Item>
                </DropdownButton>
                <Form.Control aria-label="Text input with dropdown button" placeholder="Buscar cliente..." />
            </InputGroup>
            <ClientesContainer>
                {clientes.map(cliente => <Cliente cliente={cliente}/>)}
            </ClientesContainer>
        </CustomContainer>
    )


}
export default Clientes