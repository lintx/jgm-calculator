import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class BusinessCenter extends Building{
    constructor(){
        super(BuildingNames.BusinessCenter,BuildingRarity.Rare,BuildingType.Business,1.022);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.GardenHouse,1));
        this.buffs.push(new Buff(BuffRange.Supply,BuffRange.Supply,0.1));
    }
}

export default BusinessCenter