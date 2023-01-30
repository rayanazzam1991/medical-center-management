import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Speciality, SpecialitySearchFilter, ChangeSpecialityStatus } from "/@src/models/Others/Speciality/speciality"
import { changeSpecialityStatusApi, getSpecialityApi, addSpecialityApi, editSpecialityApi, getSpecialitiesApi } from "/@src/utils/api/Others/Speciality"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useSpeciality = defineStore('speciality', () => {
    const api = useApi()
    const specialities = ref<Speciality[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()


    async function getSpecialityStore(specialityId: number) {
        if (loading.value) return

        loading.value = true
        sleep(2000)


        try {
            const response = await getSpecialityApi(api, specialityId)
            var returnedSpeciality: Speciality
            returnedSpeciality = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedSpeciality
        }
        catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        }
        finally {
            loading.value = false
        }
    }
    async function addSpecialityStore(speciality: Speciality) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await addSpecialityApi(api, speciality)
            var returnedSpeciality: Speciality
            returnedSpeciality = response.response.data
            specialities.value.push(returnedSpeciality)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedSpeciality
        }
        catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        }
        finally {
            loading.value = false
        }
    }
    async function editSpecialityStore(speciality: Speciality) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await editSpecialityApi(api, speciality)
            var returnedSpeciality: Speciality
            returnedSpeciality = response.response.data
            specialities.value.splice(
                specialities.value.findIndex((specialityElement) => (specialityElement.id = speciality.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            specialities.value.push(returnedSpeciality)
        }
        catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        }
        finally {
            loading.value = false
        }
    }
    async function getSpecialitiesStore(searchFilter: SpecialitySearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getSpecialitiesApi(api, searchFilter)
            specialities.value = returnedResponse.response.data
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message

        }
        catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        }
        finally {
            loading.value = false
        }
    }

    async function changeSpecialityStatusStore(speciality: ChangeSpecialityStatus) {
        if (loading.value) return
        loading.value = true
        try {
            const response = await changeSpecialityStatusApi(api, speciality)
            var returnedSpeciality: Speciality
            returnedSpeciality = response.response.data
            specialities.value.splice(
                specialities.value.findIndex((specialityElement) => (specialityElement.id = speciality.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            specialities.value.push(returnedSpeciality)
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }

    return {
        success,
        error_code,
        message,
        specialities,
        pagination,
        loading,
        addSpecialityStore,
        editSpecialityStore,
        getSpecialityStore,
        getSpecialitiesStore,
        changeSpecialityStatusStore
    } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSpeciality, import.meta.hot))
}
