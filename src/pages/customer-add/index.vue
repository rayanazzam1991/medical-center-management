<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { phoneExistsCheck } from '/@src/services/Others/User/userService';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateCustomer } from '/@src/models/CRM/Customer/customer';
import { City, CitySearchFilter, defaultCitySearchFilter } from '/@src/models/Others/City/city';
import { CustomerGroup, CustomerGroupSearchFilter, defaultCustomerGroupSearchFilter } from '/@src/models/Others/CustomerGroup/customerGroup';
import { defaultCreateUpdateUser, UserSearchFilter } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter, UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { addCustomer } from '/@src/services/CRM/Customer/customerService';
import { getCitiesList } from '/@src/services/Others/City/cityService';
import { getCustomerGroupsList } from '/@src/services/Others/CustomerGroup/customerGroupService';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { customerAddvalidationSchema } from '/@src/rules/CRM/Customer/customerAddValidation';
import VRadio from '/@src/components/base/form/VRadio.vue';
import sleep from "/@src/utils/sleep"
import { BaseConsts } from '/@src/utils/consts/base';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';


const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('customer.form.step_1_title'))
const head = useHead({
    title: t('customer.form.page_title'),
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
                path: `/customer-add/${customerForm.data.id}/medical-info`,
            })

        }
    },
})

const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const pageTitle = t('customer.form.step_1_subtitle')
const phoneCheck = ref<string>('false')
const currentUser = ref(defaultCreateUpdateUser)
const currentCustomer = ref(defaultCreateCustomer)
const getCurrentCustomer = () => {
    currentUser.value = customerForm.userForm
    currentCustomer.value = customerForm.data
}
const citiesList = ref<City[]>([])
const statusesList = ref<UserStatus[]>([])
const customerGroupsList = ref<CustomerGroup[]>([])

onMounted(() => {
    getCurrentCustomer()
}
)
onMounted(async () => {
    let citySearchFilter = {} as CitySearchFilter
    citySearchFilter.status = BaseConsts.ACTIVE
    citySearchFilter.per_page = 500
    const { cities } = await getCitiesList(citySearchFilter)
    citiesList.value = cities
    let userStatusSearchFilter = {} as UserStatusSearchFilter
    userStatusSearchFilter.per_page = 500

    const { userstatuses } = await getUserStatusesList(userStatusSearchFilter)
    statusesList.value = userstatuses


    let customerGroupSearchFilter = {} as CustomerGroupSearchFilter
    customerGroupSearchFilter.status = BaseConsts.ACTIVE
    customerGroupSearchFilter.per_page = 500
    const { customerGroups } = await getCustomerGroupsList(customerGroupSearchFilter)
    customerGroupsList.value = customerGroups

    currentUser.value.user_status_id = UserStatusConsts.ACTIVE
    currentCustomer.value.customer_group_id = getNormalCustomerGroupId()


})

const getNormalCustomerGroupId = () => {
    const NormalGroup = customerGroupsList.value.find((group) => group.name === "Normal")
    return NormalGroup?.id
}

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
        city_id: undefined,
        user_status_id: currentUser.value.user_status_id,
        emergency_contact_name: "",
        emergency_contact_phone: "",
        customer_group_id: currentCustomer.value.customer_group_id,
        room_id: undefined
    },
})

const onSubmitAdd = handleSubmit(async (values) => {

    var userData = currentUser.value
    const { result } = await phoneExistsCheck('964' + userData.phone_number)
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
        customerForm.userForm.city_id = userData.city_id
        customerForm.userForm.room_id = undefined
        customerForm.userForm.user_status_id = userData.user_status_id
        const { customer, message, success } = await addCustomer(customerForm.data, customerForm.userForm)
        if (success) {
            customerForm.data.id = customer.id

            await sleep(200);

            notif.success(t('toast.success.add'))
            return true
        }
        else {
            await sleep(200);


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
                            <div class="column is-6">
                                <VField id="first_name">
                                    <VLabel class="required">{{ t('customer.form.first_name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentUser.first_name" type="text" placeholder=""
                                            autocomplete="given-first_name" />
                                        <ErrorMessage class="help is-danger" name="first_name" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="last_name">
                                    <VLabel class="required">{{ t('customer.form.last_name') }}</VLabel>
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
                                    <VLabel class="required">{{ t('customer.form.phone_number') }} <span>(+964)</span>
                                    </VLabel>
                                    <VControl icon="feather:chevrons-right"
                                        :class="phoneCheck != 'false' ? 'has-validation has-error' : ''">
                                        <VInput v-model="currentUser.phone_number" type="number" placeholder=""
                                            autocomplete="given-first_name" />
                                        <ErrorMessage class="help is-danger" name="phone_number" />
                                        <p v-if="phoneCheck != 'false'" class="help is-danger">{{ phoneCheck }}</p>

                                    </VControl>
                                </VField>
                            </div>

                            <div class="column is-6">
                                <VField id="birth_date">
                                    <VLabel>{{ t('customer.form.birth_date') }} </VLabel>
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
                                    <VLabel class="">{{ t('customer.form.gender') }}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentUser.gender" value="Male" :label="t('gender.male')"
                                            name="gender" color="success" />

                                        <VRadio v-model="currentUser.gender" value="Female" :label="t('gender.female')"
                                            name="gender" color="success" />
                                        <ErrorMessage class="help is-danger" name="gender" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="city_id">
                                    <VLabel>{{ t('customer.form.city') }}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser" v-model="currentUser.city_id">
                                            <VOption value="">{{ t('customer.form.city') }}</VOption>
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
                                    <VLabel>{{ t('customer.form.address') }} </VLabel>
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
                                    <VLabel class="required">{{ t('customer.form.status') }}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentUser" v-model="currentUser.user_status_id">
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
                            <div class="column is-6">
                                <VField id="customer_group_id">
                                    <VLabel class="required">{{ t('customer.form.customer_group') }}</VLabel>
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
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="emergency_contact_name">
                                    <VLabel>{{ t('customer.form.emergency_contract_name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentCustomer.emergency_contact_name" type="text"
                                            placeholder="" autocomplete="given-emergency_contact_name" />
                                        <ErrorMessage class="help is-danger" name="emergency_contact_name" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="emergency_contact_phone">
                                    <VLabel>{{ t('customer.form.emergency_contract_phone') }}</VLabel>
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
    padding-bottom: 72px;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}
</style>
