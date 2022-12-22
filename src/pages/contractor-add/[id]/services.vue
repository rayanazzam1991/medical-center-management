<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useNotyf } from '/@src/composable/useNotyf';
import { Service, defaultServiceSearchFilter } from '/@src/models/Others/Service/service';
import { addServicesToContractor } from '/@src/services/Contractor/contractorService';
import { getServicesList } from '/@src/services/Others/Service/serviceService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep"


const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const contractorId = ref<number>(0)
// @ts-ignore
contractorId.value = route.params?.id

viewWrapper.setPageTitle('Contractor Services')
const head = useHead({
    title: 'Contractor',
})
const notif = useNotyf()
const contractorForm = useContractorForm()
contractorForm.setStep({
    number: 3,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        console.log(isValid)
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
const pageTitle = 'Step 3: Contractor Services'
const servicesList = ref<Service[]>([])
interface ServicesChecked {
    service: Service
    checked: boolean
    price: number
    contractor_service_amount: number
}
const servicesChecked = ref<ServicesChecked[]>([])
onMounted(async () => {
    const { services } = await getServicesList(defaultServiceSearchFilter)
    servicesList.value = services
    for (let index = 0; index < servicesList.value.length; index++) {
        servicesChecked.value.push({ service: servicesList.value[index], checked: false, price: 0, contractor_service_amount: 0 })

    }
})



const onSubmitAdd = async () => {

    for (let i = 0; i < servicesChecked.value.length; i++) {
        if (servicesChecked.value[i].checked == true) {
            contractorForm.contractorServicesForm.push({ service_id: servicesChecked.value[i].service.id as number, price: servicesChecked.value[i].price, contractor_service_amount: servicesChecked.value[i].price * (contractorForm.data.payment_percentage / 100) })

        }
        else {
        }

    }
    contractorForm.data.is_completed = true
    const { success, message, contractor } = await addServicesToContractor(contractorId.value, contractorForm.contractorServicesForm)

    if (success) {
        // @ts-ignore
        await sleep(200);

        notif.success(`${contractorForm.userForm.first_name} ${contractorForm.userForm.last_name} services was added successfully`)

        return true
    }
    else {
        // @ts-ignore
        await sleep(200);

        notif.error(message)

    }



}
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
                        <div class="columns is-multiline">
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
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField :key="service.service.id" v-for="service in servicesChecked"
                                    :id="service.service.name">

                                    <VLabel class="required" v-if="service.checked">Contractor's {{ service.service.name
                                    }}
                                        Price:
                                    </VLabel>
                                    <VControl v-if="service.checked" icon="feather:chevrons-right">
                                        <VInput type="number" placeholder="" autocomplete="" v-model="service.price"
                                            :key="service.service.id" />

                                    </VControl>

                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField :key="service.service.id" v-for="service in servicesChecked"
                                    :id="service.service.name">

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
                                </VField>
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
</style>
