import { useCity } from "/@src/stores/Others/City/cityStore";
import { City  , CitySearchFilter} from "/@src/utils/api/Others/City";
import { Pagination } from "/@src/utils/response";


export async function getCitiesList  (searchFilter : CitySearchFilter)  {
    const city =  useCity()
    await city.getCitiesStore(searchFilter)
    console.log('12331')
    var cities : City[] = city.cities
    var pagination : Pagination = city.pagination
    return { cities , pagination }

}