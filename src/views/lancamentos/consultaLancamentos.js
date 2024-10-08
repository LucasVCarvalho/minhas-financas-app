import React from "react";
import { withRouter } from 'react-router-dom'

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService"

import * as messages from "../../components/toastr"

import {Dialog} from 'primereact/dialog'
import { Button } from "primereact/button";

class ConsultaLancamentos extends React.Component{

    state = {
        ano : '',
        mes : '',
        tipo : '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos : []
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        if(!this.state.ano){
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then( resposta => {
                const lista = resposta.data

                if(lista.length < 1){
                    messages.mensagemAlerta("Nenhum resultado encotrado.")
                }
                this.setState({ lancamentos : lista})
            }).catch(error => {
                console.log(error)
            })
        console.log(this.lancamentos)
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) =>{
        this.setState({ showConfirmDialog : true, lancamentoDeletar : lancamento})
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog : false, lancamentoDeletar : {}})
    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar)
                lancamentos.splice(index, 1)
                this.setState({lancamentos : lancamentos ,showConfirmDialog : false})
                messages.mensagemSucesso('Lançamento deletado com sucesso!')
        }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o Lançamento')
        })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then(response =>{
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if(index !== -1){
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento
                    this.setState({lancamento})
                }
                messages.mensagemSucesso("Status atualizado com sucesso!")
            })
    }

    render(){
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label='Confirmar' icon='pi pi-check' onClick={this.deletar}/>
                <Button label='Cancelar' icon='pi pi-times' onClick={this.cancelarDelecao} className="p-button-secondary"/>
            </div>
        );

        return(
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <FormGroup label="Ano: *" htmlFor="inputAno">
                                <input type="number" 
                                        id="inputAno" 
                                        className="form-control"
                                        name="ano"
                                        value={this.state.ano}
                                        placeholder="Digite o Ano"
                                        onChange={e => this.setState({ano: e.target.value})}/>
                            </FormGroup>
                            <FormGroup label="Mês: " htmlFor="inputMes">
                                <SelectMenu id="inputMes"
                                            value={this.state.mes} 
                                            onChange={e => this.setState({mes: e.target.value})}
                                            className="form-control" 
                                            lista={meses}/>
                            </FormGroup>
                            <FormGroup label="Descrição: " htmlFor="inputDesc">
                                <input type="text" 
                                        id="inputDesc" 
                                        className="form-control"
                                        name="descricao"
                                        value={this.state.descricao}
                                        placeholder="Digite a descrição"
                                        onChange={e => this.setState({descricao: e.target.value})}/>
                            </FormGroup>
                            <FormGroup label="Tipo Lançamento:" htmlFor="inputTipo">
                                <SelectMenu id="inputTipo" 
                                            value={this.state.tipo} 
                                            onChange={e => this.setState({tipo: e.target.value})}
                                            className="form-control" 
                                            lista={tipos}/>
                            </FormGroup>

                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-success">
                                    <i className="pi pi-search"></i>    Buscar
                            </button>
                            <button onClick={this.preparaFormularioCadastro} 
                                    type="button" 
                                    className="btn btn-danger">
                                    <i className="pi pi-plus"></i>    Cadastrar
                            </button>

                        </div>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable  lancamentos={this.state.lancamentos}
                                               deleteAction={this.abrirConfirmacao} 
                                               editAction={this.editar}
                                               alterarStatus={this.alterarStatus}/>
                        </div>
                    </div>
                </div>
                <div>
                <Dialog header="Confirmação" 
                    visible={this.state.showConfirmDialog} 
                    style={{ width: '50vw' }} 
                    footer={confirmDialogFooter}
                    modal={true}
                    onHide={() => this.setState({showConfirmDialog : false})}>
                    <p className="m-0">
                        Você deseja excluir esse Lançamento?
                    </p>
                </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos)