<script  lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useForm, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateAccount, AccountConsts } from '/@src/models/Accounting/Account/account';
import { ChartOfAccount, defaultChartOfAccount, ChartOfAccountSearchFilter } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { Currency, CurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { accountvalidationSchema } from '/@src/rules/Accounting/Account/accountValidation';
import { addAccount } from '/@src/services/Accounting/Account/accountService';
import { getChartOfAccountsList } from '/@src/services/Accounting/ChartOfAccount/chartOfAccountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { useAccount } from '/@src/stores/Accounting/Account/accountStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';



export default defineComponent({
  props: {
    formType: {
      type: String,
      default: '',
    },
  },
  emits: ['onSubmit'],
  setup(props, context) {
    const { t } = useI18n()
    const viewWrapper = useViewWrapper();
    viewWrapper.setPageTitle(t('account.form.page_title'));
    const head = useHead({
      title: t('account.form.page_title'),
    });
    const accountStore = useAccount()
    const notif = useNotyf() as Notyf
    const formType = ref('')
    formType.value = props.formType
    const route = useRoute()
    const router = useRouter()
    const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('account.form.form_header', { type: formTypeName });
    const backRoute = '/account'
    const currenciesList = ref<Currency[]>([])
    const enableCurrencyRate = ref<boolean>(false)
    const chartOfAccountsList = ref<ChartOfAccount[]>([])
    const chartsList = ref<ChartOfAccount[]>([])
    const currentAccount = ref(defaultCreateAccount)
    const selectedChart = ref<ChartOfAccount>(defaultChartOfAccount)
    const selectedCurrencyId = ref<number>(0)

    onMounted(async () => {
      let currencySearchFilter = {} as CurrencySearchFilter
      const { currencies } = await getCurrenciesList(currencySearchFilter)
      currenciesList.value = currencies

      let chartOfAccountSearchFilter = {} as ChartOfAccountSearchFilter
      const { chartOfAccounts } = await getChartOfAccountsList(chartOfAccountSearchFilter)
      for (let i = 0; i <= chartOfAccounts.length; i++) {
        if (chartOfAccounts[i] == undefined)
          break
        if (chartOfAccounts[i].has_dynamic_account == true) {
          chartsList.value.push(chartOfAccounts[i])
        }

      }
      chartOfAccountsList.value = chartOfAccounts
    })

    const validationSchema = accountvalidationSchema
    const { handleSubmit } = useForm({
      validationSchema,
      initialValues: {
        name: "",
        currency_rate: 1,
        status: AccountConsts.ACTIVE,
        balance: 0
      }
    });
    const onSubmit = async (method: String) => {

      await onSubmitAdd();

    };
    const onSubmitAdd = handleSubmit(async (values) => {
      currentAccount.value.chart_of_account_id = selectedChart.value?.id
      currentAccount.value.level2_code = selectedChart.value?.code
      currentAccount.value.currency_id = selectedCurrencyId.value
      let accountData = currentAccount.value;

      const { success, message, account } = await addAccount(accountData);
      if (success) {
        // @ts-ignore
        notif.dismissAll();
        await sleep(200);
        // @ts-ignore
        notif.success(t('toast.success.add'));
        router.push({ path: `/account` });
      } else {
        await sleep(200);
        notif.error(message)
      }
    });

    watch(selectedCurrencyId, (value) => {
      let selectedCurreny = currenciesList.value.find((currency) => currency.id === value);
      if (selectedCurreny?.is_main) {
        enableCurrencyRate.value = false
        currentAccount.value.currency_rate = 1
      } else {
        enableCurrencyRate.value = true
      }
    })
    return { t, pageTitle, onSubmit, chartsList, enableCurrencyRate, selectedCurrencyId, currentAccount, viewWrapper, backRoute, accountStore, selectedChart, AccountConsts, chartOfAccountsList, currenciesList };
  },
  components: { ErrorMessage }

})

</script>
<template>
  <div class="page-content-inner">
    <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
      @onSubmit="onSubmit(formType)" :isLoading="accountStore?.loading" />
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
                <VField id="name" v-slot="{ field }">
                  <VLabel class="required">{{ t('account.form.name') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="currentAccount.name" type="text" placeholder="" autocomplete="given-name" />
                    <ErrorMessage class="help is-danger" name="name" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="balance" v-slot="{ field }">
                  <VLabel class="required">{{ t('account.form.balance') }}</VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput v-model="currentAccount.balance" placeholder="" type="number" autocomplete="given-balance" />
                    <ErrorMessage class="help is-danger" name="balance" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>

          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-6">
                <VField>
                  <VLabel>{{ t('account.form.parent_code') }}</VLabel>
                  <VControl>
                    <VSelect v-model="selectedChart">
                      <VOption :value="undefined"> {{ t('account.form.parent_code') }}</VOption>
                      <VOption v-for="chart in chartsList" :value="chart">{{ chart.name }}
                      </VOption>
                    </VSelect>

                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField>
                  <VLabel>{{ t('account.form.currency') }}</VLabel>
                  <VControl>
                    <VSelect v-model="selectedCurrencyId">
                      <VOption v-for="currency in currenciesList" :value="currency.id">{{ currency.name }}
                      </VOption>
                    </VSelect>

                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="currency_rate" v-slot="{ field }">
                  <VLabel class="required">{{ t('account.form.currency_rate') }}</VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput v-model="currentAccount.currency_rate" placeholder="" type="number"
                      autocomplete="given-currency_rate" :disabled="!enableCurrencyRate" />
                    <ErrorMessage class="help is-danger" name="currency_rate" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField v-slot="{ field }">
                  <VLabel>{{ t('account.form.description') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="currentAccount.description" type="text" placeholder=""
                      autocomplete="given-description" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="status">
                  <VLabel>{{ t('account.form.status') }}</VLabel>
                  <VControl>
                    <VRadio v-model="currentAccount.status" :value="AccountConsts.INACTIVE"
                      :label="AccountConsts.getAccountStatusName(0)" name="status" color="danger" />

                    <VRadio v-model="currentAccount.status" :value="AccountConsts.ACTIVE"
                      :label="AccountConsts.getAccountStatusName(1)" name="status" color="success" />
                    <ErrorMessage name="status" />
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


<style  scoped lang="scss">@import '/@src/scss/styles/formPage.scss';</style>
