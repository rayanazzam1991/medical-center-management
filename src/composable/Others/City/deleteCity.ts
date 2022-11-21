import { useCity } from "/@src/stores/Others/City/cityStore";
import { City } from "/@src/utils/api/Others/City";


export async function deleteCity  (cityId : number)  {
    const city =  useCity()
    await city.deleteCityStore(cityId)
    

}