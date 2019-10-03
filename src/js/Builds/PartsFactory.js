import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import HardwareStore from "./HardwareStore";
import TencentMachinery from "./TencentMachinery";

class PartsFactory extends Building{
    constructor(){
        super("零件厂",BuildingRarity.Rare,BuildingType.Industrial,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new HardwareStore().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Targets,new TencentMachinery().BuildingName,0.5));
    }
}

export default PartsFactory