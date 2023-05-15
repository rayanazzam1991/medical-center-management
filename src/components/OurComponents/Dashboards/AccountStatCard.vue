<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

export interface AccountStatCardProps {
    title: string,
    color: | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'purple'
    | 'yellow'
    | 'orange'
    | 'green'
    | 'red'
    | 'blue',
    size: 'small' | 'medium' | 'large' | 'big' | 'xl',
    icon: string,
    rounded: boolean
    bordered: boolean
    loading: boolean
    balance: string
    code: string
    currency_rate: number


}

const props = withDefaults(defineProps<AccountStatCardProps>(), {
    color: 'primary',
    icon: undefined,
    percentage: undefined,
    increase: undefined,
    size: 'small',
    title: '',
    bordered: false,
    rounded: false,
    loading: true,
    balance: '0.00',
    code: '',
    currency_rate: 1
})
const { t } = useI18n()

</script>

<template>
    <VLoader :active="props.loading" size="small">
        <div class="dashboard-tile">
            <div class="tile-head">
                <h3 class="dark-inverted is-size-5">{{ props.title }} - {{ t('dashboards.cashier.code') }} {{ props.code }}
                </h3>
                <VIconBox :bordered="props.bordered" :color="props.color" :rounded="props.rounded" :size="props.size">
                    <i v-if="props.icon.includes(':')" :data-icon="props.icon" aria-hidden="true" class="iconify"></i>
                    <i v-else :class="props.icon" aria-hidden="true"></i>
                </VIconBox>
            </div>
            <div class="tile-body">
                <h3 class="dark-inverted"><span class="is-size-6">{{ t('dashboards.cashier.balance') }}</span> {{
                    props.balance }}</h3>
                <h3 class="dark-inverted"><span class="is-size-6">{{ t('dashboards.cashier.currency_rate') }}</span> {{
                    props.currency_rate }}</h3>
            </div>
        </div>
    </VLoader>
</template>

<style lang="scss" scoped>
@import '/@src/scss/Styles/Dashboards/statCard.scss';
</style>
