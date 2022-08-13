import React, { useContext, useEffect } from 'react'
import { MainContext } from '../../../..'

const Home: React.FC = () => {

    const { setBreadCumb } = useContext(MainContext)

    useEffect(() => {
        setBreadCumb([{ name: 'Home', path: '/' }])
    }, [setBreadCumb])
    

    return <h1>Dashboard</h1>

}
export default Home