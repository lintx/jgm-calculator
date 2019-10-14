import {Building, BuildingNames, BuildingRarity, BuildingType} from "../../Building";
import {Buff, BuffRange} from "../../Buff";

class BookCity extends Building{
    constructor(){
        super(BuildingNames.BookCity,BuildingRarity.Rare,BuildingType.Business,1);
        this.initBuffs();
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.School,1));
        this.buffs.push(new Buff(BuffRange.Targets,BuildingNames.PaperMill,1));
    }
}

export default BookCity