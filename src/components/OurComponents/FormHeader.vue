<script lang="ts">
import { useI18n } from 'vue-i18n'




export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    form_submit_name: {
      type: String,
      default: '',
    },
    back_route: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['onSubmit'],
  setup(props, context) {
    const {t,locale} = useI18n()
    const iconArrow = locale.value =="ar" ? "lnir-arrow-right":"lnir-arrow-left"
    var submited = false
    const onSubmit = () => {
      context.emit('onSubmit', submited)
    }
    return { onSubmit , t,iconArrow }
  },


})




</script>

<template>
  <div class="form-layout ">
    <div class="form-outer">
      <div class="form-header">
        <div class="form-header-inner">
          <div class="left">
            <h3>{{ title }}</h3>

          </div>
          <div class="right">
            <div class="buttons">
              <div v-if="isLoading" class="loader is-loading m-r-15 m-b-05-rem w35-h35"></div>
              <VButton v-if="back_route != ''" :icon="`lnir ${iconArrow} rem-100`" :to="`${back_route}`" light
                dark-outlined>
                {{ t('forms.back_button')}}
              </VButton>
              <VButton @click="onSubmit" color="primary" raised> {{  t(`forms.type.${form_submit_name.toLowerCase()}`) }} </VButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
