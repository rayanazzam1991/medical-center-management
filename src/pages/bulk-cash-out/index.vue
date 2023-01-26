<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { Notyf } from 'notyf'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { number } from 'zod'
import { useNotyf } from '/@src/composable/useNotyf'
import { Contractor } from '/@src/models/Contractor/contractor'
import { defaultWalletSearchFilter, Wallet } from '/@src/models/Contractor/wallet'
import { CreateBulkCashOut, defaultCreateBulkCashOut, WalletMovement } from '/@src/models/Contractor/walletMovement'
import { addBulkCashOutsList } from '/@src/services/Contractor/WalletMovement/walletMovementService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import sleep from '/@src/utils/sleep'
import { getWalletsList } from '/@src/services/Contractor/Wallet/walletService'


const notif = useNotyf() as Notyf
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const keyIncrement = ref(0)
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('walletMovement.table.bulk_cash_out.title'))
useHead({
    title: t('walletMovement.table.bulk_cash_out.title'),
})
const prop = defineProps(['enabled'])
const emit = defineEmits(['onSubmit'])
const walletList = ref<Wallet[]>([])
const ValidwalletList = ref<Wallet[]>([])
const selectedRowsId = ref<number[]>([])
const editCompanyIndex = ref<number>()
onMounted(async () => {
    const { wallets } = await getWalletsList(defaultWalletSearchFilter)
    walletList.value = wallets
    const Wallet = walletList.value.filter((wallet) => wallet.amount > 0)
    ValidwalletList.value = Wallet

});
let walletId = ref()
let amount = ref()
const createBulkCashOut = ref<CreateBulkCashOut>(defaultCreateBulkCashOut)
const getSelectedWallets = (()=>{
    for (let i  of selectedRowsId.value) {
        const SelectedWallet = walletList.value.find((wallet) => wallet.id == i)
        walletId.value = SelectedWallet?.id
        amount.value = SelectedWallet?.amount
        createBulkCashOut.value.bulkCashOuts.push({wallet_id: walletId.value,total:amount.value })
    }
});
const onSubmit = async () => {
        await bulkCashOut();
        return;
};
const bulkCashOut = (async () => {
  getSelectedWallets()
    let bulkCashOut = createBulkCashOut.value
    const {success,message} = await addBulkCashOutsList(bulkCashOut)
    if (success) {
        notif.dismissAll();
        await sleep(200);
        notif.success(t('toast.success.withdraw'));
        router.push({ path: `/contractor/cash-out` });
    } else {
        await sleep(200);
        notif.error(message)
    }
});

const isAllSelected = computed(
  () => ValidwalletList.value.length === selectedRowsId.value.length
)

const columns = {
  select: {
    label: '',
    cellClass: 'is-flex-grow-0',
    align : 'center'
  },
  "contarctor.users.name": {
        align: 'center',
        label: t('walletMovement.cash_out_form.contarctor'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.contractor?.user?.first_name + ' ' + row?.contractor?.user?.last_name),
    },
  amount: {
    grow: true,
    align: 'center',
    label: t('contractor.details.amount'),
    renderRow: (row: any) =>
        h('span', row?.amount)
  },
}
function toggleSelection() {

  if (isAllSelected.value) {
    selectedRowsId.value = []
    keyIncrement.value = keyIncrement.value + 1

  } 
  else {
    selectedRowsId.value = ValidwalletList.value.map((_,index)=><number>_.id)
    keyIncrement.value = keyIncrement.value + 1

  }
}
function clickOnRow(row: any) {
  if (selectedRowsId.value.includes(row.id)) {
    selectedRowsId.value = selectedRowsId.value.filter((i) => i !== row.id)

  } else {
    selectedRowsId.value = [...selectedRowsId.value, row.id]
    keyIncrement.value = keyIncrement.value + 1
  }
}
</script>

<template>
    <BulkCashOutTableHeader  :title="viewWrapper.pageTitle" :key="keyIncrement"
        :button_name="t('walletMovement.table.bulk_cash_out.header_button')"
        @onSubmit="onSubmit"  :enable_button="selectedRowsId.length == 0 ? false : true"
        />
    <VFlexTableWrapper :columns="columns"  :data="walletList" >
        <VFlexTable separators  >
            <!-- header-column slot -->
            <template #header-column="{ column }">
            <VCheckbox
                v-if="column.key === 'select'"
                class="ml-3 mr-3"
                :checked="isAllSelected"
                name="all_selected"
                color="primary"
                square
                @click.prevent="toggleSelection"
            />
            </template>
            <!-- body-cell slot -->
            <template #body-cell="{ row, column ,value}" >
            <!--This is the slot for row.select cells-->
            <VCheckbox
                v-if="column.key === 'select'"
                :checked="clickOnRow"
                :class=" row.amount <= 0 ? 'is-disabled' : ''"
                v-model="selectedRowsId"
                :value="row.id"
                name="selection"
                square
            />
            <!--The default slot is used then-->
            </template>
        </VFlexTable>
  </VFlexTableWrapper>
</template>