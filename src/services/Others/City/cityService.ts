import { City, CitySearchFilter, defaultCity } from "/@src/models/Others/City/city"
import { useCity } from "/@src/stores/Others/City/cityStore"
import { Pagination } from "/@src/utils/response"


export async function addCity(cityData: City) {
    const cityResponse = useCity()
    var city: City = await cityResponse.addCityStore(cityData) ?? defaultCity
    var success: boolean = cityResponse.success ?? false
    var error_code: string = cityResponse.error_code ?? ''
    var message: string = cityResponse.message ?? ''
    return { success, error_code, message, city }

}

export async function deleteCity(cityId: number) {
    const cityResponse = useCity()
    await cityResponse.deleteCityStore(cityId)
    var success: boolean = cityResponse.success ?? false
    var error_code: string = cityResponse.error_code ?? ''
    var message: string = cityResponse.message ?? ''
    return { success, error_code, message }

}
export async function editCity(cityData: City) {
    const cityResponse = useCity()
    await cityResponse.editCityStore(cityData)
    var success: boolean = cityResponse.success ?? false
    var error_code: string = cityResponse.error_code ?? ''
    var message: string = cityResponse.message ?? ''
    return { success, error_code, message }

}
export async function getCitiesList(searchFilter: CitySearchFilter) {
    const city = useCity()
    await city.getCitiesStore(searchFilter)
    var cities: City[] = city.cities
    var pagination: Pagination = city.pagination
    var success: boolean = city.success ?? false
    var error_code: string = city.error_code ?? ''
    var message: string = city.message ?? ''

    return { cities, pagination, success, error_code, message }

}
export async function getCity(cityId: number) {
    const cityResponse = useCity()
    var city: City = await cityResponse.getCityStore(cityId) ?? defaultCity
    var success: boolean = cityResponse.success ?? false
    var error_code: string = cityResponse.error_code ?? ''
    var message: string = cityResponse.message ?? ''
    return { success, error_code, message, city }

}
