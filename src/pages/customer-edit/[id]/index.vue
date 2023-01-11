<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import VRadio from '/@src/components/base/form/VRadio.vue';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateCustomer } from '/@src/models/CRM/Customer/customer';
import { City, CitySearchFilter, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { CustomerGroup, CustomerGroupSearchFilter, defaultCustomerGroupSearchFilter } from '/@src/models/Others/CustomerGroup/customerGroup';
import { Room, defaultRoomSearchFilter, RoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultCreateUpdateUser, UserSearchFilter } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getCustomer, updateCustomer } from '/@src/services/CRM/Customer/customerService';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { getCustomerGroupsList } from '/@src/services/Others/CustomerGroup/customerGroupService';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { customerEditvalidationSchema } from '/@src/rules/CRM/Customer/customerEditValidation';
import sleep from "/@src/utils/sleep"
import { Notyf } from 'notyf';





const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Edit Customer Main Info')
const head = useHead({
    title: 'Customer',
})
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 1,
    canNavigate: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        if (isValid) {
            router.push({
                path: `/customer/${customerForm.dataUpdate.id}`,
            })

        }
    },
})
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const currentUser = ref(defaultCreateUpdateUser)
const currentCustomer = ref(defaultCreateCustomer)
const customerId = ref(0)
// @ts-ignore
customerId.value = route.params.id
const fetchCustomer = async () => {
    const { customer } = await getCustomer(customerId.value)
    currentUser.value.first_name = customer.user.first_name
    currentUser.value.last_name = customer.user.last_name
    currentUser.value.gender = customer.user.gender
    currentUser.value.birth_date = customer.user.birth_date
    currentUser.value.phone_number = customer.user.phone_number
    currentUser.value.address = customer.user.address
    currentUser.value.city_id = customer.user?.city?.id
    currentUser.value.user_status_id = customer.user?.status?.id
    currentUser.value.id = customer.user.id
    customerForm.userForm.room_id = undefined

    currentCustomer.value.customer_group_id = customer.customer_group.id
    currentCustomer.value.emergency_contact_name = customer.emergency_contact_name
    currentCustomer.value.emergency_contact_phone = customer.emergency_contact_phone
    currentCustomer.value.id = customer.id
    if (customer.medical_info)
        currentCustomer.value.medical_info_id = customer.medical_info.id
    currentCustomer.value.social_medias = customer.social_medias
    currentCustomer.value.user = customer.user


    customerForm.userForm.id = customer.user.id
    customerForm.userForm.first_name = currentUser.value.first_name
    customerForm.userForm.last_name = currentUser.value.last_name
    customerForm.userForm.gender = currentUser.value.gender
    customerForm.userForm.birth_date = currentUser.value.birth_date
    customerForm.userForm.phone_number = currentUser.value.phone_number
    customerForm.userForm.address = currentUser.value.address
    customerForm.userForm.city_id = currentUser.value.city_id
    customerForm.userForm.room_id = undefined

    customerForm.userForm.user_status_id = currentUser.value.user_status_id
    customerForm.dataUpdate.emergency_contact_name = currentCustomer.value.emergency_contact_name
    customerForm.dataUpdate.emergency_contact_phone = currentCustomer.value.emergency_contact_phone
    customerForm.dataUpdate.customer_group_id = currentCustomer.value.customer_group_id
    customerForm.dataUpdate.id = currentCustomer.value.id
    customerForm.dataUpdate.user.id = currentUser.value.id
    if (customer.medical_info) {

        customerForm.medicalInfoForm.allergic = customer.medical_info.allergic
        customerForm.medicalInfoForm.any_other_info = customer.medical_info.any_other_info
        customerForm.medicalInfoForm.blood_type = customer.medical_info.blood_type
        customerForm.medicalInfoForm.chronic_diseases = customer.medical_info.chronic_diseases
        customerForm.medicalInfoForm.infectious_diseases = customer.medical_info.infectious_diseases
        customerForm.medicalInfoForm.smoking = customer.medical_info.smoking
        customerForm.medicalInfoForm.id = customer.medical_info.id
    }
    for (let i = 0; i < customer.social_medias.length; i++) {
        // @ts-ignore
        customerForm.customerSocialMediaForm.push({ social_media_id: customer.social_medias[i].id, url: customer.social_medias[i].url })


    }

}

const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])
const customerGroupsList = ref<CustomerGroup[]>([])

onMounted(async () => {
    if (!isLoading.value) {
        isLoading.value = true
        let citySearchFilter = {} as CitySearchFilter
        citySearchFilter.per_page = 500
        const { cities } = await getCitiesList(citySearchFilter)
        citiesList.value = cities
        
        let roomSearchFilter = {} as RoomSearchFilter
        roomSearchFilter.per_page = 500

        const { rooms } = await getRoomsList(roomSearchFilter)
        roomsList.value = rooms

        let userStatusSearchFilter = {} as UserStatusSearchFilter
        userStatusSearchFilter.per_page = 500

        const { userstatuses } = await getUserStatusesList(userStatusSearchFilter)
        statusesList.value = userstatuses

        let customerGroupSearchFilter = {} as CustomerGroupSearchFilter
        customerGroupSearchFilter.per_page = 500

        const { customerGroups } = await getCustomerGroupsList(customerGroupSearchFilter)
        customerGroupsList.value = customerGroups
        await fetchCustomer()
        isLoading.value = false

    }
})



const validationSchema = customerEditvalidationSchema

const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        first_name: currentUser.value.first_name,
        last_name: currentUser.value.last_name,
        gender: currentUser.value.gender,
        birth_date: currentUser.value.birth_date,
        phone_number: currentUser.value.phone_number,
        address: currentUser.value.address,
        city_id: currentUser.value.city_id,
        user_status_id: currentUser.value.user_status_id,
        emergency_contact_name: currentCustomer.value.emergency_contact_name,
        emergency_contact_phone: currentCustomer.value.emergency_contact_phone,
        customer_group_id: currentCustomer.value.customer_group_id
    },
})


const onSubmitEdit = handleSubmit(async (values) => {

    var userData = currentUser.value
    var customerData = currentCustomer.value
    customerForm.dataUpdate.emergency_contact_name = customerData.emergency_contact_name
    customerForm.dataUpdate.emergency_contact_phone = customerData.emergency_contact_phone
    customerForm.dataUpdate.customer_group_id = customerData.customer_group_id

    customerForm.userForm.first_name = userData.first_name
    customerForm.userForm.last_name = userData.last_name
    customerForm.userForm.password = userData.password
    customerForm.userForm.gender = userData.gender
    customerForm.userForm.birth_date = userData.birth_date
    customerForm.userForm.phone_number = userData.phone_number
    customerForm.userForm.address = userData.address
    customerForm.userForm.city_id = userData.city_id
    customerForm.userForm.user_status_id = userData.user_status_id
    const { customer, success, message } = await updateCustomer(customerId.value, customerForm.dataUpdate, customerForm.userForm, customerForm.medicalInfoForm, customerForm.customerSocialMediaForm)
    if (success) {
        customerForm.dataUpdate.id = customer.id
        // @ts-ignore
        await sleep(200);

        notif.success(`${customerForm.userForm.first_name} ${customerForm.userForm.last_name} was updated successfully`)

        return true
    }
    else {
        // @ts-ignore
        await sleep(200);

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
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="phone_number">
                                        <VLabel class="required">Phone number <span>(+964)</span></VLabel>
                                        <VControl icon="feather:chevrons-right">

                                            <VInput disabled v-model="currentUser.phone_number" type="number"
                                                placeholder="" autocomplete="given-first_name" />
                                            <ErrorMessage class="help is-danger" name="phone_number" />
                                        </VControl>
                                    </VField>
                                </div>

                                <div class="column is-6">
                                    <VField id="birth_date">
                                        <VLabel>Birth date </VLabel>
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
                                        <VLabel class="">Gender</VLabel>
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
                                        <VLabel>City</VLabel>
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
                                        <VLabel>Address </VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VTextarea v-model="currentUser.address" />
                                            <ErrorMessage class="help is-danger" name="address" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
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
                                <div class="column is-6">
                                    <VField id="customer_group_id">
                                        <VLabel class="required">Customer Group</VLabel>
                                        <VControl>
                                            <VSelect v-if="currentCustomer" v-model="currentCustomer.customer_group_id">
                                                <VOption v-for="customerGroup in customerGroupsList"
                                                    :key="customerGroup.id" :value="customerGroup.id">{{
        customerGroup.name
}}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="customer_group_id" />
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                        </div>
                        <div class="form-fieldset">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <VField id="emergency_contact_name">
                                        <VLabel>Emergency Contact Name</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentCustomer.emergency_contact_name" type="text"
                                                placeholder="" autocomplete="given-emergency_contact_name" />
                                            <ErrorMessage class="help is-danger" name="emergency_contact_name" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-6">
                                    <VField id="emergency_contact_phone">
                                        <VLabel>Emergency Contact Phone</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput v-model="currentCustomer.emergency_contact_phone" type="number"
                                                placeholder="" autocomplete="given-emergency_contact_phone" />
                                            <ErrorMessage class="help is-danger" name="emergency_contact_phone" />
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
    padding-bottom: 72px;

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
