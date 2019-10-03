import {Building, BuildingType, BuildingRarity} from "../Building";
import {Buff, BuffRange} from "../Buff";

class Bungalow extends Building{
    constructor(){
        super("平房",BuildingRarity.Common,BuildingType.Residence,1.1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Residence,BuffRange.Residence,0.2));
    }
}

export default Bungalow