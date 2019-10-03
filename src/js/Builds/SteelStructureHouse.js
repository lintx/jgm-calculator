import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import SteelPlant from "./SteelPlant";

class SteelStructureHouse extends Building{
    constructor(){
        super("钢结构房",BuildingRarity.Common,BuildingType.Residence,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new SteelPlant().BuildingName,1));
    }
}

export default SteelStructureHouse