<script setup lang="ts">
import { usePanels } from '/@src/stores/panels'
import { useHead } from '@vueuse/head'
import { nationalService } from '/@src/services/Others/National/nationalService'
import { defaultNational } from '/@src/models/Others/National/national'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { NationalConsts } from '/@src/models/Others/National/national'
import { nationalStore } from '/@src/stores/Others/National/NationalStore'
import sleep from '/@src/utils/sleep'
import { useI18n } from 'vue-i18n'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
const panels = usePanels()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('national.details.title'))
const head = useHead({
  title: t('national.details.title'),
})

const nationalId = ref(0)
const _nationalService = new nationalService();
const _nationalStore = nationalStore();
// @ts-ignore
nationalId.value = route.params?.id as number ?? 0
const currentNational = ref(defaultNational)
const getCurrentNational = async () => {
  const { national } = await _nationalService.show(nationalId.value)
  await sleep(500)
  currentNational.value = national != undefined ? national : defaultNational
  pageTitle.value = viewWrapper.pageTitle + ': ' + currentNational.value.name

}
onMounted(async () => {
  await getCurrentNational()
})

const toEdit = () => {
  router.push({ path: `/national/${nationalId.value}/edit` })
}

</script>

<template>
  <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/national'" @onSubmit="toEdit"
    :permission="Permissions.DEPARTMENT_EDIT" :isLoading="_nationalStore?.loading" />
  <section class="form-layout">
    <div class="form-outer">
      <div class="form-body">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="columns is-multiline">
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('national.form.name', { title: viewWrapper.pageTitle }) }}:</h4>
              <span>{{ currentNational.name }}</span>
            </div>
            <div class="column is-12">
              <h4 class="margin-bottom">{{ t('national.form.status', { title: viewWrapper.pageTitle }) }}:
              </h4>
              <span>
                <VTag :color="currentNational.status === NationalConsts.INACTIVE ? 'danger' : 'success'">
                  {{ NationalConsts.showStatusName(currentNational.status) }}</VTag>
              </span>
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
