import { useCity } from "/@src/stores/Others/City/cityStore";


export async function getCity  (cityId : number)  {
    const city =  useCity()
    return await city.getCityStore(cityId)
    

}