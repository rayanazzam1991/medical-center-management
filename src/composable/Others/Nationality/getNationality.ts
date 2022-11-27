import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore";

export async function getNationality  (nationalityId : number)  {
    const nationality =  useNationality()
    return await nationality.getNationalityStore(nationalityId)
    

}