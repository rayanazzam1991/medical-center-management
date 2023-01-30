<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
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
import { z as zod } from 'zod';
import { BaseConsts } from '/@src/utils/consts/base';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';

const {t} = useI18n()
const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const contractorId = ref<number>(0)
// @ts-ignore
contractorId.value = route.params?.id

viewWrapper.setPageTitle(t('contractor.form.step_2_title'))
const head = useHead({
    title: t('contractor.form.page_title'),
})
const notif = useNotyf() as Notyf
const contractorForm = useContractorForm()
contractorForm.setStep({
    number: 2,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            contractorForm.reset()
            router.push({
                path: `/contractor/${contractorId.value}`,
            })
        }

    },
    skipStepFn: async () => {
        contractorForm.reset()
        router.push({
            path: `/contractor/${contractorId.value}`,
        })
    }

})
const pageTitle = t('contractor.form.step_2_subtitle')
const servicesList = ref<Service[]>([])
interface ServicesChecked {
    service: Service
    checked: boolean
    price: number
    contractor_service_amount: number
}
const servicesChecked = ref<ServicesChecked[]>([])

onMounted(async () => {

    let serviceSearchFilter: ServiceSearchFilter = defaultServiceSearchFilter
    serviceSearchFilter.status = BaseConsts.ACTIVE
    serviceSearchFilter.per_page = 500
    const { services } = await getServicesList(defaultServiceSearchFilter)
    servicesList.value = services

    for (let index = 0; index < servicesList.value.length; index++) {
        servicesChecked.value.push({ service: servicesList.value[index], checked: false, price: 0, contractor_service_amount: 0 })

    }
})

const validationSchema = contractorAddServicesValidationSchema

const { handleSubmit } = useForm({
    validationSchema
});


const onSubmitAdd = handleSubmit(async () => {

    for (let i = 0; i < servicesChecked.value.length; i++) {
        if (servicesChecked.value[i].checked == true) {
            contractorForm.contractorServicesForm.push({ service_id: servicesChecked.value[i].service.id as number, price: servicesChecked.value[i].price, contractor_service_amount: contractorForm.data.payment_percentage!= undefined ? servicesChecked.value[i].price * (contractorForm.data.payment_percentage / 100) :  0 })

        }
        else {
        }

    }
    contractorForm.data.is_completed = true
    const { success, message, contractor } = await addServicesToContractor(contractorId.value, contractorForm.contractorServicesForm)

    if (success) {
        // @ts-ignore
        await sleep(200);

        notif.success(t('toast.success.add'))

        return true
    }
    else {
        // @ts-ignore
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
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div v-if="servicesList.length != 0" class="columns is-multiline">
                            <div class="column is-12">

                                <VField>

                                    <VControl :key="service.service.id" v-for="service in servicesChecked" raw nogrow
                                        subcontrol>
                                        <VCheckbox :label="service.service.name" :name="service.service.id"
                                            color="primary" :key="service.service.id" v-model="service.checked" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <div v-else class="fieldset-heading mt-6">
                            <h4 class="has-text-centered ">{{t('contractor.form.no_services_placeholder')}}</h4>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div v-if="servicesList.length != 0" class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <div :class="service.checked ? 'mb-3' : ''" v-for="service in servicesChecked">
                                    <VField v-if="service.checked" :key="service.service.id"
                                        :id="`service_price_${service.service.id}`">

                                        <VLabel class="required" v-if="service.checked">
                                        {{ t('contractor.form.service_price' , {service : service.service.name}) }}
                                        </VLabel>
                                        <VControl v-if="service.checked" icon="feather:chevrons-right">
                                            <VInput type="number" placeholder="" autocomplete="" v-model="service.price"
                                                :key="service.service.id" />

                                        </VControl>
                                        <ErrorMessage class="help is-danger"
                                            :name="`service_price_${service.service.id}`" />


                                    </VField>
                                </div>

                            </div>
                            <div class="column is-6">

                                <div :class="service.checked == true ? 'field' : ''" v-for="service in servicesChecked"
                                    :id="service.service.name" :key="service.service.id">
                                    <span class="label custom-label" v-if="service.checked">
                                    {{  t('contractor.form.service_amount', {service : service.service.name}) }}
                             </span>
                                    <div v-if="service.checked" class="control">
                                        <div class="input">
                                            {{ contractorForm.data.payment_percentage != undefined ? (service.price *
        (contractorForm.data.payment_percentage / 100 )) : 0
                                            }}

                                        </div>
                                    </div>

                                </div>
                            </div>


                            <!-- <div class="column is-6">
                                <VField :key="service.service.id" v-for="service in servicesChecked"
                                    :id="`service_amount_${service.service.id}`">

                                    <VLabel class=" is-flex-wrap-nowrap" v-if="service.checked">
                                        Contractor's {{
        service.service.name
}}
                                        Service amount:
                                    </VLabel>
                                    <VControl v-if="service.checked" icon="feather:chevrons-right">
                                        <VInput disabled type="number"
                                            :value="(service.price * (contractorForm.data.payment_percentage / 100 ?? 0))"
                                            v-bind="service.price" v-model="service.contractor_service_amount"
                                            :key="service.service.id" />

                                    </VControl>
                                    <ErrorMessage class="help is-danger"
                                        :name="`service_amount_${service.service.id}`" />

                                </VField>
                            </div> -->
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
</style>