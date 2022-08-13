import React, { useContext, useEffect } from 'react'
import { MainContext } from '../../../..'

const pathName = 'Processos'
const Processos: React.FC = () => {

    const { setBreadCumb } = useContext(MainContext)

    useEffect(() => {
        setBreadCumb(breadCumb => [...breadCumb, { name: 'Processos', path: '/processos' }])
        return () => {
            setBreadCumb(breadcrumb => {
                const index = breadcrumb.findIndex(b => b.name === pathName)
                breadcrumb.splice(index,0)
                return breadcrumb
            })
        }
    }, [setBreadCumb])
    
    return <h1>Processos</h1>

}

export default Processos