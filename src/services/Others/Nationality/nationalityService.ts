import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore";

export async function getNationality  (nationalityId : number)  {
    const nationality =  useNationality()
    return await nationality.getNationalityStore(nationalityId)
}

export async function deleteNationality  (nationalityId : number)  {
    const nationality =  useNationality()
    await nationality.deleteNationalityStore(nationalityId)
}

export async function editNationality  (nationalityData : Nationality)  {
    const nationality =  useNationality()
    await nationality.editNationalityStore(nationalityData)
}

export async function getNationalitiesList  (searchFilter : NationalitySearchFilter)  {
    const nationality =  useNationality()
    await nationality.getNationalities(searchFilter)
    var nationalities : Nationality[] = nationality.nationalities
    var pagination : Pagination = nationality.pagination
    return { nationalities , pagination }
}

export async function getNationality  (nationalityId : number)  {
    const nationality =  useNationality()
    return await nationality.getNationalityStore(nationalityId)
}