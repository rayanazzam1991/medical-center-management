<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { phoneExistsCheck } from '/@src/services/Others/User/userService';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateCustomer } from '/@src/models/CRM/Customer/customer';
import { City, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { CustomerGroup, defaultCustomerGroupSearchFilter } from '/@src/models/Others/CustomerGroup/customerGroup';
import { Room, defaultRoomSearchFilter } from '/@src/models/Others/Room/room';
import { defaultCreateUpdateUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { addCustomer } from '/@src/services/CRM/Customer/customerService';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { getCustomerGroupsList } from '/@src/services/Others/CustomerGroup/customerGroupService';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { customerAddvalidationSchema } from '/@src/rules/CRM/Customer/customerAddValidation';
import VRadio from '/@src/components/base/form/VRadio.vue';



const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Main Info')
const head = useHead({
    title: 'Customer',
})
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            router.push({
                path: `/customer-add/${customerForm.data.id}/profile-picture`,
            })

        }
    },
})

const route = useRoute()
const router = useRouter()
const notif = useNotyf()
const pageTitle = 'Step 1: Customer Main Info'
const phoneCheck = ref<string>('false')
const currentUser = ref(defaultCreateUpdateUser)
const currentCustomer = ref(defaultCreateCustomer)
const getCurrentCustomer = () => {
    currentUser.value = customerForm.userForm
    currentCustomer.value = customerForm.data
}
const citiesList = ref<City[]>([])
const roomsList = ref<Room[]>([])
const statusesList = ref<UserStatus[]>([])
const customerGroupsList = ref<CustomerGroup[]>([])

onMounted(async () => {
    const { cities } = await getCitiesList(defaultCitySearchFilter)
    citiesList.value = cities
    const { rooms } = await getRoomsList(defaultRoomSearchFilter)
    roomsList.value = rooms
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statusesList.value = userstatuses
    const { customerGroups } = await getCustomerGroupsList(defaultCustomerGroupSearchFilter)
    customerGroupsList.value = customerGroups

})
onMounted(() => {
    getCurrentCustomer()
}
)


const validationSchema = customerAddvalidationSchema

const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        address: "",
        room_id: undefined,
        city_id: "",
        user_status_id: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        customer_group_id: 1
    },
})

const onSubmitAdd = handleSubmit(async (values) => {

    var userData = currentUser.value
    const { result } = await phoneExistsCheck(userData.phone_number)
    phoneCheck.value = result as string
    if (phoneCheck.value === 'false') {
        var customerData = currentCustomer.value
        customerForm.data.emergency_contact_name = customerData.emergency_contact_name
        customerForm.data.emergency_contact_phone = customerData.emergency_contact_phone
        customerForm.data.customer_group_id = customerData.customer_group_id
        customerForm.userForm.first_name = userData.first_name
        customerForm.userForm.last_name = userData.last_name
        customerForm.userForm.password = userData.password
        customerForm.userForm.gender = userData.gender
        customerForm.userForm.birth_date = userData.birth_date
        customerForm.userForm.phone_number = userData.phone_number
        customerForm.userForm.address = userData.address
        customerForm.userForm.room_id = userData.room_id
        customerForm.userForm.city_id = userData.city_id
        customerForm.userForm.user_status_id = userData.user_status_id
        console.log(customerForm.userForm)
        const { customer, message, success } = await addCustomer(customerForm.data, customerForm.userForm)
        if (success) {
            customerForm.data.id = customer.id
            // @ts-ignore
            notif.success(`${customerForm.userForm.first_name} ${customerForm.userForm.last_name} was added successfully`)
            return true
        }
        else {
            // @ts-ignore
            notif.error(message)
            return false
        }

    }
    else {
        return false
    }
})





</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="first_name">
                                    <VLabel class="required">First name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                            autocomplete="given-first_name" />
                                        <ErrorMessage class="help is-danger" name="first_name" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="last_name">
                                    <VLabel class="optional">Last name</VLabel>
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
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="birth_date">
                                    <VLabel class="optional">Birth date </VLabel>
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
                    <div class="form-fieldset">
                        <div class="columns is-multiline ">
                            <label class="lab required">Phone number </label>
                            <div class="columns column is-12">
                                <div class="column is-2 ">
                                    <input class="input" type="text" placeholder="+964" readonly />
                                </div>
                                <VField class="column is-10 " id="phone_number">
                                    <VControl class="Vi"
                                        :class="phoneCheck != 'false' ? 'has-validation has-error' : ''"
                                        icon="feather:chevrons-right">
                                        <VInput type="number" v-model="currentUser.phone_number" />
                                        <ErrorMessage class="help is-danger" name="phone_number" />
                                        <p v-if="phoneCheck != 'false'" class="help is-danger">{{ phoneCheck }}</p>
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
                                    <VLabel class="optional">Address</VLabel>
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
                            <div class="column is-12">
                                <VField id="gender">
                                    <VLabel class="required">Gender</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentUser.gender" value="Male" label="Male" name="gender"
                                            color="success" />

                                        <VRadio v-model="currentUser.gender" value="Female" label="Female" name="gender"
                                            color="success" />
                                        <ErrorMessage class="help is-danger" name="gender" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
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
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
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
                                <VField id="user_status_id">
                                    <VLabel class="required">Status</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser" v-model="currentUser.user_status_id">
                                            <VOption value="">Status</VOption>
                                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">
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
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="emergency_contact_name">
                                    <VLabel class="optional">Emergency Contact Name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentCustomer.emergency_contact_name" type="text"
                                            placeholder="" autocomplete="given-emergency_contact_name" />
                                        <ErrorMessage class="help is-danger" name="emergency_contact_name" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="emergency_contact_phone">
                                    <VLabel class="optional">Emergency Contact Phone</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentCustomer.emergency_contact_phone" type="number"
                                            placeholder="" autocomplete="given-emergency_contact_phone" />
                                        <ErrorMessage class="help is-danger" name="emergency_contact_phone" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="customer_group_id">
                                    <VLabel class="required">Customer Group</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentCustomer" v-model="currentCustomer.customer_group_id">
                                            <VOption v-for="customerGroup in customerGroupsList" :key="customerGroup.id"
                                                :value="customerGroup.id">{{ customerGroup.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="customer_group_id" />
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


.Vi {
    width: 28.5em;
}

.lab {
    margin-left: .77em;
    margin-bottom: .27em;
    display: block;
}

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}
</style>
