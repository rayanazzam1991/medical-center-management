<script lang="ts">


import { boolean } from "zod";

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
      type: boolean,
      default: false
    }
  },

  emits: ['onSubmit'],
  setup(props, context) {
    var submited = false
    const onSubmit = () => {
      context.emit('onSubmit', submited)
    }
    return { onSubmit }
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
              <VButton v-if="back_route != ''" icon="lnir lnir-arrow-left rem-100" :to="`${back_route}`" light
                dark-outlined>
                Back
              </VButton>
              <VButton @click="onSubmit" color="primary" raised> {{ form_submit_name }} </VButton>
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
