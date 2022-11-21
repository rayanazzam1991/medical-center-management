import { useCity } from "/@src/stores/Others/City/cityStore";
import { City } from "/@src/utils/api/Others/City";


export async function getCitiesList   ()  {
    const city =  useCity()
    await city.loadCities()
    var cities : City[] = city.cities
    return { cities }

}