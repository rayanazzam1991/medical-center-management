<script  lang="ts">
import { useHead } from '@vueuse/head'
import { useForm, ErrorMessage } from 'vee-validate';
import { nationalService } from '/@src/services/Others/National/nationalService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultNational, National, NationalConsts } from '/@src/models/Others/National/national';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { nationalvalidationSchema } from '/@src/rules/Others/National/nationalValidation';
import sleep from '/@src/utils/sleep';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';
import { nationalStore } from '/@src/stores/Others/National/NationalStore';

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
    viewWrapper.setPageTitle(t('national.form.page_title'));
    const head = useHead({
      title: t('national.form.page_title'),
    });
  
    const notif = useNotyf() as Notyf;
    const formType = ref("");
    formType.value = props.formType;
    const route = useRoute();
    const router = useRouter();
    const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
    const pageTitle = t('national.form.form_header', { type: formTypeName })
    const backRoute = "/national";
    const currentNational = ref<National>(defaultNational);
    const nationalId = ref(0);
    const _nationalService = new nationalService()
    const _nationalStore = nationalStore();
    // @ts-ignore
    nationalId.value = route.params?.id as number ?? 0;
    const getCurrentNational = async () => {
      if (nationalId.value === 0) {
        currentNational.value.name = "";
        currentNational.value.status = 1;
        return;
      }
      const { national } = await _nationalService.show(nationalId.value);
      console.table(national)
      currentNational.value = national;
    };
    onMounted(() => {
      getCurrentNational();
    });

    const validationSchema = nationalvalidationSchema
    const { handleSubmit } = useForm({
      validationSchema,
      initialValues: formType.value == "Edit" ? {
        name: currentNational.value.name ?? "",
        status: currentNational.value.status ?? 1,
      } : {
        name: "",
        status: 1,
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
      var nationalData = currentNational.value;
      const { national, success, message } = await _nationalService.store(nationalData);
      if (success) {

        // @ts-ignore
        notif.dismissAll();
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.add'));
        await sleep(500)
        router.push({ path: `/national/${national.id}` });
      } else {
        await sleep(200);

        notif.error(message)
      }
    });
    const onSubmitEdit = async () => {
      const nationalData = currentNational.value;
      const { message, success } = await _nationalService.update(nationalData);
      if (success) {

        // @ts-ignore
        notif.dismissAll();
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.edit'));
        await sleep(500)
        router.push({ path: `/national/${nationalData.id}` });
      } else {
        await sleep(200);

        notif.error(message)
      }
    };
    return { t, pageTitle, onSubmit, currentNational, viewWrapper, backRoute, NationalConsts, _nationalStore };
  },
  components: { ErrorMessage }
})



</script>

<template>
  <div class="page-content-inner">
    <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
      @onSubmit="onSubmit(formType)" :isLoading="_nationalStore?.loading" />
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
                <VField id="name">
                  <VLabel class="required">{{ t('national.form.name') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="currentNational.name" type="text" autocomplete="given-name" />
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
                <VField id="status">
                  <VLabel class="required">{{ t('national.form.status') }}</VLabel>

                  <VControl>
                    <VRadio v-model="currentNational.status" :value="NationalConsts.INACTIVE"
                      :label="NationalConsts.showStatusName(0)" name="status" color="danger" />

                    <VRadio v-model="currentNational.status" :value="NationalConsts.ACTIVE"
                      :label="NationalConsts.showStatusName(1)" name="status" color="success" />
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
