<script setup lang="ts">
import type { VAvatarProps, VAvatarColor } from '/@src/components/base/avatar/VAvatar.vue'
import type { UserPopover } from '/@src/models/users'
import { popovers } from '/@src/data/users/userPopovers'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'

export type NavbarTheme = 'default' | 'colored' | 'fade'
export type SubnavId =
  | 'closed'
  | 'others'
  | 'CRM'
  | 'employee'
  | 'contractor'

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
const panels = usePanels()
const route = useRoute()
const filter = ref('')
const isMobileSidebarOpen = ref(false)
const activeMobileSubsidebar = ref('dashboard')
const activeSubnav = ref<SubnavId>('closed')

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
          <AnimatedLogo width="38px" height="38px" />
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
        <UserProfileDropdown right />
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
    route.path.startsWith('/service') ||
    route.path.startsWith('/room')) &&
  'is-active',
]" class="centered-link centered-link-toggle" tabindex="0" @keydown.space.prevent="toggleSubnav('others')"
            @click="toggleSubnav('others')">
            <i class="iconify" data-icon="feather:layers" aria-hidden="true"></i>
            <span>Others</span>
          </a>
          <a :class="[
  (activeSubnav === 'CRM' ||
    route.path.startsWith('/customer') ||
    route.path.startsWith('/customer-add') ||
    route.path.startsWith('/customer-edit') ||
    route.path.startsWith('/customer-group') ||
    route.path.startsWith('/social-media')) &&
  'is-active',
]" class="centered-link centered-link-toggle" tabindex="0" @keydown.space.prevent="toggleSubnav('CRM')"
            @click="toggleSubnav('CRM')">
            <i aria-hidden="true" class="iconify" data-icon="feather:user"></i>
            <span>CRM</span>
          </a>
          <a :class="[((activeSubnav === 'contractor') ||
            route.path.startsWith('/contractor') ||
            route.path.startsWith('/contractor-add') ||
            route.path.startsWith('/contractor-edit') ||
            route.path.startsWith('/speciality') ||
            route.path.startsWith('/speciality-add')
          
          
          ) && 'is-active']" class="centered-link centered-link-toggle" tabindex="0"
            @keydown.space.prevent="toggleSubnav('contractor')" @click="toggleSubnav('contractor')">
            <i class="iconify" data-icon="feather:file-text" aria-hidden="true"></i>
            <span>Contractors</span>
          </a>
          <a :class="[(activeSubnav === 'employee' ||
            route.path.startsWith('/employee') ||
            route.path.startsWith('/employee-add') ||
            route.path.startsWith('/employee-edit') ||
            route.path.startsWith('/position') ||
            route.path.startsWith('/position-add')
          ) && 'is-active']" class="centered-link centered-link-toggle" tabindex="0"
            @keydown.space.prevent="toggleSubnav('employee')" @click="toggleSubnav('employee')">
            <i class="iconify" data-icon="feather:briefcase" aria-hidden="true"></i>
            <span>Employees</span>
          </a>
        </div>
        <!-- 
        <div class="centered-search" :class="[activeSubnav !== 'search' && 'is-hidden']">
          <div class="field">
            <div class="control has-icon">
              <input v-model="filter" type="text" class="input is-rounded search-input"
                placeholder="Search records..." />
              <div class="form-icon">
                <i aria-hidden="true" class="iconify" data-icon="feather:search"></i>
              </div>
              <div class="form-icon is-right" tabindex="0" @keydown.space.prevent="toggleSubnav('search')"
                @click="toggleSubnav('search')">
                <i aria-hidden="true" class="iconify" data-icon="feather:x"></i>
              </div>
              <div v-if="filteredUsers.length > 0" class="search-results has-slimscroll is-active">
                <div v-for="user in filteredUsers" :key="user.id" class="search-result">
                  <VAvatar v-bind="getAvatarData(user)" />
                  <div class="meta">
                    <span>{{ user.username }}</span>
                    <span>{{ user.position }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </template>

      <!-- Custom navbar sub navigation -->
      <template #subnav>
        <div :class="[
  !(activeSubnav === 'closed') && 'is-active',
]" class="navbar-subnavbar">

          <OthersSubnav :class="[activeSubnav === 'others' && 'is-active']" @close="deactivateSubnav" />

          <CRMSubnav :class="[activeSubnav === 'CRM' && 'is-active']" @close="deactivateSubnav" />

          <ContractorSubnav :class="[activeSubnav === 'contractor' && 'is-active']" @close="deactivateSubnav" />

          <EmployeeSubnav :class="[activeSubnav === 'employee' && 'is-active']" @close="deactivateSubnav" />
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
