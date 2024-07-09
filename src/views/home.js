import React from 'react'

import UsuarioService from '../app/service/usuarioService'
import { AuthContext } from '../main/provedorAutenticacao'

class Home extends React.Component{

    state = {
        saldo: 0
    }

    constructor(){
        super();
        this.usuarioService = new UsuarioService();
    }

    //Adicionando Métodos de Ciclo de Vida a Classe
    componentDidMount(){
        const usuarioLogado = this.context.usuarioAutenticado
        
        this.usuarioService
            .obterSaldoPorUsuario(usuarioLogado.id)
            .then( response => {
                this.setState({ saldo: response.data})
            }).catch(error => {
                console.error(error.response)
            });
    }

    render(){
        return(
            <div className="jumbotron">
                <h1 className="display-3">Bem vindo!</h1>
                <p className="lead">Esse é seu sistema de finanças.</p>
                <p className="lead">Seu saldo para o mês atual é de R$ {this.state.saldo} </p>
                <hr className="my-4" />
                <p>E essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
                <p className="lead">
                    <a className="btn btn-primary btn-lg"
                        href="#/cadastro-usuarios"
                        role="button"><i class="pi pi-users"></i>
                        Cadastrar Usuário
                    </a>
                    <a className="btn btn-danger btn-lg"
                        href="#/cadastro-lancamentos"
                        role="button"><i class="pi pi-money-bill"></i>
                        Cadastrar Lançamento
                    </a>
                </p>
            </div>
        )
    }
}

Home.contextType = AuthContext;

export default Home