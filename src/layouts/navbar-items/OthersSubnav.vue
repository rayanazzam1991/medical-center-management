<script setup lang="ts">
type TabId = 'others' | 'templates'
const activeTab = ref<TabId>('others')
const emits = defineEmits<{
    (e: 'close'): void
}>()

</script>

<template>
    <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


        <div class="container">
            <div class="tab-content" :class="[activeTab === 'others' && 'is-active']">
                <div class="tab-content-inner">
                    <div class="center has-slimscroll">
                        <div class="columns">
                            <div class="column is-3">
                                <h4 class="column-heading">Nationalities</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/nationality">
                                            <i aria-hidden="true" class="lnil lnil-pizza"></i>
                                            <span>Nationalities</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/nationality/add">
                                            <i aria-hidden="true" class="lnil lnil-map"></i>
                                            <span>Create Nationality</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                                <h4 class="column-heading">Services</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/service">
                                            <i aria-hidden="true" class="lnil lnil-cardiology"></i>
                                            <span>Services</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/service/add">
                                            <i aria-hidden="true" class="lnil lnil-plane-alt"></i>
                                            <span>Create Service</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                                <!-- <h4 class="column-heading">User Status</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/userstatus">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>All UserStatus</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/userstatus/add">
                                            <i aria-hidden="true" class="lnil lnil-pie-chart"></i>
                                            <span>Create UserStatus</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul> -->
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">Departments</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/department">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>Departments</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/department/add">
                                            <i aria-hidden="true" class="lnil lnil-stats-up"></i>
                                            <span>Create Department</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                                <h4 class="column-heading">Rooms</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/room">
                                            <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                                            <span>Rooms</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/room/add">
                                            <i aria-hidden="true" class="lnil lnil-stats-up"></i>
                                            <span>Create Room</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">Cities</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/city">
                                            <i aria-hidden="true" class="lnil lnil-cardiology"></i>
                                            <span>Cities</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/city/add">
                                            <i aria-hidden="true" class="lnil lnil-plane-alt"></i>
                                            <span>Create City</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">User Statuses</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/userStatus">
                                            <i aria-hidden="true" class="lnil lnil-cardiology"></i>
                                            <span>User Statuses</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/userStatus/add">
                                            <i aria-hidden="true" class="lnil lnil-plane-alt"></i>
                                            <span>Create User Status</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-content" :class="[activeTab === 'templates' && 'is-active']">
                <div class="tab-content-inner">
                    <div class="center">
                        <div class="columns">
                            <div class="column is-3">
                                <h4 class="column-heading">Sidebars</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/starters/sidebar-blank-page-1">
                                            <i aria-hidden="true" class="lnil lnil-layout"></i>
                                            <span>Regular Sidebar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/sidebar-blank-page-2">
                                            <i aria-hidden="true" class="lnil lnil-layout"></i>
                                            <span>Curved Sidebar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/sidebar-blank-page-3">
                                            <i aria-hidden="true" class="lnil lnil-layout"></i>
                                            <span>Colored Sidebar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/sidebar-blank-page-4">
                                            <i aria-hidden="true" class="lnil lnil-layout"></i>
                                            <span>Curved Colored</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/sidebar-blank-page-5">
                                            <i aria-hidden="true" class="lnil lnil-layout"></i>
                                            <span>Labels Sidebar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/sidebar-blank-page-6">
                                            <i aria-hidden="true" class="lnil lnil-layout"></i>
                                            <span>Labels Hover Sidebar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/sidebar-blank-page-7">
                                            <i aria-hidden="true" class="lnil lnil-layout"></i>
                                            <span>Float Sidebar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">Navbars</h4>
                                <ul class="has-slimscroll" simplebar>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-1">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Regular Navbar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-2">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Fading Navbar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-3">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Colored Navbar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-4">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Drop Navbar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-5">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Colored Drop</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-6">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Clean Navbar</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-7">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Clean Center</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/starters/navbar-blank-page-8">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Clean Fade</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">Widgets</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/navbar/others/charts-apex">
                                            <i aria-hidden="true" class="lnil lnil-pie-chart-alt"></i>
                                            <span>Apex Charts</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/others/charts-billboardsjs">
                                            <i aria-hidden="true" class="lnil lnil-bar-chart"></i>
                                            <span>Billboard JS</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/others/widgets-sample-ui">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>UI Widgets</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <!--                    <RouterLink-->
                                        <!--                      :to="{-->
                                        <!--                        name: '/navbar/others/widgets-sample-creative',-->
                                        <!--                      }"-->
                                        <!--                    >-->
                                        <i aria-hidden="true" class="lnil lnil-layout-alt-2"></i>
                                        <span>Creative Widgets</span>
                                        <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        <!--                    </RouterLink>-->
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/others/widgets-sample-list">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>List Widgets</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/others/widgets-sample-stats">
                                            <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                                            <span>Stat Widgets</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-3">
                                <h4 class="column-heading">Wizard</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/wizard-v1">
                                            <span>Wizard V1</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/layouts/form-layouts-1">
                                            <span>Form V1</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/layouts/form-layouts-2">
                                            <span>Form V2</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/layouts/form-layouts-3">
                                            <span>Form V3</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/navbar/layouts/form-layouts-4">
                                            <span>Form V4</span>
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
