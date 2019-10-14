import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class MediaVoice extends Building{
    constructor(){
        super(BuildingNames.MediaVoice,BuildingRarity.Legendary,BuildingType.Business,1.615);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Offline,BuffRange.Offline,0.1));
        this.buffs.push(new Buff(BuffRange.Global,BuffRange.Global,0.05));
    }
}

export default MediaVoice