import React, { useState, createContext } from 'react'
import Header from './components/Header'
import MenuLateral from './components/MenuLateral'
import Router from './components/Router'
import { BreadCumb, MainContextType } from './types'



export const MainContext = createContext<MainContextType>({ 
    breadCumb: [{ name: 'Home', path:'/home'}],
    setBreadCumb: () => {}
})


const Main: React.FC = () => {

    const [breadCumb, setBreadCumb] = useState<BreadCumb[]>([])

    return (
        <MainContext.Provider value={{ breadCumb, setBreadCumb }}>
            <div style={{ width:'100%', height: '100%' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
                    <div style={{ width: '15%', height: '100%', maxWidth: '300px'}}>
                        <MenuLateral/>
                    </div>
                    <div style={{ width: '85%', height: '100%'}}>
                        <Header/>
                        <Router/>
                    </div>
                </div>
            </div>
        </MainContext.Provider>
    )

}

export default Main