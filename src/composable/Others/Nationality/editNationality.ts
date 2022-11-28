import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore";
import { Nationality } from "/@src/utils/api/Others/Nationality";


export async function editNationality  (nationalityData : Nationality)  {
    const nationality =  useNationality()
    await nationality.editNationalityStore(nationalityData)
    

}