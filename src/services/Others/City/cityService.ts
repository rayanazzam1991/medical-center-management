import { useCity } from "/@src/stores/Others/City/cityStore";
import { City } from "/@src/utils/api/Others/City";


export async function addCity  (cityData : City)  {
    const city =  useCity()
    return await city.addCityStore(cityData)
}

export async function deleteCity  (cityId : number)  {
    const city =  useCity()
    await city.deleteCityStore(cityId)
}
export async function editCity  (cityData : City)  {
    const city =  useCity()
    await city.editCityStore(cityData)
}
export async function getCitiesList  (searchFilter : CitySearchFilter)  {
    const city =  useCity()
    await city.getCitiesStore(searchFilter)
    var cities : City[] = city.cities
    var pagination : Pagination = city.pagination
    return { cities , pagination }

}
export async function getCity  (cityId : number)  {
    const city =  useCity()
    return await city.getCityStore(cityId)
}