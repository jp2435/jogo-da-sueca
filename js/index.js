import {baralho as BaralhoCompleto} from "./baralho.js"
import { user } from "./user.js"

// Criação de usuários e separação dos seus baralhos
let User1 = new user(1)
let User2 = new user(2)
let User3 = new user(3)
let User4 = new user(4)

// Criação da variável para realizar as alterações
let BaralhoRounda = []

BaralhoCompleto.forEach(value => {
    BaralhoRounda.push(value)
})

function baralhamento(array){
    for(let i=array.length-1;i>0;i--){
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

        User1.baralho = [...User1.baralho, cartaUser1]
        User2.baralho = [...User2.baralho, cartaUser2]
        User3.baralho = [...User3.baralho, cartaUser3]
        User4.baralho = [...User4.baralho, cartaUser4]
    }
}

//Neste momento vai-se baralhar e distruibuir as cartas
baralhamento(BaralhoRounda)
distruibuicao(BaralhoRounda)

// Informação sobre o naipe de trunfo da rounda
const CartaTrunfo = User1.baralho[0]
const NaipeRounda = CartaTrunfo.naipe


let CartaTrunfoH2 = document.createElement('h2')
/*
    * CartaTrunfo.naipe.nome == NaipeRounda.nome
    * Return True
*/
CartaTrunfoH2.innerHTML = `Carta de trunfo: ${CartaTrunfo.nome} de ${CartaTrunfo.naipe.nome}`

let NaipeH2 = document.createElement('h2')
NaipeH2.innerHTML=`Trunfo: ${NaipeRounda.nome}`

let divPrincipal = document.createElement('div')
divPrincipal.setAttribute('id','principal')

function clickOnLi(event){
    const li = document.getElementById(event.path[0].id)
    li.classList.toggle('hide-li')
}

// Para criação da div onde vai ser representado as cartas
const CreateUserDiv = (user) => {
    let divUser = document.createElement('div')
    let UserH4 = document.createElement('h4')
    UserH4.innerHTML=`Jogador ${user.id}`
    divUser.appendChild(UserH4)
    let ulDiv = document.createElement('ul')
    const {baralho} = user

    for(let i=0;i<baralho.length;i++){
        let li = document.createElement('li')
        li.innerHTML=`${baralho[i].nome} de ${baralho[i].naipe.nome}`
        li.setAttribute('id', `${user.id}-${i}`)
        li.setAttribute('class', 'view-li')
        li.addEventListener('click', clickOnLi)
        ulDiv.appendChild(li)
    }

    divUser.appendChild(ulDiv)
    divPrincipal.appendChild(divUser)
}

CreateUserDiv(User1)
CreateUserDiv(User2)
CreateUserDiv(User3)
CreateUserDiv(User4)

document.body.appendChild(CartaTrunfoH2)
document.body.appendChild(NaipeH2)
document.body.appendChild(divPrincipal)