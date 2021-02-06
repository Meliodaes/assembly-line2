export default class GameRsrc {
    constructor(money, elec){
        this.money = money;
        this.electricity = elec;
    }

    updateDashboard() {
        document.querySelector('.overlay-dashboard').innerHTML = `<p>Money: ${this.money}$</p><p>Electricity: ${this.electricity}</p>`
    }
}