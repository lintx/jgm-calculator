import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import BusinessCenter from "./BusinessCenter";

class GardenHouse extends Building{
    constructor(){
        super("花园洋房",BuildingRarity.Rare,BuildingType.Residence,1.022);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new BusinessCenter().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Supply,BuffRange.Supply,0.1));
    }
}

export default GardenHouse