import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import GasStation from "./GasStation";

class PeoplesOil extends Building{
    constructor(){
        super("人民石油",BuildingRarity.Legendary,BuildingType.Industrial,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new GasStation().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,0.1));
    }
}

export default PeoplesOil