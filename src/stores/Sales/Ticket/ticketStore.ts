import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { ConfirmPaymentTicket, CreateTicket, Ticket, TicketSearchFilter, UpdateTicket, defaultTicket } from "/@src/models/Sales/Ticket/ticket"
import { closeTicketApi, confirmPaymentTicketApi, createTicketApi, getPendingTicketByBarcodeApi, getPendingTicketsListApi, getTicketApi, getTicketsListApi, moveTicketToNextWaitingListApi, updateTicketApi } from "/@src/utils/api/Sales/Ticket"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useTicket = defineStore('ticket', () => {
  const api = useApi()
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()
  const tickets = ref<Ticket[]>([])
  const ticketByBarcode = ref<Ticket>(defaultTicket)
  const pagination = ref<Pagination>(defaultPagination)

  async function createTicketStore(ticket: CreateTicket) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await createTicketApi(api, ticket)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as Ticket
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function updateTicketStore(ticketId: number, ticket: UpdateTicket) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await updateTicketApi(api, ticketId, ticket)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as Ticket
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function confirmPaymentTicketStore(ticketId: number, ticket: ConfirmPaymentTicket) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await confirmPaymentTicketApi(api, ticketId, ticket)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as Ticket
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  async function getTicketStore(ticketId: number) {
    if (loading.value) return

    loading.value = true
    sleep(2000)


    try {
      const response = await getTicketApi(api, ticketId)
      let returndTicket: Ticket
      returndTicket = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returndTicket
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

  async function getTicketsListStore(searchFilter: TicketSearchFilter) {
    if (loading.value) return
    loading.value = true
    sleep(1000)
    try {
      const response = await getTicketsListApi(api, searchFilter)
      tickets.value = response.response.data
      pagination.value = response.response.pagination
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return tickets
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }
  async function getPendingTicketsListStore(searchFilter: TicketSearchFilter) {
    if (loading.value) return
    loading.value = true
    sleep(1000)
    try {
      const response = await getPendingTicketsListApi(api, searchFilter)
      tickets.value = response.response.data
      pagination.value = response.response.pagination
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return tickets
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }

  async function closeTicketStore(ticketId: number) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await closeTicketApi(api, ticketId)
      var returnedTicket: Ticket
      returnedTicket = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  async function moveTicketToNextWaitingListStore(ticketId: number) {
    if (loading.value) return

    loading.value = true
    sleep(2000)


    try {
      const response = await moveTicketToNextWaitingListApi(api, ticketId)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

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
  async function getPendingTicketByBarcodeStore(ticketBarcode: number) {
    if (loading.value) return

    loading.value = true
    sleep(2000)


    try {
      const response = await getPendingTicketByBarcodeApi(api, ticketBarcode)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      ticketByBarcode.value = response.response.data
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


  return {
    success,
    error_code,
    message,
    loading,
    pagination,
    tickets,
    ticketByBarcode,
    createTicketStore,
    getTicketStore,
    updateTicketStore,
    getTicketsListStore,
    closeTicketStore,
    moveTicketToNextWaitingListStore,
    getPendingTicketsListStore,
    confirmPaymentTicketStore,
    getPendingTicketByBarcodeStore
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
  import.meta.hot.accept(acceptHMRUpdate(useTicket, import.meta.hot))
}
