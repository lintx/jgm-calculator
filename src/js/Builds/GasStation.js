import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import PeoplesOil from "./PeoplesOil";

class GasStation extends Building{
    constructor(){
        super("加油站",BuildingRarity.Rare,BuildingType.Business,1.204);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new PeoplesOil().BuildingName,0.5));
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,0.1));
    }
}

export default GasStation