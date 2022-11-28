import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore";
import { Nationality } from "/@src/utils/api/Others/Nationality";


export async function addNationality  (nationalityData : Nationality)  {

    const nationality =  useNationality()
    return await nationality.addNationalityStore(nationalityData)
    
    

}