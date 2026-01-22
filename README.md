# AutoJud

Sistema de monitoramento de processos judiciais e controle de prazos.

Este repositório contém a implementação do **AutoJud**, desenvolvida como Trabalho de Conclusão de Curso (TCC) no curso de Engenharia de Computação da Universidade Tecnológica Federal do Paraná (UTFPR). O projeto automatiza o acompanhamento de andamentos e o controle de prazos processuais, reduzindo a necessidade de consultas manuais em múltiplos portais judiciais.

![Tela de processo do AutoJud](https://github.com/Taiguz/autojud/blob/main/tela-processo.png)

---

## Contexto acadêmico

**Autor:** Thiago Angelo Martins  
**Instituição:** Universidade Tecnológica Federal do Paraná (UTFPR)  
**Curso:** Engenharia de Computação  

**Título do trabalho:**  
> Sistema de Monitoramento de Processos Judiciais e Controle de Prazos Utilizando JavaScript, Node.js e a API Escavador

Documento do TCC:  
[https://repositorio.utfpr.edu.br/jspui/handle/1/37686](https://repositorio.utfpr.edu.br/jspui/handle/1/37686)

---

## Objetivo do Sistema

O AutoJud tem como objetivo central:

- Centralizar informações de processos judiciais em um único sistema
- Automatizar a coleta de andamentos processuais
- Auxiliar no controle de prazos judiciais
- Reduzir falhas humanas decorrentes de acompanhamento manual

O foco é produtividade, confiabilidade da informação e mitigação de riscos relacionados à perda de prazos.

---

## Tecnologias e Arquitetura

O sistema foi desenvolvido utilizando:

- Node.js
- TypeScript
- APIs externas para consulta de processos judiciais (ex.: Escavador)
- Arquitetura backend orientada a serviços

A escolha dessas tecnologias visa simplicidade, escalabilidade e facilidade de manutenção.

---

## Limitações conhecidas

- Dependência de serviços externos para obtenção de dados judiciais
- Abrangência limitada a tribunais suportados pela API utilizada
- Projeto com foco acadêmico, não voltado para produção em larga escala

Essas limitações são discutidas no trabalho escrito.

---
## Execução do Projeto

Pré-requisitos:
- Node.js
- npm ou yarn

Instalação das dependências:

```bash
npm install
```

Execução em ambiente de desenvolvimento:

```bash
npm start
```

Variáveis de ambiente podem ser necessárias para integração com APIs externas.

---
# Oberservações

Este repositório representa a implementação prática do TCC e serve como apoio técnico ao trabalho teórico apresentado à banca examinadora.
