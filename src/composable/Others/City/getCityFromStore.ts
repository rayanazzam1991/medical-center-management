import { useCity , defaultCity } from "/@src/stores/Others/City/cityStore";
import { City } from "/@src/utils/api/Others/City";


export async function getCityFromStore(cityId:number)  {
    const cityStore =  useCity()
    await cityStore.loadCities()
    var city : City = cityStore.cities.find((city) => city.id == cityId) ?? defaultCity
    return { city }

}