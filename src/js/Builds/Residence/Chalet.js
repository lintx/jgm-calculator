import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class Chalet extends Building{
    constructor(){
        super(BuildingNames.Chalet,BuildingRarity.Common,BuildingType.Residence,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.WoodFactory,1));
    }
}

export default Chalet