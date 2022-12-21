<script setup  lang="ts">import { toFormValidator } from '@vee-validate/zod';
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { z as zod } from 'zod';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { phoneExistsCheck } from '/@src/services/Others/User/userService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateContractor } from '/@src/models/Contractor/contractor';
import { City, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { Room, defaultRoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultCreateUpdateUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getContractor, updateContractor } from '/@src/services/Contractor/contractorService';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { contractorEditvalidationSchema } from '/@src/rules/Contractor/contractorEditValidation';
import { useContractor } from '/@src/stores/Contractor/contractorStore';
import sleep from '/@src/utils/sleep';



const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contractor Main Info')
const head = useHead({
    title: 'Contractor',
})
const contractorStore = useContractor()
const contractorForm = useContractorForm()
contractorForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        if (isValid) {
            router.push({
                path: `/contractor-edit/${contractorForm.dataUpdate.id}/profile-picture`,
            })

        }
    },
    skipStepFn: async () => {
        router.push({
            path: `/contractor-edit/${contractorForm.dataUpdate.id}/profile-picture`,
        })

    }
})
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const notif = useNotyf()
const pageTitle = 'Step 1: Contractor Main Info'
const phoneCheck = ref<string>('false')
const currentUser = ref(defaultCreateUpdateUser)
const currentContractor = ref(defaultCreateContractor)
const contractorId = ref(0)
// @ts-ignore
contractorId.value = route.params.id
const fetchContractor = async () => {
    const { contractor } = await getContractor(contractorId.value)
    currentUser.value.first_name = contractor.user.first_name
    currentUser.value.last_name = contractor.user.last_name
    currentUser.value.gender = contractor.user.gender
    currentUser.value.birth_date = contractor.user.birth_date
    currentUser.value.phone_number = contractor.user.phone_number
    currentUser.value.address = contractor.user.address
    currentUser.value.city_id = contractor.user.city?.id
    currentUser.value.room_id = contractor.user.room?.id
    currentUser.value.user_status_id = contractor.user.status?.id
    currentContractor.value.starting_date = contractor.starting_date
    currentContractor.value.payment_percentage = contractor.payment_percentage
    currentContractor.value.id = contractor.id
    currentContractor.value.services = contractor.services
    currentContractor.value.user = contractor.user

    contractorForm.userForm.id = contractor.user.id
    contractorForm.userForm.first_name = currentUser.value.first_name
    contractorForm.userForm.last_name = currentUser.value.last_name
    contractorForm.userForm.gender = currentUser.value.gender
    contractorForm.userForm.birth_date = currentUser.value.birth_date
    contractorForm.userForm.phone_number = currentUser.value.phone_number
    contractorForm.userForm.address = currentUser.value.address
    contractorForm.userForm.room_id = currentUser.value.room_id
    contractorForm.userForm.city_id = currentUser.value.city_id
    contractorForm.userForm.user_status_id = currentUser.value.user_status_id
    contractorForm.dataUpdate.starting_date = currentContractor.value.starting_date
    contractorForm.dataUpdate.payment_percentage = currentContractor.value.payment_percentage
    contractorForm.dataUpdate.id = currentContractor.value.id
    for (let i = 0; i < contractor.services.length; i++) {
        // @ts-ignore
        contractorForm.contractorServicesForm.push({ service_id: contractor.services[i].id, price: contractor.services[i].price, contractor_service_amount: contractor.services[i].contractor_service_amount })


    }

}

const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])

onMounted(async () => {
    if (!isLoading.value) {
        isLoading.value = true
        const { cities } = await getCitiesList(defaultCitySearchFilter)
        citiesList.value = cities
        const { rooms } = await getRoomsList(defaultRoomSearchFilter)
        roomsList.value = rooms
        const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
        statusesList.value = userstatuses
        await fetchContractor()
        isLoading.value = false
    }
})



const validationSchema = contractorEditvalidationSchema

const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        first_name: currentUser.value.first_name,
        last_name: currentUser.value.last_name,
        gender: currentUser.value.gender,
        birth_date: currentUser.value.birth_date,
        phone_number: currentUser.value.phone_number,
        address: currentUser.value.address,
        room_id: currentUser.value.room_id,
        city_id: currentUser.value.city_id,
        user_status_id: currentUser.value.user_status_id,
        starting_date: currentContractor.value.starting_date,
        payment_percentage: currentContractor.value.payment_percentage,
    },
})


const onSubmitEdit = handleSubmit(async (values) => {

    var userData = currentUser.value
    var contractorData = currentContractor.value
    contractorForm.dataUpdate.starting_date = contractorData.starting_date
    contractorForm.dataUpdate.payment_percentage = contractorData.payment_percentage

    contractorForm.userForm.first_name = userData.first_name
    contractorForm.userForm.last_name = userData.last_name
    contractorForm.userForm.password = userData.password
    contractorForm.userForm.gender = userData.gender
    contractorForm.userForm.birth_date = userData.birth_date
    contractorForm.userForm.phone_number = userData.phone_number
    contractorForm.userForm.address = userData.address
    contractorForm.userForm.room_id = userData.room_id
    contractorForm.userForm.city_id = userData.city_id
    contractorForm.userForm.user_status_id = userData.user_status_id
    const { success, message, contractor } = await updateContractor(contractorId.value, contractorForm.dataUpdate, contractorForm.userForm, contractorForm.contractorServicesForm)
    if (success) {
        contractorForm.dataUpdate.id = contractor.id
        // @ts-ignore
        notif.success(`${contractorForm.userForm.first_name} ${contractorForm.userForm.last_name} was updated successfully`)

        return true
    }
    else {
        // @ts-ignore

        notif.error(message)
        return false


    }


})





</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="">
            <div class="form-outer">
                <div class="form-body">
                    <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
                        <div class="load">
                        </div>
                    </VLoader>
                    <div :hidden="isLoading">
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="fieldset-heading">
                                <h4>{{ pageTitle }}</h4>
                            </div>
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="first_name">
                                        <VLabel class="required">First name</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                                autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="first_name" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="last_name">
                                        <VLabel class="required">Last name</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.last_name" type="text" placeholder=""
                                                autocomplete="given-last_name" />
                                            <ErrorMessage class="help is-danger" name="last_name" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <!--Fieldset-->
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="phone_number">
                                        <VLabel class="required">Phone number <span>(+964)</span></VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.phone_number" type="number" placeholder=""
                                                disabled autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="phone_number" />
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-6">
                                    <VField id="birth_date">
                                        <VLabel class="required">Birth date </VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentUser.birth_date" type="date" placeholder=""
                                                autocomplete="given-birth_date" />
                                            <ErrorMessage class="help is-danger" name="birth_date" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="gender">
                                        <VLabel class="required">Gender</VLabel>

                                        <VControl>
                                            <VRadio v-model="currentUser.gender" value="Male" label="Male" name="gender"
                                                color="success" />

                                            <VRadio v-model="currentUser.gender" value="Female" label="Female"
                                                name="gender" color="success" />
                                            <ErrorMessage class="help is-danger" name="gender" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="city_id">
                                        <VLabel class="required">City</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.city_id">
                                                <VOption value="">City</VOption>
                                                <VOption v-for="city in citiesList" :key="city.id" :value="city.id">{{
                                                        city.name
                                                }}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="city_id" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-12">
                                    <VField id="address">
                                        <VLabel class="required">Address </VLabel>
                                        <VControl>
                                            <VTextarea v-model="currentUser.address" />
                                            <ErrorMessage class="help is-danger" name="address" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="room_id">
                                        <VLabel class="optional">Room</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.room_id">
                                                <VOption>Room</VOption>
                                                <VOption v-for="room in roomsList" :key="room.id" :value="room.id">{{
                                                        room.number
                                                }}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="room_id" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="user_status_id">
                                        <VLabel class="required">Status</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentUser" v-model="currentUser.user_status_id">
                                                <VOption value="">Status</VOption>
                                                <VOption v-for="status in statusesList" :key="status.id"
                                                    :value="status.id">
                                                    {{
                                                            status.name
                                                    }}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="user_status_id" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="starting_date">
                                        <VLabel class="required">Starting date </VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentContractor.starting_date" type="date" />
                                            <ErrorMessage class="help is-danger" name="starting_date" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="payment_percentage">
                                        <VLabel class="required">Payment Percentage</VLabel>
                                        <VControl icon="feather:percent">
                                            <VInput v-model="currentContractor.payment_percentage" type="number" />
                                            <ErrorMessage class="help is-danger" name="payment_percentage" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <!--Fieldset-->
                    </div>
                </div>
            </div>
        </form>



    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.Vi {
    width: 28.5em;
}

.required::after {
    content: " *";
    color: var(--danger);
}

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}


.lab {
    margin-left: .77em;
    margin-bottom: .27em;
    display: block;
}

.load {
    height: 400px;
    width: 500px;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}
</style>
