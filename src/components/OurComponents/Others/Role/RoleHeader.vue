<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultCitySearchFilter, CityConsts } from "/@src/models/Others/City/city"
import { defaultPagination } from "/@src/utils/response"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
import { defaultPermissionGroupSearchFilter } from "/@src/models/Others/PermissionGroup/permissionGroup"

export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        button_name: {
            type: String,
            default: '',
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const searchName = ref()
        const searchId = ref<number>()
        const searchPermissionName = ref()
        const searchFilter = ref(defaultPermissionGroupSearchFilter)
        const title = ref('')
        title.value = props.title
        const button_name = ref('')
        button_name.value = props.button_name
        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                id: searchId.value,
                permission_name: searchPermissionName.value
            }
            context.emit('search', searchFilter.value)

        }

        const resetFilter = () => {
            searchName.value = ''
            searchId.value = undefined
            searchPermissionName.value = ''
            searchFilter.value.name = undefined
            searchFilter.value.id = undefined
            searchFilter.value.permission_name = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        const onClickMainButton = () => {

            console.log('asd')
            context.emit('mainButtonClicked')

        }

        return { t, resetFilter, search, Permissions, searchName, searchPermissionName, searchId, button_name, title, onClickMainButton }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h3 class="title">{{ title }} </h3>
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchName" type="text"
                                    :placeholder="t('role.search_filter.group_name')" />
                            </VControl>
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchId" type="text" :placeholder="t('role.search_filter.group_id')" />
                            </VControl>
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchPermissionName" type="text"
                                    :placeholder="t('role.search_filter.permission_name')" />
                            </VControl>
                            <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <VButton v-permission="Permissions.ROLE_EDIT" @click="onClickMainButton" color="primary">{{
                                    button_name }}
                                </VButton>

                            </VControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin: 0.5rem 0;

}
</style>
