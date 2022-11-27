import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore";
import { Nationality, NationalitySearchFilter } from "/@src/utils/api/Others/Nationality";
import { Pagination } from "/@src/utils/response";


export async function getNationalitiesList  (searchFilter : NationalitySearchFilter)  {
    const nationality =  useNationality()
    await nationality.getNationalities(searchFilter)
    
    var nationalities : Nationality[] = nationality.nationalities
    var pagination : Pagination = nationality.pagination
    return { nationalities , pagination }

}