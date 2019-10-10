import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class SteelStructureHouse extends Building{
    constructor(){
        super(BuildingNames.SteelStructureHouse,BuildingRarity.Common,BuildingType.Residence,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.SteelPlant,1));
    }
}

export default SteelStructureHouse