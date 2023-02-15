<script setup lang="ts">
import { TrialBalanceAccount } from '/@src/models/Accounting/Account/account';

export interface TrailBalanceLvl2CollapseProps {
    items: TrialBalanceAccount[]
    withChevron?: boolean,
}

const props = withDefaults(defineProps<TrailBalanceLvl2CollapseProps>(), {
    items: () => [],
    itemOpen: undefined,

})

const internalItemOpen = ref<number | undefined>(props.itemOpen)
const toggle = (key: number) => {
    if (internalItemOpen.value === key) {
        internalItemOpen.value = undefined
        return
    }
    internalItemOpen.value = key
}
</script>

<template>
    <details v-for="(item, key) in items" :key="key" :class="[withChevron && 'has-chevron', !withChevron && 'has-plus']"
        :open="(internalItemOpen === key || undefined)" class="collapse-lvl2">
        <slot name="collapse-item2" :item="item" :index="key" :toggle="toggle">
            <summary class="collapse-header" tabindex="0" @keydown.space.prevent="() => toggle(key)"
                @click.prevent="() => toggle(key)">
                <h3>
                    <slot name="collapse-item-summary2" :item="item" :index="key" :toggle="toggle">
                        {{ item.name }}
                    </slot>
                    <slot name="collapse-item-summary2" :item="item" :index="key" :toggle="toggle">
                        {{ item.code }}
                    </slot>
                </h3>
            </summary>
        </slot>
    </details>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.collapse-lvl2 {
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
}

.is-dark {
    .collapse-lvl2 {
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
    }
}
</style>
