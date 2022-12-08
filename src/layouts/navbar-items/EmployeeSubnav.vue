<script setup lang="ts">
type TabId = 'Employee' | 'templates'
const activeTab = ref<TabId>('Employee')
</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper">


    <div class="container">
      <div class="tab-content" :class="[activeTab === 'Employee' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">Employee</h4>
                <ul>
                  <li>
                    <RouterLink to="/employee">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>All Employee</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/employee-add">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>Create Employee</span>
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
