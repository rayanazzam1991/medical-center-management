<script lang="ts">import { useI18n } from 'vue-i18n'
import { defaultGeneratableMonth, GeneratableMonth } from '/@src/models/HR/Payroll/GeneratedSalariesMonth/generatedSalariesMonth'
import { defaultVariablePaymentSearchFilter, VariablePaymentSearchFilter } from '/@src/models/HR/Payroll/VariablePayment/variablePayment'
import { defaultPagination } from '/@src/utils/response'
import { Permissions } from '/@src/utils/consts/rolesPermissions'




export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        button_name: {
            type: String,
            default: '',
        },
        generatableMonths: {
            type: Array<GeneratableMonth>,
            default: []
        }
    },


    setup(props, context) {
        const { t } = useI18n()
        const generatableMonths = ref<GeneratableMonth[]>([])
        const selectedGeneratableMonth = ref<GeneratableMonth>(defaultGeneratableMonth)
        const title = ref('')
        generatableMonths.value = props.generatableMonths
        selectedGeneratableMonth.value = generatableMonths.value[generatableMonths.value.length - 1]
        title.value = props.title

        const getSalariesReview = () => {
            context.emit('getSalariesReview', selectedGeneratableMonth.value)

        }

        return { t,Permissions, generatableMonths, selectedGeneratableMonth, getSalariesReview, title }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="getSalariesReview">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="left">
                            <h3>{{ title }}</h3>
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <VSelect v-if="generatableMonths.length != 0" v-model="selectedGeneratableMonth">
                                    <VOption v-for="(generatableMonth, index) in generatableMonths" :key="index"
                                        :value="generatableMonth">
                                        {{ generatableMonth.month }} / {{ generatableMonth.year }}
                                    </VOption>
                                </VSelect>
                            </VControl>
                            <VControl>
                                <VButton v-permission="Permissions.SALARIES_REVIEW" :disabled="generatableMonths.length == 0"  @click="getSalariesReview" color="primary">{{ button_name }}
                                </VButton>
                            </VControl>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
