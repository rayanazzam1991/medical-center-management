<script setup lang="ts">
type TabId = 'warehouse' | 'templates'
const activeTab = ref<TabId>('warehouse')
const emits = defineEmits<{
    (e: 'close'): void
}>()

</script>

<template>
    <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


        <div class="container">
            <div class="tab-content" :class="[activeTab === 'warehouse' && 'is-active']">
                <div class="tab-content-inner">
                    <div class="center has-slimscroll">
                        <div class="columns">
                            <div class="column is-3">
                                <h4 class="column-heading">Categories</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/category">
                                            <i class="lnir lnir-briefcase" aria-hidden="true"></i>
                                            <span>Categories</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/category/add">
                                            <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                                            <span>Create Category</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                                <h4 class="column-heading">Items</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/item">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>Items</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/item/add">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>Create item</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">Quantity</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/addQuantity">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>Add Quantity</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <RouterLink to="/withdrawQuantity">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>Withdraw Quantity</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">History</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/list-stock-movement">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>List Stock Movement</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
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
@import '/@src/scss/abstracts/all';
@import '/@src/scss/layout/navbar';
@import '/@src/scss/layout/responsive';
</style>
