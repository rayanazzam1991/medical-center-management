/**
 * This is a store that hold the messaging-v1 state
 * It uses the useApi composition component to make the api calls
 *
 * @see /src/pages/messaging-v1.vue
 * @see /src/composable/useApi.ts
 * @see /src/components/partials/chat/*.vue
 * @see /src/utils/api/chat
 */

 import { ref, computed } from 'vue'
 import { acceptHMRUpdate, defineStore } from 'pinia'
 
 import { City, getCities } from '/@src/utils/api/Others/City'
//  import { fetchConversations, fetchMessages } from '/@src/utils/api/chat'
 import { useApi } from '/@src/composable/useApi'
 
 const defaultCity: City = {
   id: 0,
   name: '',
   status: 0,
 }
 
 export const useCity = defineStore('city', () => {
   const api = useApi()
   const cities = ref<City[]>([])
   const loading = ref(false)
 
//    const selectedConversation = computed(() => {
//      const conversation = conversations.value.find(
//        (item) => item.id === selectedConversationId.value
//      )
 
//      if (!conversation) {
//        return defaultConversation
//      } else {
//        return conversation
//      }
//    })
 
   async function loadCities(start = 0, limit = 10) {
     if (loading.value) return
 
     loading.value = true
 
     try {
       const response = await getCities(api, start, limit)
       cities.value = response.cities
     } finally {
       loading.value = false
     }
   }
 
//    async function selectConversastion(conversationId: number) {
//      if (loading.value) return
 
//      loading.value = true
 
//      try {
//        const response = await fetchMessages(api, conversationId)
//        selectedConversationId.value = conversationId
//        messages.value = response.messages
//      } finally {
//        loading.value = false
//      }
//    }
 
//    function unselectConversation() {
//      selectedConversationId.value = 0
//      messages.value = []
//    }
 
//    function setAddConversationOpen(value: boolean) {
//      addConversationOpen.value = value
//    }
 
//    function setMobileConversationDetailsOpen(value: boolean) {
//      mobileConversationDetailsOpen.value = value
//    }
 
   return {
    cities,
    loadCities
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
   import.meta.hot.accept(acceptHMRUpdate(useCity, import.meta.hot))
 }
 