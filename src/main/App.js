import React from 'react'

import Rotas from './rotas'

import 'bootswatch/dist/flatly/bootstrap.css'
import '../custom.css'

//utilizando bootswatch flatly como estilo para o site, qualquer duvida sobre o estilo acessar o site da bootswatch
class App extends React.Component {
  render(){ 
    return(
      <div>
          <Rotas/>
      </div>         
      ) 
  }
}

export default App;
