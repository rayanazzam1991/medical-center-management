<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { defaultService } from '/@src/models/Others/Service/service'
import { getService } from '/@src/services/Others/Service/serviceService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { ServiceConsts } from '/@src/models/Others/Service/service'
import { useService } from '/@src/stores/Others/Service/serviceStore'
import sleep from '/@src/utils/sleep'
import { useI18n } from 'vue-i18n'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('service.details.title'))
const head = useHead({
  title: t('service.details.title'),
})


const serviceStore = useService()
const serviceId = ref(0)
// @ts-ignore
serviceId.value = route.params?.id as number ?? 0
const currentService = ref(defaultService)
const getCurrentService = async () => {
  const { service } = await getService(serviceId.value)
  await sleep(500)
  if (service != undefined)
    currentService.value = service
  pageTitle.value = viewWrapper.pageTitle + ': ' + currentService.value.name

}
onMounted(async () => {
  await getCurrentService()
})

const toEdit = () => {
  router.push({ path: `/service/${serviceId.value}/edit` })
}

</script>

<template>
  <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/service'" @onSubmit="toEdit"
    :permission="Permissions.SERVICE_EDIT" :isLoading="serviceStore?.loading" />
  <section class="form-layout">
    <div class="form-outer">
      <div class="form-body">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="columns is-multiline">
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('service.details.name') }}:</h4>
              <span>{{ currentService.name }}</span>
            </div>
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('service.details.description') }}:</h4>
              <span> {{ currentService.description ? currentService.description : t('place_holder.none') }} </span>
            </div>
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('service.details.estimated') }}{{
                addParenthesisToString(t('service.minutes'))
              }}:</h4>
              <span>{{ currentService.duration_minutes }}</span>
            </div>
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('service.details.price') }}:</h4>
              <span>{{ currentService.service_price }}</span>
            </div>
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('service.details.status') }}:</h4>
              <span>
                <VTag :color="currentService.status === ServiceConsts.INACTIVE ? 'danger' : 'success'">
                  {{ ServiceConsts.showStatusName(currentService.status) }}</VTag>
              </span>
            </div>
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('service.details.hasItem') }}:</h4>
              <span>
                <VTag :color="Number(currentService.has_item) === ServiceConsts.IS_NOT_HAS_ITEM ? 'danger' : 'info'">
                  {{ ServiceConsts.showHasItem(Number(currentService.has_item)) }}</VTag>

              </span>
            </div>
            <div class="column is-12" v-if="currentService.has_item == true">
              <h3 class="margin-bottom">{{ t('service.details.listItems') }}:</h3>
              <div v-for="(item, index) in currentService.service_items" :key="index" class="margin-top-bottom is-flex">
                <h4 class="column is-6">{{ t('service.details.item.name') }}: <span> {{ item.item.name }}</span>
                </h4>
                <h4 class="column is-6">{{ t('service.details.item.quantity') }}: <span>{{ item.quantity }}</span>
                </h4>

              </div>
            </div>
          </div>
        </div>
        <!--Fieldset-->
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/detailsPage.scss';
</style>
