<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AccountConsts, TrialBalanceLvl2Chart } from '/@src/models/Accounting/Account/account';

export interface TrailBalanceLvl1CollapseProps {
    items: TrialBalanceLvl2Chart[]
    withChevron?: boolean,
    is_expanded: boolean
}
const props = withDefaults(defineProps<TrailBalanceLvl1CollapseProps>(), {
    items: () => [],
    itemsOpen: undefined,
    is_expanded: false
})
onMounted(() => {
    if (isExpanded.value) {
        let index = 1
        internalItemsOpen.value = []
        props.items.forEach((element) => {
            if (internalItemsOpen.value) {
                internalItemsOpen.value.push(index)
                index++
            }
        });
    }
})

const internalItemsOpen = ref<number[] | undefined>(props.itemsOpen)
const isExpanded = ref<boolean>(props.is_expanded)
const { t } = useI18n()
const toggle = (key: number) => {
    let isClose = false
    if (internalItemsOpen.value != undefined) {
        if (internalItemsOpen.value.find((item) => item === key + 1) != undefined) {
            let newInternalItemsOpen = internalItemsOpen.value.filter(item => item !== key + 1);
            internalItemsOpen.value = newInternalItemsOpen
            isClose = true
        }
    }
    if (isClose)
        return
    if (!internalItemsOpen.value)
        internalItemsOpen.value = []
    internalItemsOpen.value.push(key + 1)

}
</script>

<template>
    <details v-for="(item, key) in items" :key="key" :class="[withChevron && 'has-chevron', !withChevron && 'has-plus']"
        :open="((internalItemsOpen?.find((item) => item == key + 1) ? true : false))" class="collapse-lvl1">
        <slot name="collapse-item1" :item="item" :index="key" :toggle="toggle">
            <summary class="collapse-header" tabindex="0" @keydown.space.prevent="() => toggle(key)"
                @click.prevent="() => toggle(key)">
                <div class="is-flex">
                    <slot clas name="collapse-item-summary1" :item="item" :index="key" :toggle="toggle">
                        <h3 class="mr-2 is-size-6">
                            {{ item.code }}
                        </h3>
                    </slot>
                    <slot name="collapse-item-summary1" :item="item" :index="key" :toggle="toggle">
                        <h3 class="is-size-6">
                            {{ item.name }}
                        </h3>
                    </slot>
                </div>
                <div class="collapse-head-info">
                    <div class="is-flex">
                        <div class="chart-row">
                            <div class="accounts-cell open-has-bold">
                                {{ item.total_credits }}
                            </div>
                        </div>
                        <div class="chart-row mr-5">
                            <div class="accounts-cell open-has-bold">
                                {{ item.total_debits }}
                            </div>
                        </div>
                    </div>
                    <slot name="collapse-item-head" :item="item" :index="key + 1"></slot>
                    <div class="collapse-icon">
                        <VIcon v-if="withChevron" icon="feather:chevron-down" />
                        <VIcon v-else-if="!withChevron" icon="feather:plus" />
                    </div>
                </div>
            </summary>
            <div class="collapse-content">
                <slot name="trail-balance-lvl1-collapse-item-content1" :item="item" :index="key" :toggle="toggle">
                    <div class="account-details columns is-flex is-justify-content-space-between"
                        v-for="account in item.accounts">
                        <div class="meta is-flex column is-3 columns my-0 is-align-items-center">
                            <div class="account-code mr-2">
                                <div class="accounts-cell">
                                    {{ account.code }}
                                </div>
                            </div>
                            <div class="account-name mr-2">
                                <div class="accounts-cell">

                                    {{ account.name }}
                                </div>
                            </div>
                        </div>
                        <div class="is-flex is-align-items-center ">
                            <div class="chart-row">
                                <div class=" accounts-cell">
                                    {{
                                        account.absolute_type == AccountConsts.CREDIT_TYPE ? account.absolute_balance : '-'
                                    }}
                                </div>
                            </div>
                            <div class="chart-row mr-5">
                                <div class="accounts-cell">
                                    {{
                                        account.absolute_type == AccountConsts.DEBIT_TYPE ? account.absolute_balance : '-'
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.accounts.length == 0" class="account-details accounts-footer my-2">
                        <div class="meta is-flex">
                            <div class="account-code mr-2">
                                {{ t('trial_balance_report.no_accounts_place_holder') }}
                            </div>
                        </div>
                    </div>
                </slot>
            </div>
        </slot>
    </details>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.collapse-lvl1 {
    border-bottom: 1px solid var(--fade-grey-dark-3) !important;
    padding: 0;
    margin-bottom: 10px;

    &[open] {
        background-color: var(--fade-grey-dark-3) !important;

    }

    &.has-plus {
        &[open] {
            .collapse-header {

                .collapse-icon {
                    transform: rotate(45deg);
                }
            }

            .collapse-content {
                display: block;
            }
        }
    }

    &.has-chevron {
        &[open] {
            .collapse-header {
                border-right: 4px solid var(--secondary);
                border-bottom: 1px solid var(--smoke-white) !important;
                background-color: var(--background-grey) !important;


                .collapse-icon {
                    transform: rotate(180deg);
                }
            }

            .collapse-content {
                display: block;
            }
        }
    }

    &[open] {
        .collapse-icon {
            border-color: var(--fade-grey-dark-3) !important;
            box-shadow: var(--light-box-shadow);
        }

        .open-has-bold {
            font-weight: 800;

        }

    }

    .collapse-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 20px;
        cursor: pointer;

        h3 {
            font-family: var(--font-alt);
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--dark-text);
        }

        .collapse-head-info {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .collapse-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            width: 30px;
            background: var(--white);
            border-radius: var(--radius-rounded);
            border: 1px solid transparent;
            transition: all 0.3s; // transition-all test

            >span {
                display: block;
                height: 16px;
                width: 16px;
            }

            svg {
                height: 16px;
                width: 16px;
                color: var(--light-text);
            }
        }
    }

    .collapse-content {
        display: none;
        padding: 0 20px;
        color: var(--light-text);
        font-family: var(--font);

        p:not(:last-child) {
            margin-bottom: 12px;
        }
    }

    .account-details {
        padding: 0.5rem 1rem;
        margin-bottom: 0;
        margin-right: 0;
        margin-left: 0;
        height: 2rem;
        border-bottom: 1px solid var(--smoke-white);

        &.accounts-footer {
            border: none;
        }

        .meta {

            .account-name,
            .account-code,
            .accounts-header {
                font-size: 1rem;
                font-weight: 800;


                .accounts-cell {
                    text-align: center;

                }
            }

        }

        &.accounts-padding {
            padding-left: 2rem;
        }

        .is-flex {
            margin-left: 18px;
        }


    }

    .chart-row {
        width: 200px;

        &.account-row {
            margin-left: 15px;

        }
    }



}

.collapse-lvl1:last-child {
    border-bottom: none !important;
}

.collapse-content {
    .account-details:last-child {
        border-bottom: none !important;

    }
}

.is-dark {
    .collapse-lvl1 {
        border-color: var(--dark-sidebar-light-12) !important;

        &[open] {
            background-color: var(--dark-sidebar-light-2) !important;

            .collapse-header {
                background-color: var(--dark-sidebar-light-4) !important;

                .collapse-icon {
                    background: var(--dark-sidebar-light-2);
                    border-color: var(--dark-sidebar-light-4) !important;
                }
            }
        }

        &.has-chevron {
            &[open] {
                .collapse-header {
                    border-bottom: 1px solid var(--dark-sidebar-light-12) !important;
                }
            }
        }

        .collapse-header {
            h3 {
                color: var(--dark-dark-text);
            }

            .collapse-icon {
                background: var(--dark-sidebar-light-6);
                border-color: var(--dark-sidebar-light-6);
            }
        }

        .account-details {
            border-color: var(--dark-sidebar-light-12);

        }

    }
}
</style>
