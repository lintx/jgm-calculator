import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import FolkFood from "./FolkFood";

class SkyVilla extends Building{
    constructor(){
        super("空中别墅",BuildingRarity.Legendary,BuildingType.Residence,1.52);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new FolkFood().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.2));
    }
}

export default SkyVilla