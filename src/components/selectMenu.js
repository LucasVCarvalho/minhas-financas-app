import React from 'react'

export default (props) => { //componentes funcionais, tipo arrow function já exportando direto
    
    const options = props.lista.map( (option, index) => {
        return (
            <option key={index} value={option.value}>{option.label}</option>
        )
    })
    
    return (
        <select {...props} >
            {options}
        </select>
    )
}