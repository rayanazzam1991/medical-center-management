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
    viewWrapper.setPageTitle(t('city.form.page_title'));
    const head = useHead({
      title: t('city.form.page_title'),
    });
    const cityStore = useCity()
    const notif = useNotyf() as Notyf;
    const formType = ref("");
    formType.value = props.formType;
    const route = useRoute();
    const router = useRouter();
    const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('city.form.form_header' , {type : formTypeName});
    const backRoute = "/city";
    const currentCity = ref(defaultCity);
    const cityId = ref(0);

    // @ts-ignore
    cityId.value = route.params?.id as number ?? 0;

    const getCurrentCity = async () => {
      if (cityId.value === 0) {
        currentCity.value.name = ''
        currentCity.value.status = 1
        return
      }
      const { city } = await getCity(cityId.value);
      currentCity.value = city != undefined ? city : defaultCity;
    };

    onMounted(() => {
      getCurrentCity();
    });

    const validationSchema = cityvalidationSchema
    const { handleSubmit } = useForm({
      validationSchema,
      initialValues: formType.value == "Edit" ? {
        name: currentCity?.value?.name ?? "",
        status: currentCity?.value?.status ?? 1,
      } : {
        name: "",
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
      var cityData = currentCity.value;
      const { success, message, city } = await addCity(cityData);
      if (success) {

        // @ts-ignore
        notif.dismissAll();
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.add'));
        router.push({ path: `/city/${city.id}` });
      } else {
        await sleep(200);

        notif.error(message)
      }
    });
    const onSubmitEdit = async () => {
      const cityData = currentCity.value;
      const { message, success } = await editCity(cityData);
      if (success) {

        // @ts-ignore
        notif.dismissAll();
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.edit'));
        router.push({ path: `/city/${cityData.id}` });
      } else {
        await sleep(200);

        notif.error(message)

      }
    };

    return { t, pageTitle, onSubmit, currentCity, viewWrapper, backRoute, CityConsts, cityStore };
  },
  components: { ErrorMessage }
})


</script>

<template>
  <div class="page-content-inner">
    <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
      @onSubmit="onSubmit(formType)" :isLoading="cityStore?.loading" />
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
                  <VLabel class="required">{{ t('city.form.name') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="currentCity.name" type="text" placeholder="" autocomplete="given-name" />
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
                  <VLabel class="required">{{ t('city.form.status') }}</VLabel>

                  <VControl>
                    <VRadio v-model="currentCity.status" :value="CityConsts.INACTIVE"
                      :label="CityConsts.showStatusName(0)" name="status" color="danger" />

                    <VRadio v-model="currentCity.status" :value="CityConsts.ACTIVE"
                      :label="CityConsts.showStatusName(1)" name="status" color="success" />
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
