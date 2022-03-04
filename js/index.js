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

const Duplas = [
    {
        users: [User1,User3],
        pontos: 0,
        id: 0,
        roundas: 0
    },
    {
        users: [User2,User4],
        pontos: 0,
        id: 1,
        roundas: 0
    }
]

const DivJogo = document.getElementById('jogo')

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
        value.src= value.nome=='Ás' ? `./img/${value.naipe.nome}_As.svg` :`./img/${value.naipe.nome}_${value.nome}.svg`
        value.jogada=false
    })
}

function clickOnCard(event){
    const img = document.getElementById(event.path[0].id)
    img.parentNode.removeChild(img)
    
    let [idUser,idCarta] = String(event.path[0].id).split('-')
    idUser = idUser-1
    const {id,baralho} = users[idUser]
    // Adicionar informação de que a carta selecionada foi jogada
    baralho[idCarta].jogada = true
    
    cartasJogadas = [...cartasJogadas, baralho[idCarta]]
    let cartaJogada = cartasJogadas.find(carta => carta.id == baralho[idCarta].id)
    cartaJogada.user = id
    CardOnCanvas(id,baralho[idCarta].src)
}
function ClearCanvas(player){
    const canvas = document.querySelector(`[canvas-${player}]`)
    const ctx = canvas.getContext('2d')

    let x = 69
    let y = (x*244)/169
    ctx.clearRect(90,30,x,y)
}
async function CardOnCanvas(player,src='./img/back_card.svg'){
    const divRounda = document.getElementById('rounda')
    const canvasPlayer = document.querySelector(`[canvas-${player}`)

    if(canvasPlayer){
        const ctx = canvasPlayer.getContext('2d')
        let x = 69
        let y = (x*244)/169

        let img = new Image();
        img.decoding = 'sync'
        img.src = src
        img.onload = function(){
            ctx.drawImage(img,90,30,x,y)
        }
        await tempoEspera(false, 500)
    }else{
        const canvas = document.createElement('canvas')
        canvas.setAttribute(`canvas-${player}`,'')
        canvas.setAttribute('class','canvas')
        const ctx = canvas.getContext('2d');

        let img = new Image();
        img.decoding = 'sync'
        img.src = src

        let x = 69
        let y = (x*244)/169
        img.onload = function(){
            ctx.drawImage(img,90,30,x,y)
        }
        ctx.font = 'italic 15px \'Roboto\''
        ctx.textAlign='center'
        ctx.fillStyle='#455678'
        ctx.fillText(`Jogador ${player}`,40,15)

        divRounda.append(canvas)
    }
    return null
}

// Para criação da div onde vai ser representado as cartas
function CreateUserDiv(user,divPrincipal){
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
        img.src='./img/back_card.svg'
        img.setAttribute('id', `${user.id}-${i}`)
        img.setAttribute('class', 'carta-user')
        divCartas.appendChild(img)
        divUser.appendChild(divCartas)
    }
    divPrincipal.appendChild(divUser)
}

// Para associar a dupla do user
function UserDupla(user){
    if(user.id == 1 || user.id == 3){
        user.dupla=0
    }else{
        user.dupla=1
    }
}

// Função de jogar
const buttonJogar = document.getElementById('jogar')
buttonJogar.addEventListener('click', () => {
    jogar(users,false)
})

function tempoEspera(lastUser=false,time=1500){
    if(lastUser){
        return undefined
    }else{
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve()
            }, time)
        })
    }
}

function AtribuicaoPontos(userID,CartasRodada){
    const duplaId = users[userID-1].dupla
    const dupla = Duplas[duplaId]

    CartasRodada.forEach(carta => {
        dupla.pontos += carta.pontos
    })
}

/*
    Função da criação do jogo
*/
function CriarJogo(){
    //Neste momento vai-se baralhar e distruibuir as cartas
    baralhamento(BaralhoRounda)
    distruibuicao(BaralhoRounda)
    
    /*
        Adição do {src} as cartas de cada user
        E adição da dupla de cada user
    */
    users.forEach(value => {
        addSrc(value)
        UserDupla(value)
    })
    // Informação sobre o naipe de trunfo da rounda
    const CartaTrunfo = User1.baralho[0]
    const TrunfoRounda = CartaTrunfo.naipe


    let CartaTrunfoH2 = document.createElement('h2')
    /**
    * CartaTrunfo.naipe.nome == NaipeRounda.nome
    * @returns {Boolean} True
    */
    CartaTrunfoH2.innerHTML = `Carta de trunfo: ${CartaTrunfo.nome} de ${CartaTrunfo.naipe.nome}`

    let NaipeH2 = document.createElement('h2')
    NaipeH2.innerHTML=`Trunfo: ${TrunfoRounda.nome}`

    let divPrincipal = document.createElement('div')
    divPrincipal.setAttribute('id','principal')

    users.forEach(user => CreateUserDiv(user,divPrincipal))

    DivJogo.appendChild(CartaTrunfoH2)
    DivJogo.appendChild(NaipeH2)
    DivJogo.appendChild(divPrincipal)


    return [CartaTrunfo,TrunfoRounda,divPrincipal]
}

// Cartas da rodada
let cartasJogadas = []

/**
 * @param  {Array} listUsers
 */
async function jogar(listUsers,button){
    const [CartaTrunfo,TrunfoRounda,divPrincipal] = CriarJogo()
    const h2DivVenc = document.querySelector('#vencedores h2')
    const pDivVenc = document.querySelector('#vencedores p')
    console.log(h2DivVenc)
    if(h2DivVenc){
        await tempoEspera()
        h2DivVenc.remove()
        pDivVenc.remove()
    }
    if(button){
        buttonJogar.style.visibility='visible'
    }else{
        buttonJogar.style.visibility='hidden'
    }

    let ordemRodada = [0,1,2,3]
    /*
        index 0, representa o user1
        index 1, representa o user2
        index 2, representa o user3
        index 3, representa o user4
    */

    for(let rodada = 0;rodada<10;rodada++){
        let userVencIDIndex
        for(let j = 0;j<ordemRodada.length;j++){
            let divcart,imgGroup
            await new Promise((resolve,reject)=>{
            /*
                Vai analisar se existe alguma alteração
                Mais exatamente se ocorrer uma eliminação de um elemento
                E vai aguardar que ocorra essa alteração
            */
            divcart = document.querySelector(`#user-${listUsers[ordemRodada[j]].id} .conjunto-cartas`)
            imgGroup = divcart.childNodes
            
            /*
                Escolher(filtrando) as cartas que não estam jogadas
                Depois adicionar a {src} e o {Listener}
            */
            const cartasNaoJogadas = listUsers[ordemRodada[j]].baralho.filter(carta => !carta.jogada)
            for(let i=0;i<cartasNaoJogadas.length;i++){
                imgGroup[i].src=cartasNaoJogadas[i].src
                imgGroup[i].addEventListener('click', clickOnCard)
            }
        
            const config = {
                childList: true,
                subtree: true
            }
            let callback = function(mutationList, observer){
                const [userID, cartaID] = mutationList[0].removedNodes[0].id.split('-')
                
                resolve()
            }
            const observer = new MutationObserver(callback)
            observer.observe(divcart, config)
            
            })
            imgGroup.forEach(img => {
                img.src='./img/back_card.svg'
                img.removeEventListener('click', clickOnCard)
            })
            if(j==3){
                await tempoEspera(true)
            }else{
                await tempoEspera()
            }
        }

        const NaipeRodada = cartasJogadas[0].naipe
        cartasJogadas.map(carta => {
            if(carta.naipe.id==TrunfoRounda.id){
                carta.trunfo = true
                return carta
            }else{
                carta.trunfo = false
                return carta
            }
        })

        /*
            Análise do vencedor da rodada
        */
        const cartasTrunfo = cartasJogadas.filter(carta => carta.trunfo==true)
        if(cartasTrunfo.length!=0 && NaipeRodada.id!=TrunfoRounda.id){
            /*
                Trunfo não é o naipe da rodada
                Mas foi jogado pelo menos 1 trunfo
            */
            let ValorTrunfos = []
            cartasTrunfo.forEach(carta => {
                ValorTrunfos = [...ValorTrunfos, carta.valor]
            })
            
            const TrunfoVencedor = ValorTrunfos.reduce((acc,curr) => {
                return Math.max(acc,curr)
            })

            const CartaVencedora = cartasTrunfo.filter(carta => carta.valor==TrunfoVencedor)
            console.log(`User ${CartaVencedora[0].user} ganhou`)

            await tempoEspera(false,800)
            users.forEach(user => {
                ClearCanvas(user.id)
            })

            alert(`User ${CartaVencedora[0].user} ganhou`)
            AtribuicaoPontos(CartaVencedora[0].user,cartasJogadas)
            userVencIDIndex = CartaVencedora[0].user-1
        }else{
            /*
                Não foi jogado nenhum trunfo
                Ou o naipe da rodada é o naipe do trunfo
            */
            const CartasNaipeJogado = cartasJogadas.filter(carta => carta.naipe.id == NaipeRodada.id)
            
            let ValorCartas = []
            CartasNaipeJogado.forEach(carta => {
                ValorCartas = [...ValorCartas, carta.valor]
            })

            const ValorCartaVencedora = ValorCartas.reduce((acc,curr) => {
                return Math.max(acc,curr)
            })

            const CartaVencedora = CartasNaipeJogado.filter(carta => carta.valor == ValorCartaVencedora)
            console.log(`User ${CartaVencedora[0].user} ganhou`)
            
            await tempoEspera(false,800)
            users.forEach(user => {
                ClearCanvas(user.id)
            })

            alert(`User ${CartaVencedora[0].user} ganhou`)
            AtribuicaoPontos(CartaVencedora[0].user,cartasJogadas)
            userVencIDIndex = CartaVencedora[0].user-1
        }
        // Renovação das cartas de rodada
        cartasJogadas = []
        
        /*
            Ordem da próxima rodada, em relação ao vencedor da rodada atual
        */
        while(userVencIDIndex!==ordemRodada[0]){
            ordemRodada.push(ordemRodada.splice(0,1)[0])
        }
    }

    // Função para indicar a dupla vencedora da rounda
    (async function DuplaVencedoraDeRounda(){
        const pontosDup1 = Duplas[0].pontos
        const pontosDup2 = Duplas[1].pontos
        const divVencedores = document.getElementById('vencedores')
        const h2 = document.createElement('h2')
        const p = document.createElement('p')

        if(pontosDup1 == 60){
            console.log('Empate entre as duplas')
            Duplas[0].roundas+=1
            Duplas[1].roundas+=1
            h2.innerHTML='Empate'
            p.innerText = `Dupla ${0}: ${Duplas[0].roundas}\n Dupla ${1}: ${Duplas[1].roundas}`
        }else{
            const MaiorValorPontos = Math.max(pontosDup1,pontosDup2)
            const DuplaVencedora = Duplas.filter(dulpa => dulpa.pontos == MaiorValorPontos)
            
            const {id,pontos} = DuplaVencedora[0]
            console.log(`Dupla ${id} ganhou com ${pontos}`)
            h2.innerHTML = `Dupla ${id} ganhou com ${pontos} pontos`
            if(MaiorValorPontos>=61 && MaiorValorPontos<=89){
                Duplas[id].roundas +=1
            }else if(MaiorValorPontos>=90 && MaiorValorPontos<=119){
                Duplas[id].roundas +=2
            }else{
                Duplas[id].roundas +=4
            }
            p.innerText = `Dupla ${0}: ${Duplas[0].roundas}\n Dupla ${1}: ${Duplas[1].roundas}`
        }
        divVencedores.append(h2)
        divVencedores.append(p)
    })()
    
    /*
        Remoção dos pontos para começar nova rounda
        E remoção dos baralhos de cada user
    */
    Duplas.forEach(dupla => {dupla.pontos = 0})
    console.log(Duplas)
    
    // Verificação se alguma dupla já alcançou as 4 roundas
    const dup = Duplas.filter(dupla=>{dupla.roundas>=4})
    console.log(`Dup: ${dup}`)
    if(dup.length==1){
        return VitoriaFinal(dup.id)
    }else{
        let firstElement = DivJogo.firstElementChild
        while(firstElement){
            firstElement.remove()
            firstElement = DivJogo.firstElementChild
        }
        console.log(cartasJogadas)
        users.forEach(user => {
            user.baralho = []
        })
        BaralhoCompleto.forEach(value => {
            BaralhoRounda.push(value)
        })
        await tempoEspera(false,1500)
        return jogar(users,false)
    }
}


function VitoriaFinal(IdDupla){
    const divVencedores = document.getElementById('vencedores')
    const h2 = document.createElement('h2')
    const p = document.createElement('p')

    h2.innerHTML=`Vitória da dupla ${IdDupla}`
    p.innerHTML=`Com ${Duplas[IdDupla].roundas} roundas ganhas`
    divVencedores.append(h2)
    divVencedores.append(p)

    console.log(`Vítória da ${IdDupla}`)
    buttonJogar.visibility='visible'
}