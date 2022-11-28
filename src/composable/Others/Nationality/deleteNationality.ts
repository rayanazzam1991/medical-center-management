import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore";
import { Nationality } from "/@src/utils/api/Others/Nationality";

export async function deleteNationality  (nationalityId : number)  {
    const nationality =  useNationality()
    await nationality.deleteNationalityStore(nationalityId)
    

}