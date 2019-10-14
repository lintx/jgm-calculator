import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class PartsFactory extends Building{
    constructor(){
        super(BuildingNames.PartsFactory,BuildingRarity.Rare,BuildingType.Industrial,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.HardwareStore,1));
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.TencentMachinery,0.5));
    }
}

export default PartsFactory