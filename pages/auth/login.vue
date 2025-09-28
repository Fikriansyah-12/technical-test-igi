<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth' // pastikan pathnya benar

const auth = useAuth()

const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref<string | null>(null)

const usernameOk = (v: string) => /^[a-zA-Z0-9_.-]{4,}$/.test(v) // min 4
const passwordOk = (v: string) => v.length >= 6

const onSubmit = async (e: Event) => {
  e.preventDefault()
  errorMsg.value = null

  if (!usernameOk(auth.form.username)) {
    errorMsg.value = 'Username minimal 4 karakter (huruf/angka/._-).'
    return
  }
  if (!passwordOk(auth.form.password)) {
    errorMsg.value = 'Password minimal 6 karakter.'
    return
  }

  loading.value = true
  try {
    await auth.loginWithCredentials() 
  } catch (err: any) {
    errorMsg.value = err?.message || 'Login gagal. Coba lagi.'
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
          <h1 class="brand-title">Welcome back</h1>
          <p class="brand-subtitle">Sign in to continue</p>
        </div>

        <form class="form" @submit="onSubmit" novalidate>
          <!-- Username -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              v-model.trim="auth.form.username"
              placeholder="johndoe"
              autocomplete="username"
              required
            />
          </div>

          <!-- Password -->
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
                v-model="auth.form.password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <label class="checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <NuxtLink to="/auth/forgot" class="ghost-link">Forgot password?</NuxtLink>
          </div>

          <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

          <button class="btn-primary" :disabled="loading">
            <span v-if="!loading">Sign in</span>
            <span v-else class="spinner" aria-label="Loading"></span>
          </button>

          <p class="footnote">
            Not a member?
            <NuxtLink to="/auth/register" class="ghost-link">Create an account</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
