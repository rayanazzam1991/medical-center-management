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
import { defaultCreateTicket, defaultConfirmPaymentTicket, ConfirmPaymentTicket } from '/@src/models/Sales/Ticket/ticket';
import { CreateTicketServiceHelper, TicketServiceConsts } from '/@src/models/Sales/TicketService/ticketService';
import { confirmPaymentTicketValidationSchema } from '/@src/rules/Sales/Ticket/confirmPaymentTicketValidationSchema';
import { getAccountsList, getAuthenticatedCashierAccounts } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { getCustomersList } from '/@src/services/CRM/Customer/customerService';
import { useTicket } from '/@src/stores/Sales/Ticket/ticketStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import debounce from 'lodash.debounce';
import { ServiceWithProvider } from '/@src/models/Others/Service/service';
import { getServicesWithProviders } from '/@src/services/Others/Service/serviceService';
import { createTicket, getTicket, confirmPaymentTicket } from '/@src/services/Sales/Ticket/ticketService';
import { UpdateTicket } from '/@src/models/Sales/Ticket/ticket';
import sleep from '/@src/utils/sleep';
import { useAuth } from '/@src/stores/Others/User/authStore';

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
    viewWrapper.setPageTitle(t('ticket.form.confirm_payment.page_title'));
    const head = useHead({
      title: t('ticket.form.confirm_payment.page_title'),
    })
    const route = useRoute();
    const ticketId = ref(0);
    // @ts-ignore
    ticketId.value = route.params?.id as number ?? 0;
    const ticketStore = useTicket()
    const notif = useNotyf() as Notyf;
    const formType = ref("");
    formType.value = props.formType;
    const router = useRouter();
    const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('ticket.form.confirm_payment.edit_form_header', { ticket_id: ticketId.value });
    const backRoute = "/pending-ticket";
    const currentTicket = ref(defaultCreateTicket);
    const currentConfirmPayment = ref(defaultConfirmPaymentTicket);
    const requestedServicesHelper = ref<CreateTicketServiceHelper[]>([]);
    const servicesWithProviders = ref<ServiceWithProvider[]>([]);
    const enableCurrencyRate = ref(false)
    const customersList = ref<Customer[]>([])
    const currenciesList = ref<Currency[]>([])
    const cashAccountsList = ref<Account[]>([])
    const isLoading = ref(false)
    const userAuth = useAuth();
    const haveCashierRole = userAuth.getUser()?.roles?.find((role) => role.name == 'Cashier')
    const isCashier = haveCashierRole ? true : false

    const getCurrentTicket = async () => {
      if (ticketId.value > 0) {

        const { ticket } = await getTicket(ticketId.value);

        currentTicket.value.customer_id = ticket.customer.id ?? 0
        currentTicket.value.total_amount = ticket.total_amount

        ticket.requested_services.forEach(service => {
          requestedServicesHelper.value.push({ sell_price: service.sell_price, service_id: service.service.id ?? 0, service_provider_id: service.service_provider_id, editable: service.status == TicketServiceConsts.NOT_SERVED })
        });
        updateTotalAmount()

      }
    }
    onMounted(async () => {
      isLoading.value = true
      if (isCashier) {
        const { cashierAccounts } = await getAuthenticatedCashierAccounts()
        cashAccountsList.value = cashierAccounts
      }

      getCurrentTicket();
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

      const accountSearchFilter = {
        per_page: 500
      } as AccountSearchFilter
      const { accounts } = await getAccountsList(accountSearchFilter)
      accounts.forEach((account) => {
        if (account.chart_account?.code == AccountConsts.CASH_CODE && !isCashier) {
          cashAccountsList.value.push(account)
        }
      });

      const { services } = await getServicesWithProviders()
      servicesWithProviders.value = services
      isLoading.value = false
    })

    const updateTotalAmount = () => {
      debouncedTotalAmount();
      updateRemainingAmount()
    }
    const debouncedTotalAmount = debounce(() => {
      currentTicket.value.total_amount = 0
      requestedServicesHelper.value.forEach((element) => {
        currentTicket.value.total_amount += element.sell_price
      })
      context.emit('input-finished', currentTicket.value.total_amount);
    }, 1)


    const updateCurrencyRate = () => {
      const currency = currenciesList.value.find((currencyElm) => currencyElm.id == currentConfirmPayment.value.currency_id)
      currentConfirmPayment.value.currency_rate = currency?.rate ?? 1
      if (!currency?.is_main)
        enableCurrencyRate.value = true
      else enableCurrencyRate.value = false
    }


    const updateRemainingAmount = debounce(() => {
      currentConfirmPayment.value.remaining_amount = currentTicket.value.total_amount - currentConfirmPayment.value.paid_amount
    }, 1)


    const validationSchema = confirmPaymentTicketValidationSchema
    const { handleSubmit, setFieldValue } = useForm({
      validationSchema,
      initialValues: {
        customer_id: currentTicket.value.customer_id,
        total_amount: currentTicket.value.total_amount,
        ticket_id: currentConfirmPayment.value.ticket_id,
        currency_rate: currentConfirmPayment.value.currency_rate,
        remaining_amount: currentConfirmPayment.value.remaining_amount,
        currency_id: currentConfirmPayment.value.currency_id,
        paid_amount: currentConfirmPayment.value.paid_amount,
        cash_account_id: currentConfirmPayment.value.cash_account_id
      }
    })

    const onSubmit = async (method: String) => {
      if (method == "Edit") {
        await onSubmitEdit();
      } else
        return;
    }


    const onSubmitEdit = handleSubmit(async () => {
      currentConfirmPayment.value.ticket_id = ticketId.value
      const { success, message, ticket } = await confirmPaymentTicket(ticketId.value, currentConfirmPayment.value)
      if (success) {
        await sleep(200);
        notif.success(t('toast.success.update_ticket', { ticket_id: ticket.id }))
        router.push({ path: `/pending-ticket` });
      }
      else {
        await sleep(200);
        notif.error(message)
      }
    })

    return {
      t, pageTitle, onSubmit, currentTicket, isLoading, customersList, viewWrapper, backRoute, ticketStore, updateRemainingAmount,
      enableCurrencyRate, UserStatusConsts, cashAccountsList, updateCurrencyRate, currenciesList, servicesWithProviders, getCustomersList, requestedServicesHelper, currentConfirmPayment
    };
  },
  components: { ErrorMessage }
})
</script>

<template>
  <div class="page-content-inner">
    <FormHeader :title="pageTitle" :form_submit_name="t('cofirm_payment')" :back_route="backRoute" type="submit"
      @onSubmit="onSubmit(formType)" :isLoading="isLoading" />
    <form class="form-layout" @submit.prevent="onSubmit(formType)">
      <div class="form-outer">
        <div class="form-body">
          <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
            <div class="load">
            </div>
          </VLoader>

          <div :hidden="isLoading" class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ pageTitle }}</h4>
            </div>
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="customer_id">
                  <VLabel class="required">{{ t('ticket.form.customer') }}</VLabel>
                  <VControl>

                    <VSelect disabled v-model="currentTicket.customer_id">
                      <VOption v-for="customer in customersList" :value="customer.id">
                        {{ customer.user.first_name }} {{ customer.user.last_name }}
                      </VOption>
                    </VSelect>
                  </VControl>
                  <ErrorMessage class="help is-danger" name="customer_id" />
                </VField>
              </div>
              <div class="column is-12 pb-0 mb-3">
                <p class="required label is-size-6">{{ t('ticket.form.services') }}</p>

              </div>
              <div class="column is-12 py-0 my-0">
                <div class="columns mb-0" v-for="(record, mainIndex) in requestedServicesHelper" :key="mainIndex">
                  <div class="column is-4">
                    <div class="mb-3">
                      <VField>
                        <VControl>
                          <VSelect disabled v-model="requestedServicesHelper[mainIndex].service_id">
                            <VOption :value="0"> {{ t('ticket.form.select_service')
                            }}</VOption>
                            <VOption v-for="service in servicesWithProviders" :value="service.id">
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
                        <VControl>
                          <div class="select">
                            <select disabled v-model="requestedServicesHelper[mainIndex].service_provider_id">
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
                        <VControl>
                          <VInput disabled type="number" v-model.number="requestedServicesHelper[mainIndex].sell_price" />
                        </VControl>
                      </VField>
                    </div>
                  </div>
                  <div class="column is-1 columns is-flex is-align-items-center">
                    <div class="mb-3 column is-6">
                      <VField
                        v-if="((mainIndex != 0 && formType == 'Add') || (formType == 'Edit' && requestedServicesHelper[mainIndex].editable))">

                      </VField>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-6">
                <VField id="total_amount">
                  <VLabel class="required">{{ t('ticket.form.total_amount') }}</VLabel>
                  <VControl>
                    <VInput disabled v-model="currentTicket.total_amount" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="total_amount" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="cash_account_id">
                  <VLabel class="required">{{ t('ticket.form.cash_account') }}</VLabel>
                  <VControl>
                    <VSelect v-model="currentConfirmPayment.cash_account_id">
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
                    <VSelect @change="updateCurrencyRate" v-model="currentConfirmPayment.currency_id">
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
                    <VInput :disabled="!enableCurrencyRate" v-model="currentConfirmPayment.currency_rate" placeholder=""
                      type="number" />
                    <ErrorMessage class="help is-danger" name="currency_rate" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="paid_amount">
                  <VLabel class="required">{{ t('ticket.form.paid_amount') }}</VLabel>
                  <VControl>
                    <VInput @input="updateRemainingAmount" v-model="currentConfirmPayment.paid_amount" placeholder=""
                      type="number" />
                    <ErrorMessage class="help is-danger" name="paid_amount" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField id="remaining_amount">
                  <VLabel class="required">{{ t('ticket.form.remaining_amount') }}</VLabel>
                  <VControl>
                    <VInput disabled v-model="currentConfirmPayment.remaining_amount" placeholder="" type="number" />
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

.load {
  height: 400px;
  width: 500px;
}
</style>
