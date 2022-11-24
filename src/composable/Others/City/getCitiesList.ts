import { useCity } from '/@src/stores/Others/City/cityStore'
import { City, SearchFilter } from '/@src/utils/api/Others/City'
import { Pagination } from '/@src/utils/response'

export async function getCitiesList(searchFilter: SearchFilter) {
  const city = useCity()
  await city.getCitiesStore(searchFilter)

  var cities: City[] = city.cities
  var pagination: Pagination = city.pagination
  return { cities, pagination }
}
