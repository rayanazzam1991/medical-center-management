<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { Notyf } from 'notyf'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { number } from 'zod'
import { useNotyf } from '/@src/composable/useNotyf'
import { Contractor } from '/@src/models/Contractor/contractor'
import { CreateBulkCashOut, defaultCreateBulkCashOut, WalletMovement } from '/@src/models/Contractor/walletMovement'
import { getAllContractor } from '/@src/services/Contractor/contractorService'
import { addBulkCashOutsList } from '/@src/services/Contractor/WalletMovement/walletMovementService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import sleep from '/@src/utils/sleep'

const notif = useNotyf() as Notyf
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('walletMovement.table.bulk_cash_out.title'))
useHead({
    title: t('walletMovement.table.bulk_cash_out.title'),
})
const emit = defineEmits(['onSubmit'])
const contractorList = ref<Contractor[]>([])
const ValidcontractorList = ref<Contractor[]>([])
const selectedRowsId = ref<number[]>([])
const editCompanyIndex = ref<number>()
onMounted(async () => {
    const { contractors } = await getAllContractor()
    contractorList.value = contractors
    const Contractor = contractorList.value.filter((contarctor) => contarctor.wallet.amount > 0)
    ValidcontractorList.value = Contractor

});
let contractorsId = ref()
let walletId = ref()
let amount = ref()
const createBulkCashOut = ref<CreateBulkCashOut>(defaultCreateBulkCashOut)
const SelectedContractorList = ref<Contractor[]>([])
const getSelectedContractors = (()=>{
    for (let i  of selectedRowsId.value) {
        const SelectedContractor = contractorList.value.find((contarctor) => contarctor.id == i)
        walletId.value = SelectedContractor?.wallet.id
        amount.value = SelectedContractor?.wallet.amount
        createBulkCashOut.value.bulkCashOuts.push({wallet_id: walletId.value,total:amount.value })
    }
});
const onSubmit = async () => {
        await bulkCashOut();
        return;
};
const bulkCashOut = (async () => {
    getSelectedContractors()
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
  () => ValidcontractorList.value.length === selectedRowsId.value.length
)


const columns = {
  select: {
    label: '',
    cellClass: 'is-flex-grow-0',
    align : 'center'
  },
  "users.name": {
        align: 'center',
        label: t('walletMovement.cash_out_form.contarctor'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.user?.first_name + ' ' + row?.user?.last_name),

    },
  amount: {
    grow: true,
    align: 'center',
    label: t('contractor.details.amount'),
    renderRow: (row: any) =>
        h('span', row?.wallet?.amount)
  },
}

function toggleSelection() {

  if (isAllSelected.value) {
    selectedRowsId.value = []
  } 
  else {
    selectedRowsId.value = ValidcontractorList.value.map((_,index)=><number>_.id)
  }

}
function clickOnRow(row: any) {
  if (selectedRowsId.value.includes(row.id)) {
    selectedRowsId.value = selectedRowsId.value.filter((i) => i !== row.id)
  } else {
    selectedRowsId.value = [...selectedRowsId.value, row.id]

  }
}


const VFocus = {
  mounted(el: HTMLInputElement) {
    el.focus()
  },
}
</script>

<template>
    <BulkCashOutTableHeader  :title="viewWrapper.pageTitle"
        :button_name="t('walletMovement.table.bulk_cash_out.header_button')"
        @onSubmit="onSubmit" 
        />
    <VFlexTableWrapper :columns="columns" 
    :data="contractorList"
    >
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
            <template #body-cell="{ row, column, value }">
            <!--This is the slot for row.select cells-->
            <VCheckbox
                v-if="column.key === 'select'"
                :checked="clickOnRow"
                :class=" row.wallet.amount <= 0 ? 'is-disabled' : ''"
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