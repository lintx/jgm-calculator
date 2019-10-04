import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import Chalet from "./Chalet";

class WoodFactory extends Building{
    constructor(){
        super("木材厂",BuildingRarity.Common,BuildingType.Industrial,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new Chalet().BuildingName,1));
    }
}

export default WoodFactory