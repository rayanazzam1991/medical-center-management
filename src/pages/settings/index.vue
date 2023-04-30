<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "setting_edit"
    ]
  }
}
</route>
  
<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep";
import { ReservationsTimeSlotsConsts, Setting, UnjustifiedHoursRoundConsts } from '/@src/models/Others/Setting/setting';
import { editSettings, getSettings } from '/@src/services/Others/Setting/settingService';
import { getWeekDays } from '/@src/services/HR/Attendance/Date/dateService';
import { useSetting } from '/@src/stores/Others/Setting/settingStore';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useDarkmode } from '/@src/stores/darkmode';
import Datepicker from '@vuepic/vue-datepicker';
import { getCurrencyByCode, updateCurrencyRate } from '/@src/services/Accounting/Currency/currencyService';
import { CurrencyConsts, Currency, defaultCurrency } from '/@src/models/Accounting/Currency/currency';



export default defineComponent({
  props: {},
  emits: ["onSubmit"],
  setup(props, context) {
    const { t, locale } = useI18n()
    const dark = useDarkmode()
    const viewWrapper = useViewWrapper();
    viewWrapper.setPageTitle(t('settings.form.page_title'));
    const head = useHead({
      title: t('settings.form.page_title'),
    });
    const roundingOptions = UnjustifiedHoursRoundConsts.ROUNDING_OPTIONS
    const reservationsTimeSlotsOptions = ReservationsTimeSlotsConsts.OPTIONS
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
    const start_time = ref({ hours: '00', minutes: '00' })
    const end_time = ref({ hours: '00', minutes: '00' })
    const late_tolerance = ref('')
    const deduction_factor = ref('')
    const hr_cycle_start_day = ref('')
    const unjustified_hours_round = ref('')
    const reservations_time_slot = ref('')
    const reservations_have_priority = ref('false')
    const new_usd_currency_rate = ref<number>(1)
    const usd_currency = ref<Currency>(defaultCurrency)
    const loading = ref(false)

    onMounted(async () => {
      loading.value = true
      const { settings } = await getSettings()
      settingsList.value = settings
      const { currency } = await getCurrencyByCode(CurrencyConsts.USD_CODE)
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
      reservations_time_slot.value = settingsList.value.find((setting) => setting.key == 'reservations_time_slot')?.value ?? ''
      reservations_have_priority.value = settingsList.value.find((setting) => setting.key == 'reservations_have_priority')?.value ?? ''
      usd_currency.value = currency
      new_usd_currency_rate.value = currency.rate



      const [start_hour, start_minute, start_second] = settings_start_time.split(':')
      start_time.value = { hours: start_hour, minutes: start_minute }
      const [end_hour, end_minute, end_second] = settings_end_time.split(':')
      end_time.value = { hours: end_hour, minutes: end_minute }
      loading.value = false

    });

    const onSubmit = async () => {

      let formatedStartTimeMinute;
      let formatedStartTimeHour;
      let formatedEndTimeMinute;
      let formatedEndTimeHour;
      let updateSettings: Setting[] = []


      if (Number(start_time.value.minutes) < 10 && Number(start_time.value.minutes) > 0)
        formatedStartTimeMinute = '0' + start_time.value.minutes
      else
        formatedStartTimeMinute = start_time.value.minutes

      if (Number(start_time.value.hours) < 10 && Number(start_time.value.hours) > 0)
        formatedStartTimeHour = '0' + start_time.value.hours
      else
        formatedStartTimeHour = start_time.value.hours
      if (Number(end_time.value.minutes) < 10 && Number(end_time.value.minutes) > 0)
        formatedEndTimeMinute = '0' + end_time.value.minutes
      else
        formatedEndTimeMinute = end_time.value.minutes

      if (Number(end_time.value.hours) < 10 && Number(end_time.value.hours) > 0)
        formatedEndTimeHour = '0' + end_time.value.hours
      else
        formatedEndTimeHour = end_time.value.hours

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
      if ((Number(deduction_factor.value) < 1) || !(Number.isInteger(Number(deduction_factor.value)))) {
        await sleep(500);
        notif.error(t('toast.error.payroll.deduction_factor'))
        return
      }
      if ((Number(new_usd_currency_rate.value) < 1) || !(Number(new_usd_currency_rate.value))) {
        await sleep(500);
        notif.error(t('toast.error.accounting.new_usd_currency_rate'))
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
      if (reservations_time_slot.value != settingsList.value.find((setting) => setting.key == 'reservations_time_slot')?.value) {
        updateSettings.push({ key: 'reservations_time_slot', value: reservations_time_slot.value })
      }
      if (reservations_have_priority.value != settingsList.value.find((setting) => setting.key == 'reservations_have_priority')?.value) {
        updateSettings.push({ key: 'reservations_have_priority', value: reservations_have_priority.value })
      }
      if (new_usd_currency_rate.value !== usd_currency.value.rate) {
        const { message, success } = await updateCurrencyRate(usd_currency.value.id, new_usd_currency_rate.value)
        if (!success) {
          notif.error(message)
          return
        }
      }
      if (updateSettings.length > 0) {

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
      } else {
        router.push({ path: `/dashboard` });

      }
    };
    return {
      t, locale, dark, daysName, roundingOptions, reservationsTimeSlotsOptions, ReservationsTimeSlotsConsts, UnjustifiedHoursRoundConsts, settingStore, new_usd_currency_rate,
      reservations_time_slot, start_of_week, late_tolerance, start_time, end_time, start_day, end_day, unjustified_hours_round, hr_cycle_start_day, deduction_factor, reservations_have_priority,
      pageTitle, settingsList, onSubmit, viewWrapper, formType, loading
    };
  },
  components: { ErrorMessage, Datepicker }
})


</script>

<template>
  <div class="page-content-inner">
    <FormHeader :title="pageTitle" :form_submit_name="formType" type="submit" @onSubmit="onSubmit()"
      :isLoading="loading" />
    <VLoader :hidden="!loading" size="xl" :active="loading">
      <div class="load">
      </div>
    </VLoader>

    <form :hidden="loading" class="form-layout" @submit.prevent="onSubmit()">
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
                      <VOption v-for="day in daysName" :key="day" :value="day">{{ t(`dates.days.${day.toLowerCase()}`)
                      }}
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
                      <VOption v-for="day in daysName" :key="day" :value="day">{{ t(`dates.days.${day.toLowerCase()}`)
                      }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="end_day" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <h2 class="mb-3 required">{{ t('settings.form.start_time') }}</h2>
                <div class="columns">
                  <VField class="column is-12 ">
                    <VControl>
                      <Datepicker v-model="start_time" :locale="locale" time-picker :cancel-text="t('date_picker.cancel')"
                        :select-text="t('date_picker.select')" :dark="dark.isDark" class="date-picker-dircetion" />
                    </VControl>
                  </VField>
                </div>
              </div>
              <div class="column is-6">
                <h2 class="mb-3 required">{{ t('settings.form.end_time') }}</h2>
                <div class="columns ">
                  <VField class="column is-12">
                    <VControl>
                      <Datepicker v-model="end_time" :locale="locale" time-picker :cancel-text="t('date_picker.cancel')"
                        :select-text="t('date_picker.select')" :dark="dark.isDark" class="date-picker-dircetion" />
                    </VControl>
                  </VField>

                </div>

              </div>
              <div class="column is-6">
                <h2 class="mb-3 required">{{ t('settings.form.start_of_week') }}</h2>

                <VField id="start_of_week">
                  <VControl>
                    <VSelect v-model="start_of_week">
                      <VOption v-for="day in daysName" :key="day" :value="day">{{ t(`dates.days.${day.toLowerCase()}`)
                      }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="start_of_week" />
                  </VControl>
                </VField>
              </div>

              <div class="column is-6">
                <h2 class="mb-3 required">{{ t('settings.form.late_tolerance') }}</h2>

                <VField>
                  <VControl>
                    <VSelect v-model="late_tolerance">
                      <VOption :key="0" :value="0">00 </VOption>

                      <VOption v-for="index in 59" :key="index" :value="index.toString()">{{
                        index
                        < 10 ? '0' + index : index }} </VOption>
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

                      <VOption v-for="day in 28" :key="day" :value="day">{{ day < 10 ? "0" + day : day }} </VOption>
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
                      <VOption v-for="option in roundingOptions" :key="option" :value="option">{{
                        UnjustifiedHoursRoundConsts.getRoundingOptionName(option) }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="unjustified_hours_round" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <div class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ t('settings.form.accounting_section') }}</h4>
            </div>
            <div class="columns is-multiline">
              <div class="column is-6">
                <h2 class="mb-3 required">{{ t('settings.form.usd_currency_rate') }}</h2>
                <h2 class="mb-3 help ">{{ t('settings.form.usd_currency_rate_helper') }}</h2>
                <VField id="new_usd_currency_rate">
                  <VControl>
                    <VInput v-model="new_usd_currency_rate" type="number" />
                    <ErrorMessage class="help is-danger" name="new_usd_currency_rate" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <div class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ t('settings.form.ticketing_section') }}</h4>
            </div>
            <div class="columns is-multiline">
              <div class="column is-6">
                <h2 class="mb-3 required">{{ t('settings.form.reservations_time_slot') }}</h2>
                <VField id="reservations_time_slot">
                  <VControl>
                    <VSelect v-model="reservations_time_slot">
                      <VOption v-for="option in reservationsTimeSlotsOptions" :key="option" :value="option">{{
                        ReservationsTimeSlotsConsts.getOptionName(option)
                      }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="reservations_time_slot" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <h2 class="mb-3 required">{{ t('settings.form.reservations_have_priority') }}</h2>
                <VField id="reservations_have_priority">
                  <VControl>
                    <VRadio v-model="reservations_have_priority" value="true" :label="t('boolean.true')"
                      name="reservations_have_priority" color="success" />
                    <VRadio v-model="reservations_have_priority" value="false" :label="t('boolean.false')"
                      name="reservations_have_priority" color="danger" />
                    <ErrorMessage class="help is-danger" name="reservations_have_priority" />
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
<style  lang="scss">
@import '/@src/scss/styles/formPage.scss';
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';

.load {
  height: 400px;
  width: 500px;
}
</style>
