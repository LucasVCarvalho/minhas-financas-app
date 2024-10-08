import React from "react";

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";

import {withRouter} from 'react-router-dom'
import * as messages from "../../components/toastr"


import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";
import { error } from "toastr";

class CadastroLancamentos extends React.Component{

    state ={
        id: null,
        descricao: '',
        valor : '',
        mes : '',
        ano : '',
        tipo : '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    componentDidMount(){
        const params = this.props.match.params
        if(params.id){
            this.service.obterPorId(params.id)
                    .then(response => 
                        {this.setState({...response.data, atualizando : true})
                    })
                    .catch(error =>{
                        messages.mensagemErro(error.response.data)
                    })
        }
    }

    salvar = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const { descricao, valor, mes, ano, tipo } = this.state
        const lancamento = { descricao, valor, mes, ano, tipo, usuario : usuarioLogado.id}

        try {
            this.service.validar(lancamento)
        } catch (erro) {
            const mensagens = erro.mensagens
            mensagens.forEach(msg => {
                messages.mensagemErro(msg)
                return false;
            })
        }


        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
            }).catch(error => 
                //messages.mensagemErro(error.response.data)
                console.log()
            )
    }

    atualizar = () => {
        const { descricao, valor, mes, ano, tipo, status, id, usuario } = this.state
        const lancamento = { descricao, valor, mes, ano, tipo, status, id, usuario}

        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento atualizado com sucesso!')
            }).catch(error => 
                messages.mensagemErro(error.response.data)
            )
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({[name] : value})
    }

    render(){
        const tipos = this.service.obterListaTipos()
        const meses = this.service.obterListaMeses()

        return(
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição: *">
                            <input id="inputDescricao" type="text" 
                                   className="form-control"
                                   name="descricao" //nome igual ao que está no state ^
                                   value={this.state.descricao}
                                   onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" type="number" 
                                className="form-control"
                                name="ano" 
                                value={this.state.ano}
                                onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" lista={meses} 
                                        className="form-control"
                                        name="mes" 
                                        value={this.state.mes}
                                        onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" type="text" 
                                   className="form-control"
                                   name="valor" 
                                   value={this.state.valor}
                                   onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo: *">
                           <SelectMenu id="inputTipo" lista={tipos} 
                                       className="form-control"
                                       name="tipo" 
                                       value={this.state.tipo}
                                       onChange={this.handleChange}/>
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status: *">
                            <input id="inputStatus" type="text" 
                                   className="form-control" 
                                   name="status" 
                                   value={this.state.status}
                                   disabled
                                   />
                        </FormGroup>
                    </div>
                    
                </div>
                <div className="row">
                    <div className="col-md-6">
                    {this.state.atualizando ?
                        (
                            <button onClick={this.atualizar} className="btn btn-primary">
                                <i className="pi pi-refresh"></i> Atualizar
                            </button>
                        ) : (  
                            <button onClick={this.salvar} className="btn btn-success">
                                <i className="pi pi-save"></i>Salvar
                            </button>
                        )
                    }
                        <button onClick={e => this.props.history.push('/consulta-lancamentos')} 
                                className="btn btn-danger">
                                <i className="pi pi-times"></i>Cancelar
                        </button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);