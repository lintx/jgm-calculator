import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import SkyVilla from "./SkyVilla";

class FolkFood extends Building{
    constructor(){
        super("民食斋",BuildingRarity.Legendary,BuildingType.Business,1.52);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new SkyVilla().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Online,BuffRange.Online,0.2));
    }
}

export default FolkFood