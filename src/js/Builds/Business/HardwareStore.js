import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class HardwareStore extends Building{
    constructor(){
        super(BuildingNames.HardwareStore,BuildingRarity.Common,BuildingType.Business,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.PartsFactory,1));
    }
}

export default HardwareStore