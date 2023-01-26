<script lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultEmployee, Employee, EmployeeSearchFilter } from '/@src/models/Employee/employee';
import { defaultCreateEmployeeVariablePayment, defaultEmployeeVariablePayment, defaultUpdateEmployeeVariablePayment, EmployeeVariablePaymentConsts } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment';
import { defaultCreateVariablePayment, defaultUpdateVariablePayment, defaultVariablePayment, VariablePayment, VariablePaymentConsts, VariablePaymentSearchFilter } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { User } from '/@src/models/Others/User/user';
import { employeeVariablePaymentValidationSchema } from '/@src/rules/HR/Payroll/EmployeeVariablePayment/employeeVariablePaymentValidation';
import { getEmployeesList } from '/@src/services/Employee/employeeService';
import { addEmployeeVariablePayment, editEmployeeVariablePayment, getEmployeeVariablePayment } from '/@src/services/HR/Payroll/EmployeeVariablePayment/employeeVariablePaymentService';
import { addVariablePayment, editVariablePayment, getVariablePaymentsList } from '/@src/services/HR/Payroll/VariablePayment/variablePaymentService';
import { useEmployeeVariablePayment } from '/@src/stores/HR/Payoll/EmployeeVariablePayment/employeeVariablePaymentStore';
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
        viewWrapper.setPageTitle(t('employee_variable_payment.form.page_title'));
        const head = useHead({
            title: t('employee_variable_payment.form.page_title'),
        });
        const employeeVariablePaymentStore = useEmployeeVariablePayment()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('employee_variable_payment.form.form_header', { type: formTypeName });
        const backRoute = "/employee-variable-payment";
        const currentEmployeeVariablePayment = ref(defaultEmployeeVariablePayment);
        const employeeVariablePaymentId = ref(0);
        const requiredDueDate = ref('');
        const employeesList = ref<Employee[]>([])
        const variablePaymentsList = ref<VariablePayment[]>([])
        const originalEmployeeVariablePaymentStatus = ref<number>();

        //@ts-ignore
        employeeVariablePaymentId.value = route.params?.id as number ?? 0;

        const getCurrentEmployeeVariablePayment = async () => {
            if (employeeVariablePaymentId.value === 0) {

                currentEmployeeVariablePayment.value.id = 0
                currentEmployeeVariablePayment.value.employee = defaultEmployee
                currentEmployeeVariablePayment.value.variable_payment = defaultVariablePayment
                currentEmployeeVariablePayment.value.amount = 0
                currentEmployeeVariablePayment.value.note = undefined
                currentEmployeeVariablePayment.value.due_date = undefined
                currentEmployeeVariablePayment.value.status = EmployeeVariablePaymentConsts.PENDING
                return
            }
            const { employeeVariablePayment } = await getEmployeeVariablePayment(employeeVariablePaymentId.value);
            currentEmployeeVariablePayment.value = employeeVariablePayment != undefined ? employeeVariablePayment : defaultEmployeeVariablePayment;
            originalEmployeeVariablePaymentStatus.value = currentEmployeeVariablePayment.value.status


        };

        onMounted(async () => {
            let variablePaymentSearchFilter = {} as VariablePaymentSearchFilter
            variablePaymentSearchFilter.per_page = 500
            variablePaymentSearchFilter.status = EmployeeVariablePaymentConsts.PENDING
            const { variablePayments } = await getVariablePaymentsList(variablePaymentSearchFilter)
            variablePaymentsList.value = variablePayments
            let employeesSearchFilter = {} as EmployeeSearchFilter
            employeesSearchFilter.per_page = 500
            const { employees } = await getEmployeesList(employeesSearchFilter)
            employeesList.value = employees

        });
        onMounted(() => {
            getCurrentEmployeeVariablePayment();
        });

        const validationSchema = employeeVariablePaymentValidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                employee_id: currentEmployeeVariablePayment?.value?.employee.id ?? 0,
                variable_payment_id: currentEmployeeVariablePayment?.value?.variable_payment.id ?? 0,
                amount: currentEmployeeVariablePayment?.value?.amount ?? 0,
                note: currentEmployeeVariablePayment?.value?.note ?? '',
                due_date: currentEmployeeVariablePayment?.value?.due_date ?? '',
                status: currentEmployeeVariablePayment?.value?.status ?? EmployeeVariablePaymentConsts.PENDING,
            } : {
                employee_id: 0,
                variable_payment_id: 0,
                amount: 0,
                note: '',
                due_date: '',
                status: EmployeeVariablePaymentConsts.PENDING,
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
            let employeeVariablePaymentData = defaultCreateEmployeeVariablePayment
            employeeVariablePaymentData.employee_id = currentEmployeeVariablePayment.value.employee.id ?? 0
            employeeVariablePaymentData.variable_payment_id = currentEmployeeVariablePayment.value.variable_payment.id
            employeeVariablePaymentData.amount = currentEmployeeVariablePayment.value.amount
            employeeVariablePaymentData.due_date = currentEmployeeVariablePayment.value.due_date
            employeeVariablePaymentData.note = currentEmployeeVariablePayment.value.note
            employeeVariablePaymentData.status = currentEmployeeVariablePayment.value.status
            if (employeeVariablePaymentData.status == EmployeeVariablePaymentConsts.WAITING) {
                employeeVariablePaymentData.due_date = currentEmployeeVariablePayment.value.due_date

            } else {
                employeeVariablePaymentData.due_date = undefined

            }

            if (employeeVariablePaymentData.status == EmployeeVariablePaymentConsts.WAITING && employeeVariablePaymentData.due_date == undefined) {
                requiredDueDate.value = t('validation.date.required_error')
                return
            }
            const { success, message, employeeVariablePayment } = await addEmployeeVariablePayment(employeeVariablePaymentData);
            if (success) {


                notif.dismissAll();
                await sleep(200);


                notif.success(t('toast.success.add'));
                router.push({ path: `/employee-variable-payment` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            if (originalEmployeeVariablePaymentStatus.value == EmployeeVariablePaymentConsts.RELEASED ||
                originalEmployeeVariablePaymentStatus.value == EmployeeVariablePaymentConsts.INACTIVE) {
                notif.error(t('toast.error.employee_variable_payment.cant_edit'))
                return
            }

            let employeeVariablePaymentData = defaultUpdateEmployeeVariablePayment
            employeeVariablePaymentData.employee_id = currentEmployeeVariablePayment.value.employee.id ?? 0
            employeeVariablePaymentData.variable_payment_id = currentEmployeeVariablePayment.value.variable_payment.id ?? 0
            employeeVariablePaymentData.amount = currentEmployeeVariablePayment.value.amount
            employeeVariablePaymentData.due_date = currentEmployeeVariablePayment.value.due_date
            employeeVariablePaymentData.status = currentEmployeeVariablePayment.value.status
            if (employeeVariablePaymentData.status == EmployeeVariablePaymentConsts.WAITING) {
                employeeVariablePaymentData.due_date = currentEmployeeVariablePayment.value.due_date

            } else {
                employeeVariablePaymentData.due_date = undefined

            }

            if (employeeVariablePaymentData.status == EmployeeVariablePaymentConsts.WAITING && employeeVariablePaymentData.due_date == undefined) {
                return
            }

            const { message, success } = await editEmployeeVariablePayment(employeeVariablePaymentId.value, employeeVariablePaymentData);
            if (success) {


                notif.dismissAll();
                await sleep(200);


                notif.success(t('toast.success.edit'));
                router.push({ path: `/employee-variable-payment` });
            } else {
                await sleep(200);
                notif.error(message)
            }
        };

        return { t, pageTitle, onSubmit, currentEmployeeVariablePayment, requiredDueDate, viewWrapper, backRoute, employeesList, variablePaymentsList, EmployeeVariablePaymentConsts, employeeVariablePaymentStore };
    },
    components: { ErrorMessage }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="employeeVariablePaymentStore?.loading" />
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
                                <VField id="employee_id">
                                    <VLabel class="required">{{ t('employee_variable_payment.form.employee_name') }}
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-if="currentEmployeeVariablePayment.employee"
                                            v-model="currentEmployeeVariablePayment.employee.id">
                                            <VOption value="">{{ t('employee_variable_payment.form.employee_name') }}
                                            </VOption>
                                            <VOption v-for="employee in employeesList" :key="employee.id"
                                                :value="employee.id">{{ employee.user.first_name }} {{
                                                    employee.user.last_name
                                                }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="employee_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="variable_payment_id">
                                    <VLabel class="required">{{ t('employee_variable_payment.form.variable_payment') }}
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-if="currentEmployeeVariablePayment.variable_payment"
                                            v-model="currentEmployeeVariablePayment.variable_payment.id">
                                            <VOption value="">{{ t('employee_variable_payment.form.variable_payment') }}
                                            </VOption>
                                            <VOption v-for="variablePayment in variablePaymentsList"
                                                :key="variablePayment.id" :value="variablePayment.id">{{
                                                    variablePayment.name
                                                }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="variable_payment_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="amount" v-slot="{ field }">
                                    <VLabel class="required">{{ t('employee_variable_payment.form.amount') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentEmployeeVariablePayment.amount" type="number"
                                            placeholder="" />
                                        <ErrorMessage class="help is-danger" name="amount" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="note" v-slot="{ field }">
                                    <VLabel class="optional">{{ t('employee_variable_payment.form.note') }}</VLabel>
                                    <VControl>
                                        <VTextarea v-model="currentEmployeeVariablePayment.note"
                                            class="is-primary-focus" rows="2"></VTextarea>

                                        <ErrorMessage class="help is-danger" name="note" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="status">
                                    <VLabel class="required">{{ t('employee_variable_payment.form.status') }}
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-if="currentEmployeeVariablePayment.status"
                                            v-model="currentEmployeeVariablePayment.status">
                                            <VOption :value="EmployeeVariablePaymentConsts.PENDING">{{
                                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.PENDING)
                                            }}</VOption>
                                            <VOption :value="EmployeeVariablePaymentConsts.APPROVED">{{
                                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.APPROVED)
                                            }}</VOption>
                                            <VOption :value="EmployeeVariablePaymentConsts.INACTIVE">{{
                                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.INACTIVE)
                                            }}</VOption>
                                            <VOption :value="EmployeeVariablePaymentConsts.WAITING">{{
                                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.WAITING)
                                            }}</VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="status" />
                                        <p class="help is-danger mt-2"
                                            v-if="currentEmployeeVariablePayment.status == EmployeeVariablePaymentConsts.INACTIVE">
                                            {{ t('employee_variable_payment.table.deactivate_caution') }}</p>

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div :hidden="currentEmployeeVariablePayment.status != EmployeeVariablePaymentConsts.WAITING"
                        class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="due_date">
                                    <VLabel class="required">{{ t('employee_variable_payment.form.due_at') }} </VLabel>
                                    <VControl icon="feather:chevrons-right"
                                        :class="(requiredDueDate != '') ? 'has-validation has-error' : ''">
                                        <VInput v-model="currentEmployeeVariablePayment.due_date" type="date" />
                                        <ErrorMessage class="help is-danger" name="due_date" />
                                        <p class="help is-danger"
                                            v-if="currentEmployeeVariablePayment.status == EmployeeVariablePaymentConsts.WAITING && currentEmployeeVariablePayment.due_date == undefined">
                                            {{ requiredDueDate }}</p>
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
