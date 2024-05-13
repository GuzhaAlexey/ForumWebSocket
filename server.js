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

console.log('ФОРМИРОВАНИЕ КОМАНД');
fl.logInFile('ФОРМИРОВАНИЕ КОМАНД');
for(let i=0; i<=10;i++){    
    teams[i] = new Team(i,`Команда ${i}`, startTime, startLevel, fl)
}

teams.forEach(function(team){
    fl.logInFile(`${team.number} "${team.name}" ${team.time} ${team.formatTime(team.time)} ${team.level}`);
    console.log(`${team.number} "${team.name}" ${team.time} ${team.formatTime(team.time)} ${team.level}`);
} )
 
const wsServer = new WebSocketServer({port: 9000});
 
let clients = {
    "admins" : {},
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
    var arrIndx;
    var typeClient;

    console.log(`Новый пользователь`);
    fl.logInFile(`Новый пользователь`);
    // отправка привественного сообщения клиенту
    wsClient.send(JSON.stringify({
        action: "CONNECTED",
        data: {
            message: "Соединение установлено'"
        }
    }));

    wsClient.on('message', function(message){
        try {
            // сообщение пришло текстом, нужно конвертировать в JSON-формат
            const jsonMessage = JSON.parse(message);
            console.log(`ЗАПРОС К СЕРВЕРУ  ${JSON.stringify(jsonMessage)}`);
            fl.logInFile(`ЗАПРОС К СЕРВЕРУ ${JSON.stringify(jsonMessage)}`);
            switch (jsonMessage.action){
                case 'I_AM':
                        switch(jsonMessage.data.type){
                            case 'ADMIN':
                                console.log(`ПОДКЛЮЧИЛСЯ админ ${jsonMessage.data.name}`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ админ ${jsonMessage.data.name}`);
                                typeClient = "admins";
                                clients.admins[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                
                                break;
                            case 'TEAM_0':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 0`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 0`);
                                typeClient = "team_0";
                                clients.team_0[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_1':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 1`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 1`);
                                typeClient = "team_1";
                                clients.team_1[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_2':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 2`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 2`);
                                typeClient = "team_2";
                                clients.team_2[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_3':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 3`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 3`);
                                typeClient = "team_3";
                                clients.team_3[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_4':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 4`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 4`);
                                typeClient = "team_4";
                                clients.team_4[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;        
                            case 'TEAM_5':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 5`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 5`);
                                typeClient = "team_5";
                                clients.team_5[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_6':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 6`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 6`);
                                typeClient = "team_6";
                                clients.team_6[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_7':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 7`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 7`);
                                typeClient = "team_7";
                                clients.team_7[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_8':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 8`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 8`);
                                typeClient = "team_8";
                                clients.team_8[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_9':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 9`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 9`);
                                typeClient = "team_9";
                                clients.team_9[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;
                            case 'TEAM_10':
                                console.log(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 10`);
                                fl.logInFile(`ПОДКЛЮЧИЛСЯ игрок ${jsonMessage.data.name} команды 10`);
                                typeClient = "team_10";
                                clients.team_10[`${uniqueId}`] = {ws: wsClient, name: jsonMessage.data.name};
                                break;                        
                        }
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
                        console.log(logText);
                        fl.logInFile(logText);
                        wsClient.send(logText);
                    break;
                case 'ECHO':
                    for (var key in clients) {
                        let group = clients[key];
                        for(key in group){
                            group[key].ws.send(jsonMessage.data);
                        }
                    }
                    break;
                case 'SET_NAME':
                    teams[jsonMessage.data.teamNumber].name = jsonMessage.data.newName;
                    let group = clients[jsonMessage.data.type];
                    for(key in group){
                        group[key].ws.send(`Новое имя команды "${teams[jsonMessage.data.teamNumber].name}"`);
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
                                levelTimer:teams[teamNumber].timeLevelCooldown
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
                        wsClient.send(teams[jsonMessage.teamNumber].time)
                    break;
                case 'MINUS_TIME':
                        teams[jsonMessage.teamNumber].minusTime(jsonMessage.value);
                        wsClient.send(teams[jsonMessage.teamNumber].time)
                    break;
                case 'LEVEL_UP':
                        var result = teams[jsonMessage.teamNumber].levelUp();
                        
                        if(result.isLevelUp){
                            for(key in clients[`${typeClient}`]){
                                clients[`${typeClient}`][key].ws.send(result.message)
                            }
                            
                            //отправка все сообщения о повышении уровня
                            for (var key in clients) {
                                if (key != typeClient) {
                                    let group = clients[key];
                                    for(key in group){
                                        group[key].ws.send('Одна из команд пересекла временную зону!');
                                    }
                                }
                            }
                        } else {
                            for(key in clients[`${typeClient}`]){
                                clients[`${typeClient}`][key].ws.send(result.message)
                            }
                        }
                        
                        //wsClient.send(teams[jsonMessage.teamNumber].level)
                    break;
                case 'DOUBLE_LEVEL_UP':
                        var result = teams[jsonMessage.teamNumber].doubleLevelUp();
                        
                        if(result.isLevelUp){
                            for(key in clients[`${typeClient}`]){
                                clients[`${typeClient}`][key].ws.send(result.message)
                            }
                            
                            //отправка все сообщения о повышении уровня
                            for (var key in clients) {
                                if (key != typeClient) {
                                    let group = clients[key];
                                    for(key in group){
                                        group[key].ws.send('Одна из команд пересекла временную зону!');
                                    }
                                }
                            }
                        } else {
                            for(key in clients[`${typeClient}`]){
                                clients[`${typeClient}`][key].ws.send(result.message)
                            }
                        }
                        
                        //wsClient.send(teams[jsonMessage.teamNumber].level)
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
                                    group[key].ws.send('Ваше время пошло!');
                                }
                            }
                            //wsClient.send('Время стартануло!');
                        } else {
                            wsClient.send('Время уже запущено!');
                        }
                    break;
                case 'STOP':
                        if(gloabalTimerCounting) {
                            stop();
                            for (var key in clients) {
                                let group = clients[key];
                                for(key in group){
                                    group[key].ws.send('Ваше остановлено!');
                                }
                            }
                            //wsClient.send('Время остановлено!');
                        } else {
                            wsClient.send('Время уже остановлено!')
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
            console.log(`ОТКЛЮЧИЛСЯ пользователь ${typeClient} [${clients[`${typeClient}`][`${uniqueId}`].name}]`);
            fl.logInFile(`ОТКЛЮЧИЛСЯ полльзователь ${typeClient} [${clients[`${typeClient}`][`${uniqueId}`].name}]`);
            delete clients[`${typeClient}`][`${uniqueId}`];
        } catch(error) {
            console.log(`ОШИБКА отключения пользователя ${typeClient} [${clients[`${typeClient}`][`${uniqueId}`].name}]`, error);
            fl.logInFile(`ОШИБКА отключения пользователя ${typeClient} [${clients[`${typeClient}`][`${uniqueId}`].name}]`, error);
        }

        
    })
}

console.log('Сервер запущен на 9000 порту');
fl.logInFile('Сервер запущен на 9000 порту');

function startAll(teams) {
    console.log('Все таймеры запущены!');
    fl.logInFile('Все таймеры запущены!');
    teams.forEach(function (team){
        team.startTimer();
    })
}

function stopAll(teams) {
    console.log('Все таймеры остановлены!');
    fl.logInFile('Все таймеры остановлены!');
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
    console.log(logText);
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
    console.log('ГЛОБАЛЬНЫЙ СТАРТ!')
    fl.logInFile('ГЛОБАЛЬНЫЙ СТАРТ!');
    gloabalTimerCounting = true;
    startAll(teams);
    logAll(teams);
    globalTimerId = setInterval(() => play(), logTime);
}

function stop() {
    console.log('ГЛОБАЛЬНЫЙ СТОП!')
    fl.logInFile('ГЛОБАЛЬНЫЙ СТОП!');
    gloabalTimerCounting = false;
    stopAll(teams);
    logAll(teams);
    clearInterval(globalTimerId);
}




