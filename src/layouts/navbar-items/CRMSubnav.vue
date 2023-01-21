<script setup lang="ts">
import { useI18n } from 'vue-i18n';

type TabId = 'CRM' | 'templates'
const activeTab = ref<TabId>('CRM')
const {t} = useI18n()
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
              <div class="column is-3">
                <h4 class="column-heading">{{t('crm_subnav.customer.customers')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/customer">
                      <i class="fas fa-user" aria-hidden="true"></i>
                      <span>{{t('crm_subnav.customer.customers')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/customer-add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{t('crm_subnav.customer.create_customer')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 class="column-heading">{{t('crm_subnav.customer_group.customer_groups')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/customer-group">
                      <i class="lnir lnir-hierchy-alt" aria-hidden="true"></i>
                      <span>{{t('crm_subnav.customer_group.customer_groups')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/customer-group/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{t('crm_subnav.customer_group.create_customer_group')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
              </div>
              <!-- <div class="column is-3">
                <h4 class="column-heading">{{t('crm_subnav.social_media.social_medias')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/social-media">
                      <i class="fas fa-hashtag" aria-hidden="true"></i>
                      <span>{{t('crm_subnav.social_media.social_medias')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/social-media/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{t('crm_subnav.social_media.create_social_media')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
              </div> -->
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
