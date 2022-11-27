import { useCity } from "/@src/stores/Others/City/cityStore";
import { City } from "/@src/utils/api/Others/City";


export async function addCity  (cityData : City)  {

    const city =  useCity()
    return await city.addCityStore(cityData)
    
    

}