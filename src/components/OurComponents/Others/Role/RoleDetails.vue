<script lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultRole } from '/@src/utils/consts/rolesPermissions';
import { defaultPermissionGroupSearchFilter, PermissionGroup, PermissionGroupHelper, PermissionGroupSearchFilter, PermissionHelper } from '/@src/models/Others/PermissionGroup/permissionGroup';
import { getRole } from '/@src/services/Others/Role/roleService';
import { getPermissionGroupsList } from '/@src/services/Others/PermissionGroup/permissionGroupService';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { usePermissionGroup } from '/@src/stores/Others/PermissionGroup/permissionGroupStore';
export default defineComponent({
    setup(props, context) {
        const { t } = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('role.details.page_title'));
        const head = useHead({
            title: t('role.details.page_title'),
        })
        const route = useRoute();
        const roleId = ref(0);
        // @ts-ignore
        roleId.value = route.params?.id as number ?? 0;
        const notif = useNotyf() as Notyf;
        const router = useRouter();
        const backRoute = "/role";
        const currentRole = ref(defaultRole);
        const permissionGroupsList = ref<PermissionGroup[]>([])
        const permissionGroupsHelper = ref<PermissionGroupHelper[]>([])
        const isLoading = ref(false)
        const searchFilter = ref(defaultPermissionGroupSearchFilter)
        const keyIncrement = ref(0)
        const permissionGroupStore = usePermissionGroup()
        const pageTitle = ref('')
        const search = async (newSearchFilter: PermissionGroupSearchFilter) => {
            isLoading.value = true
            searchFilter.value = newSearchFilter
            const { permission_groups } = await getPermissionGroupsList(searchFilter.value);

            permissionGroupsList.value = permission_groups

            // await getPermissionGroups()
            await initPermissionGroupHelper()
            isLoading.value = false
        }
        const resetFilter = async (newSearchFilter: PermissionGroupSearchFilter) => {
            searchFilter.value = newSearchFilter
            await search(searchFilter.value)
        }
        const getCurrentRole = async () => {
            if (roleId.value > 0) {
                const { role } = await getRole(roleId.value);
                currentRole.value = role
            }

        }
        const getPermissionGroups = async () => {
            if (roleId.value > 0) {
                const { permission_groups } = await getPermissionGroupsList(searchFilter.value);
                permissionGroupsList.value = permission_groups
            }

        }
        const initPermissionGroupHelper = async () => {
            permissionGroupsHelper.value = []
            permissionGroupsList.value.forEach((permissionGroup) => {
                let allPermissionsChecked = true
                let permissionsHelper: PermissionHelper[] = []
                permissionGroup.permissions.forEach((permission) => {
                    const permissionFinder = currentRole.value.permissions.find((currentRolePermission) => currentRolePermission.id == permission.id)
                    if (permissionFinder) {
                        permissionsHelper.push({ id: permissionFinder.id, display_name: permissionFinder.display_name, name: permissionFinder.name, checked: true })
                    } else {
                        permissionsHelper.push({ id: permission.id, display_name: permission.display_name, name: permission.name, checked: false })
                        allPermissionsChecked = false
                    }
                });
                permissionGroupsHelper.value.push({ id: permissionGroup.id, name: permissionGroup.name, display_name: permissionGroup.display_name, permissions: permissionsHelper, checked: allPermissionsChecked })

            });


        }
        onMounted(async () => {
            isLoading.value = true
            await getCurrentRole()
            await getPermissionGroups()
            await initPermissionGroupHelper()

            pageTitle.value = t('role.details.title', { role_name: currentRole.value.display_name })
            keyIncrement.value++
            isLoading.value = false
        })

        const toEdit = () => {
            console.log('ad')
            router.push({ path: `/role/${roleId.value}/edit` })
        }

        return {
            t, toEdit, currentRole, isLoading, permissionGroupsHelper, viewWrapper, backRoute, Permissions, keyIncrement, search, resetFilter, permissionGroupStore, pageTitle
        };
    },
})


</script>

<template>
    <div class="page-content-inner">
        <RoleHeader :key="keyIncrement" :title="pageTitle" :button_name="t('forms.type.edit')" @search="search"
            @resetFilter="resetFilter" :isLoading="isLoading || permissionGroupStore.loading" @mainButtonClicked="toEdit" />

        <form class="form-layout">
            <div class="form-outer">
                <div class="form-body">
                    <VLoader :hidden="!isLoading && !permissionGroupStore.loading" size="xl"
                        :active="isLoading || permissionGroupStore.loading">
                        <div class="load">
                        </div>
                    </VLoader>

                    <div :hidden="isLoading || permissionGroupStore.loading" class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12 ">
                                <div class="columns is-multiline borders"
                                    v-for="(permissionGroup, mainIndex) in permissionGroupsHelper" :key="mainIndex">
                                    <div class="column is-12 is-flex is-align-items-center">
                                        <VIconWrap class="m-0 p-0 ml-2"
                                            :icon="permissionGroup.checked ? 'lnil lnil-star-fill' : permissionGroup.permissions.find((permission) => permission.checked) ? 'lnil lnil-star-half' : 'lnil lnil-star'" />
                                        <h3 class="is-size-6 title">
                                            {{ permissionGroup.id }} - {{ permissionGroup.display_name }}</h3>
                                    </div>
                                    <div class="column is-2" v-for="(permission, index) in permissionGroup.permissions"
                                        :key="index">
                                        <VTag :color="permission.checked ? 'primary' : 'solid'"
                                            :label="permission.display_name" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="permissionGroupsHelper.length == 0" class="columns is-multiline">
                            <div ref="markdownContainer" class="column doc-column is-12">
                                <VPlaceholderPage :title="t('tables.placeholder.title')" larger>
                                </VPlaceholderPage>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>


    </div>
</template>
<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';

.form-fieldset {
    max-width: 90%;
}

.load {
    height: 400px;
    width: 500px;
}

.form-fieldset {
    font-family: var(-font-alt);
}

.borders {
    padding-bottom: 1rem;
    padding-top: 1rem;
    border-bottom: 2px solid var(--fade-grey-dark-3) !important;
}

.borders:last-child {
    border: none !important;
}

.title {
    font-family: var(-font-alt);
    font-size: 1.25rem;
    font-weight: 600;
}


.is-dark {
    .borders {

        border-color: var(--dark-sidebar-light-1) !important;
    }

}
</style>
