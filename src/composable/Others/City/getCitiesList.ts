import { useCity } from "/@src/stores/Others/City/cityStore";


export function getCitiesList () {
    const city =  useCity()
    // const cities = ref([])
    // const error = ref(null)

    const cities = ref(city.loadCities())
  

    return { cities }

}