import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import Residential from "./Residential";

class ConvenienceStore extends Building{
    constructor(){
        super("便利店",BuildingRarity.Common,BuildingType.Business,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new Residential().BuildingName,1));
    }
}

export default ConvenienceStore