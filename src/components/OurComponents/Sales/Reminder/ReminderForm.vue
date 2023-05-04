<script lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useForm, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Customer, CustomerSearchFilter, defaultCustomer } from '/@src/models/CRM/Customer/customer';
import { defaultCreateVariablePayment, defaultUpdateVariablePayment, defaultVariablePayment, VariablePayment, VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { defaultCreateReminder, defaultUpdateReminder } from '/@src/models/Sales/Reminder/reminder';
import { defaultTicketService } from '/@src/models/Sales/TicketService/ticketService';
import { variablePaymentValidationSchema } from '/@src/rules/HR/Payroll/VariablePayment/variablePaymentValidation';
import { getCustomer, getCustomersList } from '/@src/services/CRM/Customer/customerService';
import { addVariablePayment, getVariablePayment, editVariablePayment } from '/@src/services/HR/Payroll/VariablePayment/variablePaymentService';
import { getTicketService } from '/@src/services/Sales/TicketService/ticketServiceService';
import { useVariablePayment } from '/@src/stores/HR/Payoll/VariablePayment/variablePaymentStore';
import { useReminder } from '/@src/stores/Sales/Reminder/reminderStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';
import Datepicker from '@vuepic/vue-datepicker';
import { useDarkmode } from '/@src/stores/darkmode';
import { reminderValidationSchema } from '/@src/rules/Sales/Reminder/reminderValidationSchema';
import { createReminder, getReminder, updateReminder } from '/@src/services/Sales/Reminder/reminderService';
import { UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { ReminderConsts } from '/@src/models/Sales/Reminder/reminder';
import { UpdateReminder } from '/@src/models/Sales/Reminder/reminder';



export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const route = useRoute();
        const router = useRouter();
        const { t, locale } = useI18n()
        const dark = useDarkmode()

        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('reminder.form.page_title'));
        const head = useHead({
            title: t('reminder.form.page_title'),
        });
        const reminderId = ref(0);
        // @ts-ignore
        reminderId.value = route.params?.id as number ?? 0;

        const reminderStore = useReminder()
        const isLoading = ref(false)
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('reminder.form.form_header', { type: formTypeName });
        const backRoute = "/reminder";
        const currentReminder = ref(defaultCreateReminder);
        const customerId = ref(0);
        const enableSelectCustomer = ref(false);
        const sellectedCustomer = ref(defaultCustomer);
        const ticketServiceId = ref<number | undefined>(undefined);
        const sellectedTicketService = ref(defaultTicketService);
        const time = ref({ hours: '00', minutes: '00' })
        const date = ref('')
        if (Number.isInteger(Number(route.query.customer_id)) && !Number.isNaN(Number(route.query.customer_id))) {
            customerId.value = Number(route.query.customer_id)
            currentReminder.value.customer_id = customerId.value
        } else {
            customerId.value = 0
            enableSelectCustomer.value = true
        }
        if (Number.isInteger(Number(route.query.ticket_service_id)) && !Number.isNaN(Number(route.query.ticket_service_id))) {
            ticketServiceId.value = Number(route.query.ticket_service_id)
            currentReminder.value.ticket_service_id = ticketServiceId.value
        } else {
            ticketServiceId.value = undefined
            currentReminder.value.ticket_service_id = undefined
        }
        const getCurrentReminder = async () => {
            if (reminderId.value === 0) {
                return
            }
            const { reminder } = await getReminder(reminderId.value);
            currentReminder.value.customer_id = reminder.customer?.id ?? 0
            currentReminder.value.ticket_service_id = reminder.service?.id
            currentReminder.value.date = reminder.date
            currentReminder.value.time = reminder.time
            currentReminder.value.status = reminder.status
            currentReminder.value.note = reminder.note
            date.value = reminder.date
            const [hour, minutes] = reminder.time.split(':') as [string, string]
            time.value.hours = hour
            time.value.minutes = minutes
        };


        onMounted(async () => {
            isLoading.value = true
            if (ticketServiceId.value != 0 && customerId.value != 0) {
                const { customer } = await getCustomer(customerId.value)
                sellectedCustomer.value = customer
                if (ticketServiceId.value) {
                    const { ticket_service } = await getTicketService(ticketServiceId.value)
                    sellectedTicketService.value = ticket_service
                }
            }
            if (formType.value == 'Edit') {
                await getCurrentReminder()
                const { customer } = await getCustomer(currentReminder.value.customer_id)
                sellectedCustomer.value = customer
                if (currentReminder.value.ticket_service_id) {
                    const { ticket_service } = await getTicketService(currentReminder.value.ticket_service_id)
                    sellectedTicketService.value = ticket_service
                }
                enableSelectCustomer.value = false
                ticketServiceId.value = currentReminder.value.ticket_service_id
                setCustomerIdValue()
            }
            isLoading.value = false

        });
        const setCustomerIdValue = () => {
            setFieldValue('customer_id', currentReminder.value.customer_id)
        }

        const validationSchema = reminderValidationSchema
        const { handleSubmit, setFieldValue } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                customer_id: currentReminder?.value?.customer_id ?? 0,
                date: currentReminder?.value?.date,
                note: currentReminder?.value?.note,
                time: currentReminder?.value?.time,
                status: currentReminder?.value?.status,

            } : {
                customer_id: currentReminder?.value?.customer_id ?? 0,
                note: "",
                date: "",
                time: "",
                status: ReminderConsts.ACTIVE,
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
        const onSubmitEdit = handleSubmit(async (values) => {
            let updateReminderData: UpdateReminder = defaultUpdateReminder
            updateReminderData.date = date.value
            updateReminderData.time = time.value.hours + ':' + time.value.minutes
            updateReminderData.note = currentReminder.value.note
            updateReminderData.status = currentReminder.value.status
            const { success, message } = await updateReminder(reminderId.value, updateReminderData);
            if (success) {
                notif.dismissAll();
                await sleep(200);
                notif.success(t('toast.success.edit'));
                router.push({ path: `/reminder` });
            } else {
                await sleep(200);
                notif.error(message)
            }

        });
        return { t, UserStatusConsts, ReminderConsts, getCustomersList, pageTitle, onSubmit, setCustomerIdValue, currentReminder, isLoading, viewWrapper, backRoute, sellectedTicketService, ticketServiceId, sellectedCustomer, reminderStore, time, date, locale, dark, enableSelectCustomer };
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
                            <div v-if="!enableSelectCustomer" class="column is-12">
                                <h4 class="label"> {{ t('reminder.form.customer') }}
                                    <span class="is-size-5">
                                        {{ sellectedCustomer.user.first_name }}
                                        {{ sellectedCustomer.user.last_name }}
                                    </span>
                                </h4>
                            </div>
                            <div v-else class="column is-12">
                                <Multiselect v-if="formType == 'Add'" v-model="currentReminder.customer_id" mode="single"
                                    :placeholder="t('reminder.form.customer')" :close-on-select="true" ref="customer_id"
                                    @select="setCustomerIdValue()" :filter-results="false" :min-chars="0"
                                    :resolve-on-load="false" :infinite="true" :limit="20" :rtl="true" :max="1"
                                    :clear-on-search="true" :delay="0" :searchable="true" :canClear="false" :options="async (query: any) => {
                                            let customerSearchFilter = {
                                                user_status_id: UserStatusConsts.ACTIVE,
                                                name: query,
                                            } as CustomerSearchFilter
                                            //@ts-ignore
                                            const data = await getCustomersList(customerSearchFilter)
                                            //@ts-ignore
                                            return data.customers.map((customer: Customer) => {
                                                return { value: customer.id, label: customer.user.first_name + ' ' + customer.user.last_name }
                                            })
                                        }"
                                    @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                            </div>
                            <div v-if="ticketServiceId" class="column is-12">
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
                                        <VTextarea v-model="currentReminder.note" class="is-primary-focus" rows="4"
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
                            <div v-if="formType == 'Edit'" class="column is-12">
                                <VField id="status" v-slot="{ field }">
                                    <VLabel class="required">{{ t('position.table.columns.status') }}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentReminder.status" :value="ReminderConsts.ACTIVE"
                                            :label="ReminderConsts.getStatusName(ReminderConsts.ACTIVE)" name="status"
                                            color="primary" />
                                        <VRadio v-model="currentReminder.status" :value="ReminderConsts.INACTIVE"
                                            :label="ReminderConsts.getStatusName(ReminderConsts.INACTIVE)" name="status"
                                            color="success" />
                                        <VRadio v-model="currentReminder.status" :value="ReminderConsts.DONE"
                                            :label="ReminderConsts.getStatusName(ReminderConsts.DONE)" name="status"
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
