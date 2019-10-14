import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class SteelPlant extends Building{
    constructor(){
        super(BuildingNames.SteelPlant,BuildingRarity.Rare,BuildingType.Industrial,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.SteelStructureHouse,1));
        this.buffs.push(new Buff(BuffRange.Industrial,BuffRange.Industrial,0.15));
    }
}

export default SteelPlant