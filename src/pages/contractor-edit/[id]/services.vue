<script setup lang="ts">import { useHead } from '@vueuse/head';
import { useNotyf } from '/@src/composable/useNotyf';
import { Service, defaultServiceSearchFilter } from '/@src/models/Others/Service/service';
import { getContractor, updateContractor } from '/@src/services/Contractor/contractorService';
import { getServicesList } from '/@src/services/Others/Service/serviceService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';



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
        var isValid = await onSubmitEdit()
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

const fetchContractor = async () => {

    const { contractor } = await getContractor(contractorId.value)
    console.log(contractor.payment_percentage)
    for (let i = 0; i < contractor.services.length; i++) {
        // @ts-ignore
        contractorForm.contractorServicesForm.push({ service_id: contractor.services[i].id, price: contractor.services[i].price, contractor_service_amount: contractor.services[i].contractor_service_amount })


    }

    console.log(contractorForm.contractorServicesForm)

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
    contractorForm.dataUpdate.payment_percentage = contractor.payment_percentage
    contractorForm.dataUpdate.id = contractorId.value

    console.log(contractorForm.dataUpdate)

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



const onSubmitEdit = async () => {
    contractorForm.contractorServicesForm.splice(0, contractorForm.contractorServicesForm.length)
    for (let i = 0; i < servicesChecked.value.length; i++) {
        if (servicesChecked.value[i].checked == true) {
            contractorForm.contractorServicesForm.push({ service_id: servicesChecked.value[i].service.id as number, price: servicesChecked.value[i].price, contractor_service_amount: (servicesChecked.value[i].price * (contractorForm.dataUpdate.payment_percentage as number / 100)) })
            console.log(contractorForm.contractorServicesForm)
        }

    }
    contractorForm.dataUpdate.is_completed = true
    const { success, message, contractor } = await updateContractor(contractorId.value, contractorForm.dataUpdate, contractorForm.userForm, contractorForm.contractorServicesForm)
    if (success) {
        // @ts-ignore
        notif.success(`${contractorForm.userForm.first_name} ${contractorForm.userForm.last_name} services was added successfully`)

        return true
    }
    else {
        // @ts-ignore

        notif.error(message)

    }

}




</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="onSubmitEdit()">
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

                                    <VControl v-for="service in servicesChecked" raw nogrow subcontrol>
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
                            <div class="column is-5">
                                <VField v-for="service in servicesChecked" :id="service.service.name">

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
                            <div class="column is-7">
                                <VField v-for="service in servicesChecked" :id="service.service.name">

                                    <VLabel v-if="service.checked">Contractor's {{ service.service.name }}
                                        Service amount:
                                    </VLabel>
                                    <VControl v-if="service.checked" icon="feather:chevrons-right">
                                        <VInput disabled type="number"
                                            :value="(service.price * (contractorForm.dataUpdate.payment_percentage as number / 100 ?? 0))"
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
</style>
