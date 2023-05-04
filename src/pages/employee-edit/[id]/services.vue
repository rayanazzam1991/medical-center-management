<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { CreateUpdateServicesHelper } from '/@src/models/Employee/employee';
import { Service, defaultServiceSearchFilter, ServiceSearchFilter } from '/@src/models/Others/Service/service';
import { employeeEditServicesValidationSchema } from '/@src/rules/Employee/employeeEditServicesValidationSchema';
import { getEmployee, updateEmployee } from '/@src/services/Employee/employeeService';
import { getServicesList } from '/@src/services/Others/Service/serviceService';
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps';
import { useEmployee } from '/@src/stores/Employee/employeeStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep"



const viewWrapper = useViewWrapper()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const employeeId = ref<number>(0)
// @ts-ignore
employeeId.value = route.params?.id


viewWrapper.setPageTitle(t('employee.form.edit_step_2_title'))
const head = useHead({
  title: t('employee.form.page_title'),
})
const notif = useNotyf() as Notyf
const employeeForm = useEmployeeForm()
employeeForm.setStep({
  number: 2,
  canNavigate: true,
  validateStepFn: async () => {
    var isValid = await onSubmitEdit()

    if (isValid) {
      router.push({
        path: `/employee/${employeeId.value}`,
        query: { tab: 'Services' }
      })
      employeeForm.reset()

    }

  },

})
const servicesList = ref<Service[]>([])

const fetchEmployee = async () => {
  employeeForm.employeeServicesForm.splice(0, employeeForm.employeeServicesForm.length)
  employeeForm.originalServices.splice(0, employeeForm.originalServices.length)
  const { employee } = await getEmployee(employeeId.value)
  for (let i = 0; i < employee.services.length; i++) {
    employeeForm.employeeServicesForm.push({ service_id: employee.services[i].service?.id ?? 0, price: employee.services[i].price })
    employeeForm.originalServices.push({ service_id: employee.services[i].service?.id ?? 0, price: employee.services[i].price })
    setFieldValue(`service_id_${i}`, employee.services[i].service.id)
  }
  employeeForm.userForm.id = employee.user.id
  employeeForm.userForm.first_name = employee.user.first_name
  employeeForm.userForm.last_name = employee.user.last_name
  employeeForm.userForm.gender = employee.user.gender
  employeeForm.userForm.birth_date = employee.user.birth_date
  employeeForm.userForm.phone_number = employee.user.phone_number
  employeeForm.userForm.address = employee.user.address
  employeeForm.userForm.room_id = employee.user.room.id
  employeeForm.userForm.city_id = employee.user.city.id
  employeeForm.userForm.user_status_id = employee.user.status.id
  employeeForm.dataUpdate.starting_date = employee.starting_date
  employeeForm.dataUpdate.end_date = employee.end_date
  employeeForm.dataUpdate.nationality_id = employee.nationality.id ?? 0
  employeeForm.dataUpdate.payment_percentage = employee.payment_percentage
  employeeForm.dataUpdate.basic_salary = employee.basic_salary
  employeeForm.dataUpdate.id = employeeId.value
  employeeForm.dataUpdate.type = employee.type
  employeeForm.dataUpdate.position_id = employee.position.id
}
onMounted(async () => {
  isLoading.value = true
  const { services } = await getServicesList(defaultServiceSearchFilter)
  servicesList.value = services
  if (employeeForm.dataUpdate.id != employeeId.value) {

    await fetchEmployee()
  }
  setServiceValue()

  isLoading.value = false


})
const addService = (service: CreateUpdateServicesHelper) => {
  employeeForm.employeeServicesForm.push(service)
}
const removeService = (index: number) => {
  if (index !== -1) {
    employeeForm.employeeServicesForm.splice(index, 1);
  }
}
const setServiceValue = () => {
  employeeForm.employeeServicesForm.forEach((service, index) => {
    setFieldValue(`service_id_${index}`, service.service_id)
  });
}

const validationSchema = employeeEditServicesValidationSchema

const { handleSubmit, setFieldValue } = useForm({
  validationSchema,
});



const onSubmitEdit = handleSubmit(async () => {
  employeeForm.originalServices.splice(0, employeeForm.originalServices.length)
  let priceError: boolean = false
  employeeForm.employeeServicesForm.forEach((service) => {
    if (service.price <= 0 || (Number.isNaN(service.price))) {
      const serviceName = servicesList.value.find((serviceEl) => serviceEl.id == service.service_id)?.name
      notif.error(t('toast.error.employee.services_prices_error', { service_name: serviceName }))
      priceError = true
    } else {
      employeeForm.originalServices.push(service)
    }
  });
  if (priceError)
    return
  let employeeService = employeeForm.originalServices.map(function (item) { return item.service_id });
  let isDuplicate = employeeService.some(function (item, idx) {
    return employeeService.indexOf(item) != idx
  });
  if (isDuplicate) {
    notif.error(t('toast.error.employee.services_is_duplicated'))
    return
  }
  const { success, message, employee } = await updateEmployee(employeeId.value, employeeForm.dataUpdate, employeeForm.userForm, employeeForm.employeeServicesForm)
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
    <form class="form-layout" @submit.prevent="onSubmitEdit()">
      <div class="form-outer">
        <div class="form-body">
          <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
            <div class="load">
            </div>
          </VLoader>

          <div :hidden="isLoading" class="form-fieldset">
            <div class="fieldset-heading">
              <!-- <h4>{{ pageTitle }}</h4> -->
              <h4>{{ t('employee.form.choose_services') }}</h4>

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
            <div v-if="employeeForm.employeeServicesForm.length != 0" class="mb-4 is-flex">
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

            <div class="mb-4 is-flex" v-for="(service, mainIndex) in employeeForm.employeeServicesForm" :key="mainIndex">
              <div class="column is-6 py-0"
                v-if="employeeForm.originalServices.find((element) => element.service_id == service.service_id)">
                <div class="">
                  <VField :id="`service_id_${mainIndex}`">
                    <VSelect disabled v-model="service.service_id">
                      <VOption :value="service.service_id">{{ servicesList.find((serviceElement) =>
                        service.service_id == serviceElement.id)?.name }}</VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" :name="`service_id_${mainIndex}`" />
                  </VField>
                </div>

              </div>
              <div class="column is-6 py-0" v-else>
                <div class="">
                  <VField :id="`service_id_${mainIndex}`">
                    <VControl>
                      <Multiselect v-model="employeeForm.employeeServicesForm[mainIndex].service_id" mode="single"
                        :placeholder="t('employee.form.select_service')" :close-on-select="true" ref="accountMultiselect"
                        :filter-results="false" :min-chars="0" :resolve-on-load="false" :infinite="true" :limit="20"
                        :rtl="true" :max="1" :clear-on-search="true" :delay="0" :searchable="true" :canClear="false"
                        @select="setServiceValue()" :options="async (query: any) => {
                          let serviceSearchFilter = {} as ServiceSearchFilter
                          //@ts-ignore
                          serviceSearchFilter.name = query
                          //@ts-ignore
                          const { services } = await getServicesList(serviceSearchFilter)
                          //@ts-ignore
                          return services.map((service: Service) => {
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
                      <VInput v-model.number="employeeForm.employeeServicesForm[mainIndex].price" />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div class="column is-2 py-0">
                <div class="">
                  <VField>
                    <VControl>
                      <VIconButton icon="feather:trash-2" class="remove_btn" @click="removeService(mainIndex)"
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
