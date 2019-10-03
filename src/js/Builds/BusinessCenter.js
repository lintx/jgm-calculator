import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import GardenHouse from "./GardenHouse";

class BusinessCenter extends Building{
    constructor(){
        super("商贸中心",BuildingRarity.Rare,BuildingType.Business,1.022);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new GardenHouse().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Supply,BuffRange.Supply,0.1));
    }
}

export default BusinessCenter