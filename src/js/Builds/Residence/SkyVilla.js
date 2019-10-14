import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class SkyVilla extends Building{
    constructor(){
        super(BuildingNames.SkyVilla,BuildingRarity.Legendary,BuildingType.Residence,1.52);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.FolkFood,1));
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.2));
    }
}

export default SkyVilla