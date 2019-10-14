import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class Residential extends Building{
    constructor(){
        super(BuildingNames.Residential,BuildingRarity.Common,BuildingType.Residence,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.ConvenienceStore,1));
    }
}

export default Residential