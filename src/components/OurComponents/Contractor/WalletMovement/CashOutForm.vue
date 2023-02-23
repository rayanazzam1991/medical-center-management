<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { defaultCreateWalletMovement, defaultWalletMovement, WalletMovement, WalletMovementConsts } from '/@src/models/Contractor/walletMovement';
import { addWalletMovement } from '/@src/services/Contractor/WalletMovement/walletMovementService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { walletMovementAddvalidationSchema } from '/@src/rules/Contractor/WalletMovement/walletMovementAddValidation';
import sleep from "/@src/utils/sleep";
import { useWalletMovement } from "/@src/stores/Contractor/WalletMovement/walletMovementStore";
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';
import { getContractor, getContractorsList } from '/@src/services/Contractor/contractorService';
import { Contractor, ContractorSearchFilter } from '/@src/models/Contractor/contractor';
import { getCurrenciesFromStorage } from '/@src/services/Accounting/Currency/currencyService';
import { Currency, defaultCurrency } from '/@src/models/Accounting/Currency/currency';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';


export default defineComponent({
  props: {
    formType: {
      type: String,
      default: "",
    },
  },
  emits: ["onSubmit"],
  setup(props, context) {
    const { t } = useI18n()
    const viewWrapper = useViewWrapper();
    viewWrapper.setPageTitle(t('walletMovement.cash_out_form.page_title'));
    const head = useHead({
      title: t('walletMovement.cash_out_form.page_title'),
    });
    const walletMovementStore = useWalletMovement()
    const notif = useNotyf() as Notyf;
    const formType = ref("");
    formType.value = props.formType;
    const route = useRoute();
    const contractorId = route.query.id
    const router = useRouter();
    const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('walletMovement.cash_out_form.form_header', { type: formTypeName });
    const backRoute = "/contractor/cash-out";
    const currentWalletMovement = ref(defaultCreateWalletMovement);
    const selectedContractor = ref();
    const contractorName = ref();
    let Amount = ref();
    let walletId = ref();
    // @ts-ignore
    const contractorList = ref<Contractor[]>([])
    const currencies = getCurrenciesFromStorage()
    const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency

    onMounted(async () => {
      if (contractorId != undefined) {
        const { contractor } = await getContractor(Number(contractorId))
        contractorList.value.push(contractor)
        selectedContractor.value = contractor.id
        contractorName.value = contractor.user.first_name + ' ' + contractor.user.last_name
      }
      else {
        let searchFlter = {} as ContractorSearchFilter
        const { contractors } = await getContractorsList(searchFlter);
        contractorList.value = contractors
      }
    })
    watch(selectedContractor, (value) => {
      const Contractor = contractorList.value.find((contractor) => contractor.id == value)
      Amount.value = Contractor?.wallet.amount
      walletId.value = Contractor?.wallet.id

    })
    const getCurrentWalletMovement = () => {
      currentWalletMovement.value.type = ''
      currentWalletMovement.value.action = ''
      currentWalletMovement.value.total = Amount.value ?? 0
      currentWalletMovement.value.wallet_id = 0
      currentWalletMovement.value.note = ''
    };

    onMounted(() => {
      getCurrentWalletMovement();

    });

    const validationSchema = walletMovementAddvalidationSchema
    const { handleSubmit } = useForm({
      validationSchema,
      initialValues: {
        contractor_id: contractorId ? contractorId : 0,
        total: Amount.value ?? 0,
        note: ""
      }
    });
    const onSubmit = async (method: String) => {
      await onSubmitAdd();
    };
    const onSubmitAdd = handleSubmit(async (values) => {
      var walletMovementData = currentWalletMovement.value;
      walletMovementData.action = WalletMovementConsts.CASH_OUT
      walletMovementData.type = WalletMovementConsts.OUT
      walletMovementData.wallet_id = walletId.value
      walletMovementData.total = currentWalletMovement.value.total
      walletMovementData.note = currentWalletMovement.value.note
      const { success, message, walletMovement } = await addWalletMovement(walletMovementData);
      if (success) {

        // @ts-ignore
        notif.dismissAll();
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.withdraw'));
        router.push({
          path: `/contractor/${selectedContractor.value}`,
          query: { tab: 'Wallet' }
        });
      } else {
        await sleep(200);

        notif.error(message)
      }
    });

    return { t, contractorName, contractorId, Amount, selectedContractor, contractorList, pageTitle, onSubmit, currentWalletMovement, viewWrapper, backRoute, WalletMovementConsts, walletMovementStore, addParenthesisToString, mainCurrency };
  },
  components: { ErrorMessage }
})


</script>

<template>
  <div class="page-content-inner">
    <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
      @onSubmit="onSubmit(formType)" :isLoading="walletMovementStore?.loading" />
    <form class="form-layout" @submit.prevent="onSubmit(formType)">
      <div class="form-outer">
        <div class="form-body">
          <!--Fieldset-->
          <div v-if="!contractorId" class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="contractor_id">
                  <VLabel class="required">{{ t('walletMovement.cash_out_form.contarctor') }}</VLabel>
                  <VControl>
                    <VSelect v-model="selectedContractor">
                      <VOption value="">{{ t('walletMovement.cash_out_form.contarctor') }}</VOption>
                      <VOption v-for="contarctor in contractorList" :key="contarctor.id" :value="contarctor.id">
                        {{ contarctor.user.first_name + ' ' + contarctor.user.last_name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="contractor_id" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <div v-else class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <label class="lable required">{{ t('walletMovement.cash_out_form.contarctor') }}</label>
                <input class="input" disabled type="text" :placeholder="contractorName" />
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField v-slot="{ field }">
                  <VLabel> {{ t('walletMovement.cash_out_form.my_total') }} {{ addParenthesisToString(mainCurrency.name)
                  }}</VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput disabled v-model="Amount" type="number" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="total" v-slot="{ field }">
                  <VLabel class="required">{{ t('walletMovement.cash_out_form.cash_out_total') }}{{
                    addParenthesisToString(mainCurrency.name)
                  }}</VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput v-model="currentWalletMovement.total" type="number" />
                    <ErrorMessage name="total" class="help is-danger" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>

          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="note" v-slot="{ field }">
                  <VLabel>{{ t('walletMovement.cash_out_form.note') }}</VLabel>
                  <VControl>
                    <VTextarea v-model="currentWalletMovement.note" type="number" />
                    <ErrorMessage name="note" class="help is-danger" />
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
</style>
