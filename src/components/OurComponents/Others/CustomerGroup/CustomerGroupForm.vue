<script  lang="ts">
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCustomerGroup, CustomerGroup, CustomerGroupConsts } from '/@src/models/Others/CustomerGroup/customerGroup';
import { customergroupvalidationSchema } from '/@src/rules/Others/CustomerGroup/customergroupValidation';
import { getCustomerGroup, addCustomerGroup, editCustomerGroup } from '/@src/services/Others/CustomerGroup/customerGroupService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep";
import { useCustomerGroup } from '/@src/stores/Others/CustomerGroup/customerGroupStore';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';


export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const {t} = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('customer_group.form.page_title'));
        const head = useHead({
            title: t('customer_group.form.page_title'),
        });
        const customerGroupStore = useCustomerGroup()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('customer_group.form.form_header' , {type : formTypeName});
        const backRoute = "/customer-group";
        const currentCustomerGroup = ref(defaultCustomerGroup);
        const customerGroupId = ref(0);
        // @ts-ignore
        customerGroupId.value = route.params?.id as number ?? 0;
        const getCurrentCustomerGroup = async () => {
            if (customerGroupId.value === 0) {
                currentCustomerGroup.value.name = ''
                currentCustomerGroup.value.status = 1
                return
            }

            const { customerGroup } = await getCustomerGroup(customerGroupId.value);
            currentCustomerGroup.value = customerGroup != undefined ? customerGroup : defaultCustomerGroup;
        };
        onMounted(() => {
            getCurrentCustomerGroup();
        });
        const validationSchema = customergroupvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentCustomerGroup.value.name ?? "",
                status: currentCustomerGroup.value.status ?? 1,
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
            var customerGroupData = currentCustomerGroup.value;
            const { customerGroup, message, success } = await addCustomerGroup(customerGroupData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.add'));
                await sleep(500);
                router.push({ path: `/customer-group/${customerGroup.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            const customerGroupData = currentCustomerGroup.value;
            const { success, message } = await editCustomerGroup(customerGroupData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.edit'));
                await sleep(500);
                router.push({ path: `/customer-group/${customerGroupData.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        };
        return { t, pageTitle, onSubmit, currentCustomerGroup, viewWrapper, backRoute, CustomerGroupConsts, customerGroupStore };
    },
    components: { ErrorMessage }
})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="customerGroupStore?.loading" />
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
                                <VField id="name" v-slot="{ field }">
                                    <VLabel class="required">{{ t('customer_group.form.name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentCustomerGroup.name" type="text" placeholder=""
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
                                <VField id="status" v-slot="{ field }">
                                    <VLabel class="required">{{t('customer_group.form.status')}}</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentCustomerGroup.status"
                                            :value="CustomerGroupConsts.INACTIVE"
                                            :label="CustomerGroupConsts.showStatusName(0)" name="status"
                                            color="danger" />

                                        <VRadio v-model="currentCustomerGroup.status"
                                            :value="CustomerGroupConsts.ACTIVE"
                                            :label="CustomerGroupConsts.showStatusName(1)" name="status"
                                            color="success" />
                                        <ErrorMessage class="help is-danger" name="status" />

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
