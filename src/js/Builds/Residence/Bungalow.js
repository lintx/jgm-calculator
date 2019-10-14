import {Building, BuildingType, BuildingRarity, BuildingNames} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class Bungalow extends Building{
    constructor(){
        super(BuildingNames.Bungalow,BuildingRarity.Common,BuildingType.Residence,1.1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Residence,BuffRange.Residence,0.2));
    }
}

export default Bungalow