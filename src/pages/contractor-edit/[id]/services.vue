<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Service, defaultServiceSearchFilter } from '/@src/models/Others/Service/service';
import { contractorEditServicesValidationSchema } from '/@src/rules/Contractor/contractorEditServicesValidationSchema';
import { getContractor, updateContractor } from '/@src/services/Contractor/contractorService';
import { getServicesList } from '/@src/services/Others/Service/serviceService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep"



const viewWrapper = useViewWrapper()
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const contractorId = ref<number>(0)
// @ts-ignore
contractorId.value = route.params?.id


viewWrapper.setPageTitle(t('contractor.form.edit_step_2_title'))
const head = useHead({
    title: t('contractor.form.page_title'),
})
const notif = useNotyf() as Notyf
const contractorForm = useContractorForm()
contractorForm.setStep({
    number: 2,
    canNavigate: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()

        if (isValid) {
            router.push({
                path: `/contractor/${contractorId.value}`,
                query: { tab: 'Services' }
            })
            contractorForm.reset()

        }

    },

})
const servicesList = ref<Service[]>([])
interface ServicesChecked {
    service: Service
    checked: boolean
    price: number
    contractor_service_amount: number
}

const fetchContractor = async () => {

    const { contractor } = await getContractor(contractorId.value)
    for (let i = 0; i < contractor.services.length; i++) {
        // @ts-ignore
        contractorForm.contractorServicesForm.push({ service_id: contractor.services[i].id, price: contractor.services[i].price, contractor_service_amount: contractor.services[i].contractor_service_amount })


    }


    contractorForm.userForm.id = contractor.user.id
    contractorForm.userForm.first_name = contractor.user.first_name
    contractorForm.userForm.last_name = contractor.user.last_name
    contractorForm.userForm.gender = contractor.user.gender
    contractorForm.userForm.birth_date = contractor.user.birth_date
    contractorForm.userForm.phone_number = contractor.user.phone_number
    contractorForm.userForm.address = contractor.user.address
    contractorForm.userForm.room_id = contractor.user.room.id
    contractorForm.userForm.city_id = contractor.user.city.id
    contractorForm.userForm.user_status_id = contractor.user.status.id
    contractorForm.dataUpdate.starting_date = contractor.starting_date
    contractorForm.dataUpdate.end_date = contractor.end_date
    contractorForm.dataUpdate.speciality_id = contractor.speciality.id ?? 0
    contractorForm.dataUpdate.payment_percentage = contractor.payment_percentage
    contractorForm.dataUpdate.id = contractorId.value


}



const servicesChecked = ref<ServicesChecked[]>([])
onMounted(async () => {
    const { services } = await getServicesList(defaultServiceSearchFilter)
    servicesList.value = services
    if (contractorForm.dataUpdate.id != contractorId.value) {

        await fetchContractor()
    }


    for (let index = 0; index < servicesList.value.length; index++) {
        var service = contractorForm.contractorServicesForm.find((element) => element.service_id == servicesList.value[index].id)
        if (service) {

            servicesChecked.value.push({ service: servicesList.value[index], checked: true, price: service.price, contractor_service_amount: service.contractor_service_amount })
        }
        else {
            servicesChecked.value.push({ service: servicesList.value[index], checked: false, price: 0, contractor_service_amount: 0 })
        }

    }


})
const validationSchema = contractorEditServicesValidationSchema

const { handleSubmit } = useForm({
    validationSchema,
});



const onSubmitEdit = handleSubmit(async () => {
    contractorForm.contractorServicesForm.splice(0, contractorForm.contractorServicesForm.length)
    for (let i = 0; i < servicesChecked.value.length; i++) {
        if (servicesChecked.value[i].checked == true) {
            contractorForm.contractorServicesForm.push({ service_id: servicesChecked.value[i].service.id as number, price: servicesChecked.value[i].price, contractor_service_amount: (servicesChecked.value[i].price * (contractorForm.dataUpdate.payment_percentage as number / 100)) })
        }

    }
    contractorForm.dataUpdate.is_completed = true
    const { success, message, contractor } = await updateContractor(contractorId.value, contractorForm.dataUpdate, contractorForm.userForm, contractorForm.contractorServicesForm)
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
        <form class="form-layout" @submit.prevent="onSubmitEdit()">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{t('contractor.form.choose_services')}}</h4>
                        </div>
                        <div v-if="servicesList.length != 0" class="columns is-multiline">
                            <div class="column is-12">

                                <VField>

                                    <VControl v-for="service in servicesChecked" raw nogrow subcontrol>
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
                    <div v-if="servicesList.length != 0" class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <div :class="service.checked ? 'mb-3' : ''" v-for="service in servicesChecked">
                                    <VField v-if="service.checked" :key="service.service.id"
                                        :id="`service_price_${service.service.id}`">

                                        <VLabel class="required" v-if="service.checked">
                                            {{ t('contractor.form.service_price',{service : service.service.name}) }}
                                        </VLabel>
                                        <VControl v-if="service.checked" icon="feather:chevrons-right">
                                            <VInput :placeholder="service.price" class="input" type="number"
                                                v-model="service.price" :key="service.service.id" />

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
                                    {{ t('contractor.form.service_amount',{service: service.service.name}) }}
                         </span>
                                    <div v-if="service.checked" class="control">
                                        <div class="input">
                                            {{  contractorForm.dataUpdate.payment_percentage != undefined ? (service.price *
        (contractorForm.dataUpdate.payment_percentage / 100 )) : 0
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
