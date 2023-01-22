<script lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useForm, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCreateVariablePayment, defaultUpdateVariablePayment, defaultVariablePayment, VariablePayment, VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { variablePaymentValidationSchema } from '/@src/rules/HR/Payroll/VariablePayment/variablePaymentValidation';
import { addVariablePayment, getVariablePayment, editVariablePayment } from '/@src/services/HR/Payroll/VariablePayment/variablePaymentService';
import { useVariablePayment } from '/@src/stores/HR/Payoll/VariablePayment/variablePaymentStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';



export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const { t } = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('variable_payment.form.page_title'));
        const head = useHead({
            title: t('variable_payment.form.page_title'),
        });
        const variablePaymentStore = useVariablePayment()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('variable_payment.form.form_header', { type: formTypeName });
        const backRoute = "/variable-payment";
        const currentVariablePayment = ref(defaultVariablePayment);
        const variablePaymentId = ref(0);
        const originalVariablePaymentName = ref<string>();
            const originalVariablePaymentStatus = ref<number>();

        // @ts-ignore
        variablePaymentId.value = route.params?.id as number ?? 0;

        const getCurrentVariablePayment = async () => {
            if (variablePaymentId.value === 0) {
                currentVariablePayment.value.name = ''
                currentVariablePayment.value.type = VariablePaymentConsts.INCREMENT_TYPE
                currentVariablePayment.value.status = VariablePaymentConsts.ACTIVE
                return
            }
            const { variablePayment } = await getVariablePayment(variablePaymentId.value);
            currentVariablePayment.value = variablePayment != undefined ? variablePayment : defaultVariablePayment;
            originalVariablePaymentName.value = currentVariablePayment.value.name
            originalVariablePaymentStatus.value = currentVariablePayment.value.status
        };

        onMounted(() => {
            getCurrentVariablePayment();
        });

        const validationSchema = variablePaymentValidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentVariablePayment?.value?.name ?? "",
                type: currentVariablePayment?.value?.type ?? VariablePaymentConsts.INCREMENT_TYPE,
                status: currentVariablePayment?.value?.status ?? VariablePaymentConsts.ACTIVE,
            } : {
                name: "",
                type: VariablePaymentConsts.INCREMENT_TYPE,
                status: VariablePaymentConsts.ACTIVE,
            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            } else if (method == "Edit") {
                await onSubmitEdit();
            } else
                return;
        };
        const onSubmitAdd = handleSubmit(async (values) => {
            let variablePaymentData = defaultCreateVariablePayment
            variablePaymentData.name = currentVariablePayment.value.name
            variablePaymentData.type = currentVariablePayment.value.type
            variablePaymentData.status = currentVariablePayment.value.status

            const { success, message, variablePayment } = await addVariablePayment(variablePaymentData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.add'));
                router.push({ path: `/variable-payment` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            let variablePaymentData = defaultUpdateVariablePayment
            console.log(currentVariablePayment.value.name)
            console.log(originalVariablePaymentName.value)
            if(currentVariablePayment.value.name !== originalVariablePaymentName.value) {
                variablePaymentData.name = currentVariablePayment.value.name
            }
            else { 
                variablePaymentData.name = undefined

            }
            if(currentVariablePayment.value.status !== originalVariablePaymentStatus.value) {
                variablePaymentData.status = currentVariablePayment.value.status

            }else {
                variablePaymentData.status = undefined

            }
            variablePaymentData.type = currentVariablePayment.value.type

            const { message, success } = await editVariablePayment(variablePaymentId.value, variablePaymentData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.edit'));
                router.push({ path: `/variable-payment` });
            } else {
                await sleep(200);

                notif.error({message : message , duration : 5000})

            }
        };

        return { t, pageTitle, onSubmit, currentVariablePayment, viewWrapper, backRoute, VariablePaymentConsts, variablePaymentStore };
    },
    components: { ErrorMessage }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="variablePaymentStore?.loading" />
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
                                    <VLabel class="required">{{ t('variable_payment.form.name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentVariablePayment.name" type="text" placeholder=""
                                            autocomplete="given-name" />
                                        <ErrorMessage class="help is-danger" name="name" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="type" v-slot="{ field }">
                                    <VLabel class="required">{{ t('variable_payment.form.type') }}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentVariablePayment.type"
                                            :value="VariablePaymentConsts.DECREMENT_TYPE"
                                            :label="VariablePaymentConsts.getTypeName(VariablePaymentConsts.DECREMENT_TYPE)"
                                            name="type" color="danger" />
                                        <VRadio v-model="currentVariablePayment.type"
                                            :value="VariablePaymentConsts.INCREMENT_TYPE"
                                            :label="VariablePaymentConsts.getTypeName(VariablePaymentConsts.INCREMENT_TYPE)"
                                            name="type" color="success" />

                                        <ErrorMessage class="help is-danger" name="type" />
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
                                    <VLabel class="required">{{ t('variable_payment.form.status') }}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentVariablePayment.status"
                                            :value="VariablePaymentConsts.INACTIVE"
                                            :label="VariablePaymentConsts.showStatusName(0)" name="status"
                                            color="danger" />
                                        <VRadio v-model="currentVariablePayment.status"
                                            :value="VariablePaymentConsts.ACTIVE"
                                            :label="VariablePaymentConsts.showStatusName(1)" name="status"
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
<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
