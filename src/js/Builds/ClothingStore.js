import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import TextileMill from "./TextileMill";

class ClothingStore extends Building{
    constructor(){
        super("服装店",BuildingRarity.Common,BuildingType.Business,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new TextileMill().BuildingName,1));
    }
}

export default ClothingStore