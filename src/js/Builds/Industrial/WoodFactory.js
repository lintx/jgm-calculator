import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class WoodFactory extends Building{
    constructor(){
        super(BuildingNames.WoodFactory,BuildingRarity.Common,BuildingType.Industrial,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.Chalet,1));
    }
}

export default WoodFactory