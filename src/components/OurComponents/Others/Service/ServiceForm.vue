<script  lang="ts">
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { CreateServiceItem, CreateServiceItemHelper, defaultCreateService, defaultService, Service, ServiceConsts } from '/@src/models/Others/Service/service';
import { servicevalidationSchema } from '/@src/rules/Others/Service/serviceValidation';
import { getService, addService, editService } from '/@src/services/Others/Service/serviceService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';
import { useService } from '/@src/stores/Others/Service/serviceStore';
import { useI18n } from 'vue-i18n';
import { Notyf } from 'notyf';
import { defaultItem, ItemSearchFilter } from '/@src/models/Warehouse/Item/item';
import { ServiceItem } from '/@src/models/Others/Service/service';
import { getItemsList } from '/@src/services/Warehouse/Item/itemService';
import { Item } from "/@src/models/Warehouse/Item/item"
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';

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
    const pageTitle = t('service.form.form_header', { type: formTypeName });
    const backRoute = "/service";
    const currentService = ref(defaultCreateService);
    const serviceId = ref(0);
    const serviceItems = ref<CreateServiceItemHelper[]>([])
    const itemsList = ref<Item[]>([])
    const itemId = ref<number>(0)
    const hasItem = ref(false)
    const keyIncrement = ref(0)
    // @ts-ignore
    serviceId.value = route.params?.id as number ?? 0;
    const getCurrentService = async () => {
      if (serviceId.value === 0) {
        currentService.value.name = ''
        currentService.value.status = 1
        currentService.value.description = undefined
        currentService.value.service_price = undefined
        currentService.value.duration_minutes = undefined
        currentService.value.has_item = false
        return
      }

      const { service } = await getService(serviceId.value);
      currentService.value = service != undefined ? service : defaultService;
      hasItem.value = currentService.value.has_item
      service.service_items.forEach((item) => {
        serviceItems.value.push({ quantity: item.quantity, item_id: item.item.id, isNew: false })

      });
      setItemIdValue()
    };
    onMounted(async () => {
      getCurrentService();

      if (formType.value == 'Add') {
        serviceItems.value.push({ item_id: 0, quantity: 0, isNew: true })
      }
      setItemIdValue()
      let itemSearchFilter = {
        is_for_sale: 1
      } as ItemSearchFilter
      const { items } = await getItemsList(itemSearchFilter)
      itemsList.value = items
    });
    onMounted(() => {
    });
    const validationSchema = servicevalidationSchema
    const addItem = (item: CreateServiceItemHelper) => {
      serviceItems.value?.push(item)
    }

    const { handleSubmit, setFieldValue } = useForm({
      validationSchema,
      initialValues: formType.value == "Edit" ? {
        name: currentService.value.name ?? "",
        status: currentService.value.status ?? 1,
        description: currentService.value.description ?? undefined,
        duration_minutes: currentService.value.duration_minutes ?? undefined,
        service_price: currentService.value.service_price ?? undefined,
        service_items: currentService.value.service_items ?? [],
        hasItem: currentService.value.has_item ?? false

      } : {
        name: '',
        status: 1,
        description: '',
        duration_minutes: '',
        service_price: '',
        service_items: [],
        hasItem: false
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
    const removeItem = (index: number) => {
      if (index !== -1) {
        serviceItems.value.splice(index, 1);
      }
    }
    const setItemIdValue = () => {
      serviceItems.value.forEach((element, index) => {
        setFieldValue(`item_id_${index}`, element.item_id)
      });
    }
    watch(hasItem, (value) => {
      if (value && serviceItems.value.length == 0) {
        serviceItems.value.push({ item_id: 0, quantity: 0, isNew: true })
      }
    })
    const onSubmitAdd = handleSubmit(async (values) => {
      let serviceData = currentService.value;
      currentService.value.has_item = hasItem.value
      let quantityError = false
      serviceData.service_items = []
      if (currentService.value.has_item) {
        serviceItems.value.forEach(element => {

          serviceData.service_items.push({ item_id: element.item_id, quantity: element.quantity })
          if (element.quantity <= 0) {

            const item: Item = itemsList.value.find((itemElemnt) => itemElemnt.id === element.item_id) ?? defaultItem
            notif.error(t('toast.error.item.item_service_quantity'))
            quantityError = true
          }
          if (element.item_id == 0) {
            const item: Item = itemsList.value.find((itemElemnt) => itemElemnt.id === element.item_id) ?? defaultItem
            notif.error(t('toast.error.item.item_service_empty'))
            quantityError = true
          }

        });
        if (quantityError) return
      }

      let itemService = serviceItems.value.map(function (item) { return item.item_id });
      let isDuplicate = itemService.some(function (item, idx) {
        return itemService.indexOf(item) != idx
      });
      if (isDuplicate) {
        notif.error(t('toast.error.item.item_service_is_duplicated'))
        return
      }


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
      currentService.value.has_item = hasItem.value
      let quantityError = false
      serviceData.service_items = []
      if (currentService.value.has_item) {
        serviceItems.value.forEach(element => {
          serviceData.service_items.push({ item_id: element.item_id, quantity: element.quantity })
          if (element.quantity <= 0) {
            const item: Item = itemsList.value.find((itemElemnt) => itemElemnt.id === element.item_id) ?? defaultItem
            notif.error(`item ${item.name} quantity < 0 `)
            quantityError = true
          }
        });
        if (quantityError) return
      }
      if (serviceItems.value.length == 0)
        serviceData.has_item = false
      let itemService = serviceItems.value.map(function (item) { return item.item_id });
      let isDuplicate = itemService.some(function (item, idx) {
        return itemService.indexOf(item) != idx
      });
      if (isDuplicate) {
        notif.error(t('toast.error.item.item_service_is_duplicated'))
        return
      }

      const { success, message } = await editService(serviceData);
      if (success) {

        // @ts-ignore
        notif.dismissAll();
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.edit'));
        await sleep(500);
        // initItem()
        router.push({ path: `/service/${serviceData.id}` });
      } else {
        await sleep(200);

        notif.error(message)
      }
    });
    return { t, pageTitle, onSubmit, removeItem, addItem, addParenthesisToString, getItemsList, currentService, setItemIdValue, keyIncrement, serviceItems, viewWrapper, backRoute, ServiceConsts, serviceStore, itemsList, itemId, hasItem };
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
                    <VInput v-model="currentService.name" type="text" placeholder="" autocomplete="given-name" />
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
                  <VLabel class="optional">{{ t('service.form.desciption') }}</VLabel>
                  <VControl icon="feather:file-text">
                    <VInput v-model="currentService.description" type="text" placeholder="" autocomplete="" />
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
                  <VLabel class="required">{{ t('service.form.price') }}</VLabel>
                  <VControl>
                    <VInput v-model="currentService.service_price" type="number" />
                    <ErrorMessage name="service_price" class="help is-danger" />
                  </VControl>
                </VField>
              </div>
              <!--Fieldset-->
              <div class="form-fieldset">
                <div class="columns">
                  <div class="is-flex is-justify-content-center">
                    <VControl class="ml-3">
                      <VSwitchSegment :key="keyIncrement" v-model="hasItem" :label-true="t('service.form.hasItem')"
                        :label-false="t('service.form.donthasItem')" color="success" />
                    </VControl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-fieldset" :hidden="!hasItem">
            <div class="columns is-multiline" v-if="serviceItems.length != 0">
              <div class="column is-6">
                <P class="label-text">
                  {{ t('service.form.choose_item') }}</P>
              </div>
              <div class="column is-6">
                <p class="label-text">
                  {{ t('service.form.quantity') }}</p>
              </div>
            </div>

            <div class="columns" v-for="(item, mainIndex) in serviceItems" :key="mainIndex">
              <div class="column is-6">
                <VField :id="`item_id_${mainIndex}`">
                  <VControl>
                    <Multiselect v-if="(serviceItems[mainIndex].isNew && formType == 'Edit') || formType == 'Add'"
                      v-model="serviceItems[mainIndex].item_id" mode="single" :placeholder="t('service.form.select_item')"
                      :close-on-select="true" ref="accountMultiselect" :filter-results="false" :min-chars="0"
                      :resolve-on-load="false" :infinite="true" :limit="20" :rtl="true" :max="1" :clear-on-search="true"
                      :delay="0" :searchable="true" :canClear="false" @select="setItemIdValue()" :options="async (query: any) => {
                        let itemSearchFilter = {
                          name: query
                        } as ItemSearchFilter
                        const data = await getItemsList(itemSearchFilter)
                        //@ts-ignore
                        return data.items.map((item: Item) => {
                          return { value: item.id, label: `${item.name}` }
                        })
                      }" @open="(select$: any) => {
  if (select$.noOptions) {
    select$.resolveOptions()
  }
}" />
                    <VSelect :disabled="formType == 'Edit'" v-else v-model="serviceItems[mainIndex].item_id">
                      <VOption value="">{{ t('service.form.choose_item') }}</VOption>
                      <VOption v-for="item in itemsList" :key="item.id" :value="item.id">{{
                        item.name }}
                      </VOption>
                    </VSelect>

                  </VControl>
                  <ErrorMessage class="help is-danger" :name="`item_id_${mainIndex}`" />
                </VField>
              </div>
              <div class="column is-6">
                <VField>
                  <VControl>
                    <VInput type="number" v-model.number="serviceItems[mainIndex].quantity" />
                  </VControl>
                </VField>
              </div>
              <div class="column columns is-flex is-align-items-center">
                <VField v-if="(mainIndex != 0 && formType == 'Add') || (formType == 'Edit')">
                  <VControl>
                    <VIconButton icon="feather:trash-2" class="remove_btn" @click="removeItem(mainIndex)" color="danger">
                    </VIconButton>
                  </VControl>
                </VField>
              </div>

            </div>
            <div class="columns px-3 py-2">
              <VButton @click.prevent="addItem({
                item_id: 0,
                quantity: 0,
                isNew: true
              })" color="primary">
                {{ t('financial_record.add_new_row') }}
              </VButton>
            </div>
          </div>

          <div class="form-fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField id="duration_minutes" v-slot="{ field }">
                  <VLabel class="required">{{ t('service.form.duration') }} {{
                    addParenthesisToString(t('service.minutes'))
                  }}</VLabel>
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
