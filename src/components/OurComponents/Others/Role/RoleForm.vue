<script lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { getCustomersList } from '/@src/services/CRM/Customer/customerService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { createTicket, getTicket, updateTicket } from '/@src/services/Sales/Ticket/ticketService';
import { UpdateTicket } from '/@src/models/Sales/Ticket/ticket';
import sleep from '/@src/utils/sleep';
import { defaultRole } from '/@src/utils/consts/rolesPermissions';
import { defaultPermissionGroupSearchFilter, PermissionGroup, PermissionGroupHelper, PermissionGroupSearchFilter, PermissionHelper } from '/@src/models/Others/PermissionGroup/permissionGroup';
import { getRole, updateRolePermissions } from '/@src/services/Others/Role/roleService';
import { getPermissionGroupsList } from '/@src/services/Others/PermissionGroup/permissionGroupService';
import { usePermissionGroup } from '/@src/stores/Others/PermissionGroup/permissionGroupStore';
import { stringTrim } from '/@src/composable/helpers/stringHelpers';

export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    setup(props, context) {
        const { t } = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('role.form.page_title'));
        const head = useHead({
            title: t('role.form.page_title'),
        })
        const route = useRoute();
        const roleId = ref(0);
        // @ts-ignore
        roleId.value = route.params?.id as number ?? 0;
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const router = useRouter();
        const permissionGroupStore = usePermissionGroup()
        const backRoute = "/role";
        const currentRole = ref(defaultRole);
        const pageTitle = ref('')
        const keyIncrement = ref(0)
        const permissionGroupsList = ref<PermissionGroup[]>([])
        const permissionGroupsHelper = ref<PermissionGroupHelper[]>([])
        const permissionGroupsHelperForEditing = ref<string[]>([])
        const isLoading = ref(false)
        const searchFilter = ref(defaultPermissionGroupSearchFilter)

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
        const initPermissionGroupHelper = async (isFirstCall: boolean = false) => {
            permissionGroupsHelper.value = []
            permissionGroupsList.value.forEach((permissionGroup) => {
                let allPermissionsChecked = true
                let permissionsHelper: PermissionHelper[] = []
                permissionGroup.permissions.forEach((permission) => {
                    const permissionFinder = currentRole.value.permissions.find((currentRolePermission) => currentRolePermission.id == permission.id)
                    if (permissionFinder) {

                        permissionsHelper.push({ id: permissionFinder.id, display_name: permissionFinder.display_name, name: permissionFinder.name, checked: true })
                        if (isFirstCall) {

                            const permissionEditFinder = permissionGroupsHelperForEditing.value.find((el) => el == permissionFinder.name)
                            if (!permissionEditFinder)
                                permissionGroupsHelperForEditing.value.push(permissionFinder.name)
                        }
                    } else {
                        permissionsHelper.push({ id: permission.id, display_name: permission.display_name, name: permission.name, checked: false })
                        allPermissionsChecked = false
                    }
                });
                permissionGroupsHelper.value.push({ id: permissionGroup.id, name: permissionGroup.name, display_name: permissionGroup.display_name, permissions: permissionsHelper, checked: allPermissionsChecked })

            });


        }
        const search = async (newSearchFilter: PermissionGroupSearchFilter) => {
            isLoading.value = true
            searchFilter.value = newSearchFilter
            const { permission_groups } = await getPermissionGroupsList(searchFilter.value);

            permissionGroupsList.value = permission_groups

            await initPermissionGroupHelper(false)
            isLoading.value = false
        }
        const resetFilter = async (newSearchFilter: PermissionGroupSearchFilter) => {
            searchFilter.value = newSearchFilter
            await search(searchFilter.value)
        }

        onMounted(async () => {
            isLoading.value = true
            await getCurrentRole()
            await getPermissionGroups()
            await initPermissionGroupHelper(true)
            pageTitle.value = formType.value == 'Add' ? t('role.form.add_form_header') : t('role.form.edit_form_header', { role_name: currentRole.value.display_name });
            keyIncrement.value++
            isLoading.value = false
        })
        const toggleAll = (index: number, newValue: boolean) => {
            permissionGroupsHelper.value.at(index)?.permissions.forEach((permission) => {
                permission.checked = !newValue
                if (permission.checked) {
                    const permissionEditFinder = permissionGroupsHelperForEditing.value.find((el) => el == permission.name)
                    if (!permissionEditFinder) {
                        permissionGroupsHelperForEditing.value.push(permission.name)
                    }
                } else {
                    const permissionEditFinderIndex = permissionGroupsHelperForEditing.value.findIndex((el) => el == permission.name)
                    if (permissionEditFinderIndex != -1) {
                        permissionGroupsHelperForEditing.value.splice(permissionEditFinderIndex, 1)
                    }
                }

            })

        }
        const togglePermission = (permissionGroupIndex: number, permissionIndex: number) => {
            const permission = permissionGroupsHelper.value.at(permissionGroupIndex)?.permissions.at(permissionIndex)
            if (permission) {
                permission.checked = !permission.checked
                if (permission.checked) {
                    const permissionEditFinder = permissionGroupsHelperForEditing.value.find((el) => el == permission.name)
                    if (!permissionEditFinder) {
                        permissionGroupsHelperForEditing.value.push(permission.name)
                    }
                } else {
                    const permissionEditFinderIndex = permissionGroupsHelperForEditing.value.findIndex((el) => el == permission.name)
                    if (permissionEditFinderIndex != -1) {
                        permissionGroupsHelperForEditing.value.splice(permissionEditFinderIndex, 1)
                    }
                }

            }
            const permissionGroup = permissionGroupsHelper.value.at(permissionGroupIndex)
            if (permissionGroup) {
                let allPermissionsChecked = true
                permissionGroup.permissions.forEach(permission => {
                    if (!permission.checked) {
                        allPermissionsChecked = false
                    }

                });
                permissionGroup.checked = allPermissionsChecked
            }


        }

        const onSubmit = async (method: String) => {
            if (method == "Edit") {
                await onSubmitEdit();
            } else
                return;
        }

        const onSubmitEdit = async () => {
            isLoading.value = true
            let newPermissions: string[] = []
            newPermissions = permissionGroupsHelperForEditing.value.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })

            const { success, message, role } = await updateRolePermissions(roleId.value, newPermissions)
            if (success) {
                await sleep(200);
                notif.success(t('toast.success.edit'))
                router.push({ path: `/role/${role.id}` });
            }
            else {
                await sleep(200);
                notif.error(message)
            }
            isLoading.value = false

        }

        return {
            t, pageTitle, onSubmit, currentRole, isLoading, stringTrim, search, resetFilter, permissionGroupStore, permissionGroupsHelper, permissionGroupsHelperForEditing, viewWrapper, backRoute, toggleAll, togglePermission, keyIncrement, getCustomersList,
        };
    },
})


</script>

<template>
    <div class="page-content-inner">
        <RoleHeader :key="keyIncrement" :title="pageTitle" :button_name="t('forms.type.save')" @search="search"
            @resetFilter="resetFilter" :isLoading="isLoading || permissionGroupStore.loading"
            @mainButtonClicked="onSubmit(formType)" />

        <form class="form-layout" @submit.prevent="onSubmit(formType)">
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
                                        <VCheckbox class="p-0 pl-2" v-model="permissionGroup.checked" color="primary"
                                            @click.number="toggleAll(mainIndex, permissionGroup.checked)" />
                                        <h3 class="is-size-6 title">
                                            {{ permissionGroup.id }} - {{ permissionGroup.display_name }}</h3>
                                    </div>
                                    <div class="column is-2" v-for="(permission, index) in permissionGroup.permissions"
                                        :key="index">
                                        <VTag class="cursor" @click="togglePermission(mainIndex, index)" :color="permissionGroupsHelperForEditing.find((el) => permission.name == el) ?
                                            'primary' : 'solid'" :label="stringTrim(permission.display_name, 40)" />
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

.cursor {
    cursor: pointer;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;

    /*
     Introduced in Internet Explorer 10.
     See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
   */
    -ms-user-select: none;
    user-select: none;
}

.is-dark {
    .borders {

        border-color: var(--dark-sidebar-light-1) !important;
    }

}
</style>
