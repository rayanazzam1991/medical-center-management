<script setup lang="ts">
import { toFormValidator } from '@vee-validate/zod';
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep"
import { z as zod } from 'zod';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()

viewWrapper.setPageTitle(t('contractor.form.step_2_title'))
const head = useHead({
    title: "Add Record",
})
const notif = useNotyf() as Notyf

const pageTitle = "add Record"



onMounted(async () => {


})

const validationSchema = null

const { handleSubmit } = useForm({
    validationSchema
});

interface AccountingRecord {
    id?: number
    value?: number
}
interface Account {
    id: number,
    code: string,
    name: string
}
const records = ref<AccountingRecord[]>([])


const addRecord = (record: AccountingRecord) => {
    records.value?.push(record)
}

const removeRecord = (record: AccountingRecord) => {
    const index = records.value.indexOf(record);
    if (index !== -1) {
        records.value.splice(index, 1);
    }
}

const accountsList = ref<Account[]>([]);

accountsList.value?.push({ id: 1, code: "123", name: "Cash" })
accountsList.value?.push({ id: 2, code: "456", name: "Inventory" })

const clearAccountValue = () => {

}

const setAccountValue = () => {

}


const onSubmitAdd = handleSubmit(async () => {


    // if (success) {
    //     // @ts-ignore
    //     await sleep(200);

    //     notif.success(t('toast.success.add'))

    //     return true
    // }
    // else {
    //     // @ts-ignore
    //     await sleep(200);

    //     notif.error(message)

    // }



})
</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="onSubmitAdd()">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <button @click="addRecord({ id: 1, value: 20 })">Add Record</button>

                        <!--Fieldset-->
                        <div class="columns" v-for="(record, index) in records" :key="index">
                            <div class="column is-5">
                                <div class="mb-3">
                                    <VField id="test">
                                        <VLabel class="required">
                                            test</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VSelect>
                                                <VOption v-for="account in accountsList" :key="account.id"
                                                    :value="account.id">
                                                    {{ account.name }}
                                                </VOption>
                                            </VSelect>
                                            <!-- <Multiselect mode="single"
                                             :placeholder="t('customer.form.city')"
                                                :close-on-select="false" 
                                                :filter-results="false" 
                                                :min-chars="0"
                                                :resolve-on-load="false"
                                                :infinite="true" 
                                                :limit="10"
                                                :rtl="true"
                                                :max="1" 
                                                :clear-on-search="true"
                                                :delay="0"
                                                :searchable="true"
                                                @clear="clearAccountValue()"
                                                @select="setAccountValue()"
                                                  :options="(query: any) => {
                                                    // let citySearchFilter = {} as CitySearchFilter
                                                    // citySearchFilter.name = query
                                                    // const data = await getAccountsList()
                                                    return accountsList
                                                    // return data.cities.map((item: any) => {
                                                    //     return { value: item.id, label: item.name }
                                                    // })
                                                }" @open="(select$: any) => {
                                                if (select$.noOptions) {
                                                    select$.resolveOptions()
                                                }
                                            }" /> -->

                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                            :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField id="test">
                                        <VLabel class="required">
                                            test</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput type="number" placeholder="" autocomplete="" />

                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                            :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-4">
                                <div class="mb-3">
                                    <VField id="test">

                                        <VLabel class="required">
                                            test</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput type="number" placeholder="" autocomplete="" />

                                        </VControl>
                                        <!-- <ErrorMessage class="help is-danger"
                                            :name="`service_price_${service.service.id}`" /> -->
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-1">
                                <button @click="removeRecord(record)">Remove</button>
                            </div>
                        </div>


                        <!-- <div class="column is-6">
                                <VField :key="service.service.id" v-for="service in servicesChecked"
                                    :id="`service_amount_${service.service.id}`">

                                    <VLabel class=" is-flex-wrap-nowrap" v-if="service.checked">
                                        Contractor's {{
        service.service.name
}}
                                        Service amount:
                                    </VLabel>
                                    <VControl v-if="service.checked" icon="feather:chevrons-right">
                                        <VInput disabled type="number"
                                            :value="(service.price * (contractorForm.data.payment_percentage / 100 ?? 0))"
                                            v-bind="service.price" v-model="service.contractor_service_amount"
                                            :key="service.service.id" />

                                    </VControl>
                                    <ErrorMessage class="help is-danger"
                                        :name="`service_amount_${service.service.id}`" />

                                </VField>
                            </div> -->
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


.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}


.field {

    .custom-label {
        font-family: var(--font);
        font-size: 0.9rem;
        color: var(--light-text) !important;
        font-weight: 400;
    }
}

.input {
    height: 38px;
}
</style>