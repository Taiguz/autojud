import React, { useContext } from 'react'
import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MainContext } from '../..'

const Header: React.FC = () => {
    const { breadCumb } = useContext(MainContext)

    return (
        <Breadcrumb style={{ height: '50px'}}>
            {breadCumb.map(({ name, path}, index) => (
                <BreadcrumbItem active={index === breadCumb.length - 1}>{name}</BreadcrumbItem>
            ))}
        </Breadcrumb>
    )

}

export default Header