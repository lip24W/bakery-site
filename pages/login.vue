<template>
  <div class="container mt-6">
    <div class="column is-half is-offset-one-quarter">
      <div class="box">
        <h2 class="title is-3 has-text-centered mb-5">Вход</h2>
        <form @submit.prevent="login">
          <div class="field">
            <label class="label">Логин</label>
            <div class="control">
              <input v-model="loginValue" type="text" required class="input" placeholder="Логин" />
            </div>
          </div>
          <div class="field">
            <label class="label">Пароль</label>
            <div class="control">
              <input v-model="password" type="password" required class="input" placeholder="Пароль" />
            </div>
          </div>
          <div class="field mt-4">
            <button type="submit" class="button is-link is-fullwidth">Войти</button>
          </div>
          <p v-if="error" class="has-text-danger mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const loginValue = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function login() {
  error.value = ''
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.login === loginValue.value && user.password === password.value) {
    localStorage.setItem('isAuth', 'true')
    window.dispatchEvent(new Event('storage'))
    router.push('/profile')
  } else {
    error.value = 'Неверный логин или пароль.'
  }
}
</script> 