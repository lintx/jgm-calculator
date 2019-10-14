import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class PaperMill extends Building{
    constructor(){
        super(BuildingNames.PaperMill,BuildingRarity.Common,BuildingType.Industrial,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.BookCity,1));
    }
}

export default PaperMill