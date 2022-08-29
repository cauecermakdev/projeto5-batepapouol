let objMsg = {
    from: "",
    to:"Todos",
    text: "",
    type:"message"//dps 
}  

let logado = false;


function reset(){
    document.querySelector("footer textarea").value = "";
    document.querySelector(".msgs").innerHTML = "";
    document.querySelector(".participant").innerHTML="";
}

reset();

//abre e fecha menu lateral
function toggleMenu(){
    const icon_seletor = document.querySelector(".esconder");
    icon_seletor.classList.toggle("display-none");

    const seletor_blackback = document.querySelector(".blackbackground");
    seletor_blackback.classList.toggle("display-none");

    const seletorMenu = document.querySelector(".menu");
    seletorMenu.classList.toggle("clicked");
}


//mostrar as primeiras mensagens primeiro
function scroll_new_msgs(){
    const elementoQueQueroQueApareca = document.querySelector('.fim');
    elementoQueQueroQueApareca.scrollIntoView();
}


/*chat commit*/

const username = {
    name: ""
};

function tratarSucesso(resposta) {
    //console.log(resposta);
    if (resposta.status == 200) {
        
        
         //colocar display-none na div ".enter"
        document.querySelector(".enter").classList.add("display-none");
        //console.log("Foi inserido Username com sucesso!");
        
        //dps que deu certo login
        logado = true;
        if(logado){
            participants_menu();
            buscaMensagensServidor();
            setInterval(buscaMensagensServidor,3000);
            setInterval(usuarioOnline,5000);
            // participants_menu();
            setInterval(participants_menu,10000);
        }
        //coloca msgs no html
    }
}

function tratarErrorNome(error) {
//   console.log("Deu catch na funcao enterUserName");
    if (error.response.status == 400) {
        //logado = false;
        alert("usuário já existe, insira um nome de usuário diferente!");    
        document.querySelector(".enter input").value = "";
    }
}


function enterUserName() {
    //username.name = prompt("Digite seu nome:");
    username.name = document.querySelector(".enter input").value;

    //faz post com objeto com nome
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', username);

    requisicao.then(tratarSucesso);
    requisicao.catch(tratarErrorNome);
}

//enterUserName();
function usuarioOff(){
    logado=false;
}

function usuarioOnline() {
    
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', username);
    //requisicao.catch(console.log("Deu catch na funcao UsuarioOnline"));
}


//envia mensagem 
function sendMessage(){

    //textarea value
    const text_textarea_seletor = document.querySelector("footer textarea");
    //console.log(text_textarea_seletor.value);

    //console.log(objMsg);

    objMsg.from = username.name;
    objMsg.text = text_textarea_seletor.value;
    //console.log(objMsg);

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",objMsg);

    //requisicao.then(alert("deuBom"));
    requisicao.then(buscaMensagensServidor());
    
    //requisicao.catch(console.log("Deu catch na funcao send message"));
    //Caso o servidor responda com erro, significa que esse usuário não está mais na sala e a página deve ser atualizada
    requisicao.catch(function(){window.location.reload()});
    
    //dps que enviar a msg apaga ela do textarea
    text_textarea_seletor.value = "";
}


function insereMensagem(objetoMsg) {

    const from = objetoMsg.from;
    const to = objetoMsg.to;
    const text = objetoMsg.text;
    const type = objetoMsg.type;
    const time = objetoMsg.time;
    //console.log(type);

   //if(type == "private_message" && to != username.name){

    //}else{
    const seletor_msg = document.querySelector(".msgs");

    seletor_msg.innerHTML +=
    `
    <li>
        <div class="${type} bate-papo">
        <p><span class="time">${time}</span>
            <span class="username">${from}</span>
            <span class="msg">${text}</span>
        </p>
        </div>
    </li>
    `
    //}


}



//colocar essa mensagem no meu html
function colocaMsgHTML(requisicao) {
    //zera msgs
    document.querySelector(".msgs").innerHTML = "";

    //imprimindo array com objetos que foram buscados no servidor
    //console.log(requisicao.data);

    const array_msgs = requisicao.data;
    array_msgs.forEach(insereMensagem);
    scroll_new_msgs();

}

function deuRuim(erro){
    alert("Erro na requisição de mensagens");
    //console.log(erro);
}

/*buscando msg no servidor*/
function buscaMensagensServidor(objeto) {
    const requisicao = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    //console.log(typeof(requisicao));
    //console.log("buscaMsg");
    requisicao.then(colocaMsgHTML);//colocar essa mensagem no meu html
    //console.log("Deu catch na funcao buscaMensagensServidor");
    //requisicao.catch(deuRuim);//preciso tratar caso não dê certo
}


//posso ter uma funcao get(funcao,link) e uma funcao post(funcao,link)
/*
document.addEventListener('keydown', function (event) {
    if (event.key !== 13) return;
    // Aqui seu código
    console.log("deu enter");
})
*/


/*********************************************** */
/*MENU FUNCTIONS*/

function colocaFrasetextarea(nome){

    //se selecionar para mandar alguem de selecionar todos e depois selecionar todos vai dar problema
    //sempre que selecionar todos preciso retirar a frase do textarea
    //o problema é que se a frase nao estiver no textarea e eu selecionar todos logo de cara, vou adicionar mais um display-none
    //quando selecionar Todos preciso verificar se já tem display none na frase do textarea, senão tiver eu adiciono

    //coloca a frase
    document.querySelector(".frase_msg_reservada").classList.remove("display-none");

    //colocando nome no textarea
    document.querySelector(".to-textarea-name").innerHTML = `${nome}`;
    
}

function retiroFrasetextarea(){
    const seletor_reservada = document.querySelector("footer p");
    if(!seletor_reservada.classList.contains("display-none")){
        seletor_reservada.classList.add("display-none");
    }
}

//seleciona item
function select_item_menu(elemento){
    
    //1. mostra check do item selecionado no participant e na visibility

    const classePai = elemento.parentElement.parentElement.className;
    const selected = document.querySelector(`.${classePai} .select`);
    

    if(selected != null){
        selected.classList.remove("select");
    }

    elemento.classList.toggle("select");//dando check no elemento clicado



    //2. de acordo com o item selecionado mudo o to do objMsg

    if(classePai == "participant"){
        //console.log("entra participant");
        const nome = elemento.children[0].children[1].innerHTML;
        objMsg.to = nome;
        
        if(objMsg.to != "Todos"){
            colocaFrasetextarea(nome);
        }else{
            retiroFrasetextarea();
        }
    }

    if(classePai == "visibility"){
        const visibility = elemento.children[0].children[1].innerHTML;
        if(visibility == "Público"){
            //console.log("publico");
            objMsg.type = "message";
            //console.log(objMsg);
        }else if(objMsg.to != "Todos"){
            objMsg.type = "private_message";
            //console.log(objMsg);
            //console.log("privado");
        }   
    }
}

function insertVisibilityMenu(){
    const sel_visibility = document.querySelector(".visibility");
    sel_visibility.innerHTML = `
    
        <li>
            <div class="menu-item" onclick="select_item_menu(this)">
                <div class="display-flex">
                    <ion-icon name="lock-open"></ion-icon>
                    <p>Público</p>
                </div>
                <div>
                    <ion-icon name="checkmark" class="check-icon"></ion-icon>
                </div>
            </div>
        </li>

                            
        <li>
            <div class="menu-item" onclick="select_item_menu(this)">
                <div class="display-flex">
                    <ion-icon name="lock-closed"></ion-icon>
                    <p>Privado</p>
                </div>
                <div>
                    <ion-icon name="checkmark" class="check-icon"></ion-icon>
                </div>
            </div>
        </li>
    `
}

function select_item_menu_participants(elemento){

    const selected = document.querySelector(".select");
    

    if(selected != null){
        selected.classList.remove("select");
    }

    //selecionando elemento clicado
    elemento.classList.toggle("select");
}

function insertHTMLMenu(participante){
    const seletor_participant = document.querySelector(".participant");

    seletor_participant.innerHTML +=
    `
    <li>
        <div class="menu-item" onclick="select_item_menu(this)">
            <div class="display-flex">
                <ion-icon name="person-circle"></ion-icon>
                <p>${participante.name}</p>
            </div>
            <div>
                <ion-icon name="checkmark" class="check-icon"></ion-icon>
            </div>
        </div>
    </li>
    `
    ;
}


function insertMenuparticipants(participantes){
    //adiciona li com todos
    document.querySelector(".participant").innerHTML=
    `
    <li>
        <div class="menu-item" onclick="select_item_menu(this)">
            <div class="display-flex">
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <div>
                <ion-icon name="checkmark" class="check-icon"></ion-icon>
            </div>
        </div>
    </li>
    `;

    const array_participantes = participantes.data;
    array_participantes.forEach(insertHTMLMenu);
    insertVisibilityMenu();
    //console.log(participantes.data);
}


/* colocando lista de participants no menu lateral*/
function participants_menu(){
    //reseta participants anteriores
    const requisicaoParticipantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants"); 
    requisicaoParticipantes.then(insertMenuparticipants);
    //requisicaoParticipantes.catch(console.log("Deu catch na funcao q coloca participants menu"))
}

//colocando participantes no menu lateral
//participants_menu();
//setInterval(participants_menu,10000);
