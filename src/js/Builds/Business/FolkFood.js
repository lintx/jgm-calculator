import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class FolkFood extends Building{
    constructor(){
        super(BuildingNames.FolkFood,BuildingRarity.Legendary,BuildingType.Business,1.52);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.SkyVilla,1));
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.2));
    }
}

export default FolkFood