import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import ConvenienceStore from "./ConvenienceStore";

class Residential extends Building{
    constructor(){
        super("居民楼",BuildingRarity.Common,BuildingType.Residence,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new ConvenienceStore().BuildingName,1));
    }
}

export default Residential