import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";

class RevivalMansion extends Building{
    constructor(){
        super("复兴公馆",BuildingRarity.Legendary,BuildingType.Residence,1.672);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,0.1));
        this.buffs.push(new Buff(BuffRange.Supply,BuffRange.Supply,0.1));
    }
}

export default RevivalMansion