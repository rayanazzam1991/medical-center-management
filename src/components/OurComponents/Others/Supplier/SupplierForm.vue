<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from "/@src/utils/sleep";
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';
import { useSupplier } from "/@src/stores/Others/Supplier/supplierStore";
import { CreateSupplier, defaultCreateSupplier, defaultSupplier, defaultUpdateSupplier, Supplier, SupplierConsts, UpdateSupplier } from '/@src/models/Others/Supplier/supplier';
import { getSupplier, addSupplier, editSupplier } from '/@src/services/Others/Supplier/supplierService';
import { suppliervalidationSchema } from '/@src/rules/Others/Supplier/supplierValidation';
import { City, CitySearchFilter, defaultCity } from '/@src/models/Others/City/city';
import { getCitiesList } from '/@src/services/Others/City/cityService';


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
        viewWrapper.setPageTitle(t('supplier.form.page_title'));
        const head = useHead({
            title: t('supplier.form.page_title'),
        });
        const supplierStore = useSupplier()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('supplier.form.form_header' , {type : formTypeName});
        const backRoute = "/supplier";
        const currentSupplier = ref(defaultSupplier);
        const supplierId = ref(0);

        // @ts-ignore
        supplierId.value = route.params?.id as number ?? 0;

        const getCurrentSupplier = async () => {
            if (supplierId.value === 0) {
              currentSupplier.value.name = ''
              currentSupplier.value.phone_number = ''
              currentSupplier.value.address = ''
              currentSupplier.value.status = 1
              currentSupplier.value.city = undefined
                return
            }
            const { supplier } = await getSupplier(supplierId.value);
            currentSupplier.value = supplier != undefined ? supplier : defaultSupplier;
        };

        onMounted(() => {
          getCurrentSupplier();
        });
        const citiesList = ref<City[]>([])
        onMounted(async () => {
            let citySearchFilter  = {} as CitySearchFilter
            citySearchFilter.status = SupplierConsts.ACTIVE
            const { cities } = await getCitiesList(citySearchFilter)
            citiesList.value = cities
        })
        const validationSchema = suppliervalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
              name: currentSupplier?.value?.name ?? "",
              phone_number: currentSupplier?.value?.phone_number ?? "",
              status: currentSupplier?.value?.status ?? 1,
              city_id: currentSupplier.value?.city?.id ?? undefined,
            } : {
                name: "",
                phone_number: "",
                status: 1,
                city_id: undefined
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
          let supplierData: CreateSupplier = defaultCreateSupplier;
          supplierData.address = currentSupplier.value.address
          supplierData.notes = currentSupplier.value.notes
          supplierData.name = currentSupplier.value.name
          supplierData.phone_number = currentSupplier.value.phone_number
          supplierData.status = currentSupplier.value.status
            supplierData.city_id = currentSupplier.value.city?.id
            const { success, message, supplier } = await addSupplier(supplierData);
            if (success) {

                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(t('toast.success.add'));
                router.push({ path: `/supplier/${supplier.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
          let supplierData: UpdateSupplier = defaultUpdateSupplier;

          supplierData.address = currentSupplier.value.address
          supplierData.id = currentSupplier.value.id
          supplierData.notes = currentSupplier.value.notes
          supplierData.name = currentSupplier.value.name
          supplierData.phone_number = currentSupplier.value.phone_number
          supplierData.status = currentSupplier.value.status
          supplierData.city_id = currentSupplier.value.city?.id
            const { message, success } = await editSupplier(supplierData);
            if (success) {
                // @ts-ignore
                notif.dismissAll();
                await sleep(200);
                // @ts-ignore
                notif.success(t('toast.success.edit'));
                router.push({ path: `/supplier/${supplierData.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        };
        return {t, pageTitle, onSubmit, currentSupplier, viewWrapper, backRoute,citiesList, SupplierConsts, supplierStore };
    },
    components: { ErrorMessage }
})
</script>
<template>
  <div class="page-content-inner">
      <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
          @onSubmit="onSubmit(formType)" :isLoading="supplierStore?.loading" />
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
                                    <VLabel class="required">{{ t('supplier.form.name') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentSupplier.name" type="text" placeholder=""
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
                                <VField id="phone_number"  v-slot="{ field }">
                                    <VLabel class="required">{{ t('supplier.form.phone_number') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentSupplier.phone_number" type="text" placeholder=""
                                            autocomplete="given-phone_number" />
                                            <ErrorMessage class="help is-danger" name="phone_number" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                  </div>
                    <!--Fieldset-->
                  <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField  v-slot="{ field }">
                                    <VLabel >{{ t('supplier.form.address') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentSupplier.address" type="text" placeholder=""
                                            autocomplete="given-address" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                  </div>
                    <!--Fieldset-->
                  <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="notes" v-slot="{ field }">
                                    <VLabel >{{ t('supplier.form.notes') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentSupplier.notes" type="text" placeholder=""
                                            autocomplete="given-notes" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                  </div>
                    <!--Fieldset-->
                  <div class="form-fieldset">
                      <div class="columns is-multiline">
                          <div class="column is-12">
                              <VField >
                                  <VLabel >{{t('supplier.form.city')}}</VLabel>
                                  <VControl>
                                      <VSelect v-model="currentSupplier.city" >
                                          <VOption :value="undefined"> {{t('supplier.form.city')}}</VOption>
                                          <VOption v-for="city in citiesList"
                                              :value="city">{{ city.name }}
                                          </VOption>
                                      </VSelect>

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
                                  <VLabel >{{t('supplier.form.status')}}</VLabel>
                                  <VControl>
                                      <VRadio v-model="currentSupplier.status" :value="SupplierConsts.INACTIVE"
                                          :label="SupplierConsts.getSupplierStatusName(0)" name="status" color="danger" />

                                      <VRadio v-model="currentSupplier.status" :value="SupplierConsts.ACTIVE"
                                          :label="SupplierConsts.getSupplierStatusName(1)" name="status" color="success" />

                                          <VRadio v-model="currentSupplier.status" :value="SupplierConsts.NOT_RECOMMENDED"
                                            :label="SupplierConsts.getSupplierStatusName(2)" name="status" color="info"
                                            />
                                      <ErrorMessage name="status" />
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

