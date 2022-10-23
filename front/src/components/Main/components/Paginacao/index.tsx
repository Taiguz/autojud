import React, { useState } from 'react'
import { Pagination } from 'react-bootstrap'

interface Props {
    totalItens: number
    paginaAtual: number
    itensPorPagina: number
    disabled: boolean
    setPagina: (pagina: number) => void
}

const quantidadeItens = 2

// Paginas comecam em 0 
const Paginacao: React.FC<Props> = ({ totalItens, paginaAtual, itensPorPagina, setPagina, disabled }) => {
    console.log(totalItens, paginaAtual, itensPorPagina, disabled)

    const totalPaginas = Math.ceil(totalItens / itensPorPagina)

    let limiteInferior = paginaAtual - quantidadeItens
    let limiteSuperior = paginaAtual + quantidadeItens

    console.log(limiteInferior, limiteSuperior)

    if(limiteInferior <= 0){
        limiteSuperior += Math.abs(limiteInferior)
        limiteInferior = 1;
    }

    if(limiteSuperior > totalPaginas) {
        limiteInferior -= limiteSuperior - totalPaginas
        if(limiteInferior <= 0)
            limiteInferior = 1
        limiteSuperior = totalPaginas
    }

    const paginas = []

    for(let index = limiteInferior; index <= limiteSuperior; index++)
        paginas.push(index)

    if(totalItens === itensPorPagina)
        return <></>

    return (
        <Pagination className="d-flex justify-content-end">
        <Pagination.Prev disabled ={paginaAtual === 1 || disabled} onClick={() => setPagina(paginaAtual - 1)}/>
        {limiteInferior > (quantidadeItens) && <Pagination.Ellipsis disabled/>}

        {paginas.map(pagina => 
            pagina === paginaAtual ?
            <Pagination.Item active>{pagina}</Pagination.Item> : 
            <Pagination.Item disabled>{pagina}</Pagination.Item>
        )}

        {limiteSuperior < (totalPaginas - quantidadeItens) && <Pagination.Ellipsis disabled/>}
        <Pagination.Next disabled={paginaAtual === totalPaginas || disabled} onClick={() => setPagina(paginaAtual + 1)}/>
        </Pagination>
    )
}

export default Paginacao