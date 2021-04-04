const deputiesApi = {
    method: 'GET',
    url: 'https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome',
};

const politicalPartiesApi = {
    method: 'GET',
    url: 'https://dadosabertos.camara.leg.br/api/v2/partidos?ordem=ASC&ordenarPor=sigla',
};

const eventsApi = {
    method: 'GET',
    url: 'https://dadosabertos.camara.leg.br/api/v2/eventos?ordem=ASC&ordenarPor=dataHoraInicio',
};

class Deputie{
    constructor(name,image,politicalParties,state,legislature){
        this.name = name;
        this.image = image;
        this.politicalParties = politicalParties;
        this.state = state;
        this.legislature = legislature;
    }
}

class PoliticalParties{
    constructor(name, image){
        this.name = name;
        this.image = image;
    }
}

class Events{
    constructor(date, hour, descriptionType, local){
        this.date = date;
        this.hour = hour;
        this.descriptionType = descriptionType;
        this.local = local;
        this.building = "CÂMARA DOS DEPUTADOS";
    }
}

var deputie = new Deputie();

var events = new Events();

var politicalParties = new PoliticalParties();


var apiDeputiesData = [];

var apiPoliticalPartiesData = [];

var apiEventsData = [];

var eventsMap = new Map();
var deputiesMap = new Map();
var politicalPartiesMap = new Map();

eventsMap.set("searchStatus", false);
deputiesMap.set("searchStatus", false);
politicalPartiesMap.set("searchStatus", false);

eventsMap.set("quantityToDisplay", 2);
deputiesMap.set("quantityToDisplay", 8);
politicalPartiesMap.set("quantityToDisplay", 8);

callDeputiesApi();
callPartiesApi();
callEventsApi()

function callDeputiesApi(){

    axios.request(deputiesApi).then(function (response) {

        for(const [keyDeputiesApi, valueDeputiesApi]  of Object.entries(response["data"]["dados"])){

            deputie = new Deputie(valueDeputiesApi["nome"],valueDeputiesApi["urlFoto"], valueDeputiesApi["siglaPartido"],
            valueDeputiesApi["siglaUf"], valueDeputiesApi["idLegislatura"]);
                    
            apiDeputiesData.push(deputie);
            
        }  
        
        assembleInformations(false, deputiesMap, apiDeputiesData, "dadosDeputies");

    }).catch(function (error) {
      console.error(error);
    });
    
    
}

function callPartiesApi(){

    axios.request(politicalPartiesApi).then(function (response) {

        for(const [keyPoliticalPartiesApi, valuePoliticalPartiesApi]  of Object.entries(response["data"]["dados"])){
            
            var sigla = valuePoliticalPartiesApi["sigla"];

            politicalParties = new PoliticalParties(valuePoliticalPartiesApi["sigla"],`./image/partidos/${sigla}.png`)
                    
            apiPoliticalPartiesData.push(politicalParties);
        }  
        
        assembleInformations(false, politicalPartiesMap, apiPoliticalPartiesData, "dadosParties");

    }).catch(function (error) {
      console.error(error);
    });  
    
    
}

function callEventsApi(){

    axios.request(eventsApi).then(function (response) {
        for(const [keyEventsApi, valueEventsApi]  of Object.entries(response["data"]["dados"])){

            var date = new Date(valueEventsApi["dataHoraInicio"]);

            var eventDateHour = date.toLocaleString("br").split(" ");

            events = new Events(eventDateHour[0],eventDateHour[1], valueEventsApi["descricaoTipo"], 
            valueEventsApi["localCamara"]["nome"])

            apiEventsData.push(events);
        }  
        
        assembleInformations(false, eventsMap, apiEventsData, "todosDadosEvents");

    }).catch(function (error) {
      console.error(error);
    });  
}

function assembleInformations(reset, dataMap, apiData, htmlId){
    clear(htmlId);

    if(!dataMap.get("searchStatus")){

        dataMap.set("dataLength", apiData.length);
        dataMap.set("list", apiData);
    }

    var dataLength = dataMap.get("dataLength");

    var list = dataMap.get("list");

    var quantidadeItensExibidos = dataMap.get("quantityDisplayed");

    if(isNaN(quantidadeItensExibidos)){
        quantidadeItensExibidos = 0;
    }

    console.log(quantidadeItensExibidos);

    if(reset){
        quantidadeItensExibidos = 0;
    }

    var quantidadeDeItensParaSeremExibidos = dataMap.get("quantityToDisplay");

    if(dataLength == quantidadeItensExibidos){
        quantidadeItensExibidos = 0;
    }

    if(dataLength - quantidadeItensExibidos < quantidadeDeItensParaSeremExibidos){
        quantidadeDeItensParaSeremExibidos = dataLength - quantidadeItensExibidos;
    }

    var limiteDeItens = quantidadeItensExibidos + quantidadeDeItensParaSeremExibidos;

    for(var index = quantidadeItensExibidos; index < limiteDeItens; index++){
        showInformations(list[index],htmlId)
    }

    quantidadeItensExibidos += quantidadeDeItensParaSeremExibidos;

    dataMap.set("quantityDisplayed", quantidadeItensExibidos);

    return false;
}

function showInformations(data, htmlId){

    if(htmlId == "dadosDeputies"){

        document.getElementById("dadosDeputies").innerHTML += 
        '<div class="data"> ' +
        '<div class="deputie-img"> ' +
        `<img src='${data.image}' alt='Foto do deputado(a) ${data.name}'>` +
        '</div>' +
        '<div class="deputie-info"> ' +
        `<h2>${data.name}</h2>` +
        `<h3>(${data.politicalParties}-${data.state})</h3>` +
        `<ul>` +
        `<li><p>Legislatura em que exerceu mandato: <b>${data.legislature}°<b></p></li>` +
        `</ul>` +
        '</div>' +
        '</div>'

    }else if(htmlId == "dadosParties"){

        document.getElementById("dadosParties").innerHTML += 
        '<div class="data"> ' +
        '<div class="partie-img"> ' +
        `<img src='${data.image}' alt='Foto do partido ${data.name}'>` +
        '</div>' +
        '<div class="partie-info"> ' +
        `<h2>${data.name}</h2>` +
        '</div>' +
        '</div>'
    }
    else
    {
        document.getElementById("todosDadosEvents").innerHTML +=
        "<div class='dadosEvents'>" +
        "<div class='firstInformation'>" +
        `<p><i class="fas fa-calendar-alt"></i> ${data.date}</p>` +
        `<p><i class="far fa-clock"></i> ${data.hour}</p>` +
        "</div>" +
        "<div class='linha-vertical'></div>" +
        "<div class='secoundInformation'>" +
        `<p>${data.building}</p>` +
        `<p>${data.descriptionType}</p>` +
        `<p>${data.local}</p>` +
        "</div>" +
        "</div>"
    }
}

function clear(htmlId){
    document.getElementById(htmlId).innerHTML = "";
}

function search(dataMap, apiData, inputId, htmlId){

    var name = document.getElementById(inputId).value;

    if(deputieName != ''){
        dataMap.set("searchStatus", true);

        var searchData = apiData.filter(x => x.name.toLowerCase()
        .replace(new RegExp('[aáàãäâ]'),'a')
        .replace(new RegExp('[eéèëê]'),'e')
        .replace(new RegExp('[iíìïî]'),'i')
        .replace(new RegExp('[oóòõöô]'),'o')
        .replace(new RegExp('[uúùüû]'),'u')
        .includes(name.toLowerCase()));
    
        dataMap.set("dataLength", searchData.length);
        dataMap.set("list", searchData);
         
    }else{
        dataMap.set("searchStatus", false);
    }

    assembleInformations(true, dataMap, apiData, htmlId);

    return false;
}

function searchEvents(){

    var eventsName = document.getElementById("eventsInput").value;
    var eventsDate = document.getElementById("eventsData").value;
    
    var dataFormatada = new Date(eventsDate+"T10:30:00-03:00").toLocaleString("br").split(" ");

    if(eventsName != '' ||  eventsDate != ''){
        eventsMap.set("searchStatus", true);

        var searchData = apiEventsData.filter(x=> 
            (eventsDate == '' || x.date == dataFormatada[0]) && 
            (eventsName == '' || x.descriptionType.toLowerCase()
        .replace(new RegExp('[aáàãäâ]'),'a')
        .replace(new RegExp('[eéèëê]'),'e')
        .replace(new RegExp('[iíìïî]'),'i')
        .replace(new RegExp('[oóòõöô]'),'o')
        .replace(new RegExp('[uúùüû]'),'u')
        .includes(eventsName.toLowerCase())));
    
        eventsMap.set("dataLength", searchData.length);
        eventsMap.set("list", searchData);

    }else{
        eventsMap.set("searchStatus", false);
    }

    assembleInformations(true, eventsMap,apiEventsData,"todosDadosEvents");

    return false;
}
