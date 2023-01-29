<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { defaultCity, City, CityConsts } from '/@src/models/Others/City/city';
import { getCity, addCity, editCity } from '/@src/services/Others/City/cityService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { cityvalidationSchema } from '/@src/rules/Others/City/cityValidation';
import sleep from "/@src/utils/sleep";
import { useCity } from "/@src/stores/Others/City/cityStore";
import { Setting, UnjustifiedHoursRoundConsts } from '/@src/models/Others/Setting/setting';
import { editSettings, getSettings } from '/@src/services/Others/Setting/settingService';
import { getWeekDays } from '/@src/services/HR/Attendance/Date/dateService';
import { useSetting } from '/@src/stores/Others/Setting/settingStore';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';


export default defineComponent({
    props: {},
    emits: ["onSubmit"],
    setup(props, context) {
        const {t} = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('settings.form.page_title'));
        const head = useHead({
            title: t('settings.form.page_title'),
        });
        const roundingOptions = UnjustifiedHoursRoundConsts.ROUNDING_OPTIONS
        const notif = useNotyf() as Notyf;
        const formType = ref("Edit");
        const route = useRoute();
        const settingStore = useSetting();
        const router = useRouter();
        const settingsList = ref<Setting[]>([])
        const pageTitle = viewWrapper.pageTitle;
        const daysName = ref<string[]>([])
        const start_day = ref('')
        const end_day = ref('')
        const start_of_week = ref('')
        const start_time = ref({ hour: '00', minute: '00' })
        const end_time = ref({ hour: '00', minute: '00' })
        const late_tolerance = ref('')
        const deduction_factor = ref('')
        const hr_cycle_start_day = ref('')
        const unjustified_hours_round = ref('')
        

        onMounted(async () => {
            const { settings } = await getSettings()
            settingsList.value = settings
            daysName.value = await getWeekDays()
            start_day.value = settingsList.value.find((setting) => setting.key == 'start_day')?.value ?? ''
            end_day.value = settingsList.value.find((setting) => setting.key == 'end_day')?.value ?? ''
            start_of_week.value = settingsList.value.find((setting) => setting.key == 'start_of_week')?.value ?? ''
            const settings_start_time = settingsList.value.find((setting) => setting.key == 'start_time')?.value ?? ''
            const settings_end_time = settingsList.value.find((setting) => setting.key == 'end_time')?.value ?? ''
            late_tolerance.value = settingsList.value.find((setting) => setting.key == 'late_tolerance')?.value ?? ''
            deduction_factor.value = settingsList.value.find((setting) => setting.key == 'deduction_factor')?.value ?? ''
            hr_cycle_start_day.value = settingsList.value.find((setting) => setting.key == 'hr_cycle_start_day')?.value ?? ''
            unjustified_hours_round.value = settingsList.value.find((setting) => setting.key == 'unjustified_hours_round')?.value ?? ''

            const [start_hour, start_minute, start_second] = settings_start_time.split(':')
            start_time.value = { hour: start_hour, minute: start_minute }
            const [end_hour, end_minute, end_second] = settings_end_time.split(':')
            end_time.value = { hour: end_hour, minute: end_minute }

        });

        const onSubmit = async () => {

            let formatedStartTimeMinute;
            let formatedStartTimeHour;
            let formatedEndTimeMinute;
            let formatedEndTimeHour;
            let updateSettings: Setting[] = []


            if (Number(start_time.value.minute) < 10 && Number(start_time.value.minute) > 0)
                formatedStartTimeMinute = '0' + start_time.value.minute
            else
                formatedStartTimeMinute = start_time.value.minute

            if (Number(start_time.value.hour) < 10 && Number(start_time.value.hour) > 0)
                formatedStartTimeHour = '0' + start_time.value.hour
            else
                formatedStartTimeHour = start_time.value.hour
            if (Number(end_time.value.minute) < 10 && Number(end_time.value.minute) > 0)
                formatedEndTimeMinute = '0' + end_time.value.minute
            else
                formatedEndTimeMinute = end_time.value.minute

            if (Number(end_time.value.hour) < 10 && Number(end_time.value.hour) > 0)
                formatedEndTimeHour = '0' + end_time.value.hour
            else
                formatedEndTimeHour = end_time.value.hour

            if (Number(formatedStartTimeHour) > Number(formatedEndTimeHour)) {
                await sleep(500);
                notif.error(t('toast.error.Attendance.time'))
                return
            }

            else if (Number(formatedStartTimeHour) == Number(formatedEndTimeHour)) {
                if (Number(formatedStartTimeMinute) >= Number(formatedEndTimeMinute)) {
                    await sleep(500);
                    notif.error(t('toast.error.Attendance.time'))
                    return
                }
            }
            if((Number(deduction_factor.value) < 1 ) || !(Number.isInteger(deduction_factor.value))) {
                await sleep(500);
                    notif.error(t('toast.error.payroll.deduction_factor'))
                    return

            }
            const updateStartTime = formatedStartTimeHour + ':' + formatedStartTimeMinute
            const updateEndTime = formatedEndTimeHour + ':' + formatedEndTimeMinute
            if (updateStartTime != settingsList.value.find((setting) => setting.key == 'start_time')?.value || updateEndTime != settingsList.value.find((setting) => setting.key == 'end_time')?.value) {

                updateSettings.push({ key: 'start_time', value: updateStartTime }, { key: 'end_time', value: updateEndTime })
            }
            if (start_day.value != settingsList.value.find((setting) => setting.key == 'start_day')?.value) {
                updateSettings.push({ key: 'start_day', value: start_day.value })
            }
            if (end_day.value != settingsList.value.find((setting) => setting.key == 'end_day')?.value) {
                updateSettings.push({ key: 'end_day', value: end_day.value })
            }
            if (start_of_week.value != settingsList.value.find((setting) => setting.key == 'start_of_week')?.value) {
                const new_start_of_week_index = daysName.value.findIndex((day) => day == start_of_week.value)
                const new_end_of_week = daysName.value.at(new_start_of_week_index - 1) ?? start_of_week.value

                updateSettings.push({ key: 'start_of_week', value: start_of_week.value }, { key: 'end_of_week', value: new_end_of_week })
            }
            if (late_tolerance.value != settingsList.value.find((setting) => setting.key == 'late_tolerance')?.value) {
                updateSettings.push({ key: 'late_tolerance', value: late_tolerance.value })
            }
            if (deduction_factor.value != settingsList.value.find((setting) => setting.key == 'deduction_factor')?.value) {
                updateSettings.push({ key: 'deduction_factor', value: deduction_factor.value })
            }
            if (hr_cycle_start_day.value != settingsList.value.find((setting) => setting.key == 'hr_cycle_start_day')?.value) {
                updateSettings.push({ key: 'hr_cycle_start_day', value: hr_cycle_start_day.value })
            }
            if (unjustified_hours_round.value != settingsList.value.find((setting) => setting.key == 'unjustified_hours_round')?.value) {
                updateSettings.push({ key: 'unjustified_hours_round', value: unjustified_hours_round.value })
            }


            const { message, success } = await editSettings(updateSettings);
            if (success) {

                notif.dismissAll();
                await sleep(200);

                notif.success(t('toast.success.edit'));
                router.push({ path: `/dashboard` });
            } else {
                await sleep(200);

                notif.error(message)

            }
        };
        return { t, daysName,roundingOptions , UnjustifiedHoursRoundConsts, settingStore, start_of_week, late_tolerance, start_time, end_time, start_day, end_day, unjustified_hours_round , hr_cycle_start_day, deduction_factor, pageTitle, settingsList, onSubmit, viewWrapper, formType };
    },
    components: { ErrorMessage }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" type="submit" @onSubmit="onSubmit()"
            :isLoading="settingStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit()">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ t('settings.form.hr_section') }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <h2 class="mb-3 required">{{ t('settings.form.start_day') }}</h2>

                                <VField id="start_day">
                                    <VControl>
                                        <VSelect v-model="start_day">
                                            <VOption v-for="day in daysName" :key="day" :value="day">{{ t(`dates.days.${day.toLowerCase()}`) }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="start_day" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <h2 class="mb-3 required">{{ t('settings.form.end_day') }}</h2>

                                <VField id="end_day">
                                    <VControl>
                                        <VSelect v-model="end_day">
                                            <VOption v-for="day in daysName" :key="day" :value="day">{{ t(`dates.days.${day.toLowerCase()}`) }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="end_day" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <h2 class="mb-3 required">{{t('settings.form.start_time')}}</h2>
                                <div class="columns">

                                    <VField class="column is-6 ">
                                        <VControl>
                                            <VSelect v-model="start_time.hour">
                                                <VOption :key="'00'" :value="'00'">00 </VOption>

                                                <VOption v-for="index in 23" :key="index" :value="index">{{ index < 10
        ? '0' + index : index
}} </VOption>
                                            </VSelect>
                                        </VControl>
                                    </VField>
                                    <VField class="column is-6">
                                        <VControl>
                                            <VSelect v-model="start_time.minute">
                                                <VOption :key="'00'" :value="'00'">00 </VOption>

                                                <VOption v-for="index in 59" :key="index" :value="index.toString()">{{
        index
            < 10 ? '0' + index : index
}} </VOption>
                                            </VSelect>
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-12">
                                <h2 class="mb-3 required">{{t('settings.form.end_time')}}</h2>
                                <div class="columns ">
                                    <VField class="column is-6">
                                        <VControl>
                                            <VSelect v-model="end_time.hour">
                                                <VOption :key="'00'" :value="'00'">00 </VOption>

                                                <VOption v-for="index in 23" :key="index" :value="index">{{ index < 10
        ? '0' + index : index
}} </VOption>
                                            </VSelect>
                                        </VControl>
                                    </VField>
                                    <VField class="column is-6 ">
                                        <VControl>
                                            <VSelect v-model="end_time.minute">
                                                <VOption :key="'00'" :value="'00'">00 </VOption>

                                                <VOption v-for="index in 59" :key="index" :value="index.toString()">{{
        index
            < 10 ? '0' + index : index
}} </VOption>
                                            </VSelect>
                                        </VControl>
                                    </VField>
                                </div>

                            </div>
                            <div class="column is-6">
                                <h2 class="mb-3 required">{{t('settings.form.start_of_week')}}</h2>

                                <VField id="start_of_week">
                                    <VControl>
                                        <VSelect v-model="start_of_week">
                                            <VOption v-for="day in daysName" :key="day" :value="day">{{ t(`dates.days.${day.toLowerCase()}`) }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="start_of_week" />
                                    </VControl>
                                </VField>
                            </div>

                            <div class="column is-6">
                                <h2 class="mb-3 required">{{t('settings.form.late_tolerance')}}</h2>

                                <VField>
                                    <VControl>
                                        <VSelect v-model="late_tolerance">
                                            <VOption :key="0" :value="0">00 </VOption>

                                            <VOption v-for="index in 59" :key="index" :value="index.toString()">{{
        index
            < 10 ? '0' + index : index
}} </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ t('settings.form.payroll_section') }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <h2 class="mb-3 required">{{ t('settings.form.deduction_factor') }}</h2>
                                <VField id="deduction_factor">
                                    <VControl>
                                        <VInput v-model="deduction_factor" type="number" />
                                        <ErrorMessage class="help is-danger" name="deduction_factor" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <h2 class="mb-3 required">{{ t('settings.form.hr_cycle_start_day') }}</h2>
                                <VField id="hr_cycle_start_day">
                                    <VControl>
                                        <VSelect v-model="hr_cycle_start_day">

                                        <VOption v-for="day in 28" :key="day" :value="day">{{ day < 10 ? "0" + day : day }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="hr_cycle_start_day" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <h2 class="mb-3 required">{{ t('settings.form.unjustified_hours_round') }}</h2>

                                <VField id="unjustified_hours_round">
                                    <VControl>
                                        <VSelect v-model="unjustified_hours_round">
                                            <VOption v-for="option in roundingOptions" :key="option" :value="option">{{ UnjustifiedHoursRoundConsts.getRoundingOptionName(option) }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="unjustified_hours_round" />
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
