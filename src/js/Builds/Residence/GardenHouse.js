import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class GardenHouse extends Building{
    constructor(){
        super(BuildingNames.GardenHouse,BuildingRarity.Rare,BuildingType.Residence,1.022);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.BusinessCenter,1));
        this.buffs.push(new Buff(BuffRange.Supply,BuffRange.Supply,0.1));
    }
}

export default GardenHouse