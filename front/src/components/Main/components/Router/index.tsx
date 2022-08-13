import React from 'react'
import Clientes from './Routes/Clientes';
import {
  Routes,
  Route,
} from "react-router-dom";
import Home from './Routes/Home';
import Processos from './Routes/Processos';

const PaginaCentral: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/clientes" element={<Clientes/>} />
            <Route path="/processos" element={<Processos/>} />
            <Route
                path="*"
                element={
                    <main style={{ padding: "1rem" }}>
                    <p>There's nothing here!</p>
                    </main>
                }
            />
        </Routes>
    )
}

export default PaginaCentral