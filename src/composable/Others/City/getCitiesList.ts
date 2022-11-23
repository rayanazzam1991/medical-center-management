import { useCity } from "/@src/stores/Others/City/cityStore";
import { City  , SearchFilter} from "/@src/utils/api/Others/City";


export async function getCitiesList  (searchFilter : SearchFilter)  {
    const city =  useCity()
    await city.getCities(searchFilter)
    
    var cities : City[] = city.cities
    return { cities }

}