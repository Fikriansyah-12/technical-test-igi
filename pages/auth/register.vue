<script setup lang="ts">
import { reactive, ref } from 'vue'
import { navigateTo } from '#app'

const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref<string | null>(null)

const form = reactive({
  usename:'',
  email: '',
  password: '',
  remember: false,
})

const emailOk = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const username = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const passwordOk = (v: string) => v.length >= 6

const onSubmit = async (e: Event) => {
  e.preventDefault()
  errorMsg.value = null
    if (!username(form.usename)) {
    errorMsg.value = 'Username minimal 8 karakter. '
    return
  }

  if (!emailOk(form.email)) {
    errorMsg.value = 'Alamat email tidak valid.'
    return
  }
  if (!passwordOk(form.password)) {
    errorMsg.value = 'Password minimal 6 karakter.'
    return
  }

  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 900))
    navigateTo('/dashboard')
  } catch (err) {
    errorMsg.value = 'Login gagal. Coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-gradient"></div>

    <div class="auth-container">
      <div class="auth-card">
        <div class="brand">
          <img
            class="brand-logo"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Brand"
          />
          <p class="brand-subtitle">Sign up to continue</p>
        </div>

        <form class="form" @submit="onSubmit">
          <div class="form-group">
            <label for="email">Username</label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              placeholder="jhon doe"
              autocomplete="email"
              required
            />
          </div>
            <div class="form-group">
            <label for="email">Email address</label>
            <input
              id="email"
              type="email"
              v-model.trim="form.email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password">Password</label>
              <button type="button" class="ghost-link" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <div class="password-wrap">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <label class="checkbox">
              <input type="checkbox" v-model="form.remember" />
              <span>Remember me</span>
            </label>
            <a href="/auth/forgot" class="ghost-link">Forgot password?</a>
          </div>

          <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

          <button class="btn-primary" :disabled="loading">
            <span v-if="!loading">Sign in</span>
            <span v-else class="spinner" aria-label="Loading"></span>
          </button>
        </form>
       
      </div>
    </div>
  </div>
</template>
