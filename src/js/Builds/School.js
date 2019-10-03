import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import BookCity from "./BookCity";

class School extends Building{
    constructor(){
        super("学校",BuildingRarity.Common,BuildingType.Business,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new BookCity().BuildingName,1));
    }
}

export default School