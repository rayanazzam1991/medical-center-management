<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { defaultPosition, Position, PositionConsts } from '/@src/models/Others/Position/position';
import { getPosition, addPosition, editPosition } from '/@src/services/Others/Position/positionService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { positionvalidationSchema } from '/@src/rules/Others/Position/positionValidation';
import sleep from "/@src/utils/sleep";
import { usePosition } from "/@src/stores/Others/Position/positionStore";
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
        viewWrapper.setPageTitle(t('position.form.page_title'));
        const head = useHead({
            title: t('position.form.page_title'),
        });
        const positionStore = usePosition()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('position.form.form_header' , {type : formTypeName});
        const backRoute = "/position";
        const currentPosition = ref(defaultPosition);
        const positionId = ref(0);

        // @ts-ignore
        positionId.value = route.params?.id as number ?? 0;

        const getCurrentPosition = async () => {
            if (positionId.value === 0) {
                currentPosition.value.name = ''
                currentPosition.value.status = 1
                return
            }
            const { position } = await getPosition(positionId.value);
            currentPosition.value = position != undefined ? position : defaultPosition;
        };

        onMounted(() => {
            getCurrentPosition();
        });

        const validationSchema = positionvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentPosition?.value?.name ?? "",
                description: currentPosition?.value?.description ?? "",
                status: currentPosition?.value?.status ?? 1,
            } : {
                name: "",
                description: "",
                status: 1,
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
            var positionData = currentPosition.value;
            const { success, message, position } = await addPosition(positionData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.add'));
                router.push({ path: `/position/${position.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            const positionData = currentPosition.value;
            const { message, success } = await editPosition(positionData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.edit'));
                router.push({ path: `/position/${positionData.id}` });
            } else {
                await sleep(200);

                notif.error(message)

            }
        };

        return { t, pageTitle, onSubmit, currentPosition, viewWrapper, backRoute, PositionConsts, positionStore };
    },
    components: { ErrorMessage }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="positionStore?.loading" />
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
                                    <VLabel class="required">{{ t('position.form.name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentPosition.name" type="text" placeholder=""
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
                                <VField id="description" v-slot="{ field }">
                                    <VLabel>{{ t('position.form.description') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentPosition.description" type="text" placeholder=""
                                            autocomplete="given-description" />
                                        <ErrorMessage class="help is-danger" name="description" />

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
                                    <VLabel class="required">{{ t('position.form.status') }}</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentPosition.status" :value="PositionConsts.INACTIVE"
                                            :label="PositionConsts.showStatusName(0)" name="status" color="danger" />

                                        <VRadio v-model="currentPosition.status" :value="PositionConsts.ACTIVE"
                                            :label="PositionConsts.showStatusName(1)" name="status" color="success" />
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
