import '@fullcalendar/react/dist/vdom'
import React, { useContext, useEffect, useState } from 'react'
import { MainContext, useError } from '../../../..'
import FullCalendar, { CustomContentGenerator, EventClickArg, EventContentArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { Evento } from './types'
import api from '../../../../../../api'
import { ITarefa } from '../Tarefas/types'
import { useNavigate } from 'react-router'
import { CustomContainer } from './style'
import { limitString } from '../../../../../../utils'
import { Link } from 'react-router-dom'

const options: { [key: string]: any} = {
    viewOptions: {
        dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' },
            dayHeaderFormat: { weekday: "long"}
        },
        mensal: {
            type: 'dayGridMonth',
            buttonText: 'Mês'
        },
        semanal: {
            type: 'dayGridWeek',
            buttonText: 'Semana'
        }
    },
    headerToolbar: {
        right: 'prev,next today',
        center: 'title',
        left: 'mensal,semanal'
    },
}

const Agenda: React.FC = () => {

    const { setBreadCrumb } = useContext(MainContext)
    const [eventos, setEventos] = useState<Evento[]>([])

    const showError = useError()

    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Agenda', path: '/agenda' }])
    }, [setBreadCrumb])


    const buildEvent = (tarefa: ITarefa): Evento => {
        const {tar_id, tar_objetivo, tar_data_termino: date, tar_situacao, processo} = tarefa
        const title = `${processo?.pro_titulo}: ${tar_objetivo}`
        const backgroundColor = tar_situacao ? 'lightgreen' : undefined
        const id = String(tar_id)

        return { id, title, date, backgroundColor, tarefa }
    }

    const eventContent = (info: EventContentArg) => {
        const { event: { extendedProps: { tarefa } }, view } = info
        const { processo: { pro_titulo, pro_cnj }, tar_objetivo, tar_id } = tarefa

        const objetivo = limitString(tar_objetivo, view.type !== 'mensal' ? 200 : 25)
        return (
            <Link to={`/processos/${pro_cnj}/tarefas/${tar_id}`} style={{ textDecoration: 'none', color: 'black'}}>
                <div title={tar_objetivo} style={{ textOverflow: 'ellipsis', overflow: 'hidden'}}><span style={{ fontWeight: 'bold'}}>{pro_titulo}</span>: {objetivo}</div>
            </Link>
        )
    }

    const eventClassNames = (info: EventContentArg) => {
        const { view } = info
        if(view.type === 'mensal')
            return [ 'mensal' ]
        return [ 'normal' ]
    }


    useEffect(() => {
        const fetchEventos = async () => {
            try{
                const { data } = await api.get<ITarefa[]>('usuario/tarefas')
                setEventos(data.map(tarefa => buildEvent(tarefa)))
            }
            catch(error){
                showError("Erro ao buscar as tarefas.")
            }
        }
        fetchEventos()
    },[setEventos, showError])


    return (
        <CustomContainer>
            <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, listPlugin ]}
                initialView="dayGridMonth"
                locale="pt-br"
                height='100%'
                events={eventos}
                navLinks={true}
                views={options.viewOptions}
                eventContent={eventContent}
                eventClassNames={eventClassNames}
                headerToolbar={options.headerToolbar}
            />
        </CustomContainer>
    )

}

export default Agenda