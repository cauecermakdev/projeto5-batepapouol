let objMsg = {
    from: "",
    to:"Todos",
    text: "",
    type:"message"//dps 
}  

/* //seleciona menu-items
function selectMenuItems(elemento){
    elemento.classList.toggle("display-none");
} */

function reset(){
    document.querySelector("footer input").value = "";
    document.querySelector(".msgs").innerHTML = "";
    document.querySelector(".contato").innerHTML="";
}

reset();

//abre e fecha menu lateral
function toggleMenu(){
    const icon_seletor = document.querySelector(".esconder");
    icon_seletor.classList.toggle("display-none");

    const seletor_blackback = document.querySelector(".blackbackground");
    seletor_blackback.classList.toggle("display-none");
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
    if (resposta.status === 200) {
        //console.log("Foi inserido Username com sucesso!");
    }
}

function tratarError(error) {
    //alert("deu ruim!");
    //alert(error.response.status);

    if (error.response.status === 400) {
        enterUserName();
    }
}


function enterUserName() {
    username.name = prompt("Digite seu nome:");
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', username);

    requisicao.then(tratarSucesso);
    requisicao.catch(tratarError);
}

enterUserName();

function usuarioOnline() {
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', username);
    //requisicao.then(console.log(requisicao));
    //requisicao.then(tratarSucesso);
    //requisicao.catch(tratarError);
}


//envia mensagem 
function sendMessage(){
    //objeto a ser enviado
    /*{
        from: "nome do usuário",
        to: "nome do destinatário (Todos se não for um específico)",
        text: "mensagem digitada",
        type: "message" // ou "private_message" para o bônus
    }*/

    //input value
    const text_input_seletor = document.querySelector("footer input");
    console.log(text_input_seletor.value);
    //Será usado para colocar no menu sidebar
    //const contatoSelecionado = document.querySelector(".contato .check");
    //const visibilidadeSelecionada = document.querySelector(".visibilidade .check");

    /*if(to_ !== "" || to_ != "Todos"){
    }*///caso de ser msg privada
    
    console.log(objMsg);
    objMsg = {
        from: username.name,
        to:"Todos",
        text: text_input_seletor.value,
        type:"message"//dps 
    }  
    console.log(objMsg);

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",objMsg);

    //requisicao.then(alert("deuBom"));
    requisicao.then(buscaMensagensServidor());
    //requisicao.catch(window.location.reload());
    
    //dps que enviar a msg apaga ela do input
    text_input_seletor.value = "";
}



//requisito de mandar nome do usuario a cada 5 segundos para saber que ele esta online
setInterval(usuarioOnline,5000);


/* OBJETO DE RESPOSTA DAS MENSAGENS DO SERVIDOR

[
    {
        from: "João",
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: "08:01:17"
    },
    {
        from: "João",
        to: "Todos",
        text: "Bom dia",
        type: "message",
        time: "08:02:50"
    },
]
*/

//insere <li> com a mensagem especifica no <ul> do html
function insertElements(msg_type, msgClass){
    //msg_type: status or msg4all or msgDirect
    console.log(msg_type);

    const seletor_msg = document.querySelector(msgClass);

    seletor_msg.innerHTML +=
    `
    <li>
        <div class="${msg_type} bate-papo">
        <p><span class="time">${time}</span>
            <span class="username">${from}</span>
            <span class="msg">${text}</span>
        </p>
        </div>
    </li>
    `

}

function insereMensagem(objetoMsg) {

    const from = objetoMsg.from;
    const to = objetoMsg.to;
    const text = objetoMsg.text;
    const type = objetoMsg.type;
    const time = objetoMsg.time;
    //console.log(type);

   //if(from == username.name){
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

    //.msgs in html is ul and have all msgs  inside
    //insertElements(type,".msgs");

    /*
    //qual o tipo da mensagem? 
    //colocar mensagem na ul
    if (type === "status") {//tipo entra e sai

        insertElements("status",".msgs");

    } else if (type === "message") {

    } else {

    }
    */
}



//colocar essa mensagem no meu html
function colocaMsgHTML(requisicao) {
    //zera msgs
    document.querySelector(".msgs").innerHTML = "";

    console.log(requisicao.data);

    const array_msgs = requisicao.data;
    array_msgs.forEach(insereMensagem);
    scroll_new_msgs();

}

function deuRuim(erro){
    //alert("Erro na requisição de mensagens");
    console.log(erro);
}

/*buscando msg no servidor*/
function buscaMensagensServidor(objeto) {
    const requisicao = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    console.log(typeof(requisicao));
    console.log("buscaMsg");
    requisicao.then(colocaMsgHTML);//colocar essa mensagem no meu html
    requisicao.catch(deuRuim);//preciso tratar caso não dê certo
}

buscaMensagensServidor();
//setInterval(buscaMensagensServidor,3000);


//avisa servidor que usuario esta online
//setInterval(usuarioOnline,5000);


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

function colocaFraseInput(nome){
    /*
    if(`${nome}` != "Todos"){

    }*/

    //se selecionar para mandar alguem de selecionar todos e depois selecionar todos vai dar problema
    //sempre que selecionar todos preciso retirar a frase do input
    //o problema é que se a frase nao estiver no input e eu selecionar todos logo de cara, vou adicionar mais um display-none
    //quando selecionar Todos preciso verificar se já tem display none na frase do input, senão tiver eu adiciono

    //coloca a frase
    document.querySelector(".frase_msg_reservada").classList.remove("display-none");

    //colocando nome no input
    document.querySelector(".to-input-name").innerHTML = `${nome}`;
    
}

//seleciona item
function select_item_menu(elemento){
    
    //1. mostra check do item selecionado no contato e na visibilidade

    const classePai = elemento.parentElement.parentElement.className;
    const selected = document.querySelector(`.${classePai} .select`);
    

    if(selected != null){
        selected.classList.remove("select");
    }

    elemento.classList.toggle("select");//dando check no elemento clicado



    //2. de acordo com o item selecionado mudo o to do objMsg

    if(classePai == "contato"){
        console.log("entra contato");
        const nome = elemento.children[0].children[1].innerHTML;
        objMsg.to = nome;
        
        colocaFraseInput(nome);
       
    }

    if(classePai == "visibilidade"){
        const visibilidade = elemento.children[0].children[1].innerHTML;
        if(visibilidade == "Público"){
            console.log("publico");
            objMsg.type = "message";
        }else{
            objMsg.type = "private_message";
            console.log("privado");
        }
        
    }


    //3. se selecionada visibilidade mudo a visibilidade da msg

}

function insertVisibilityMenu(){
    const sel_visibilidade = document.querySelector(".visibilidade");
    sel_visibilidade.innerHTML = `
    
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

function select_item_menu_contatos(elemento){

    const selected = document.querySelector(".select");
    

    if(selected != null){
        selected.classList.remove("select");
    }

    //selecionando elemento clicado
    elemento.classList.toggle("select");
}

function insertHTMLMenu(participante){
    const seletor_contato = document.querySelector(".contato");

    seletor_contato.innerHTML +=
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


function insertMenuContatos(participantes){
    //adiciona li com todos
    document.querySelector(".contato").innerHTML=
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




/* colocando lista de contatos no menu lateral*/
function contatos_menu(){
    //reseta contatos anteriores
    const requisicaoParticipantes = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants"); 
    requisicaoParticipantes.then(insertMenuContatos);

}

contatos_menu();

//setInterval(contatos_menu,10000);
