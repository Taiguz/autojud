import React, { useContext } from 'react'
import { BreadcrumbItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import { MainContext } from '../..'
import { CustomBreadcrumb } from './style'

const BreadCumb: React.FC = () => {
    const  { breadCrumb }  = useContext(MainContext)

    return (
        <CustomBreadcrumb>
            {breadCrumb.map(({ name, path }: any, index: number) => ( 
                <BreadcrumbItem 
                    key={v4()}
                    active={index === breadCrumb.length - 1}
                    linkAs={Link}
                    linkProps={{ to: path }}>
                {name}
                </BreadcrumbItem>
            ))}
        </CustomBreadcrumb>
    )

}

export default BreadCumb