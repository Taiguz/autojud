import React from 'react'
import { Routes, Route } from "react-router-dom";
import Breadcrumb from '../Breadcrumb';
import Navbar from '../Navbar';
import Agenda from './Routes/Agenda';
import Andamento from './Routes/Andamento';
import Andamentos from './Routes/Andamentos';
import Home from './Routes/Home';
import Processo from './Routes/Processo';
import Processos from './Routes/Processos';
import Tarefa from './Routes/Tarefa';
import Tarefas from './Routes/Tarefas';
import Usuario from './Routes/Usuario';
import Usuarios from './Routes/Usuarios';

const PaginaCentral: React.FC = () => {
    return (
        <>
            <Navbar/>
            <Breadcrumb/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="processos" element={<Processos/>} />
                <Route path="agenda" element={<Agenda/>} />
                <Route path="usuarios" element={<Usuarios/>} />
                <Route path="usuarios/:tag" element={<Usuario/>} />
                <Route path="processos/:processoId" element={<Processo/>} />
                <Route path="processos/:processoId/andamentos" element={<Andamentos/>} />
                <Route path="processos/:processoId/andamentos/:andamentoId" element={<Andamento/>} />
                <Route path="processos/:processoId/tarefas" element={<Tarefas/>} />
                <Route path="processos/:processoId/tarefas/:tarefaId" element={<Tarefa/>} />
                <Route path="processos/:processoId/tarefas/:tarefaPaiId/subtarefa/:tarefaId" element={<Tarefa/>} />
                <Route
                    path="*"
                    element={
                        <main style={{ padding: "1rem" }}>
                        <p>Não tem nada aqui :(</p>
                        </main>
                    }
                />
            </Routes>
        </>
    )
}

export default PaginaCentral