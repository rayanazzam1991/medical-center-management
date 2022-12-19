<script  lang="ts">
import { useHead } from '@vueuse/head'
import { useForm, ErrorMessage } from 'vee-validate';
import {
    addDepartment,
    editDepartment,
    getDepartment
} from '/@src/services/Others/Department/departmentService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultDepartment, Department, DepartmentConsts } from '/@src/models/Others/Department/department';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { departmentvalidationSchema } from '/@src/rules/Others/Department/departmentValidation';
import sleep from '/@src/utils/sleep';
import { useDepartment } from '/@src/stores/Others/Department/departmentStore';

export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle("Department");
        const head = useHead({
            title: "Department",
        });
        const departmentStore = useDepartment()
        const notif = useNotyf();
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const pageTitle = formType.value + " " + viewWrapper.pageTitle;
        const backRoute = "/department";
        const currentDepartment = ref(defaultDepartment);
        const departmentId = ref(0);
        // @ts-ignore
        departmentId.value = route.params?.id as number ?? 0;
        const getCurrentDepartment = async () => {
            if (departmentId.value === 0) {
                currentDepartment.value.name = "";
                currentDepartment.value.status = 1;
                return;
            }
            const { department } = await getDepartment(departmentId.value);
            currentDepartment.value = department != undefined ? department : defaultDepartment;
        };
        onMounted(() => {
            getCurrentDepartment();
        });
        const validationSchema = departmentvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentDepartment.value.name ?? "",
                status: currentDepartment.value.status ?? 1,
            } : {
                name: "",
                status: 1,
            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            }
            else if (method == "Edit") {
                await onSubmitEdit();
            }
            else
                return;
        };
        const onSubmitAdd = handleSubmit(async (values) => {
            var departmentData = currentDepartment.value;
            const { department, success, message } = await addDepartment(departmentData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                // @ts-ignore
                notif.success(` ${viewWrapper.pageTitle} ${department.name} was added successfully`);
                await sleep(500)
            router.push({ path: `/department/${department.id}` });
            } else {
                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            const departmentData = currentDepartment.value;
            const { message, success } = await editDepartment(departmentData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                // @ts-ignore
                notif.success(`${departmentData.name} ${viewWrapper.pageTitle} was edited successfully`);
                await sleep(500)router.push({ path: `/department/${departmentData.id}` });
            } else {
                notif.error(message)
            }
        };
        return { pageTitle, onSubmit, currentDepartment, viewWrapper, backRoute, DepartmentConsts, departmentStore };
    },
    components: { ErrorMessage }
})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="departmentStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="name">
                                    <VLabel>{{ viewWrapper.pageTitle }} name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentDepartment.name" type="text"
                                            autocomplete="given-name" />
                                        <ErrorMessage class="help is-danger" name="name" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="status">
                                    <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentDepartment.status" :value="DepartmentConsts.INACTIVE"
                                            :label="DepartmentConsts.showStatusName(0)" name="status" color="warning" />

                                        <VRadio v-model="currentDepartment.status" :value="DepartmentConsts.ACTIVE"
                                            :label="DepartmentConsts.showStatusName(1)" name="status" color="success" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>



    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
