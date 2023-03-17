<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Permissions } from '/@src/utils/consts/rolesPermissions'

type TabId = 'CRM' | 'templates'
const activeTab = ref<TabId>('CRM')
const { t } = useI18n()
const emits = defineEmits<{
  (e: 'close'): void
}>()

</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">
    <div class="container">
      <div class="tab-content" :class="[activeTab === 'CRM' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-4">
                <h4 v-permission="Permissions.CUSTOMER_ACCESS" class="column-heading">{{
                  t('crm_subnav.customer.customers') }}</h4>
                <ul>
                  <li v-permission="Permissions.CUSTOMER_LIST">
                    <RouterLink to="/customer">
                      <i class="fas fa-user mx-3" aria-hidden="true"></i>
                      <span>{{ t('crm_subnav.customer.customers') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.CUSTOMER_CREATE">
                    <RouterLink to="/customer-add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('crm_subnav.customer.create_customer') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 v-permission="Permissions.CUSTOMER_GROUP_ACCESS" class="column-heading">{{
                  t('crm_subnav.customer_group.customer_groups') }}</h4>
                <ul>
                  <li v-permission="Permissions.CUSTOMER_GROUP_LIST">
                    <RouterLink to="/customer-group">
                      <i class="lnir lnir-hierchy-alt" aria-hidden="true"></i>
                      <span>{{ t('crm_subnav.customer_group.customer_groups') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.CUSTOMER_GROUP_CREATE">
                    <RouterLink to="/customer-group/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('crm_subnav.customer_group.create_customer_group') }}</span>
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
// @import '/@src/scss/abstracts/all';
// @import '/@src/scss/layout/navbar';
// @import '/@src/scss/layout/responsive';
</style>
