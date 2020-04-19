//-------------------- Mney --------------------

export class Money {
    constructor(amount, tempMoney){
        this.amount = amount;
        this.tempMoney = tempMoney;
        this.update();
    }
    sub(amount){
        this.amount -= amount;
        this.update();
    }
    add(amount){
        this.amount += amount;
        this.update();
    }
    update(){
        document.querySelector('.overall_money').innerHTML = "<span>$</span>"+this.amount;
    }
}