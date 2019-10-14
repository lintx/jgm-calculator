import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class GasStation extends Building{
    constructor(){
        super(BuildingNames.GasStation,BuildingRarity.Rare,BuildingType.Business,1.204);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.PeoplesOil,0.5));
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,0.1));
    }
}

export default GasStation