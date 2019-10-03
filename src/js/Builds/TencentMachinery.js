import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import PartsFactory from "./PartsFactory";

class TencentMachinery extends Building{
    constructor(){
        super("企鹅机械",BuildingRarity.Legendary,BuildingType.Industrial,1.33);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new PartsFactory().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Global,BuffRange.Global,0.1));
    }
}

export default TencentMachinery