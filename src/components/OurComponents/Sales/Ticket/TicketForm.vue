<script lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useForm, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountSearchFilter, AccountConsts } from '/@src/models/Accounting/Account/account';
import { Currency, CurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { Customer, CustomerSearchFilter } from '/@src/models/CRM/Customer/customer';
import { UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { defaultCreateTicket, defaultTicket } from '/@src/models/Sales/Ticket/ticket';
import { CreateTicketService, CreateTicketServiceHelper } from '/@src/models/Sales/TicketService/ticketService';
import { ticketValidationSchema } from '/@src/rules/Sales/Ticket/ticketValidationSchema';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { getCustomersList } from '/@src/services/CRM/Customer/customerService';
import { useTicket } from '/@src/stores/Sales/Ticket/ticketStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import debounce from 'lodash.debounce';
import { emit } from 'process';
import { ServiceWithProvider } from '/@src/models/Others/Service/service';
import { getServicesWithProviders } from '/@src/services/Others/Service/serviceService';
import { createTicket, getTicket } from '/@src/services/Sales/Ticket/ticketService';
import sleep from '/@src/utils/sleep';

export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit", 'input-finished'],
    setup(props, context) {
        const { t } = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('ticket.form.page_title'));
        const head = useHead({
            title: t('ticket.form.page_title'),
        });
        const ticketStore = useTicket()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('ticket.form.form_header', { type: formTypeName });
        const backRoute = "/ticket";
        const currentTicket = ref(defaultCreateTicket);
        const ticketId = ref(0);
        const requestedServicesHelper = ref<CreateTicketServiceHelper[]>([]);
        const servicesWithProviders = ref<ServiceWithProvider[]>([]);
        const enableCurrencyRate = ref(false)
        // @ts-ignore
        ticketId.value = route.params?.id as number ?? 0;

        const customersList = ref<Customer[]>([])
        const currenciesList = ref<Currency[]>([])
        const cashAccountsList = ref<Account[]>([])

        const getCurrentTicket = async () => {
            const { ticket } = await getTicket(ticketId.value);
            // console.log(ticket)
            currentTicket.value.cash_account_id = ticket.cash_account.id ?? 0
            currentTicket.value.currency_id = ticket.currency.id
            currentTicket.value.currency_rate = ticket.currency_rate
            currentTicket.value.customer_id = ticket.customer.id ?? 0
            currentTicket.value.paid_amount = ticket.paid_amount
            currentTicket.value.remaining_amount = ticket.remaining_amount
            currentTicket.value.total_amount = ticket.total_amount

            ticket.requested_services.forEach(service => {
                requestedServicesHelper.value.push({ sell_price: service.sell_price, service_id: service.service.id ?? 0, service_provider_id: service.service_provider_id })

            });

            updateTotalAmount()
        };

        onMounted(async () => {
            getCurrentTicket();
            if (formType.value == 'Add')
                addService({ sell_price: 0, service_provider_id: 0, service_id: 0 } as CreateTicketServiceHelper)

            const customerSearchFilter = {
                user_status_id: UserStatusConsts.ACTIVE,
                per_page: 500
            } as CustomerSearchFilter
            const { customers } = await getCustomersList(customerSearchFilter)
            customersList.value = customers


            const currencySearchFilter = {
                per_page: 500
            } as CurrencySearchFilter
            const { currencies } = await getCurrenciesList(currencySearchFilter)
            currenciesList.value = currencies
            if (formType.value == 'Add')
                currentTicket.value.currency_id = currenciesList.value.find((currency) => currency.is_main)?.id ?? 0


            const accountSearchFilter = {
                per_page: 500
            } as AccountSearchFilter
            const { accounts } = await getAccountsList(accountSearchFilter)
            accounts.forEach((account) => {
                if (account.chart_account?.code == AccountConsts.CASH_CODE) {
                    cashAccountsList.value.push(account)
                }
            });

            const { services } = await getServicesWithProviders()
            servicesWithProviders.value = services


        });
        const addService = (service: CreateTicketServiceHelper) => {
            requestedServicesHelper.value?.push(service)
        }
        const updatePrice = (service: CreateTicketServiceHelper, index: number) => {
            const serviceWithProvider = servicesWithProviders.value.find((serviceElm) => serviceElm.id == service.service_id)
            const provider = serviceWithProvider?.providers.find((serviceProvider) => serviceProvider.id == service.service_provider_id)
            service.sell_price = provider?.price ?? 0
            updateTotalAmount()
        }
        const removeService = (index: number) => {
            if (index !== -1) {
                requestedServicesHelper.value.splice(index, 1);
                updateTotalAmount()
            }
        }
        const updateTotalAmount = () => {
            debouncedTotalAmount();
            updateRemainingAmount()
        };
        const updateCurrencyRate = () => {
            const currency = currenciesList.value.find((currencyElm) => currencyElm.id == currentTicket.value.currency_id)
            currentTicket.value.currency_rate = currency?.rate ?? 1
            if (!currency?.is_main)
                enableCurrencyRate.value = true
            else enableCurrencyRate.value = false
        }


        const debouncedTotalAmount = debounce(() => {
            currentTicket.value.total_amount = 0
            requestedServicesHelper.value.forEach((element) => {
                currentTicket.value.total_amount += element.sell_price
            })
            context.emit('input-finished', currentTicket.value.total_amount);
        }, 100);
        const updateRemainingAmount = debounce(() => {
            currentTicket.value.remaining_amount = currentTicket.value.total_amount - currentTicket.value.paid_amount
        }, 100)
        const setCustomerIdValue = () => {
            setFieldValue('customer_id', currentTicket.value.customer_id)
        }


        const validationSchema = ticketValidationSchema
        const { handleSubmit, setFieldValue } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                // customer_id: currentTicket.value.customer_id,
                // total_amount: currentTicket.value.total_amount,
                // remaining_amount: 0,
                // paid_amount: 0,
                // cash_account_id: 0,
                // currency_rate: 1

                // name: currentVariablePayment?.value?.name ?? "",
                // type: currentVariablePayment?.value?.type ?? VariablePaymentConsts.INCREMENT_TYPE,
                // status: currentVariablePayment?.value?.status ?? VariablePaymentConsts.ACTIVE,
            } : {
                customer_id: 0,
                total_amount: 0,
                remaining_amount: 0,
                paid_amount: 0,
                cash_account_id: 0,
                currency_rate: 1
            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            } else if (method == "Edit") {
                // await onSubmitEdit();
            } else
                return;
        };
        const validateRequestedServices = () => {
            let serviceError = false
            let serviceProviderError = false
            let servicePriceError = false
            if (requestedServicesHelper.value.length == 0) {
                notif.error({ message: t('toast.error.ticket.no_services_error'), duration: 3000 })
                return false

            }

            requestedServicesHelper.value.forEach((service) => {
                if (service.service_id == 0) {
                    notif.error({ message: t('toast.error.ticket.service_is_required'), duration: 3000 })
                    serviceError = true
                }
            });
            if (serviceError)
                return false


            requestedServicesHelper.value.forEach((service) => {
                if (service.service_provider_id == 0) {
                    const serviceProvider = servicesWithProviders.value.find((serviceWithProvider) => service.service_id == serviceWithProvider.id)
                    notif.error({ message: t('toast.error.ticket.service_provider_is_required', { service_name: serviceProvider?.name }), duration: 3000 })
                    serviceProviderError = true
                }
            });
            if (serviceProviderError)
                return false

            requestedServicesHelper.value.forEach((service) => {
                if (service.sell_price <= 0 || Number.isNaN(service.sell_price)) {
                    const serviceProvider = servicesWithProviders.value.find((serviceWithProvider) => service.service_id == serviceWithProvider.id)
                    notif.error({ message: t('toast.error.ticket.service_price_is_invalid', { service_name: serviceProvider?.name }), duration: 3000 })
                    serviceProviderError = true
                }
            });
            if (serviceProviderError)
                return false

            let requestedServices = requestedServicesHelper.value.map(function (item) { return item.service_id });
            let isDuplicate = requestedServices.some(function (item, idx) {
                return requestedServices.indexOf(item) != idx
            });
            if (isDuplicate) {
                notif.error(t('toast.error.ticket.services_is_duplicated'))
                return false
            }
            return true
        }
        const onSubmitAdd = handleSubmit(async (values) => {
            currentTicket.value.requested_services = []
            const isValid = validateRequestedServices()
            if (!isValid)
                return

            requestedServicesHelper.value.forEach((service) => {
                currentTicket.value.requested_services.push({ sell_price: service.sell_price, service_provider_id: service.service_provider_id })
            });
            const { success, message, ticket } = await createTicket(currentTicket.value)
            if (success) {
                await sleep(200);

                notif.success(t('toast.success.add_ticket', { ticket_id: ticket.id }))
                currentTicket.value.requested_services = []

                router.push({ path: "/ticket" });
            }
            else {
                currentTicket.value.requested_services = []

                await sleep(200);

                notif.error(message)

            }


        });
        // const onSubmitEdit = async () => {
        //     let variablePaymentData = defaultUpdateVariablePayment
        //     if (currentVariablePayment.value.name !== originalVariablePaymentName.value) {
        //         variablePaymentData.name = currentVariablePayment.value.name
        //     }
        //     else {
        //         variablePaymentData.name = undefined

        //     }
        //     if (currentVariablePayment.value.status !== originalVariablePaymentStatus.value) {
        //         variablePaymentData.status = currentVariablePayment.value.status

        //     } else {
        //         variablePaymentData.status = undefined

        //     }
        //     variablePaymentData.type = currentVariablePayment.value.type

        //     const { message, success } = await editVariablePayment(variablePaymentId.value, variablePaymentData);
        //     if (success) {

        //         // @ts-ignore
        //         notif.dismissAll();
        //         await sleep(200);

        //         // @ts-ignore
        //         notif.success(t('toast.success.edit'));
        //         router.push({ path: `/variable-payment` });
        //     } else {
        //         await sleep(200);

        //         notif.error({ message: message, duration: 5000 })

        //     }
        // };

        return { t, pageTitle, onSubmit, currentTicket, customersList, viewWrapper, backRoute, ticketStore, updateRemainingAmount, enableCurrencyRate, setCustomerIdValue, updateCurrencyRate, addService, removeService, updatePrice, UserStatusConsts, updateTotalAmount, cashAccountsList, currenciesList, servicesWithProviders, getCustomersList, requestedServicesHelper };
    },
    components: { ErrorMessage }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="ticketStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="customer_id">
                                    <VLabel class="required">{{ t('ticket.form.customer') }}</VLabel>
                                    <VControl>
                                        <Multiselect v-if="formType == 'Add'" v-model="currentTicket.customer_id"
                                            mode="single" :placeholder="t('ticket.form.select_customer')"
                                            :close-on-select="true" ref="customer_id" @select="setCustomerIdValue()"
                                            :filter-results="false" :min-chars="0" :resolve-on-load="false" :infinite="true"
                                            :limit="50" :rtl="true" :max="1" :clear-on-search="true" :delay="0"
                                            :searchable="true" :canClear="false" :options="async (query: any) => {
                                                let customerSearchFilter = {
                                                    user_status_id: UserStatusConsts.ACTIVE,
                                                    name: query,
                                                } as CustomerSearchFilter
                                                //@ts-ignore
                                                const data = await getCustomersList(customerSearchFilter)

                                                //@ts-ignore
                                                return data.customers.map((customer: Customer) => {
                                                    return { value: customer.id, label: customer.user.first_name + ' ' + customer.user.last_name }
                                                })
                                            }" @open="(select$: any) => {
    if (select$.noOptions) {
        select$.resolveOptions()
    }
}" />
                                        <VSelect disabled v-else v-model="currentTicket.customer_id">

                                            <VOption v-for="customer in customersList" :value="customer.id">
                                                {{ customer.user.first_name }} {{ customer.user.last_name }}
                                            </VOption>
                                        </VSelect>

                                    </VControl>
                                    <ErrorMessage class="help is-danger" name="customer_id" />
                                </VField>
                            </div>
                            <div class="column is-12 pb-0">
                                <p class="required label is-size-6">{{ t('ticket.form.services') }}</p>

                                <div class="columns mb-0" v-for="(record, mainIndex) in requestedServicesHelper"
                                    :key="mainIndex">
                                    <div class="column is-4">
                                        <div class="mb-3">
                                            <VField>
                                                <VLabel v-if="mainIndex == 0" class="required">
                                                    {{ t('ticket.form.select_service') }}</VLabel>
                                                <VControl>
                                                    <VSelect v-model="requestedServicesHelper[mainIndex].service_id">
                                                        <VOption :value="0"> {{ t('ticket.form.select_service')
                                                        }}</VOption>

                                                        <VOption v-for="service in servicesWithProviders"
                                                            :value="service.id">
                                                            {{ service.name }}
                                                        </VOption>
                                                    </VSelect>
                                                </VControl>
                                            </VField>
                                        </div>
                                    </div>
                                    <div class="column is-4">
                                        <div class="mb-3">
                                            <VField>
                                                <VLabel v-if="mainIndex == 0" class="required">
                                                    {{ t('ticket.form.select_provider') }}</VLabel>
                                                <VControl>
                                                    <div class="select">

                                                        <select @change="updatePrice(record, mainIndex)"
                                                            v-model="requestedServicesHelper[mainIndex].service_provider_id">
                                                            <option :value="0"> {{ t('ticket.form.select_provider')
                                                            }}</option>

                                                            <option
                                                                v-for="serviceProvider in servicesWithProviders.find((service) => service.id == requestedServicesHelper[mainIndex].service_id)?.providers"
                                                                :value="serviceProvider.id">
                                                                {{ serviceProvider.provider.user.first_name }} {{
                                                                    serviceProvider.provider.user.last_name }}
                                                            </option>
                                                        </select>
                                                    </div>
                                                </VControl>
                                            </VField>
                                        </div>
                                    </div>
                                    <div class="column is-4">
                                        <div class="mb-3">
                                            <VField>
                                                <VLabel v-if="mainIndex == 0" class="required">
                                                    {{ t('ticket.form.sell_price') }}</VLabel>
                                                <VControl>
                                                    <VInput @input="() => updateTotalAmount()" type="number"
                                                        v-model.number="requestedServicesHelper[mainIndex].sell_price" />
                                                </VControl>
                                            </VField>
                                        </div>
                                    </div>
                                    <div class="column is-1 columns is-flex is-align-items-center">
                                        <div class="mb-3 column is-6">
                                            <VField v-if="mainIndex != 0">
                                                <VControl>
                                                    <VIconButton icon="feather:trash-2" class="remove_btn"
                                                        @click="removeService(mainIndex)" color="danger">
                                                    </VIconButton>
                                                </VControl>
                                            </VField>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="column is-12 pt-0">

                                <VButton @click.prevent="addService({
                                    service_id: 0,
                                    sell_price: 0,
                                    service_provider_id: 0,
                                })" color="primary">
                                    {{ t('ticket.form.add_new_service') }}
                                </VButton>
                            </div>

                            <div class="column is-6">
                                <VField id="total_amount">
                                    <VLabel class="required">{{ t('ticket.form.total_amount') }}</VLabel>
                                    <VControl>
                                        <VInput disabled v-model="currentTicket.total_amount" placeholder=""
                                            type="number" />
                                        <ErrorMessage class="help is-danger" name="total_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="cash_account_id">
                                    <VLabel class="required">{{ t('ticket.form.cash_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="currentTicket.cash_account_id">
                                            <VOption :value="0"> {{ t('ticket.form.select_cash_account')
                                            }}</VOption>
                                            <VOption v-for="account in cashAccountsList" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="cash_account_id" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="currency_id">
                                    <VLabel class="required">{{ t('ticket.form.currency') }}</VLabel>
                                    <VControl>
                                        <VSelect @change="updateCurrencyRate" v-model="currentTicket.currency_id">

                                            <VOption v-for="currency in currenciesList" :value="currency.id">
                                                {{ currency.code }} - {{ currency.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="currency_id" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="currency_rate" v-slot="{ field }">
                                    <VLabel class="required">{{ t('ticket.form.currency_rate') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput :disabled="!enableCurrencyRate" v-model="currentTicket.currency_rate"
                                            placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="currency_rate" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="paid_amount">
                                    <VLabel class="required">{{ t('ticket.form.paid_amount') }}</VLabel>
                                    <VControl>
                                        <VInput @input="updateRemainingAmount" v-model="currentTicket.paid_amount"
                                            placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="paid_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="remaining_amount">
                                    <VLabel class="required">{{ t('ticket.form.remaining_amount') }}</VLabel>
                                    <VControl>
                                        <VInput disabled v-model="currentTicket.remaining_amount" placeholder=""
                                            type="number" />
                                        <ErrorMessage class="help is-danger" name="remaining_amount" />
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
<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';

.form-fieldset {
    max-width: 60%;
}

.label {
    font-family: var(--font);
    font-size: 0.9rem;
    color: var(--light-text) !important;
    font-weight: 400;
}
</style>
