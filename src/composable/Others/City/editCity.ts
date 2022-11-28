import { useCity } from "/@src/stores/Others/City/cityStore";
import { City } from "/@src/utils/api/Others/City";


export async function editCity  (cityData : City)  {
    const city =  useCity()
    await city.editCityStore(cityData)
    

}