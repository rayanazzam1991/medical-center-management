<script  lang="ts">
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultService, Service, ServiceConsts } from '/@src/models/Others/Service/service';
import { servicevalidationSchema } from '/@src/rules/Others/Service/serviceValidation';
import { getService, addService, editService } from '/@src/services/Others/Service/serviceService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';
import { useService } from '/@src/stores/Others/Service/serviceStore';
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
        viewWrapper.setPageTitle(t('service.form.page_title'));
        const head = useHead({
            title: t('service.form.page_title'),
        });
        const serviceStore = useService()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('service.form.form_header' , {type : formTypeName});
        const backRoute = "/service";
        const currentService = ref(defaultService);
        const serviceId = ref(0);
        // @ts-ignore
        serviceId.value = route.params?.id as number ?? 0;
        const getCurrentService = async () => {
            if (serviceId.value === 0) {
                currentService.value.name = ''
                currentService.value.status = 1
                currentService.value.description = undefined
                currentService.value.service_price = undefined
                currentService.value.duration_minutes = undefined
                return
            }

            const { service } = await getService(serviceId.value);
            currentService.value = service != undefined ? service : defaultService;
        };
        onMounted(() => {
            getCurrentService();
        });
        const validationSchema = servicevalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentService.value.name ?? "",
                status: currentService.value.status ?? 1,
                description: currentService.value.description ?? undefined,
                duration_minutes: currentService.value.duration_minutes ?? undefined,
                service_price: currentService.value.service_price ?? undefined,
            } : {
                name: '',
                status: 1,
                description: '',
                duration_minutes: '',
                service_price: '',

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
            var serviceData = currentService.value;
            const { service, message, success } = await addService(serviceData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.add'));
                await sleep(500)
                router.push({ path: `/service/${service.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = handleSubmit(async () => {
            const serviceData = currentService.value;
            const { success, message } = await editService(serviceData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.edit'));
                await sleep(500);
                router.push({ path: `/service/${serviceData.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        return {t, pageTitle, onSubmit, currentService, viewWrapper, backRoute, ServiceConsts, serviceStore };
    },
    components: { ErrorMessage }
})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="serviceStore?.loading" />
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
                                    <VLabel class="required">{{ t('service.form.name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentService.name" type="text" placeholder=""
                                            autocomplete="given-name" />
                                        <ErrorMessage name="name" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="description" v-slot="{ field }">
                                    <VLabel class="optional">{{t('service.form.desciption')}}</VLabel>
                                    <VControl icon="feather:file-text">
                                        <VInput v-model="currentService.description" type="text" placeholder=""
                                            autocomplete="" />
                                        <p v-if="field?.errorMessage" class="help is-danger">
                                            {{ field.errorMessage }}
                                        </p>

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="service_price" v-slot="{ field }">
                                    <VLabel class="required">{{t('service.form.price')}}</VLabel>
                                    <VControl >
                                        <VInput v-model="currentService.service_price" type="number" />
                                        <ErrorMessage name="service_price" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="duration_minutes" v-slot="{ field }">
                                    <VLabel class="required">{{t('service.form.duration')}}</VLabel>
                                    <VControl icon="feather:clock">
                                        <VInput v-model="currentService.duration_minutes" type="number" />
                                        <ErrorMessage name="duration_minutes" class="help is-danger" />

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
                                    <VLabel class="required">{{ t('service.form.status') }}</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentService.status" :value="ServiceConsts.INACTIVE"
                                            :label="ServiceConsts.showStatusName(0)" name="status" color="danger" />

                                        <VRadio v-model="currentService.status" :value="ServiceConsts.ACTIVE"
                                            :label="ServiceConsts.showStatusName(1)" name="status" color="success" />
                                        <ErrorMessage name="status" class="help is-danger" />

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
