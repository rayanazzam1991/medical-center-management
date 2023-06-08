import { nationalStore } from "/@src/stores/Others/National/NationalStore"
import { defaultNational, National, NationalSearchFilter } from '/@src/models/Others/National/national'
import { Pagination } from '/@src/utils/response'

export class nationalService {
  _nationalStore;

  constructor() {
    this._nationalStore = nationalStore()
  }

  async get(searchFilter: NationalSearchFilter) {
    await this._nationalStore.get(searchFilter)
    var nationals: National[] = this._nationalStore.nationals
    var success: boolean = this._nationalStore.success ?? false
    var error_code: string = this._nationalStore.error_code ?? ''
    var message: string = this._nationalStore.message ?? ''
    var pagination: Pagination = this._nationalStore.pagination
    return { success, error_code, message, nationals, pagination }
  }

  async show(id: number) {
    var national: National = await this._nationalStore.show(id) ?? defaultNational
    var success: boolean = this._nationalStore.success ?? false
    var error_code: string = this._nationalStore.error_code ?? ''
    var message: string = this._nationalStore.message ?? ''
    return { success, error_code, message, national }
  }

  async store(_national: National) {
    var national: National = await this._nationalStore.store(_national) ?? defaultNational
    var success: boolean = this._nationalStore.success ?? false
    var error_code: string = this._nationalStore.error_code ?? ''
    var message: string = this._nationalStore.message ?? ''
    return { success, error_code, message, national }
  }

  async update(_national: National) {
    var national: National = await this._nationalStore.update(_national) ?? defaultNational
    var success: boolean = this._nationalStore.success ?? false
    var error_code: string = this._nationalStore.error_code ?? ''
    var message: string = this._nationalStore.message ?? ''
    return { success, error_code, message, national }
  }

  async destroy(id: number) {
    await this._nationalStore.destroy(id)
    var success: boolean = this._nationalStore.success ?? false
    var error_code: string = this._nationalStore.error_code ?? ''
    var message: string = this._nationalStore.message ?? ''
    return { success, error_code, message }
  }
}
