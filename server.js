import Team from './modules/Team.js'
import FileLogger from './modules/FileLogger.js';
import {WebSocketServer} from 'ws';
import fs from 'fs'
//import https from 'https'

const startTime = 10 * 60 * 60 * 1000; //стартовое время 10 часов
//const startTime = 10 * 1000;
const startLevel = 25;

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();

    var HH = date.getHours();
    if (HH < 10) HH = '0' + HH;

    var MM = date.getMinutes();
    if (MM < 10) MM = '0' + MM;

    var SS = date.getSeconds();
    if (SS < 10) SS = '0' + SS;

    var MI = date.getMilliseconds();
  
    return dd + '_' + mm + '_' + yy + '_' + HH + '_' + MM + '_' + SS + '_' + MI;
  }

const teams = []
const log_file_path = `./logs/log_${formatDate(new Date())}.txt`;
const fl = new FileLogger(log_file_path);
const logTime = 1 * 60 * 1000; //время глоабльного логирования

fl.logInFile('ФОРМИРОВАНИЕ КОМАНД');
for(let i=0; i<=10;i++){    
    teams[i] = new Team(i,`Команда ${i}`, startTime, startLevel, fl)
}
let logText = ""
teams.forEach(function(team){
    logText += `${team.number} "${team.name}" ${team.time} ${team.formatTime(team.time)} ${team.level}\n`;
})
 fl.logInFile(logText)
 
const wsServer = new WebSocketServer({port: 9000});
 
let clients = {
    "lobby"  : {},
    "admin" : {},
    "team_0" : {},
    "team_1" : {},
    "team_2" : {},
    "team_3" : {},
    "team_4" : {},
    "team_5" : {},
    "team_6" : {},
    "team_7" : {},
    "team_8" : {},
    "team_9" : {},
    "team_10" : {}
};

wsServer.on('connection', onConnect);

function onConnect(wsClient) {

    var uniqueId = Date.now();
    var typeClient = "lobby";

    fl.logInFile(`Новый пользователь UID[${uniqueId}]`);
    // отправка привественного сообщения клиенту
    wsClient.send(JSON.stringify({
        action: "CONNECTED",
        data: {
            message: "Соединение установлено"
        }
    }));

    clients.lobby[`${uniqueId}`] = {ws: wsClient, name: "Неизвестный"}

    wsClient.on('message', function(message){
        try {
            // сообщение пришло текстом, нужно конвертировать в JSON-формат
            const jsonMessage = JSON.parse(message);
            fl.logInFile(`ЗАПРОС К СЕРВЕРУ ${JSON.stringify(jsonMessage)}`);
            switch (jsonMessage.action){
                case 'I_AM':
                        function setInClinets(type, UID, wsClient, name) {
                            delete clients["lobby"][UID]
                            fl.logInFile(`ПОДКЛЮЧИЛСЯ ${type == "ADMIN" ? "админ" : "игрок"} ${typeClient} ${jsonMessage.data.name}`);
                            typeClient = type;
                            for(key in clients[type]){
                                console.log(key)
                                console.log(clients[type][key])
                            }
                            clients[type][UID] = {ws: wsClient, name: name};
                        }
                        setInClinets(jsonMessage.data.type.toLowerCase(), uniqueId, wsClient, jsonMessage.data.name)
                    break;
                case 'SHOW_ALL_CLIENTS':
                        let logText = '\n ВСЕ ПОДКЛЮЧЕНИЯ \n';
                        for (key in clients) {
                            let group = clients[key];
                            logText += `-Группа ${key}\n`;
                            for(key in group) {
                                logText += `|---[${key}] ${group[key].name}\n`
                            };
                        }
                        fl.logInFile(logText);
                        let showJson = {
                            action: "SHOW_ALL_CLIENTS",
                            data: {
                                logText: logText
                            }
                        }
                        wsClient.send(JSON.stringify(showJson));
                    break;
                case 'ECHO':
                    let echoJson = {
                        action: "ECHO",
                        data: {
                            message: jsonMessage.data,
                        }
                    }
                    let message = JSON.stringify(echoJson)
                    for (var key in clients) {
                        let group = clients[key];
                        for(key in group){
                            group[key].ws.send(message);
                        }
                    }
                    break;
                case 'SET_NAME':                   
                    teams[jsonMessage.teamNumber].name = jsonMessage.newName;
                    for(key in clients[`team_${jsonMessage.teamNumber}`]){
                        clients[`team_${jsonMessage.teamNumber}`][key].ws.send(JSON.stringify({
                            action: "SET_NAME",
                            data: {
                                name: jsonMessage.newName,
                                message: `Новое имя команды "${teams[jsonMessage.teamNumber].name}"`
                            }
                        }))
                    }
                    break;
                case 'GET_INFO':
                    function teamData(teamNumber) {

                        let json = {
                            action : "GET_INFO",
                            data: {
                                number:teamNumber,
                                name:teams[teamNumber].name,
                                time:teams[teamNumber].time,
                                credit:teams[teamNumber].credit,
                                level:teams[teamNumber].level,
                                levelTimer:teams[teamNumber].timeLevelCooldown,
                                isCounting:teams[teamNumber].isCounting
                            }
                        }
                        return JSON.stringify(json);
                    }
                    
                    switch(jsonMessage.data.type){
                        case 'ADMIN':
                            wsClient.send(0);
                            break;
                        case 'TEAM_0':
                            wsClient.send(teamData(0));
                            break;
                        case 'TEAM_1':
                            wsClient.send(teamData(1));
                            break;
                        case 'TEAM_2':
                            wsClient.send(teamData(2));
                            break;
                        case 'TEAM_3':
                            wsClient.send(teamData(3));
                            break;
                        case 'TEAM_4':
                            wsClient.send(teamData(4));
                            break;        
                        case 'TEAM_5':
                            wsClient.send(teamData(5));
                            break;
                        case 'TEAM_6':
                            wsClient.send(teamData(6));
                            break;
                        case 'TEAM_7':
                            wsClient.send(teamData(7));
                            break;
                        case 'TEAM_8':
                            wsClient.send(teamData(8));
                            break;
                        case 'TEAM_9':
                            wsClient.send(teamData(9));
                            break;
                        case 'TEAM_10':
                            wsClient.send(teamData(10));
                            break;  
                        default:
                            wsClient.send(`Неверный параметр "${jsonMessage.data.type}"`);
                            break;                         
                    }
                    break;
                case 'PING':
                    setTimeout(function(){
                        wsClient.send('PONG');
                    },2000);
                    break;
                case 'ADD_TIME':
                        teams[jsonMessage.teamNumber].addTime(jsonMessage.value);

                        for(key in clients[`team_${jsonMessage.teamNumber}`]){
                            clients[`team_${jsonMessage.teamNumber}`][key].ws.send(JSON.stringify({
                                action: "ADD_TIME",
                                data: {
                                    value: jsonMessage.value,
                                    time: teams[jsonMessage.teamNumber].time,
                                    credit: teams[jsonMessage.teamNumber].credit,
                                    message: `Вам начислено время ${teams[jsonMessage.teamNumber].formatTime(jsonMessage.value)}`,
                                }
                            }))
                        }
                    break;
                case 'MINUS_TIME':
                        teams[jsonMessage.teamNumber].minusTime(jsonMessage.value);

                        for(key in clients[`team_${jsonMessage.teamNumber}`]){
                            clients[`team_${jsonMessage.teamNumber}`][key].ws.send(JSON.stringify({
                                action: "MINUS_TIME",
                                data: {
                                    value: jsonMessage.value,
                                    time: teams[jsonMessage.teamNumber].time,
                                    credit: teams[jsonMessage.teamNumber].credit,
                                    message: `У вас вычтено время ${teams[jsonMessage.teamNumber].formatTime(jsonMessage.value)}`,
                                }
                            }))
                        }
                    break;
                case 'LEVEL_UP':
                        var result = teams[jsonMessage.teamNumber].levelUp();
                        
                        if(result.isLevelUp){
                            for(key in clients[`team_${jsonMessage.teamNumber}`]){
                                clients[`team_${jsonMessage.teamNumber}`][key].ws.send(JSON.stringify({
                                    action: "TRUE_LEVEL_UP",
                                    data: {
                                        message: result.message,
                                        level: teams[jsonMessage.teamNumber].level,
                                        levelTimer: teams[jsonMessage.teamNumber].timeLevelCooldown,
                                    }
                                }))
                            }
                            
                            //отправка все сообщения о повышении уровня
                            for (var key in clients) {
                                if (key != `team_${jsonMessage.teamNumber}`) {
                                    let group = clients[key];
                                    for(key in group){
                                        group[key].ws.send(JSON.stringify({
                                            action: "OTHER_LEVEL_UP",
                                            data:{
                                                message: "Одна из команд пересекла временную зону!"
                                            }
                                        }));
                                    }
                                }
                            }
                        } else {
                            for(key in clients[`team_${jsonMessage.teamNumber}`]){
                                clients[`${typeClient}`][key].ws.send(JSON.stringify({
                                    action: "FALSE_LEVEL_UP",
                                    data: {
                                        message: result.message
                                    }
                                }));
                            }
                        }
                        
                        //wsClient.send(teams[jsonMessage.teamNumber].level)
                    break;
                case 'DOUBLE_LEVEL_UP':
                        var result = teams[jsonMessage.teamNumber].doubleLevelUp();
                        
                        if(result.isLevelUp){
                            for(key in clients[`team_${jsonMessage.teamNumber}`]){
                                clients[`team_${jsonMessage.teamNumber}`][key].ws.send(JSON.stringify({
                                    action: "TRUE_DOUBLE_LEVEL_UP",
                                    data: {
                                        message: result.message,
                                        level: teams[jsonMessage.teamNumber].level,
                                        levelTimer: teams[jsonMessage.teamNumber].timeLevelCooldown,
                                    }
                                }))
                            }
                            
                            //отправка все сообщения о повышении уровня
                            for (var key in clients) {
                                if (key != `team_${jsonMessage.teamNumber}`) {
                                    let group = clients[key];
                                    for(key in group){
                                        group[key].ws.send(JSON.stringify({
                                            action: "OTHER_DOUBLE_LEVEL_UP",
                                            data:{
                                                message: "Одна из команд пересекла временную зону!"
                                            }
                                        }));
                                    }
                                }
                            }
                        } else {
                            for(key in clients[`team_${jsonMessage.teamNumber}`]){
                                clients[`team_${jsonMessage.teamNumber}`][key].ws.send(JSON.stringify({
                                    action: "FALSE_DOUBLE_LEVEL_UP",
                                    data: {
                                        message: result.message
                                    }
                                }))
                            }
                        }                        
                    break;    
                case 'LEVEL_DOWN':
                        teams[jsonMessage.teamNumber].levelDown();
                        wsClient.send(teams[jsonMessage.teamNumber].level)
                    break;   
                case 'START':
                        if(!gloabalTimerCounting) {
                            start();
                            for (var key in clients) {
                                let group = clients[key];
                                for(key in group){
                                    group[key].ws.send(JSON.stringify({
                                        action: "START",
                                        data: {
                                            message: "Ваше время пошло!"
                                        }
                                    }));
                                }
                            }
                            //wsClient.send('Время стартануло!');
                        } else {
                            wsClient.send(JSON.stringify({
                                action: "FALSE_START",
                                data: {
                                    message: "Время уже запущено!"
                                }
                            }));
                        }
                    break;
                case 'STOP':
                        if(gloabalTimerCounting) {
                            stop();
                            for (var key in clients) {
                                let group = clients[key];
                                for(key in group){
                                    group[key].ws.send(JSON.stringify({
                                        action: "STOP",
                                        data: {
                                            message: "Время остановлено!"
                                        }
                                    }));
                                }
                            }
                            //wsClient.send('Время остановлено!');
                        } else {
                            wsClient.send(JSON.stringify({
                                action: "FALSE_STOP",
                                data: {
                                    message: "Время уже остановлено!"
                                }
                            }))
                        }
                    break;

                default:
                    console.log('Неизвестная команда');
                    break;
            }
        } catch (error) {
            console.log('Ошибка', error);
        }
    });
    wsClient.on('close', function(){
        try{
            fl.logInFile(`ОТКЛЮЧИЛСЯ полльзователь ${typeClient} UID[${uniqueId}] ${clients[typeClient][uniqueId].name}`);
            delete clients[typeClient][uniqueId];
        } catch(error) {
            fl.logInFile(`ОШИБКА отключения пользователя ${typeClient} UID[${uniqueId}] ${clients[typeClient][uniqueId].name}`, error);
        }
    })
}

fl.logInFile('Сервер запущен на 9000 порту');

function startAll(teams) {
    fl.logInFile('Запуск всех таймеров!');
    teams.forEach(function (team){
        team.startTimer();
    })
}

function stopAll(teams) {
    fl.logInFile('Остановка всех таймеров!');
    teams.forEach(function(team){
        team.stopTimer()
    })
}

function logAll(teams){
    var logText = `\n|Номер|Название  |Время          |Время(формат)  |Зона|Таймер зоны|Кредит    |Кредит(формат) |\n`;
    teams.forEach(function(team){
        logText += `|${team.number.toString().padEnd(5)}|`+
                      `${team.name.padEnd(10)}|`+
                      `${team.time.toString().padEnd(15)}|`+
                      `${team.formatTime(team.time).padEnd(15)}|`+
                      `${team.level.toString().padEnd(4)}|`+
                      `${team.formatTime(team.timeLevelCooldown).toString().padEnd(11)}|`+
                      `${team.credit.toString().padEnd(10)}|`+
                      `${team.formatTime(team.credit).toString().padEnd(15)}|\n`;
    });
    fl.logInFile(logText);
}

function addAll(teams, value) {
    console.log(`Добавление времени ${value} всем командам!`);
    fl.logInFile(`Добавление времени ${value} всем командам!`);
    teams.forEach(function(team){
        team.addTime(value);
    })
}

function minusAll(teams, value) {
    console.log(`Вычитание времени ${value} всем командам!`);
    fl.logInFile(`Вычитание времени ${value} всем командам!`);
    teams.forEach(function(team){
        team.minusTime(value);
    })
}

let gloabalTimerCounting = false;
let globalTimerId;

function play() {
    logAll(teams);
}

function start() {
    fl.logInFile('ГЛОБАЛЬНЫЙ СТАРТ!');
    gloabalTimerCounting = true;
    startAll(teams);
    logAll(teams);
    globalTimerId = setInterval(() => play(), logTime);
}

function stop() {
    fl.logInFile('ГЛОБАЛЬНЫЙ СТОП!');
    gloabalTimerCounting = false;
    stopAll(teams);
    logAll(teams);
    clearInterval(globalTimerId);
}




