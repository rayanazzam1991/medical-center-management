<script setup  lang="ts">

import VRadio from '/@src/components/base/form/VRadio.vue';

import { z as zod } from 'zod'
import { toFormValidator } from '@vee-validate/zod';
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { getCustomerGroupsList } from '/@src/composable/Others/CustomerGroup/getCustomerGroupsList';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { defaultCreateUpdateCustomer } from '/@src/stores/CRM/Customer/customerStore';
import { defaultCustomerGroupSearchFilter } from '/@src/stores/Others/CustomerGroup/customerGroupStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { CustomerGroup } from '/@src/utils/api/Others/CustomerGroup';


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Additional Info')
const head = useHead({
    title: 'Customer',
})
// const notif = useNotyf()
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 2,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            router.push({
                name: '/customer-add/profile-picture',
            })

        }
    },
    previousStepFn: async () => {
        router.push({
            name: '/customer-add/',
        })
    },
    skipStepFn: async () => {
        console.log('test', customerForm.data)
        currentCustomer.value.customer_group_id = undefined
        currentCustomer.value.emergency_contact_name = undefined
        currentCustomer.value.emergency_contact_phone = undefined

        router.push({
            name: '/customer-add/profile-picture'
        })
    }

})

const route = useRoute()
const router = useRouter()

const pageTitle = 'Step 2: Customer Additional Info'
const currentCustomer = ref(defaultCreateUpdateCustomer)
const getCurrentCustomer = () => {

    currentCustomer.value = customerForm.data



}
const customerGroups2 = ref<CustomerGroup[]>([])
onMounted(async () => {
    const { customerGroups } = await getCustomerGroupsList(defaultCustomerGroupSearchFilter)
    customerGroups2.value = customerGroups
})

onMounted(() => {
    getCurrentCustomer()
}
)


const validationSchema = toFormValidator(zod
    .object({
        emergency_contact_name:
            zod
                .string({
                    required_error: "This field is required",
                })
                .min(1, "This field is required"),
        emergency_contact_phone:
            zod
                .preprocess(
                    (input) => {
                        const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                        return processed.success ? processed.data : input;
                    },
                    zod
                        .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                        .min(9, "Please enter a valid number"),
                ),
        customer_group_id: zod
            .preprocess(
                (input) => {
                    const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                    return processed.success ? processed.data : input;
                },
                zod
                    .number({ required_error: 'This field is required', invalid_type_error: "This field is required" })
                    .min(1, "This field is required"),
            ),
    }));

const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        emergency_contact_name: currentCustomer.value.emergency_contact_name,
        emergency_contact_phone: currentCustomer.value.emergency_contact_phone,
        customer_group_id: currentCustomer.value.customer_group_id,
    },
})

const onSubmitAdd = handleSubmit(async (values) => {
    var customerData = currentCustomer.value
    customerForm.data.emergency_contact_name = customerData.emergency_contact_name
    customerForm.data.emergency_contact_phone = customerData.emergency_contact_phone
    customerForm.data.customer_group_id = customerData.customer_group_id

    return true

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
                                <VField id="emergency_contact_name">
                                    <VLabel>Emergency Contact Name</VLabel>
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
                                    <VLabel>Emergency Contact Phone</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentCustomer.emergency_contact_phone" type="text"
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
                                    <VLabel>Customer Group</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentCustomer" v-model="currentCustomer.customer_group_id">
                                            <VOption value="">Customer Group</VOption>
                                            <VOption v-for="customerGroup in customerGroups2" :key="customerGroup.id"
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

.is-navbar {
    .form-layout {
        margin-top: 30px;
    }
}

.filter {
    margin: 1rem;
}

.justify-content {
    display: flex;
    align-items: baseline;
}

.form-layout {
    &.is-split {
        max-width: 840px;

        .form-outer {
            .form-body {
                padding: 0;
                width: 100%;

                .form-section {
                    display: flex;
                    padding: 20px;

                    &.is-grey {
                        background: #fafafa;
                    }

                    .left,
                    .right {
                        padding: 20px 40px;
                        width: 50%;

                        h3 {
                            font-family: var(--font-alt);
                            font-weight: 600;
                            font-size: 0.95rem;
                            color: var(--dark-text);
                            margin-bottom: 20px;
                        }
                    }


                    .left {
                        width: 20%;
                        position: relative;
                        border-right: 1px solid var(--fade-grey-dark-3);

                        .operator {
                            position: absolute;
                            top: 17px;
                            right: -10px;
                            text-transform: uppercase;
                            font-family: var(--font);
                            font-weight: 500;
                            color: var(--dark-text);
                            background: var(--white);
                            padding: 4px 0;
                        }
                    }

                    .radio-pills {
                        display: flex;
                        justify-content: space-between;

                        .radio-pill {
                            position: relative;

                            input {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: 100%;
                                opacity: 0;
                                cursor: pointer;

                                &:checked {
                                    +.radio-pill-inner {
                                        background: var(--primary);
                                        border-color: var(--primary);
                                        box-shadow: var(--primary-box-shadow);
                                        color: var(--white);
                                    }
                                }
                            }

                            .radio-pill-inner {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 60px;
                                height: 40px;
                                background: var(--white);
                                border: 1px solid var(--fade-grey-dark-3);
                                border-radius: 8px;
                                font-family: var(--font);
                                font-weight: 600;
                                font-size: 0.9rem;
                                transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                                    height 0.3s, width 0.3s;
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        &.is-grey {
                            background: var(--dark-sidebar-light-4) !important;
                        }

                        h3 {
                            color: var(--dark-dark-text);
                        }

                        .left {
                            border-color: var(--dark-sidebar-light-12) !important;

                            .operator {
                                background: var(--dark-sidebar-light-6) !important;
                                color: var(--dark-dark-text);
                            }

                            .radio-pills {
                                .radio-pill {
                                    input {
                                        &:checked+.radio-pill-inner {
                                            border-color: var(--primary);
                                            background: var(--primary);
                                            box-shadow: var(--primary-box-shadow);
                                            color: var(--smoke-white);
                                        }
                                    }

                                    .radio-pill-inner {
                                        background: var(--dark-sidebar-light-2);
                                        border-color: var(--dark-sidebar-light-12);
                                        color: var(--dark-dark-text);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        flex-direction: column;
                        padding-right: 0;
                        padding-left: 0;

                        .left,
                        .right {
                            width: 100%;
                            padding-right: 30px;
                            padding-left: 30px;
                        }


                        .left {
                            border-right: none;
                            border-bottom: 1px solid var(--fade-grey-dark-3);
                            padding-bottom: 40px;

                            .operator {
                                top: unset;
                                bottom: -14px;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                                text-align: center;
                                max-width: 60px;
                            }
                        }

                        .right {
                            padding-top: 30px;
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        padding-right: 0;
                        padding-left: 0;
                    }
                }
            }
        }
    }
}
</style>
