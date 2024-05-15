export default class Team {

    isCounting = false;
    isOpen = false;
    creditPaid = 3 * 60 * 60 * 1000; //кредитная ставка
    levelUpPrice = 1 * 60 * 60 * 1000; //стоимость повышения уровня
    isLevelCooldown = false;
    timeForLevelCooldown = 1 * 60 * 60 * 1000;

    constructor(teamNumber, teamName, startTime, startLevel, fileLogger) {
        this.number = teamNumber;
        this.name = teamName;
        this.time = startTime;        
        this.level = startLevel;
        this.credit = 0;
        this.timeLevelCooldown = 0;
        this.fl = fileLogger;
    }

    setCredit(value){
        if(this.isOpen){
            this.addCredit(this.creditPaid);
        } else {
            this.openCredit(this.creditPaid);
        }
    }

    startTimer(){
        if(!this.isCounting){
            this.fl.logInFile(`Запуск таймера команды ${this.number} ${this.name}`);
            this.isCounting = true;
            this.timerId = setInterval(() => this.minusTickTime(1000), 1000);
        } else {
            this.fl.logInFile(`Таймер команды ${this.number} ${this.name} уже запущен!`);
        }
    }

    stopTimer(){
        if(this.isCounting){
            this.fl.logInFile(`Остановка таймера команды ${this.number} ${this.name}`);
            this.isCounting = false;
            clearInterval(this.timerId);
        } else {
            this.fl.logInFile(`Таймер команды ${this.number} ${this.name} не запущен!`);
        }
    }

    addTime(value) {
        this.fl.logInFile(`Команде ${this.number} ${this.name} добавлено ${this.formatTime(value)} (${value})`);
        if (!this.isOpen) {
            this.time += value
        } else {
            this.minusCredit(value);
        }
    }

    minusTickTime(value) {
        this.time -= value;
        if (this.time <= 0 && this.isCounting) {
            this.setCredit(this.creditPaid);
        } 
    }

    minusTime(value) {
        this.fl.logInFile(`У команды ${this.number} "${this.name}" вычтено ${this.formatTime(value)}  (${value})`);
        this.time -= value;
        if (this.time <= 0 && this.isCounting) {
            this.setCredit(this.creditPaid);
        } 
    }

    formatTime(time){
        let hours = Math.floor((time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        let minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
        let secodns = Math.floor((time % (60 * 1000)) / 1000);
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        secodns = secodns < 10 ? '0' + secodns : secodns;
        return hours + ':' + minutes + ':' + secodns;
    }

    openCredit(value){
        if (!this.isOpen) {
            this.fl.logInFile(`Открыт кредит на ${this.formatTime(value)} (${value}) для команды ${this.number} ${this.name} `);
            this.addCredit(value);
            this.isOpen = true;
        } else {
            this.fl.logInFile(`Кредит команды ${this.number} ${this.name}  уже открыт`);
        }
    }

    closeCredit(){
        if(this.isOpen) {
            this.fl.logInFile(`Кредит команды ${this.number} "${this.name}" закрыт!`);
            this.isOpen = false;
            if (this.credit < 0) {
                this.addTime(Math.abs(this.credit))
            }
            this.credit = 0;
        } else {
            this.fl.logInFile(`Кредит команды ${this.number} "${this.name}" не открыт!`);
        }
    }

    addCredit(value){
        this.fl.logInFile(`Кредит команды ${this.number} "${this.name}" увеличен на ${this.formatTime(value)} (${value}`);
        this.credit += value;
        this.addCreditTime(value);
    }

    addCreditTime(value) {
        this.fl.logInFile(`Команде ${this.number} "${this.name}" добавдено кредитное время ${this.formatTime(value)} (${value}`);
        this.time += value;

        
    }

    minusCredit(value) {
        this.fl.logInFile(`Кредит команды ${this.number} "${this.name}" уменьшен на ${this.credit < value ? this.formatTime(this.credit) : this.formatTime(value)}`);
        this.credit -= value;
        if (this.credit <= 0) {
            this.closeCredit()
        }
    }

    startLevelCooldown() {
        if(!this.isLevelCooldown) {
            this.fl.logInFile(`Начат таймер зоны команды ${this.number} "${this.name}"!`);
            this.isLevelCooldown = true;
            this.timeLevelCooldown  = this.timeForLevelCooldown;

            this.levelTimer = setInterval(()=>{
                this.minusLevelTime(1000);
            }, 1000);

        } else {
            this.fl.logInFile(`Таймер повышения зоны команды ${this.number} "${this.name}" уже запущен!`);
        }
    }

    minusLevelTime(value){
        this.timeLevelCooldown -= value;
        if (this.timeLevelCooldown <= 0) {
            this.stopLevelCooldown()
        }
    }

    stopLevelCooldown() {
        if(this.isLevelCooldown) {
            this.fl.logInFile(`Закончен таймер повышения зоны команды ${this.number} "${this.name}"!`);
            clearInterval(this.levelTimer);
            this.isLevelCooldown = false;
        } else {
            this.fl.logInFile(`Таймер повышения зоны команды ${this.number} "${this.name}" уже остановлен!`);
        }
    }

    levelUp(){
        if (!this.isLevelCooldown){
            if (!this.isOpen) {
                if (this.level > 1) {
                    if (this.time >= this.levelUpPrice) {
                        this.level --;
                        this.minusTime(this.levelUpPrice);
                        this.fl.logInFile(`Повышение зоны команды ${this.number} "${this.name}" до ${this.level}`);
                        this.startLevelCooldown();
                        return {
                            isLevelUp : true,
                            message : `Вы успешно пересекли временную зону ${this.level}!`
                        };
                    } else {
                        this.fl.logInFile(`Отказ в повышении зоны команде ${this.number} "${this.name}", так как недостаточно времени!`);
                        return {
                            isLevelUp : false,
                            message : `Недостаточно времени для пересечения временной зоны!`
                        };
                    }
                    
                } else {
                    this.fl.logInFile(`Команда ${this.number} "${this.name}" достигла максимальной зоны!`);
                    return {
                        isLevelUp : false,
                        message : `Достигнута максимальная временная зона!`
                    };
                }
            } else {
                this.fl.logInFile(`Отказ в повышении зоны команде ${this.number} "${this.name}", так как открыт кредит!`);
                return {
                    isLevelUp : false,
                    message : `Отказ в повышении зоны из-за открытого кредита!`
                };
            }
        } else {
            this.fl.logInFile(`Отказ в повышении зоны команде ${this.number} "${this.name}", так как идет таймер зоны!`);
            return {
                isLevelUp : false,
                message : `Отказ в повышении зоны, так как идет таймер зоны!`
            };
        }

    }

    doubleLevelUp() {
        if (!this.isLevelCooldown) {
            if (!this.isOpen) {
                if (this.level > 2) {
                    let doubleLevelUpPrice = this.levelUpPrice * 2;
                    if (this.time >= doubleLevelUpPrice) {
                        this.level --;
                        this.level --;
                        this.minusTime(doubleLevelUpPrice);
                        this.startLevelCooldown();
                        this.fl.logInFile(`Двойное повышение зоны команды ${this.number} "${this.name}" до ${this.level}`);
                        return {
                            isLevelUp : true,
                            message : `Вы успешно пересекли временную зону ${this.level}!`
                        };
                    } else {
                        this.fl.logInFile(`Отказ в повышении зоны команде ${this.number} "${this.name}", так как недостаточно времени!`);
                        return {
                            isLevelUp : false,
                            message : `Недостаточно времени для двойного пересечения временной зоны!`
                        };
                    }
                    
                } else {
                    this.fl.logInFile(`Команда ${this.number} "${this.name}" достигла максимальной зоны для двойного перехода!`);
                    return {
                        isLevelUp : false,
                        message : `Достигнута максимальная временная зона для двойного перехода!`
                    };
                }
            } else {
                this.fl.logInFile(`Отказ в двойном повышении зоны команде ${this.number} "${this.name}", так как открыт кредит!`);
                return {
                    isLevelUp : false,
                    message : `Отказ в повышении зоны из-за открытого кредита!`
                };
            }
        } else {
            this.fl.logInFile(`Отказ в двойном повышении зоны команде ${this.number} "${this.name}", так как идет таймер зоны!`);
            return {
                isLevelUp : false,
                message : `Отказ в повышении зоны, так как идет таймер зоны!`
            };
        }

    }

    levelDown(){
        if (this.level < 25) {
            this.level ++;
            this.fl.logInFile(`Зоны команды ${this.number} ${this.name} уменьшена до ${this.level}`);
        } else {
            this.fl.logInFile(`Команда ${this.number} ${this.name} достигла минимальной зоны!`);
        }
    }
}