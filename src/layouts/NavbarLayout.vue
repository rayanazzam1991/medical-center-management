<script setup lang="ts">
import type { VAvatarProps, VAvatarColor } from '/@src/components/base/avatar/VAvatar.vue'
import type { UserPopover } from '/@src/models/users'
import { popovers } from '/@src/data/users/userPopovers'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'
import { useI18n } from 'vue-i18n'
import { useDarkmode } from '../stores/darkmode'
import AccountingSubnav from './navbar-items/AccountingSubnav.vue'

export type NavbarTheme = 'default' | 'colored' | 'fade'
export type SubnavId =
  | 'closed'
  | 'others'
  | 'CRM'
  | 'HR'
  | 'contractor'
  | 'warehouse'
  | 'accounting'
  | 'ticketing'

const props = withDefaults(
  defineProps<{
    theme?: NavbarTheme
    nowrap?: boolean
  }>(),
  {
    theme: 'default',
  }
)

const viewWrapper = useViewWrapper()
const darkmode = useDarkmode()
const panels = usePanels()
const route = useRoute()
const filter = ref('')
const isMobileSidebarOpen = ref(false)
const activeMobileSubsidebar = ref('dashboard')
const activeSubnav = ref<SubnavId>('closed')
const { t, locale } = useI18n()
const LR = locale.value == "ar" ? "left" : "right"
const filteredUsers = computed(() => {
  if (!filter.value) {
    return []
  }

  return Object.values(popovers).filter((user) => {
    return (
      user.fullName.match(new RegExp(filter.value, 'i')) ||
      user.position.match(new RegExp(filter.value, 'i'))
    )
  })
})

function toggleSubnav(subnav: SubnavId) {
  if (activeSubnav.value === subnav) {
    activeSubnav.value = 'closed'
  } else {
    activeSubnav.value = subnav
  }
}
function activateSubnav(subnav: SubnavId) {
  activeSubnav.value = subnav
}
function deactivateSubnav() {
  activeSubnav.value = 'closed'
}

function getAvatarData(user: UserPopover): VAvatarProps {
  return {
    picture: user.avatar,
    initials: user.initials,
    color: user.color as VAvatarColor,
  }
}

watch(
  () => route.fullPath,
  () => {
    activeSubnav.value = 'closed'
    isMobileSidebarOpen.value = false
  }
)
</script>

<template>
  <div class="navbar-layout">
    <div class="app-overlay"></div>

    <!-- Mobile navigation -->
    <MobileNavbar :is-open="isMobileSidebarOpen" @toggle="isMobileSidebarOpen = !isMobileSidebarOpen">
      <template #brand>
        <RouterLink to="/" class="navbar-item is-brand">
          <AnimatedLogo width="38px" height="38px" />
        </RouterLink>

      <div class="brand-end">
        <NotificationsMobileDropdown />
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <MobileSidebar :is-open="isMobileSidebarOpen" @toggle="isMobileSidebarOpen = !isMobileSidebarOpen">
      <template #links>
        <li>
          <a :class="[activeMobileSubsidebar === 'dashboard' && 'is-active']" tabindex="0"
            @keydown.space.prevent="activeMobileSubsidebar = 'dashboard'" @click="activeMobileSubsidebar = 'dashboard'">
            <i aria-hidden="true" class="iconify" data-icon="feather:activity"></i>
          </a>
        </li>
        <li>
          <a :class="[activeMobileSubsidebar === 'layouts' && 'is-active']" tabindex="0"
            @keydown.space.prevent="activeMobileSubsidebar = 'layouts'" @click="activeMobileSubsidebar = 'layouts'">
            <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
          </a>
        </li>
        <li :class="[activeMobileSubsidebar === 'elements' && 'is-active']" tabindex="0"
          @keydown.space.prevent="activeMobileSubsidebar = 'elements'" @click="activeMobileSubsidebar = 'elements'">
          <a>
            <i aria-hidden="true" class="iconify" data-icon="feather:box"></i>
          </a>
        </li>
        <li :class="[activeMobileSubsidebar === 'components' && 'is-active']" tabindex="0"
          @keydown.space.prevent="activeMobileSubsidebar = 'components'" @click="activeMobileSubsidebar = 'components'">
          <a>
            <i aria-hidden="true" class="iconify" data-icon="feather:cpu"></i>
          </a>
        </li>
        <li>
          <RouterLink to="/messaging-v1">
            <i aria-hidden="true" class="iconify" data-icon="feather:message-circle"></i>
          </RouterLink>
        </li>
      </template>

      <template #bottom-links>
        <li>
          <a tabindex="0" @keydown.space.prevent="panels.setActive('search')" @click="panels.setActive('search')">
          <i aria-hidden="true" class="iconify" data-icon="feather:search"></i>
        </a>
      </li>
      <li>
        <a href="#">
          <i aria-hidden="true" class="iconify" data-icon="feather:settings"></i>
        </a>
      </li>
    </template>
  </MobileSidebar>

  <!-- Mobile subsidebar links -->
    <Transition name="slide-x">
      <LayoutsMobileSubsidebar v-if="isMobileSidebarOpen && activeMobileSubsidebar === 'layouts'" />
      <DashboardsMobileSubsidebar v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'dashboard'" />
      <ComponentsMobileSubsidebar v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'components'" />
      <ElementsMobileSubsidebar v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'elements'" />
    </Transition>

    <!-- Desktop navigation -->
    <Navbar :theme="props.theme">
      <!-- Custom navbar title -->
      <template #title>
        <RouterLink to="/" class="brand">
          <img v-if="darkmode.isDark" src="/images/logos/logo/logo_light.png" />
          <img v-else src="/images/logos/logo/logo.png" />
        </RouterLink>

        <div class="separator"></div>

        <!-- <ProjectsQuickDropdown /> -->
        <h1 class="title is-5">{{ viewWrapper.pageTitle }}</h1>
      </template>

      <!-- Custom navbar toolbar -->
      <template #toolbar>
        <Toolbar class="desktop-toolbar">
          <!-- <ToolbarNotification /> -->

          <!-- <a class="toolbar-link right-panel-trigger" tabindex="0" @keydown.space.prevent="panels.setActive('activity')"
                                                                @click="panels.setActive('activity')">
                                                                <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
                                                              </a> -->
        </Toolbar>

        <!--        <LayoutSwitcher />-->
        <UserProfileDropdown LR />
      </template>

      <!-- Custom navbar links -->
      <template #links>
        <div class="centered-links" :class="''">
          <a :class="[
            (activeSubnav === 'others' ||
              route.path.startsWith('/nationality') ||
              route.path.startsWith('/department') ||
              route.path.startsWith('/city') ||
              route.path.startsWith('/userStatus') ||
              route.path.startsWith('/service/') ||
              route.path == ('/service') ||
              route.path.startsWith('/room') ||
              route.path.startsWith('/settings') ||
              route.path.startsWith('/supplier')
            ) &&
            'is-active',
          ]" class="centered-link centered-link-toggle" tabindex="0" @keydown.space.prevent="toggleSubnav('others')"
            @click="toggleSubnav('others')">
            <i class="iconify" data-icon="feather:layers" aria-hidden="true"></i>
            <span>{{ t("navbar.others") }}</span>
          </a>
          <a :class="[
            (activeSubnav === 'CRM' ||
              route.path == '/customer' ||
              route.path.startsWith('/customer/') ||
              route.path.startsWith('/customer-add') ||
              route.path.startsWith('/customer-edit') ||
              route.path.startsWith('/customer-group') ||
              route.path.startsWith('/social-media')) &&
            'is-active',
          ]" class="centered-link centered-link-toggle" tabindex="0" @keydown.space.prevent="toggleSubnav('CRM')"
            @click="toggleSubnav('CRM')">
            <i aria-hidden="true" class="iconify" data-icon="feather:user"></i>
            <span>{{ t("navbar.crm") }}</span>
          </a>
          <!-- <a :class="[((activeSubnav === 'contractor') ||
                                      route.path.startsWith('/contractor') ||
                                      route.path.startsWith('/contractor-add') ||
                                      route.path.startsWith('/contractor-edit') ||
                                      route.path.startsWith('/speciality') ||
                                      route.path.startsWith('/bulk-cash-out')


                                    ) && 'is-active']" class="centered-link centered-link-toggle" tabindex="0"
                                      @keydown.space.prevent="toggleSubnav('contractor')" @click="toggleSubnav('contractor')">
                                      <i class="iconify" data-icon="feather:file-text" aria-hidden="true"></i>
                                      <span>{{ t("navbar.contractor") }}</span>
                                  </a> -->
          <a :class="[((activeSubnav === 'ticketing') ||
            route.path.startsWith('/ticket') ||
            route.path.startsWith('/waiting-list') ||
            route.path.startsWith('/requested-services') ||
            route.path.startsWith('/reminder') ||
            route.path.startsWith('/service-history-screen')
          ) && 'is-active']" class="centered-link centered-link-toggle" tabindex="0"
            @keydown.space.prevent="toggleSubnav('ticketing')" @click="toggleSubnav('ticketing')">
            <i class="iconify" data-icon="bi:ticket-perforated" aria-hidden="true"></i>
            <span>{{ t("navbar.ticketing") }}</span>
          </a>
        <a :class="[(activeSubnav === 'HR' ||
          route.path.startsWith('/employee') ||
          route.path.startsWith('/employee-add') ||
          route.path.startsWith('/employee-edit') ||
          route.path.startsWith('/position') ||
          route.path.startsWith('/variable-payment') ||
          route.path.startsWith('/employee-variable-payment') ||
          route.path.startsWith('/generate-salaries') ||
          route.path.startsWith('/attendance-justification')
        ) && 'is-active']" class="centered-link centered-link-toggle" tabindex="0"
            @keydown.space.prevent="toggleSubnav('HR')" @click="toggleSubnav('HR')">
            <i class="iconify" data-icon="feather:briefcase" aria-hidden="true"></i>
            <span>{{ t('navbar.human_resources') }}</span>
          </a>
          <a :class="[(activeSubnav === 'warehouse' ||
            route.path.startsWith('/category') ||
            route.path.startsWith('/item') ||
            route.path.startsWith('/inventory') ||
            route.path.startsWith('/list-inventory-movement')
          ) && 'is-active']" class="centered-link centered-link-toggle" tabindex="0"
            @keydown.space.prevent="toggleSubnav('warehouse')" @click="toggleSubnav('warehouse')">
            <i class="iconify" data-icon="feather:grid" aria-hidden="true"></i>
            <span>{{ t('navbar.warehouse') }}</span>
          </a>
          <a :class="[
            (activeSubnav === 'accounting' ||
              route.path.startsWith('/deliver-salaries') ||
              route.path.startsWith('/onhold-salaries') ||
              route.path.startsWith('/salary') ||
              route.path.startsWith('/trial-balance-report') ||
              route.path.startsWith('/balance-sheet-report') ||
              route.path.startsWith('/income-statment-report') ||
              route.path.startsWith('/add-cash-account') ||
              route.path.startsWith('/account') ||
              route.path.startsWith('/transfer-cash-money') ||
              route.path.startsWith('/add-record') ||
              route.path.startsWith('/add-custom-revenue') ||
              route.path.startsWith('/transaction') ||
              route.path.startsWith('/add-custom-expense')
            ) &&
            'is-active',
          ]" class="centered-link centered-link-toggle" tabindex="0"
            @keydown.space.prevent="toggleSubnav('accounting')" @click="toggleSubnav('accounting')">
            <i class="iconify" data-icon="feather:dollar-sign" aria-hidden="true"></i>
            <span>{{ t("navbar.accounting") }}</span>
          </a>

        </div>
      </template>

      <!-- Custom navbar sub navigation -->
      <template #subnav>
        <div :class="[
          !(activeSubnav === 'closed') && 'is-active',
        ]" class="navbar-subnavbar">

          <OthersSubnav :class="[activeSubnav === 'others' && 'is-active']" @close="deactivateSubnav" />
          <CRMSubnav :class="[activeSubnav === 'CRM' && 'is-active']" @close="deactivateSubnav" />
          <!-- <ContractorSubnav :class="[activeSubnav === 'contractor' && 'is-active']" @close="deactivateSubnav" /> -->
          <EmployeeSubnav :class="[activeSubnav === 'HR' && 'is-active']" @close="deactivateSubnav" />
          <WarehouseSubnav :class="[activeSubnav === 'warehouse' && 'is-active']" @close="deactivateSubnav" />
          <AccountingSubnav :class="[activeSubnav === 'accounting' && 'is-active']" @close="deactivateSubnav" />
          <TicketingSubnav :class="[activeSubnav === 'ticketing' && 'is-active']" @close="deactivateSubnav" />
        </div>
      </template>
    </Navbar>

    <!-- <LanguagesPanel /> -->
    <!-- <ActivityPanel /> -->
    <!-- <TaskPanel /> -->

    <VViewWrapper top-nav>
      <VPageContentWrapper>
        <template v-if="props.nowrap">
          <slot></slot>
        </template>
        <VPageContent v-else class="is-relative">
          <div class="is-navbar-lg">
            <div class="page-title has-text-centered">
              <!-- Mobile Page Title -->
              <div class="title-wrap">
                <h1 class="title is-4">{{ viewWrapper.pageTitle }}</h1>
              </div>

              <!-- <Toolbar class="mobile-toolbar">
                                                                    <ToolbarNotification />

                                                                    <a class="toolbar-link right-panel-trigger" tabindex="0"
                                                                      @keydown.space.prevent="panels.setActive('activity')" @click="panels.setActive('activity')">
                                                                      <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
                                                                    </a>
                                                                  </Toolbar> -->
            </div>

            <slot></slot>
          </div>
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>
  </div>
</template>
