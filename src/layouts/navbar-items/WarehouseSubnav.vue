<script setup lang="ts">
import { useI18n } from 'vue-i18n';

type TabId = 'warehouse' | 'templates'
const activeTab = ref<TabId>('warehouse')
const emits = defineEmits<{
    (e: 'close'): void
}>()
const {t,locale} = useI18n()
// const marginLR = locale.value =="ar" ? "ml-2" : ""

</script>

<template>
    <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


        <div class="container">
            <div class="tab-content" :class="[activeTab === 'warehouse' && 'is-active']">
                <div class="tab-content-inner">
                    <div class="center has-slimscroll">
                        <div class="columns">
                            <div class="column is-4">
                                <h4 class="column-heading">{{ t('warehouse_subnav.category.categories') }}</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/category">
                                            <i class="lnir lnir-briefcase" aria-hidden="true"></i>
                                            <span>{{  t('warehouse_subnav.category.categories') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/category/add">
                                            <i  aria-hidden="true" class="lnir lnir-circle-plus"></i>
                                            <span>{{t('warehouse_subnav.category.create_category')}}</span>
                                            <i  aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                                <h4 class="column-heading">{{t('warehouse_subnav.item.items')}}</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/item">
                                            <i  aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>{{t('warehouse_subnav.item.items')}}</span>
                                            <i  aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/item/add">
                                            <i  aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>{{t('warehouse_subnav.item.create_item')}}</span>
                                            <i  aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-4">
                                <h4 class="column-heading">{{ t('warehouse_subnav.quantity.quantity') }}</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/add-quantity">
                                            <i  aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>{{ t('warehouse_subnav.quantity.add_quantity') }}</span>
                                            <i  aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <RouterLink to="/withdraw-quantity">
                                            <i  aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>{{ t('warehouse_subnav.quantity.withdraw_quantity') }}</span>
                                            <i  aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                                <h4 class="column-heading">{{t('warehouse_subnav.item_history.item_history')}}</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/list-stock-movement">
                                            <i  aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>{{t('warehouse_subnav.item_history.list_stock_movement')}}</span>
                                            <i  aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                                <h4 class="column-heading">{{t('warehouse_subnav.inventory.inventory')}}</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/inventory">
                                            <i  aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>{{t('warehouse_subnav.inventory.inventory_table')}}</span>
                                            <i  aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
// @import '/@src/scss/abstracts/all';
// @import '/@src/scss/layout/navbar';
// @import '/@src/scss/layout/responsive';
</style>
