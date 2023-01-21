<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useDarkmode } from '/@src/stores/darkmode'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'
import { signIn } from "/@src/composable/Others/User/Auth/signIn";
import { defaultSignInRequest } from '/@src/models/Others/User/auth'
import { useAuth } from '/@src/stores/Others/User/authStore'
import { getSettings } from '/@src/services/Others/Setting/settingService'
import {useI18n} from "vue-i18n";
import { Notyf } from 'notyf'

const isLoading = ref(false)
const darkmode = useDarkmode()
const router = useRouter()
const route = useRoute()
const notif = useNotyf() as Notyf
const { t } = useI18n()
const userSession = useUserSession()
const redirect = route.query.redirect as string
const signRequest = ref(defaultSignInRequest);
const userAuth = useAuth();


onBeforeMount(() => {
  if (userAuth.isLoggedIn) {
    router.push({
      name: "/dashboard/"
    })
  }
})

const handleLogin = async () => {
  if (!isLoading.value) {
    isLoading.value = true
    notif.dismissAll()
    try {

      const loggedUser = await signIn(signRequest.value);
      const { settings } = await getSettings();

      if (userAuth.isLoggedIn) {

        router.push({
          name: '/dashboard/'
        })
      }
      await sleep(200);

      notif.success(t('auth.success_login'))
    } catch (err: any) {
      if (err.response?.status !== undefined) {
        if (err.response.status !== 401) throw err
        {
          notif.error({
            message: err?.response?.data?.message,
            duration: 5000,
          })
        }
      }
    } finally {
      isLoading.value = false
    }

  }
}

useHead({
  title: 'Auth Login - Vuero',
})
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Image section (hidden on mobile) -->
    <div class="column login-column is-8 h-hidden-mobile h-hidden-tablet-p hero-banner">
      <div class="hero login-hero is-fullheight is-app-grey">
        <div class="hero-body p-0 m-0">
          <div class="columns m-0 p-0">
            <div class="column p-0 m-0">
              <img src="/images/photo/banners/login_banner.jpg"/>
            </div>
          </div>
        </div>
        <div class="hero-footer">
          <p class="has-text-centered"></p>
        </div>
      </div>
    </div>

    <!-- Form section -->
    <div class="column is-4">
      <div class="hero is-fullheight is-white">
        <div class="hero-heading">
          <label class="dark-mode ml-auto" tabindex="0"
            @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()">
            <input type="checkbox" :checked="!darkmode.isDark" @change="darkmode.onChange" />
            <span></span>
          </label>
          <div class="auth-logo">
            <RouterLink to="/">
             <img v-if="darkmode.isDark" src ="/images/logos/logo/logo_light.png"/>
             <img v-else src ="/images/logos/logo/logo.png"/>
            </RouterLink>
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>{{ t('auth.form.welcome_back') }}</h2>
                  <p>{{ t('auth.form.sign_in')}}</p>
                  <!--                  <RouterLink to="/auth/signup-2">-->
                  <!--                    I do not have an account yet-->
                  <!--                  </RouterLink>-->
                </div>
                <div class="auth-form-wrapper">
                  <!-- Login Form -->
                  <form @submit.prevent="handleLogin">
                    <div class="login-form">
                      <!-- Username -->
                      <VField>
                        <VControl icon="feather:user">
                          <VInput v-model="signRequest.phone_number" type="text" :placeholder="t('auth.form.placeholders.phone')"
                            autocomplete="username" />
                        </VControl>
                      </VField>

                      <!-- Password -->
                      <VField>
                        <VControl icon="feather:lock">
                          <VInput v-model="signRequest.password" type="password" :placeholder="t('auth.form.placeholders.password')"
                            autocomplete="current-password" />
                        </VControl>
                      </VField>

                      <!--                      &lt;!&ndash; Switch &ndash;&gt;-->
                      <!--                      <VField>-->
                      <!--                        <VControl class="setting-item">-->
                      <!--                          <VCheckbox label="Remember me" paddingless />-->
                      <!--                        </VControl>-->
                      <!--                      </VField>-->

                      <!-- Submit -->
                      <div class="login">
                        <VButton :loading="isLoading" color="primary" type="submit" bold fullwidth raised>
                          {{t('auth.form.sign_in_button')}}
                        </VButton>
                      </div>

                      <!--                      <div class="forgot-link has-text-centered">-->
                      <!--                        <a>Forgot Password?</a>-->
                      <!--                      </div>-->
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
