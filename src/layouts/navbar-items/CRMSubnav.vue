<script setup lang="ts">
type TabId = 'CRM' | 'templates'
const activeTab = ref<TabId>('CRM')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">
    <div class="container">
      <div class="tab-content" :class="[activeTab === 'CRM' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">Customer</h4>
                <ul>
                  <li>
                    <RouterLink to="/customer">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>All Customer</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/customer-add">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>Create Customer</span>
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
