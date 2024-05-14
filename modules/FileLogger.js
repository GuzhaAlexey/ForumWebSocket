import fs from 'fs';

export default class FileLogger {

    constructor(path) {
        this.path = path;
    }

    formatDateTime(date) {

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
      
        return dd + '.' + mm + '.' + yy + ' ' + HH + ':' + MM + ':' + SS + '.' + MI;
      }

    logInFile(text){

        let sysDate = new Date();
        var currentTime = (600 + sysDate.getTimezoneOffset())*60*1000; //перевод на время UTC +10
        let localDate = new Date(sysDate.getTime()+currentTime);

        let logText = 
                    'LocalTime[' + this.formatDateTime(localDate) + ']' + ' SystemTime['+ this.formatDateTime(sysDate) +']\n' 
                    + text + '\n\n';
        console.log(logText);
        fs.appendFileSync(this.path, logText);
    }
}