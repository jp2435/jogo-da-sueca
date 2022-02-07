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
const ulCartasJogadas = document.getElementById('cartasjogadas')

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
    
    const li = document.createElement('li')

    li.innerHTML = `Carta ${baralho[idCarta].nome} de ${baralho[idCarta].naipe.nome}, de user ${id}`
    
    cartasJogadas = [...cartasJogadas, baralho[idCarta]]
    let cartaJogada = cartasJogadas.find(carta => carta.id == baralho[idCarta].id)
    cartaJogada.user = id
    ulCartasJogadas.appendChild(li)
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
    jogar(users)
})

function tempoEspera(lastUser=false){
    if(lastUser){
        return undefined
    }else{
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve()
            }, 1500)
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
async function jogar(listUsers){
    const [CartaTrunfo,TrunfoRounda,divPrincipal] = CriarJogo()
    buttonJogar.classList.toggle('hide-button')
    
    let ordem = [0,1,2,3]
    /*
        index 0, representa o user1
        index 1, representa o user2
        index 2, representa o user3
        index 3, representa o user4
    */
    let PrimeiraRodada = true

    for(let rodada = 0;rodada<10;rodada++){
        // PrimeiraRodada ? console.log("Primeira Rodada") : console.log(`${rodada+1} Rodada`)
        let userVencID
        for(let j = 0;j<ordem.length;j++){
            let divcart,imgGroup
            await new Promise((resolve,reject)=>{
            /*
                Vai analisar se existe alguma alteração
                Mais exatamente se ocorrer uma eliminação de um elemento
                E vai aguardar que ocorra essa alteração
            */
            divcart = document.querySelector(`#user-${listUsers[ordem[j]].id} .conjunto-cartas`)
            imgGroup = divcart.childNodes
            
            /*
                Escolher(filtrando) as cartas que não estam jogadas
                Depois adicionar a {src} e o {Listener}
            */
            const cartasNaoJogadas = listUsers[ordem[j]].baralho.filter(carta => !carta.jogada)
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
            alert(`User ${CartaVencedora[0].user} ganhou`)
            AtribuicaoPontos(CartaVencedora[0].user,cartasJogadas)
            userVencID = CartaVencedora[0].user-1
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
            alert(`User ${CartaVencedora[0].user} ganhou`)
            AtribuicaoPontos(CartaVencedora[0].user,cartasJogadas)
            userVencID = CartaVencedora[0].user-1
        }

        // Renovação das cartas de rodada
        cartasJogadas = []

        /*
            Eliminação das cartas inseridas durante a rodada
        */
        const liNodes = ulCartasJogadas.childNodes
        await new Promise(resolve => {
            setTimeout(()=> {
                for(let i = 3;i>=0;i--){
                    liNodes[i].remove()
                }
                resolve()
            },2000)
        })
        
        /*
            Ordem da próxima rodada, em relação ao vencedor da rodada atual
        */

        while(userVencID!==ordem[0]){
            ordem.push(ordem.splice(0,1)[0])
        }
        /*
            Indicar que já aconteceu a primeira rodada
        */
        PrimeiraRodada=false
    }

    // Função para indicar a dupla vencedora da rounda
    const DuplaVencedoraDeRounda = ()=>{
        const pontosDup1 = Duplas[0].pontos
        const pontosDup2 = Duplas[1].pontos

        if(pontosDup1 == 60){
            console.log('Empate entre as duplas')
            Duplas[0].roundas+=1
            Duplas[1].roundas+=1
        }else{
            const MaiorValorPontos = Math.max(pontosDup1,pontosDup2)
            const DuplaVencedora = Duplas.filter(dulpa => dulpa.pontos == MaiorValorPontos)
            
            const {id,pontos} = DuplaVencedora[0]
            console.log(`Dupla ${id} ganhou com ${pontos}`)
            if(MaiorValorPontos>=61 && MaiorValorPontos<=89){
                Duplas[id].roundas +=1
            }else if(MaiorValorPontos>=90 && MaiorValorPontos<=119){
                Duplas[id].roundas +=2
            }else{
                Duplas[id].roundas +=4
            }
        }
    }
    DuplaVencedoraDeRounda()

    /*
        Remoção dos pontos para começar nova rounda
        E remoção dos baralhos de cada user
    */
    Duplas.forEach(dupla => {dupla.pontos = 0})
    console.log(Duplas)
    
    // Verificação se alguma dupla já alcançou as 4 roundas
    for(let k =0;k<Duplas.length;k++){
        if(Duplas[k].roundas>=4){
            return VitoriaFinal(Duplas[k].id)
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
            return jogar(users)
        }
    }

    buttonJogar.classList.toggle('hide-button')
}


function VitoriaFinal(IdDupla){
    console.log(`Vítória da ${Duplas[IdDupla].id}`)
}