import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";

class WaterPlant extends Building{
    constructor(){
        super("水厂",BuildingRarity.Common,BuildingType.Industrial,1.26);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,1));
    }
}

export default WaterPlant