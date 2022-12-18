<script setup lang="ts">
import { usePanels } from '/@src/stores/panels'
import { useHead } from '@vueuse/head'
import { getDepartment } from '/@src/services/Others/Department/departmentService'
import { defaultDepartment } from '/@src/models/Others/Department/department'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { DepartmentConsts } from '/@src/models/Others/Department/department'
import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import sleep from '/@src/utils/sleep'
const panels = usePanels()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')
const head = useHead({
    title: 'Department',
})

const departmentStore = useDepartment()
const departmentId = ref(0)
// @ts-ignore
departmentId.value = route.params?.id as number ?? 0
const currentDepartment = ref(defaultDepartment)
const getCurrentDepartment = async () => {
    const department = await getDepartment(departmentId.value)
    await sleep(500)
    if (department != undefined)
        currentDepartment.value = department
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentDepartment.value.name

}
onMounted(async () => {
    await getCurrentDepartment()
})

const toEdit = () => {
    router.push({ path: `/department/${departmentId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/department'" @onSubmit="toEdit"
        :isLoading="departmentStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">Department Name:</h4>
                            <span>{{ currentDepartment.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">Department Status:</h4>
                            <span>
                                <VTag
                                    :color="currentDepartment.status === DepartmentConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ DepartmentConsts.showStatusName(currentDepartment.status) }}</VTag>
                            </span>
                        </div>
                    </div>
                </div>
                <!--Fieldset-->
            </div>
        </div>
    </section>


</template>

<style scoped lang="scss">
@import '/@src/scss/styles/detailsPage.scss';
</style>
