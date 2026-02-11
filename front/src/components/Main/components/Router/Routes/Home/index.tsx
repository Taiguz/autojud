import React, { useContext, useEffect } from 'react'
import { FaExternalLinkAlt } from "react-icons/fa"
import { MainContext } from '../../../..'
import { Container } from 'react-bootstrap'

const styles = {
    container: {
        padding: '24px',
        maxWidth: '900px',
        margin: '0 auto',
        lineHeight: 1.6,
    } as React.CSSProperties,
    title: {
        marginBottom: '8px',
        maxWidth: '100%'
    } as React.CSSProperties,
    subtitle: {
        marginTop: 0,
        marginBottom: '24px',
        fontWeight: 500,
    } as React.CSSProperties,
    section: {
        marginBottom: '24px',
    } as React.CSSProperties,
    description: {
        marginBottom: '12px',
    } as React.CSSProperties,
    link: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '8px',
        textDecoration: 'none',
        fontWeight: 600,
    } as React.CSSProperties,
}

const Home: React.FC = () => {

    const { setBreadCrumb } = useContext(MainContext)

    useEffect(() => {
        setBreadCrumb([
            { name: 'Home/', path: '/' },
        ])
    }, [setBreadCrumb])
    

    return (
        <Container style={{ width: '100%' }}>
            <h1 style={styles.title}>Sistema de Monitoramento de Processos Judiciais e Controle de Prazos</h1>
            <h2 style={styles.subtitle}>Projeto de Trabalho de Conclusão de Curso</h2>


            <section style={styles.section}>
                <h3>Sobre o Projeto</h3>
                <p style={styles.description}>
                    O AutoJud é um sistema desenvolvido para auxiliar na gestão e automação de processos
                    jurídicos. A plataforma oferece funcionalidades completas para:
                </p>
                <ul>
                    <li>Gerenciamento de processos jurídicos e seus andamentos</li>
                    <li>Controle de tarefas e subtarefas vinculadas aos processos</li>
                    <li>Agenda integrada para compromissos e prazos</li>
                    <li>Gestão de usuários e responsáveis por processos</li>
                    <li>Sistema de notificações via e-mail para acompanhamento de andamentos dos processos e suas atividades</li>
                </ul>
                <p style={styles.description}>
                    O objetivo é facilitar o trabalho de profissionais da área jurídica,
                    centralizando informações e automatizando processos repetitivos, proporcionando
                    maior organização e eficiência no dia a dia.
                </p>
            </section>

            <section style={styles.section}>
                <h3>Repositório do Projeto</h3>
                <p style={styles.description}>
                    O código-fonte completo deste projeto está disponível no GitHub:
                </p>
                <a
                    style={styles.link}
                    href="https://github.com/Taiguz/autojud"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaExternalLinkAlt size={16} />
                    Repositório no GitHub
                </a>
            </section>

            <section style={styles.section}>
                <h3>Contexto Acadêmico</h3>
                <p style={styles.description}>
                    <strong>Autor:</strong> Thiago Angelo Martins
                </p>
                <p style={styles.description}>
                    <strong>Instituição:</strong> Universidade Tecnológica Federal do Paraná (UTFPR)
                </p>
                <p style={styles.description}>
                    <strong>Curso:</strong> Engenharia de Computação
                </p>
                <p style={styles.description}>
                    <strong>Título do trabalho:</strong> Sistema de Monitoramento de Processos Judiciais e Controle
                    de Prazos Utilizando JavaScript, Node.js e a API Escavador
                </p>
                <a
                    style={styles.link}
                    href="https://repositorio.utfpr.edu.br/jspui/handle/1/37686"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaExternalLinkAlt size={16} />
                    Acessar documento no repositório da UTFPR
                </a>
            </section>
        </Container>
    )

}
export default Home
