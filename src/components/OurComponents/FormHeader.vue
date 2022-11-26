<script lang="ts">

import { toFormValidator } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import sleep from '/@src/utils/sleep';
import { z as zod } from 'zod'
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
  },

  emits: ['onSubmit'],
  setup(props, context) {
    const title = props.title
    const form_submit_name = props.form_submit_name
    const back_route = props.back_route
    var submited = false
    const { y } = useWindowScroll()
    const isStuck = computed(() => {
      return y.value > 30
    })



    const onSubmit = () => {
      console.log('handlesubmit')
      submited = true
      context.emit('onSubmit', submited)
      console.log('formheader')
    }
    return { isStuck, onSubmit }
  },


})




</script>

<template>
  <div class="form-layout ">
    <div class="form-outer">
      <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left">
            <h3>{{ title }}</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton icon="lnir lnir-arrow-left rem-100" :to="`${back_route}`" light dark-outlined>
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

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.is-navbar {
  .form-layout {
    margin-top: 30px;
  }
}

.form-layout {
  max-width: 100%;
  margin: 0 auto;

  &.is-split {
    // max-width: 840px;

    .form-outer {
      width: 100%;

      .form-body {
        padding: 0;

        .form-section {
          display: flex;
          padding: 20px;

          &.is-grey {
            background: #fafafa;
          }

          .left,
          .right {
            padding: 20px 40px;
            width: 50%;

            h3 {
              font-family: var(--font-alt);
              font-weight: 600;
              font-size: 0.95rem;
              color: var(--dark-text);
              margin-bottom: 20px;
            }
          }

          .left {
            position: relative;
            border-right: 1px solid var(--fade-grey-dark-3);

            .operator {
              position: absolute;
              top: 17px;
              right: -10px;
              text-transform: uppercase;
              font-family: var(--font);
              font-weight: 500;
              color: var(--dark-text);
              background: var(--white);
              padding: 4px 0;
            }
          }

          .radio-pills {
            display: flex;
            justify-content: space-between;

            .radio-pill {
              position: relative;

              input {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                opacity: 0;
                cursor: pointer;

                &:checked {
                  +.radio-pill-inner {
                    background: var(--primary);
                    border-color: var(--primary);
                    box-shadow: var(--primary-box-shadow);
                    color: var(--white);
                  }
                }
              }

              .radio-pill-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 40px;
                background: var(--white);
                border: 1px solid var(--fade-grey-dark-3);
                border-radius: 8px;
                font-family: var(--font);
                font-weight: 600;
                font-size: 0.9rem;
                transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                  height 0.3s, width 0.3s;
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .form-layout {
    &.is-split {
      .form-outer {
        .form-body {
          .form-section {
            &.is-grey {
              background: var(--dark-sidebar-light-4) !important;
            }

            h3 {
              color: var(--dark-dark-text);
            }

            .left {
              border-color: var(--dark-sidebar-light-12) !important;

              .operator {
                background: var(--dark-sidebar-light-6) !important;
                color: var(--dark-dark-text);
              }

              .radio-pills {
                .radio-pill {
                  input {
                    &:checked+.radio-pill-inner {
                      border-color: var(--primary);
                      background: var(--primary);
                      box-shadow: var(--primary-box-shadow);
                      color: var(--smoke-white);
                    }
                  }

                  .radio-pill-inner {
                    background: var(--dark-sidebar-light-2);
                    border-color: var(--dark-sidebar-light-12);
                    color: var(--dark-dark-text);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .form-layout {
    &.is-split {
      .form-outer {
        .form-body {
          .form-section {
            flex-direction: column;
            padding-right: 0;
            padding-left: 0;

            .left,
            .right {
              width: 100%;
              padding-right: 30px;
              padding-left: 30px;
            }

            .left {
              border-right: none;
              border-bottom: 1px solid var(--fade-grey-dark-3);
              padding-bottom: 40px;

              .operator {
                top: unset;
                bottom: -14px;
                left: 0;
                right: 0;
                margin: 0 auto;
                text-align: center;
                max-width: 60px;
              }
            }

            .right {
              padding-top: 30px;
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .form-layout {
    &.is-split {
      .form-outer {
        .form-body {
          .form-section {
            padding-right: 0;
            padding-left: 0;
          }
        }
      }
    }
  }
}
</style>
