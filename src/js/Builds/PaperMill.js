import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import BookCity from "./BookCity";

class PaperMill extends Building{
    constructor(){
        super("造纸厂",BuildingRarity.Common,BuildingType.Industrial,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new BookCity().BuildingName,1));
    }
}

export default PaperMill