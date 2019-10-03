import {Building, BuildingRarity, BuildingType} from "../Building";
import School from "./School";
import PaperMill from "./PaperMill";
import {Buff, BuffRange} from "../Buff";

class BookCity extends Building{
    constructor(){
        super("图书城",BuildingRarity.Rare,BuildingType.Business,1);
    }

    initBuffs(){
        this.buffs.push(new Buff(BuffRange.Targets,new School().BuildingName,1));
        this.buffs.push(new Buff(BuffRange.Targets,new PaperMill().BuildingName,1));
    }
}

export default BookCity