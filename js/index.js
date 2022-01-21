import {baralho as BaralhoCompleto} from "./baralho.js"
import { user } from "./user.js"

// Criação de usuários e separação dos seus baralhos
let User1 = new user(1)
let User1Baralho = User1.baralho
let User2 = new user(2)
let User2Baralho = User2.baralho
let User3 = new user(3)
let User3Baralho = User3.baralho
let User4 = new user(4)
let User4Baralho = User4.baralho

// Criação da variável para realizar as alterações
let BaralhoRounda = []

BaralhoCompleto.forEach(value => {
    BaralhoRounda.push(value)
})


function baralhamento(array){
    for(let i =array.length -1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1))
        const jArrIndex = array[j]
        const iArrIndex = array[i]
        array[i] = jArrIndex
        array[j] = iArrIndex
    }
}

function distruibuicao(array){
    for(let i=0;i<10;i++){
        const cartaUser1 = array.shift()
        const cartaUser2 = array.shift()
        const cartaUser3 = array.shift()
        const cartaUser4 = array.shift()

        User1Baralho = [...User1Baralho, cartaUser1]
        User2Baralho = [...User2Baralho, cartaUser2]
        User3Baralho = [...User3Baralho, cartaUser3]
        User4Baralho = [...User4Baralho, cartaUser4]
    }
}

//Neste momento vai-se baralhar e distruibuir as cartas
baralhamento(BaralhoRounda)
distruibuicao(BaralhoRounda)
