<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TrialBalanceLvl1Chart } from '/@src/models/Accounting/Account/account';
import sleep from '/@src/utils/sleep';

export interface TrailBalanceCollapseProps {
    items: TrialBalanceLvl1Chart[]
    withChevron?: boolean,
    is_expanded: boolean
}

const props = withDefaults(defineProps<TrailBalanceCollapseProps>(), {
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
const { t } = useI18n()
const internalItemsOpen = ref<number[] | undefined>(props.itemsOpen)
const isExpanded = ref<boolean>(props.is_expanded)
const toggle = (key: number) => {
    let isClose = false
    if (internalItemsOpen.value != undefined) {
        if (internalItemsOpen.value.find((item) => item === key + 1) != undefined) {
            let newInternalItemsOpen = internalItemsOpen.value.filter(item => item !== key + 1);
            internalItemsOpen.value = newInternalItemsOpen
            isClose = true
        }
    }
    if (isClose) {
        return
    }
    if (!internalItemsOpen.value)
        internalItemsOpen.value = []
    internalItemsOpen.value.push(key + 1)

}
</script>

<template>
    <details v-for="(item, key) in items" :key="key + 1"
        :class="[withChevron && 'has-chevron', !withChevron && 'has-plus']"
        :open="(internalItemsOpen?.find((item) => item == key + 1) ? true : false)" class="collapse">
        <slot name="collapse-item" :item="item" :index="key + 1" :toggle="toggle">
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
                    <slot name="collapse-item-head" :item="item" :index="key + 1"></slot>
                    <div class="collapse-icon">
                        <VIcon v-if="withChevron" icon="feather:chevron-down" />
                        <VIcon v-else-if="!withChevron" icon="feather:plus" />
                    </div>
                </div>
            </summary>
            <div class="collapse-content">
                <slot name="trail-balance-collapse-item-content" :item="item" :index="key + 1" :toggle="toggle">
                    <TrailBalanceLvl1Collapse :items="item.children" with-chevron :is_expanded="isExpanded"
                        :close="(internalItemsOpen?.find((item) => item == key + 1) ? false : true)" />
                </slot>
                <div class="account-details columns is-flex-direction-row-reverse is-justify-content-space-between"
                    v-if="item.children.length != 0">
                    <div class="meta is-flex column is-3 columns ml-5">
                        <div class="accounts-header column is-6">
                            <h1 class="accounts-cell">
                                {{ t('trial_balance_report.credit') }}
                            </h1>

                        </div>

                        <div class="accounts-header column is-6">
                            <h1 class="accounts-cell">

                                {{ t('trial_balance_report.debit') }}
                            </h1>

                        </div>
                    </div>
                </div>

                <div v-if="item.children.length != 0"
                    class="account-details accounts-footer columns is-flex-direction-row-reverse is-justify-content-end">
                    <div class="meta is-flex column is-3 columns ml-5 my-0 ">
                        <div class="account-code column is-6 is-align-self-center">
                            <div class="accounts-cell">
                                {{ item.total_credits }}
                            </div>

                        </div>

                        <div class="account-name column is-6 is-align-self-center">
                            <div class="accounts-cell">
                                {{ item.total_debits }}
                            </div>

                        </div>
                    </div>
                    <!-- <h1 class="mt-1"> {{ t('trial_balance_report.lvl1_total' , { chart_name: item.name }) }} </h1> -->

                </div>

            </div>
        </slot>
    </details>
</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';

.collapse {
    @include vuero-s-card;

    padding: 0;
    margin-bottom: 1.5rem;

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
        padding: 0 20px 20px;
        color: var(--light-text);
        font-family: var(--font);

        p:not(:last-child) {
            margin-bottom: 12px;
        }
    }

    .account-details {
        padding: 0.5rem 1.75rem;
        margin-right: 0;
        margin-left: 0;
        height: 2rem;
        border-bottom: 1px solid var(--fade-grey-dark-3);

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

    }

}

.is-dark {
    .collapse {
        @include vuero-card--dark;

        &[open] {
            .collapse-header {
                .collapse-icon {
                    background: var(--dark-sidebar-light-2);
                    border-color: var(--dark-sidebar-light-4) !important;
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
