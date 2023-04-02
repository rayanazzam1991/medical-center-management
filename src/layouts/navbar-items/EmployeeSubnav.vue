<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
import { Permissions } from '/@src/utils/consts/rolesPermissions'

type TabId = 'HR' | 'templates'
const activeTab = ref<TabId>('HR')
const emits = defineEmits<{
  (e: 'close'): void
}>()
const { t } = useI18n()

</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


    <div class="container">
      <div class="tab-content" :class="[activeTab === 'HR' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-4"
                v-if="checkPermission(Permissions.EMPLOYEE_ACCESS) || checkPermission(Permissions.POSITION_ACCESS)">
                <h4 v-permission="Permissions.EMPLOYEE_ACCESS" class="column-heading">{{
                  t('human_resources_subnav.employee.employees') }}</h4>
                <ul>
                  <li v-permission="Permissions.EMPLOYEE_LIST">
                    <RouterLink to="/employee">
                      <i class="lnir lnir-briefcase" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.employee.employees') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.EMPLOYEE_CREATE">
                    <RouterLink to="/employee-add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('human_resources_subnav.employee.create_employee') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/dismissed-employee">

                      <i class="lnil lnil-firecracker" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.employee.employee_history') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 v-permission="Permissions.POSITION_ACCESS" class="column-heading">{{
                  t('human_resources_subnav.position.positions') }}</h4>
                <ul>
                  <li v-permission="Permissions.POSITION_LIST">
                    <RouterLink to="/position">
                      <i class="lnir lnir-hierchy-alt" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.position.positions') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.POSITION_CREATE">
                    <RouterLink to="/position/add">
                      <i class="lnir lnir-circle-plus" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.position.create_position') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
              </div>
              <div class="column is-4" v-if="checkPermission(Permissions.EMPLOYEE_SCHEDULE_ACCESS) || checkPermission(Permissions.ATTENDANCE_JUSTIFICATION_ACCESS)
                || checkPermission(Permissions.ATTENDANCE_ACCESS) || checkPermission(Permissions.SALARIES_GENERATE)">
                <h4 v-permission="Permissions.EMPLOYEE_SCHEDULE_ACCESS" class="column-heading">{{
                  t('human_resources_subnav.employees_schedule') }}</h4>
                <ul>
                  <li v-permission="Permissions.EMPLOYEE_SCHEDULE_LIST">
                    <RouterLink to="/employee-schedule">
                      <i aria-hidden="true" class="lnir lnir-calender-alt-1"></i>
                      <span>{{ t('human_resources_subnav.employees_schedule') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <h4 v-permission="Permissions.ATTENDANCE_JUSTIFICATION_ACCESS" class="column-heading">{{
                  t('human_resources_subnav.attendance_justifications') }}</h4>
                <ul>
                  <li v-permission="Permissions.ATTENDANCE_JUSTIFICATION_LIST">
                    <RouterLink to="/attendance-justification">
                      <i aria-hidden="true" class="lnir lnir-calender-alt-1"></i>
                      <span>{{ t('human_resources_subnav.attendance_justifications') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <h4 v-permission="Permissions.ATTENDANCE_ACCESS" class="column-heading">{{
                  t('human_resources_subnav.employees_attendance') }}</h4>
                <ul>
                  <li v-permission="Permissions.ATTENDANCE_LIST">
                    <RouterLink to="/employee-attendance">
                      <i class="lnir lnir-calender-alt" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.employees_attendance') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <h4 v-permission="Permissions.SALARIES_GENERATE" class="column-heading">{{
                  t('human_resources_subnav.generate_salaries') }}</h4>
                <ul>
                  <li v-permission="Permissions.SALARIES_GENERATE">
                    <RouterLink to="/generate-salaries">
                      <i class="fas fa-money-check-alt mx-2" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.generate_salaries') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4"
                v-if="checkPermission(Permissions.VARIABLE_PAYMENT_ACCESS) || checkPermission(Permissions.EMPLOYEE_VARIABLE_PAYMENT_ACCESS)">
                <h4 v-permission="Permissions.VARIABLE_PAYMENT_ACCESS" class="column-heading">{{
                  t('human_resources_subnav.variable_payment.variable_payments') }}</h4>
                <ul>
                  <li v-permission="Permissions.VARIABLE_PAYMENT_LIST">
                    <RouterLink to="/variable-payment">
                      <i class="fas fa-money-check mx-2" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.variable_payment.variable_payments') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.VARIABLE_PAYMENT_CREATE">
                    <RouterLink to="/variable-payment/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('human_resources_subnav.variable_payment.create_variable_payment') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 v-permission="Permissions.EMPLOYEE_VARIABLE_PAYMENT_ACCESS" class="column-heading">
                  {{ t('human_resources_subnav.employee_variable_payment.employee_variable_payments') }}</h4>
                <ul>
                  <li v-permission="Permissions.EMPLOYEE_VARIABLE_PAYMENT_LIST">
                    <RouterLink to="/employee-variable-payment">
                      <i class="fas fa-money-check mx-2" aria-hidden="true"></i>
                      <span>{{ t('human_resources_subnav.employee_variable_payment.employee_variable_payments') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.EMPLOYEE_VARIABLE_PAYMENT_CREATE">
                    <RouterLink to="/employee-variable-payment/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('human_resources_subnav.employee_variable_payment.create_employee_variable_payment')
                      }}</span>
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
// @import '/@src/scss/abstracts/all';
// @import '/@src/scss/layout/navbar';
// @import '/@src/scss/layout/responsive';
</style>
