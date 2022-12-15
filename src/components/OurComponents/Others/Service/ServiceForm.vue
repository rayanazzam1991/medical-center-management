<script  lang="ts">import { toFormValidator } from '@vee-validate/zod'
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { z as zod } from 'zod'
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultService, Service, ServiceConsts } from '/@src/models/Others/Service/service';
import { getService, addService, editService } from '/@src/services/Others/Service/serviceService';
import { useViewWrapper } from '/@src/stores/viewWrapper';




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
        viewWrapper.setPageTitle("Service");
        const head = useHead({
            title: "Service",
        });
        const notif = useNotyf();
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const pageTitle = formType.value + " " + viewWrapper.pageTitle;
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

            const service = await getService(serviceId.value);
            currentService.value = service != undefined ? service : defaultService;
        };
        onMounted(() => {
            getCurrentService();
        });
        const validationSchema = toFormValidator(zod
            .object({
                name: zod
                    .string({
                        required_error: "This field is required",
                    })
                    .min(1, "This field is required"),
                description: zod.string().optional(),
                duration_minutes:
                    zod.preprocess(
                        (input) => {
                            const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                            return processed.success ? processed.data : input;
                        },
                        zod
                            .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                            .min(0, "Please enter a valid number"),
                    ),

                service_price:
                    zod.preprocess(
                        (input) => {
                            const processed = zod.string({}).regex(/\d+/).transform(Number).safeParse(input);
                            return processed.success ? processed.data : input;
                        },
                        zod
                            .number({ required_error: 'This field is required', invalid_type_error: "Please enter a valid number" })
                            .min(0, "Please enter a valid number"),
                    ),
                status: zod
                    .number({ required_error: "Please choose one" }),
            }));
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: {
                name: currentService.value.name ?? "",
                status: currentService.value.status ?? 1,
                description: currentService.value.description ?? undefined,
                duration_minutes: currentService.value.duration_minutes ?? undefined,
                service_price: currentService.value.service_price ?? undefined,
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
            serviceData = await addService(serviceData) as Service;
            // @ts-ignore
            notif.dismissAll();
            // @ts-ignore
            notif.success(`${serviceData.name} ${viewWrapper.pageTitle} was added successfully`);
            router.push({ path: `/service/${serviceData.id}` });
        });
        const onSubmitEdit = handleSubmit(async () => {
            const serviceData = currentService.value;
            await editService(serviceData);
            // @ts-ignore
            notif.dismissAll();
            // @ts-ignore
            notif.success(`${serviceData.name} ${viewWrapper.pageTitle} was edited successfully`);
            router.push({ path: `/service/${serviceData.id}` });
        });
        return { pageTitle, onSubmit, currentService, viewWrapper, backRoute, ServiceConsts };
    },
    components: { ErrorMessage }
})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" />
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
                                    <VLabel>{{ viewWrapper.pageTitle }} name</VLabel>
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
                                    <VLabel>Description</VLabel>
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
                                    <VLabel>Price ({{ ServiceConsts.PRICE_DOLLAR }})</VLabel>
                                    <VControl icon="feather:dollar-sign">
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
                                    <VLabel>Duration</VLabel>
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
                                    <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentService.status" :value="ServiceConsts.INACTIVE"
                                            :label="ServiceConsts.showStatusName(0)" name="status" color="warning" />

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
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.is-navbar {
    .form-layout {
        margin-top: 30px;
    }
}

.filter {
    margin: 1rem;
}

.justify-content {
    display: flex;
    align-items: baseline;
}

.form-layout {
    &.is-split {
        max-width: 840px;

        .form-outer {
            .form-body {
                padding: 0;
                width: 100%;

                .form-section {
                    display: flex;
                    padding: 20px;

                    &.is-grey {
                        background: #fafafa;
                    }

                    .left,
                    .right {
                        padding: 20px 40px;
                        width: 50%;

                        h3 {
                            font-family: var(--font-alt);
                            font-weight: 600;
                            font-size: 0.95rem;
                            color: var(--dark-text);
                            margin-bottom: 20px;
                        }
                    }


                    .left {
                        width: 20%;
                        position: relative;
                        border-right: 1px solid var(--fade-grey-dark-3);

                        .operator {
                            position: absolute;
                            top: 17px;
                            right: -10px;
                            text-transform: uppercase;
                            font-family: var(--font);
                            font-weight: 500;
                            color: var(--dark-text);
                            background: var(--white);
                            padding: 4px 0;
                        }
                    }

                    .radio-pills {
                        display: flex;
                        justify-content: space-between;

                        .radio-pill {
                            position: relative;

                            input {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: 100%;
                                opacity: 0;
                                cursor: pointer;

                                &:checked {
                                    +.radio-pill-inner {
                                        background: var(--primary);
                                        border-color: var(--primary);
                                        box-shadow: var(--primary-box-shadow);
                                        color: var(--white);
                                    }
                                }
                            }

                            .radio-pill-inner {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 60px;
                                height: 40px;
                                background: var(--white);
                                border: 1px solid var(--fade-grey-dark-3);
                                border-radius: 8px;
                                font-family: var(--font);
                                font-weight: 600;
                                font-size: 0.9rem;
                                transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                                    height 0.3s, width 0.3s;
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        &.is-grey {
                            background: var(--dark-sidebar-light-4) !important;
                        }

                        h3 {
                            color: var(--dark-dark-text);
                        }

                        .left {
                            border-color: var(--dark-sidebar-light-12) !important;

                            .operator {
                                background: var(--dark-sidebar-light-6) !important;
                                color: var(--dark-dark-text);
                            }

                            .radio-pills {
                                .radio-pill {
                                    input {
                                        &:checked+.radio-pill-inner {
                                            border-color: var(--primary);
                                            background: var(--primary);
                                            box-shadow: var(--primary-box-shadow);
                                            color: var(--smoke-white);
                                        }
                                    }

                                    .radio-pill-inner {
                                        background: var(--dark-sidebar-light-2);
                                        border-color: var(--dark-sidebar-light-12);
                                        color: var(--dark-dark-text);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        flex-direction: column;
                        padding-right: 0;
                        padding-left: 0;

                        .left,
                        .right {
                            width: 100%;
                            padding-right: 30px;
                            padding-left: 30px;
                        }


                        .left {
                            border-right: none;
                            border-bottom: 1px solid var(--fade-grey-dark-3);
                            padding-bottom: 40px;

                            .operator {
                                top: unset;
                                bottom: -14px;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                                text-align: center;
                                max-width: 60px;
                            }
                        }

                        .right {
                            padding-top: 30px;
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        padding-right: 0;
                        padding-left: 0;
                    }
                }
            }
        }
    }
}
</style>
