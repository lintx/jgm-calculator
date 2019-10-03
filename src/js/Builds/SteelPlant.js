import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import SteelStructureHouse from "./SteelStructureHouse";

class SteelPlant extends Building{
    constructor(){
        super("钢铁厂",BuildingRarity.Rare,BuildingType.Industrial,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new SteelStructureHouse().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Industrial,BuffRange.Industrial,0.15));
    }
}

export default SteelPlant