import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class PeoplesOil extends Building{
    constructor(){
        super(BuildingNames.PeoplesOil,BuildingRarity.Legendary,BuildingType.Industrial,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.GasStation,1));
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,0.1));
    }
}

export default PeoplesOil