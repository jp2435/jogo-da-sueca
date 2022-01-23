import {baralho as BaralhoCompleto} from "./baralho.js"
import { user } from "./user.js"

// Criação de usuários
let User1 = new user(1)
let User2 = new user(2)
let User3 = new user(3)
let User4 = new user(4)

const users = [
    User1,
    User2,
    User3,
    User4
]

// Criação da variável do baralho para realizar as alterações
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

function addSrc(user){
    const {baralho} = user
    baralho.forEach(value => {
        value.src= value.nome=='Ás' ? `/img/${value.naipe.nome}_As.svg` :`/img/${value.naipe.nome}_${value.nome}.svg`
    })
}

function clickOnCard(event){
    const img = document.getElementById(event.path[0].id)
    img.classList.toggle('hide-img')
}

// Para criação da div onde vai ser representado as cartas
function CreateUserDiv(user){
    let divUser = document.createElement('div')
    let UserH4 = document.createElement('h4')
    UserH4.innerHTML=`Jogador ${user.id}`
    divUser.appendChild(UserH4)
    let divCartas = document.createElement('div')
    divCartas.setAttribute('class', 'dclasscartas')
    const {baralho} = user

    for(let i=0;i<baralho.length;i++){
        let img = document.createElement('img')
        img.src=baralho[i].src
        img.setAttribute('id', `${user.id}-${i}`)
        img.setAttribute('class', 'cartas-user')
        img.addEventListener('click',clickOnCard)
        divCartas.appendChild(img)
        divUser.appendChild(divCartas)
    }

    divPrincipal.appendChild(divUser)
}

//Neste momento vai-se baralhar e distruibuir as cartas
baralhamento(BaralhoRounda)
distruibuicao(BaralhoRounda)

users.forEach(value => {
    addSrc(value)
})

// Informação sobre o naipe de trunfo da rounda
const CartaTrunfo = User1.baralho[0]
const NaipeRounda = CartaTrunfo.naipe


let CartaTrunfoH2 = document.createElement('h2')
/**
* CartaTrunfo.naipe.nome == NaipeRounda.nome
* @returns {boolean} True
*/
CartaTrunfoH2.innerHTML = `Carta de trunfo: ${CartaTrunfo.nome} de ${CartaTrunfo.naipe.nome}`

let NaipeH2 = document.createElement('h2')
NaipeH2.innerHTML=`Trunfo: ${NaipeRounda.nome}`

let divPrincipal = document.createElement('div')
divPrincipal.setAttribute('id','principal')

CreateUserDiv(User1)
CreateUserDiv(User2)
CreateUserDiv(User3)
CreateUserDiv(User4)

document.body.appendChild(CartaTrunfoH2)
document.body.appendChild(NaipeH2)
document.body.appendChild(divPrincipal)