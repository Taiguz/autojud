import React, { useContext, useEffect } from 'react'
import { MainContext } from '../../../..'

const Home: React.FC = () => {

    const { setBreadCrumb } = useContext(MainContext)

    useEffect(() => {
        setBreadCrumb([])
    }, [setBreadCrumb])
    

    return <h1>Dashboard</h1>

}
export default Home