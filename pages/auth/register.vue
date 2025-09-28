<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth' 

const auth = useAuth()

const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref<string | null>(null)

// VALIDATION
const usernameOk = (v: string) => /^[a-zA-Z0-9_.-]{4,}$/.test(v) 
const emailOk    = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const passwordOk = (v: string) => v.length >= 6

const onSubmit = async (e: Event) => {
  e.preventDefault()
  errorMsg.value = null

  if (!usernameOk(auth.form.username)) {
    errorMsg.value = 'Username must be at least 4 characters (letters, numbers, . _ -).'
    return
  }
  if (!emailOk(auth.form.email)) {
    errorMsg.value = 'Invalid email address.'
    return
  }
  if (!passwordOk(auth.form.password)) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }

  loading.value = true
  try {
    await auth.register() 
  } catch (err: any) {
    errorMsg.value = err?.message || 'Registration failed. Please try again.'
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
          <p class="brand-subtitle">Create your account</p>
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

          <!-- Email -->
          <div class="form-group">
            <label for="email">Email address</label>
            <input
              id="email"
              type="email"
              v-model.trim="auth.form.email"
              placeholder="you@example.com"
              autocomplete="email"
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
                autocomplete="new-password"
                required
              />
            </div>
            <p class="hint">Use at least 6 characters.</p>
          </div>

          <p v-if="errorMsg" class="error" aria-live="polite">{{ errorMsg }}</p>

          <button class="btn-primary" :disabled="loading">
            <span v-if="!loading">Sign up</span>
            <span v-else class="spinner" aria-label="Loading"></span>
          </button>

          <p class="alt text-sm text-gray-500 mt-3">
            Already have an account?
            <NuxtLink class="ghost-link" to="/auth/login">Sign in</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
