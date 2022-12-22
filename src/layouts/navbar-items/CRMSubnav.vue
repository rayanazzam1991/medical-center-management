<script setup lang="ts">
type TabId = 'CRM' | 'templates'
const activeTab = ref<TabId>('CRM')
  const emits = defineEmits<{
    (e: 'close'): void
}>()

</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper"  @mouseleave="() => emits('close')">
    <div class="container">
      <div class="tab-content" :class="[activeTab === 'CRM' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">Customers</h4>
                <ul>
                  <li>
                    <RouterLink to="/customer">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>Customers</span>
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
                </ul><br />
                <h4 class="column-heading">Customer Groups</h4>
                <ul>
                  <li>
                    <RouterLink to="/customer-group">
                      <i aria-hidden="true" class="lnil lnil-pizza"></i>
                      <span>Customer Groups</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/customer-group/add">
                      <i aria-hidden="true" class="lnil lnil-map"></i>
                      <span>Create Customer Group</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
              </div>
              <div class="column is-3">
                <h4 class="column-heading">Social Media</h4>
                <ul>
                  <li>
                    <RouterLink to="/social-media">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>Social Media</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/social-media/add">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>Create Social Media</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
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
