<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { Service, defaultServiceSearchFilter, ServiceSearchFilter } from '/@src/models/Others/Service/service';
import { contractorAddServicesValidationSchema } from '../../../rules/Contractor/contractorAddServicesValidationSchema';
import { addServicesToContractor } from '/@src/services/Contractor/contractorService';
import { getServicesList } from '/@src/services/Others/Service/serviceService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep"
import { BaseConsts } from '/@src/utils/consts/base';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps';
import { employeeAddServicesValidationSchema } from '/@src/rules/Employee/employeeAddServicesValidationSchema';
import { addServicesToEmployee } from '/@src/services/Employee/employeeService';
import { CreateUpdateServicesHelper } from '/@src/models/Employee/employee';
import { isNumber } from '/@src/composable/helpers/isNumberCheck';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const employeeId = ref<number>(0)
// @ts-ignore
employeeId.value = route.params?.id
const employeeServices = ref<CreateUpdateServicesHelper[]>([]);
viewWrapper.setPageTitle(t('employee.form.step_2_title'))
const head = useHead({
  title: t('employee.form.page_title'),
})
const notif = useNotyf() as Notyf
const isLoading = ref(false)
const employeeForm = useEmployeeForm()
employeeForm.setStep({
  number: 2,
  canNavigate: true,
  skipable: true,
  validateStepFn: async () => {
    var isValid = await onSubmitAdd()
    if (isValid) {
      router.push({
        path: `/employee/${employeeId.value}`,
      })
      employeeForm.reset()
    }

  },
  skipStepFn: async () => {
    router.push({
      path: `/employee/${employeeId.value}`,
    })
    employeeForm.reset()
  }
})
const pageTitle = t('employee.form.step_2_subtitle')
const servicesList = ref<Service[]>([])
onMounted(async () => {
  isLoading.value = true
  const serviceSearchFilter = {
    status: BaseConsts.ACTIVE,
    per_page: 500

  } as ServiceSearchFilter
  const { services } = await getServicesList(serviceSearchFilter)
  servicesList.value = services
  isLoading.value = false

})

const validationSchema = employeeAddServicesValidationSchema
const { handleSubmit, setFieldValue } = useForm({
  validationSchema
});
const setServiceValue = () => {
  employeeServices.value.forEach((service, index) => {
    setFieldValue(`service_id_${index}`, service.service_id)
  });
}
const addService = (service: CreateUpdateServicesHelper) => {
  employeeServices.value?.push(service)
}
const removeService = (service: CreateUpdateServicesHelper, index: number) => {
  if (index !== -1) {
    employeeServices.value.splice(index, 1);
  }
}
const onSubmitAdd = handleSubmit(async () => {
  employeeForm.employeeServicesForm.splice(0, employeeForm.employeeServicesForm.length)
  let priceError: boolean = false
  if (employeeServices.value.length < 1) {
    notif.error(t('toast.error.employee.add_some_services'))
    return
  }
  employeeServices.value.forEach((service) => {
    if (service.price <= 0 || (Number.isNaN(service.price))) {
      const serviceName = servicesList.value.find((serviceEl) => serviceEl.id == service.service_id)?.name
      notif.error(t('toast.error.employee.services_prices_error', { service_name: serviceName }))
      priceError = true
    } else {
      employeeForm.employeeServicesForm.push(service)
    }
  });
  if (priceError)
    return
  let employeeService = employeeForm.employeeServicesForm.map(function (item) { return item.service_id });
  let isDuplicate = employeeService.some(function (item, idx) {
    return employeeService.indexOf(item) != idx
  });
  if (isDuplicate) {
    notif.error(t('toast.error.employee.services_is_duplicated'))
    return
  }
  const { success, message } = await addServicesToEmployee(employeeId.value, employeeForm.employeeServicesForm)

  if (success) {
    await sleep(200);
    notif.success(t('toast.success.add'))
    return true
  }
  else {
    await sleep(200);
    notif.error(message)
  }
})
</script>

<template>
  <div class="page-content-inner">
    <form class="form-layout" @submit.prevent="onSubmitAdd()">
      <div class="form-outer">
        <div class="form-body">
          <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
            <div class="load">
            </div>
          </VLoader>

          <div :hidden="isLoading" class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ pageTitle }}</h4>
            </div>
            <div v-if="servicesList.length != 0" class="columns px-3 py-2">

              <VButton @click.prevent="addService({
                service_id: 0,
                price: 0,
              })" color="primary">
                {{ t('employee.form.add_new_service') }}
              </VButton>
            </div>
            <div v-if="servicesList.length == 0" class="fieldset-heading mt-6">
              <h4 class="has-text-centered ">{{ t('employee.form.no_services_placeholder') }}</h4>
            </div>
            <div v-if="employeeServices.length != 0" class="mb-4 is-flex">
              <div class="column is-6 py-0">
                <h1 class="service-label required">
                  {{ t('employee.form.select_service') }}
                </h1>

              </div>
              <div class="column is-4 py-0">
                <h1 class="service-label required">
                  {{ t('employee.form.service_price') }}

                </h1>
              </div>

            </div>
            <div v-else class="fieldset-heading mt-6">
              <h4 class="has-text-centered ">{{ t('employee.form.no_service_added_placeholder') }}</h4>
            </div>

            <div class="mb-4 is-flex" v-for="(service, mainIndex) in employeeServices" :key="mainIndex">
              <div class="column is-6 py-0">
                <div class="">
                  <VField :id="`service_id_${mainIndex}`">
                    <VControl>
                      <Multiselect v-model="employeeServices[mainIndex].service_id" mode="single"
                        :placeholder="t('employee.form.select_service')" :close-on-select="true" ref="accountMultiselect"
                        :filter-results="false" :min-chars="0" :resolve-on-load="false" :infinite="true" :limit="20"
                        :rtl="true" :max="1" :clear-on-search="true" :delay="0" :searchable="true" :canClear="false"
                        @select="setServiceValue()" :options="async (query: any) => {
                          let serviceSearchFilter = {} as ServiceSearchFilter
                          //@ts-ignore
                          serviceSearchFilter.name = query
                          //@ts-ignore
                          const data = await getServicesList(serviceSearchFilter)
                          //@ts-ignore
                          return data.services.map((service: any) => {
                            return { value: service.id, label: `${service.name}` }
                          })
                        }" @open="(select$: any) => {
  if (select$.noOptions) {
    select$.resolveOptions()
  }
}" />
                    </VControl>
                    <ErrorMessage class="help is-danger" :name="`service_id_${mainIndex}`" />
                  </VField>
                </div>

              </div>
              <div class="column is-4 py-0">
                <div class="">
                  <VField>
                    <VControl>
                      <VInput v-model.number="employeeServices[mainIndex].price" />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div class="column is-2 py-0">
                <div class="">
                  <VField>
                    <VControl>
                      <VIconButton icon="feather:trash-2" class="remove_btn" @click="removeService(service, mainIndex)"
                        color="danger">
                      </VIconButton>
                    </VControl>
                  </VField>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.required::after {
  content: " *";
  color: var(--danger);
}


.form-layout .form-outer .form-body {
  padding: 20px 40px 40px;
}

.layout {
  min-width: 50%;
}

.form-fieldset {
  max-width: 40%;
}


.field {

  .custom-label {
    font-family: var(--font);
    font-size: 0.9rem;
    color: var(--light-text) !important;
    font-weight: 400;
  }
}

.input {
  height: 38px;
}

.service-label {
  font-family: var(--font);
  font-weight: 600;
}

.load {
  height: 400px;
  width: 500px;
}
</style>
