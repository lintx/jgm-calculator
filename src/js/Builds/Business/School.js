import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class School extends Building{
    constructor(){
        super(BuildingNames.School,BuildingRarity.Common,BuildingType.Business,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.BookCity,1));
    }
}

export default School