import {Building, BuildingRarity, BuildingType} from "../Building";
import {Buff, BuffRange} from "../Buff";
import WoodFactory from "./WoodFactory";

class Chalet extends Building{
    constructor(){
        super("木屋",BuildingRarity.Common,BuildingType.Residence,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new WoodFactory().BuildingName,1));
    }
}

export default Chalet