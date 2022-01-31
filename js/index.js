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
/**
 * @param  {Object} user
 */
function addSrc(user){
    const {baralho} = user
    baralho.forEach(value => {
        value.src= value.nome=='Ás' ? `/img/${value.naipe.nome}_As.svg` :`/img/${value.naipe.nome}_${value.nome}.svg`
        value.jogada=false
    })
}

function clickOnCard(event){
    const img = document.getElementById(event.path[0].id)
    img.parentNode.removeChild(img)
    
    const ulCartasJogadas = document.getElementById('cartasjogadas')
    let [idUser,idCarta] = String(event.path[0].id).split('-')
    idUser= idUser-1
    // Adicionar informação de que a carta selecionada foi jogada
    users[idUser].baralho[idCarta].jogada = true
    
    const li = document.createElement('li')
    li.innerHTML = `Carta ${users[idUser].baralho[idCarta].nome} de ${users[idUser].baralho[idCarta].naipe.nome}, de user ${users[idUser].id}`
    
    ulCartasJogadas.appendChild(li)
}

// Para criação da div onde vai ser representado as cartas
function CreateUserDiv(user){
    let divUser = document.createElement('div')
    divUser.setAttribute('id', `user-${user.id}`)
    let UserH4 = document.createElement('h4')
    UserH4.innerHTML=`Jogador ${user.id}`
    divUser.appendChild(UserH4)
    let divCartas = document.createElement('div')
    divCartas.setAttribute('class', 'conjunto-cartas')
    const {baralho} = user

    for(let i=0;i<baralho.length;i++){
        let img = document.createElement('img')
        img.src='/img/back_card.svg'
        img.setAttribute('id', `${user.id}-${i}`)
        img.setAttribute('class', 'carta-user')
        divCartas.appendChild(img)
        divUser.appendChild(divCartas)
    }

    divPrincipal.appendChild(divUser)
}

//Neste momento vai-se baralhar e distruibuir as cartas
baralhamento(BaralhoRounda)
distruibuicao(BaralhoRounda)

// Adição do {src} as cartas de cada user
users.forEach(value => {
    addSrc(value)
})

// Informação sobre o naipe de trunfo da rounda
const CartaTrunfo = User1.baralho[0]
const NaipeRounda = CartaTrunfo.naipe


let CartaTrunfoH2 = document.createElement('h2')
/**
* CartaTrunfo.naipe.nome == NaipeRounda.nome
* @returns {Boolean} True
*/
CartaTrunfoH2.innerHTML = `Carta de trunfo: ${CartaTrunfo.nome} de ${CartaTrunfo.naipe.nome}`

let NaipeH2 = document.createElement('h2')
NaipeH2.innerHTML=`Trunfo: ${NaipeRounda.nome}`

let divPrincipal = document.createElement('div')
divPrincipal.setAttribute('id','principal')

users.forEach(user => CreateUserDiv(user))

document.body.appendChild(CartaTrunfoH2)
document.body.appendChild(NaipeH2)
document.body.appendChild(divPrincipal)


// Função de jogar
const buttonJogar = document.getElementById('jogar')
buttonJogar.addEventListener('click', () => {
    jogar(users)
})
/**
 * @param  {Array} listUsers
 */
async function jogar(listUsers){
    console.log(listUsers)    
    console.log(listUsers.length)  
    for(let j = 0;j<listUsers.length;j++){
        let divcart,imgGroup
        await new Promise((resolve,reject)=>{
        /*
            Vai analisar se existe alguma alteração
            Mais exatamente se ocorrer uma eliminação de um elemento
            E vai aguardar que ocorra essa alteração
        */
        divcart = document.querySelector(`#user-${listUsers[j].id} .conjunto-cartas`)
        imgGroup = divcart.childNodes
        
        /*
            Escolher(filtrando) as cartas que não estam jogadas
            Depois adicionar a {src} e o {Listener}
        */
        const cartasNaoJogadas = listUsers[j].baralho.filter(carta => !carta.jogada)
        for(let i=0;i<cartasNaoJogadas.length;i++){
            imgGroup[i].src=cartasNaoJogadas[i].src
            imgGroup[i].addEventListener('click', clickOnCard)
        }
    
        const config = {
            childList: true,
            subtree: true
        }
        let callback = function(mutationList, observer){
            console.log('Carta eliminada')
            const [userID, cartaID] = mutationList[0].removedNodes[0].id.split('-')
            
            resolve()
        }
        const observer = new MutationObserver(callback)
        observer.observe(divcart, config)
        
        })
        imgGroup.forEach(img => {
            img.src='/img/back_card.svg'
            img.removeEventListener('click', clickOnCard)
        })
    }
}