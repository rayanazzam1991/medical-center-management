<script lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useForm, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountSearchFilter, AccountConsts } from '/@src/models/Accounting/Account/account';
import { Currency, CurrencyConsts, CurrencySearchFilter, defaultCurrency } from '/@src/models/Accounting/Currency/currency';
import { Customer, CustomerSearchFilter } from '/@src/models/CRM/Customer/customer';
import { UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { defaultCreateTicket, defaultConfirmPaymentTicket, ConfirmPaymentTicket } from '/@src/models/Sales/Ticket/ticket';
import { CreateTicketServiceHelper, TicketServiceConsts } from '/@src/models/Sales/TicketService/ticketService';
import { confirmPaymentTicketValidationSchema } from '/@src/rules/Sales/Ticket/confirmPaymentTicketValidationSchema';
import { getAccountIdByContactId, getAccountsList, getAuthenticatedCashierAccounts } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { getCustomersList } from '/@src/services/CRM/Customer/customerService';
import { useTicket } from '/@src/stores/Sales/Ticket/ticketStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
//@ts-ignore
import debounce from 'lodash.debounce';
import { ServiceWithProvider } from '/@src/models/Others/Service/service';
import { getServicesWithProviders } from '/@src/services/Others/Service/serviceService';
import { createTicket, getTicket, confirmPaymentTicket } from '/@src/services/Sales/Ticket/ticketService';
import { UpdateTicket } from '/@src/models/Sales/Ticket/ticket';
import sleep from '/@src/utils/sleep';
import { useAuth } from '/@src/stores/Others/User/authStore';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';

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
    const IQDcashAccountsList = ref<Account[]>([])
    const USDcashAccountsList = ref<Account[]>([])
    const USDcashAccountId = ref<number>(0)
    const IQDcashAccountId = ref<number>(0)
    const IQDcashAmount = ref(0)
    const USDcashAmount = ref(0)
    const USDcashAmountInUSD = ref(0)
    const isLoading = ref(false)
    const userAuth = useAuth();
    const haveCashierRole = userAuth.getUser()?.roles?.find((role) => role.name == 'Cashier')
    const isCashier = haveCashierRole ? true : false
    const currencyRate = ref(1)
    const customerAccountCurrency = ref(defaultCurrency)
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
        cashierAccounts.forEach((account) => {
          if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
            if (account.currency?.code == CurrencyConsts.IQD_CODE) {
              IQDcashAccountsList.value.push(account)
              IQDcashAccountId.value = account.id ?? 0
            } else {
              USDcashAccountsList.value.push(account)
              USDcashAccountId.value = account.id ?? 0
            }
          }
        });
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
      const usdCurrency = currenciesList.value.find((currency) => !currency.is_main)
      if (usdCurrency) {
        currencyRate.value = usdCurrency.rate
      }
      const { account_id } = await getAccountIdByContactId({ contact_id: currentTicket.value.customer_id, contact_type: 'Customer' })
      const accountSearchFilter = {
        per_page: 500
      } as AccountSearchFilter
      const { accounts } = await getAccountsList(accountSearchFilter)
      accounts.forEach((account) => {
        if (account.id == account_id) {
          customerAccountCurrency.value = account.currency!
        }
        if (account.chart_account?.code == AccountConsts.CASH_CODE && !isCashier) {
          if (account.currency?.code == CurrencyConsts.IQD_CODE) {
            IQDcashAccountsList.value.push(account)
          } else {
            USDcashAccountsList.value.push(account)
          }
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

    const updateRemainingAmount = debounce(() => {
      currentConfirmPayment.value.remaining_amount = currentTicket.value.total_amount - (IQDcashAmount.value + USDcashAmount.value)
    }, 1)


    const validationSchema = confirmPaymentTicketValidationSchema
    const { handleSubmit, setFieldValue } = useForm({
      validationSchema,
      initialValues: {
        iqd_amount: 0,
        usd_amount: 0,
        currency_rate: currencyRate.value,
        remaining_amount: currentConfirmPayment.value.remaining_amount,
        iqd_cash_account: 0,
        usd_cash_account: 0
      }
    })

    const onSubmit = async (method: String) => {
      if (method == "Edit") {
        await onSubmitEdit();
      } else
        return;
    }


    const onSubmitEdit = handleSubmit(async () => {
      if (IQDcashAmount.value == 0 && USDcashAmount.value == 0) {
        notif.error({ message: t('toast.error.please_select_at_least_iqd_or_usd') })
        return
      }
      if (IQDcashAmount.value != 0 && IQDcashAccountId.value == 0) {
        notif.error({ message: t('toast.error.please_select_cash_account') })
        return

      }
      if (USDcashAmount.value != 0 && USDcashAccountId.value == 0) {
        notif.error({ message: t('toast.error.please_select_cash_account') })
        return

      }
      if (USDcashAmount.value == 0 && customerAccountCurrency.value.code == CurrencyConsts.IQD_CODE) {
        currencyRate.value = 1
        const notyf = new Notyf({
          duration: 4000,
          position: {
            x: 'right',
            y: 'bottom',
          },
          types: [
            {
              type: 'info',
              background: useCssVar('--info').value,
              icon: {
                className: 'fas fa-info-circle',
                tagName: 'i',
                text: '',
              },
            },
          ],
        })
        notyf.open({
          type: 'info',
          message: t('toast.info.currency_rate_is_set_to_1'),
        })
      }
      currentConfirmPayment.value.currency_rate = currencyRate.value
      currentConfirmPayment.value.iqd_cash_account_id = IQDcashAccountId.value != 0 ? IQDcashAccountId.value : undefined
      currentConfirmPayment.value.usd_cash_account_id = USDcashAccountId.value != 0 ? USDcashAccountId.value : undefined
      currentConfirmPayment.value.iqd_paid_amount = IQDcashAmount.value
      currentConfirmPayment.value.usd_paid_amount = USDcashAmount.value
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
    watch(USDcashAmountInUSD, (value) => {
      USDcashAmount.value = Number(value) * currencyRate.value
    })
    watch(currencyRate, (value) => {
      USDcashAmount.value = Number(value) * USDcashAmountInUSD.value
    })
    watch(USDcashAmount, (value) => {
      currentConfirmPayment.value.remaining_amount = currentTicket.value.total_amount - (Number(IQDcashAmount.value) + Number(value))

    })
    watch(IQDcashAmount, (value) => {
      currentConfirmPayment.value.remaining_amount = currentTicket.value.total_amount - (Number(value) + Number(USDcashAmount.value))
    })

    return {
      t, pageTitle, onSubmit, currentTicket, isLoading, customersList, viewWrapper, backRoute, ticketStore, updateRemainingAmount,
      enableCurrencyRate, UserStatusConsts, IQDcashAccountsList, USDcashAccountsList, currenciesList, servicesWithProviders, getCustomersList, requestedServicesHelper, currentConfirmPayment,
      IQDcashAmount, USDcashAmount, isCashier, USDcashAccountId, IQDcashAccountId, USDcashAmountInUSD, currencyRate
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
                <VField>
                  <VLabel class="required">{{ t('ticket.form.customer') }}</VLabel>
                  <VControl>
                    <VSelect disabled v-model="currentTicket.customer_id">
                      <VOption v-for="customer in customersList" :value="customer.id">
                        {{ customer.user.first_name }} {{ customer.user.last_name }}
                      </VOption>
                    </VSelect>
                  </VControl>
                </VField>
              </div>
              <div class="column is-12 pb-0 my-0">
                <p class="required label is-size-6">{{ t('ticket.form.services') }}</p>
                <div class="columns mb-0">
                  <div class="column is-4">
                    <div class="mb-3">
                      <p class="label">
                        {{ t('ticket.form.service') }}</p>
                    </div>
                  </div>
                  <div class="column is-4">
                    <div class="mb-3">
                      <p class="label">
                        {{ t('ticket.form.provider') }}</p>
                    </div>
                  </div>
                  <div class="column is-4">
                    <div class="mb-3">
                      <p class="label">
                        {{ t('ticket.form.sell_price') }}</p>
                    </div>
                  </div>
                </div>
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
              <div class="column is-12">
                <VField>
                  <VLabel class="required">{{ t('ticket.form.total_amount') }}</VLabel>
                  <VControl>
                    <VInput disabled v-model="currentTicket.total_amount" placeholder="" type="number" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12 columns p-0 m-0 py-2 ">
                <div class="column is-6 columns is-multiline m-0 p-0 my-2 split-border">
                  <div class="column is-12">
                    <VField id="iqd_amount">
                      <VLabel class="required">{{ t('ticket.form.iqd_amount') }}
                      </VLabel>
                      <VControl>
                        <VInput v-model="IQDcashAmount" placeholder="" type="number" />
                        <ErrorMessage class="help is-danger" name="iqd_amount" />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <VField id="iqd_cash_account">
                      <VLabel>{{ t('ticket.form.iqd_cash_account') }}
                      </VLabel>
                      <VControl>
                        <VSelect :disabled="isCashier" v-model="IQDcashAccountId">
                          <VOption :value="0"> {{ t('ticket.form.select_account')
                          }}</VOption>
                          <VOption v-for="account in IQDcashAccountsList" :value="account.id">
                            {{ account.code }} - {{ account.name }}
                          </VOption>
                        </VSelect>
                        <ErrorMessage class="help is-danger" name="iqd_cash_account" />
                      </VControl>
                    </VField>
                  </div>
                </div>
                <div class="column is-6 columns is-multiline m-0 p-0 my-2">
                  <div class="column is-12">
                    <VField id="usd_amount">
                      <VLabel class="required">{{ t('ticket.form.usd_amount') }}
                      </VLabel>
                      <VControl>
                        <VInput v-model="USDcashAmountInUSD" placeholder="" type="number" />
                        <ErrorMessage class="help is-danger" name="usd_amount" />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <VField id="usd_cash_account">
                      <VLabel>{{ t('ticket.form.usd_cash_account') }}
                      </VLabel>
                      <VControl>
                        <VSelect :disabled="isCashier" v-model="USDcashAccountId">
                          <VOption :value="0"> {{ t('ticket.form.select_account')
                          }}</VOption>
                          <VOption v-for="account in USDcashAccountsList" :value="account.id">
                            {{ account.code }} - {{ account.name }}
                          </VOption>
                        </VSelect>
                        <ErrorMessage class="help is-danger" name="usd_cash_account" />
                      </VControl>
                    </VField>
                  </div>
                </div>
              </div>
              <div class="column is-6">
                <VField id="currency_rate">
                  <VLabel class="required">{{ t('ticket.form.currency_rate') }}
                  </VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput v-model="currencyRate" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="currency_rate" />
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

.split-border {
  border-left: 3px solid var(--fade-grey-dark-3);
}

.is-dark {
  .split-border {
    border-color: var(--dark-sidebar-light-12) !important;

  }
}
</style>
