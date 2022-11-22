import { useCity } from "/@src/stores/Others/City/cityStore";
import { City } from "/@src/utils/api/Others/City";


export async function addCity  (cityData : City)  {
    console.log('comp')

    const city =  useCity()
    await city.addCityStore(cityData)
    

}