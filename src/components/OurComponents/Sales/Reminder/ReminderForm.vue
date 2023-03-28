<script lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useForm, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCustomer } from '/@src/models/CRM/Customer/customer';
import { defaultCreateVariablePayment, defaultUpdateVariablePayment, defaultVariablePayment, VariablePayment, VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { defaultCreateReminder } from '/@src/models/Sales/Reminder/reminder';
import { defaultTicketService } from '/@src/models/Sales/TicketService/ticketService';
import { variablePaymentValidationSchema } from '/@src/rules/HR/Payroll/VariablePayment/variablePaymentValidation';
import { getCustomer } from '/@src/services/CRM/Customer/customerService';
import { addVariablePayment, getVariablePayment, editVariablePayment } from '/@src/services/HR/Payroll/VariablePayment/variablePaymentService';
import { getTicketService } from '/@src/services/Sales/TicketService/ticketServiceService';
import { useVariablePayment } from '/@src/stores/HR/Payoll/VariablePayment/variablePaymentStore';
import { useReminder } from '/@src/stores/Sales/Reminder/reminderStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';
import Datepicker from '@vuepic/vue-datepicker';
import { useDarkmode } from '/@src/stores/darkmode';
import { reminderValidationSchema } from '/@src/rules/Sales/Reminder/reminderValidationSchema';
import { createReminder } from '/@src/services/Sales/Reminder/reminderService';



export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const { t, locale } = useI18n()
        const dark = useDarkmode()

        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('reminder.form.page_title'));
        const head = useHead({
            title: t('reminder.form.page_title'),
        });
        const reminderStore = useReminder()
        const isLoading = ref(false)
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('reminder.form.form_header', { type: formTypeName });
        const backRoute = "/requested-services";
        const currentReminder = ref(defaultCreateReminder);
        const customerId = ref(0);
        const sellectedCustomer = ref(defaultCustomer);
        const ticketServiceId = ref(0);
        const sellectedTicketService = ref(defaultTicketService);
        const time = ref({ hours: '00', minutes: '00' })
        const date = ref('')
        if (Number.isInteger(Number(route.query.customer_id)) && !Number.isNaN(Number(route.query.customer_id))) {
            customerId.value = Number(route.query.customer_id)
            currentReminder.value.customer_id = customerId.value
        } else {
            customerId.value = 0
        }
        if (Number.isInteger(Number(route.query.ticket_service_id)) && !Number.isNaN(Number(route.query.ticket_service_id))) {
            ticketServiceId.value = Number(route.query.ticket_service_id)
            currentReminder.value.ticket_service_id = ticketServiceId.value
        } else {
            ticketServiceId.value = 0
        }


        onMounted(async () => {
            isLoading.value = true
            if (ticketServiceId.value != 0 && customerId.value != 0) {
                const { customer } = await getCustomer(customerId.value)
                sellectedCustomer.value = customer
                const { ticket_service } = await getTicketService(ticketServiceId.value)
                sellectedTicketService.value = ticket_service
            }
            isLoading.value = false

        });

        const validationSchema = reminderValidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
            } : {
                name: "",
                type: VariablePaymentConsts.INCREMENT_TYPE,
                status: VariablePaymentConsts.ACTIVE,
            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            } else
                return;
        };
        const onSubmitAdd = handleSubmit(async (values) => {
            let reminderData = currentReminder.value
            reminderData.time = time.value.hours + ':' + time.value.minutes
            reminderData.date = date.value
            if (reminderData.customer_id == 0 || reminderData.ticket_service_id == 0) {
                notif.error({ message: t('toast.error.reminder.reminder_error'), duration: 3000 })
                return
            } else {
                const { success, message } = await createReminder(reminderData);
                if (success) {

                    notif.dismissAll();
                    await sleep(200);

                    notif.success(t('toast.success.add'));
                    router.push({ path: `/reminder` });
                } else {
                    await sleep(200);
                    notif.error(message)
                }

            }
        });
        return { t, pageTitle, onSubmit, currentReminder, isLoading, viewWrapper, backRoute, sellectedTicketService, sellectedCustomer, reminderStore, time, date, locale, dark };
    },
    components: { ErrorMessage, Datepicker }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="(isLoading || reminderStore.loading)" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
                        <div class="load">
                        </div>
                    </VLoader>
                    <div :hidden="isLoading" class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <h4 class="label"> {{ t('reminder.form.customer') }}
                                    <span class="is-size-5">
                                        {{ sellectedCustomer.user.first_name }}
                                        {{ sellectedCustomer.user.last_name }}
                                    </span>
                                </h4>
                            </div>
                            <div class="column is-12">
                                <h4 class="label"> {{ t('reminder.form.service') }}
                                    <span class="is-size-5">
                                        {{ sellectedTicketService.service.name }}
                                    </span>
                                </h4>
                            </div>
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel class="required">{{ t('reminder.form.note') }}</VLabel>
                                    <VControl>
                                        <VTextarea v-model="currentReminder.note" class="is-primary-focus" rows="2"
                                            :placeholder="t('reminder.form.note') + '...'"></VTextarea>
                                        <ErrorMessage class="help is-danger" name="note" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="date">
                                    <VLabel class="required">{{ t('reminder.form.date') }}</VLabel>
                                    <VControl>
                                        <VInput v-model="date" type="date" />
                                        <ErrorMessage class="help is-danger" name="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="time">
                                    <VLabel class="required">{{ t('reminder.form.time') }}</VLabel>
                                    <VControl>
                                        <Datepicker v-model="time" :locale="locale" :cancel-text="t('date_picker.cancel')"
                                            time-picker :select-text="t('date_picker.select')" :dark="dark.isDark"
                                            class="date-picker-dircetion" />
                                        <ErrorMessage class="help is-danger" name="time" />
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
<style lang="scss">
@import '/@src/scss/styles/formPage.scss';
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';

.label {
    font-family: var(--font);
    font-size: 0.9rem;
    color: var(--light-text) !important;
    font-weight: 400;
}

.load {
    height: 400px;
    width: 500px;
}
</style>
