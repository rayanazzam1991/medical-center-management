import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Position, PositionSearchFilter, ChangePositionStatus } from "/@src/models/Others/Position/position"
import { changePositionStatusApi, getPositionApi, addPositionApi, editPositionApi, getPositionsApi } from "/@src/utils/api/Others/Position"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const usePosition = defineStore('position', () => {
    const api = useApi()
    const positions = ref<Position[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()


    async function getPositionStore(positionId: number) {
        if (loading.value) return

        loading.value = true
        sleep(2000)


        try {
            const response = await getPositionApi(api, positionId)
            var returnedPosition: Position
            returnedPosition = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedPosition
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
    async function addPositionStore(position: Position) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await addPositionApi(api, position)
            var returnedPosition: Position
            returnedPosition = response.response.data
            positions.value.push(returnedPosition)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedPosition
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
    async function editPositionStore(position: Position) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await editPositionApi(api, position)
            var returnedPosition: Position
            returnedPosition = response.response.data
            positions.value.splice(
                positions.value.findIndex((positionElement) => (positionElement.id = position.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            positions.value.push(returnedPosition)
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
    async function getPositionsStore(searchFilter: PositionSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getPositionsApi(api, searchFilter)
            positions.value = returnedResponse.response.data
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

    async function changePositionStatusStore(position: ChangePositionStatus) {
        if (loading.value) return
        loading.value = true
        try {
            const response = await changePositionStatusApi(api, position)
            var returnedPosition: Position
            returnedPosition = response.response.data
            positions.value.splice(
                positions.value.findIndex((positionElement) => (positionElement.id = position.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            positions.value.push(returnedPosition)
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
        positions,
        pagination,
        loading,
        addPositionStore,
        editPositionStore,
        getPositionStore,
        getPositionsStore,
        changePositionStatusStore
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
    import.meta.hot.accept(acceptHMRUpdate(usePosition, import.meta.hot))
}
