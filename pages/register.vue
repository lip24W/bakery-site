<template>
  <div class="container mt-6">
    <div class="column is-half is-offset-one-quarter">
      <div class="box">
        <h2 class="title is-3 has-text-centered mb-5">Регистрация</h2>
        <form @submit.prevent="handleRegister">
          <div class="field">
            <label class="label">Логин</label>
            <div class="control">
              <input v-model="login" type="text" required class="input" placeholder="Логин" />
            </div>
          </div>
          <div class="field">
            <label class="label">Пароль</label>
            <div class="control">
              <input v-model="password" type="password" required class="input" placeholder="Пароль" />
            </div>
          </div>
          <div class="field mt-4">
            <button type="submit" class="button is-link is-fullwidth">Зарегистрироваться</button>
          </div>
          <p v-if="error" class="has-text-danger mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const login = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function handleRegister() {
  error.value = ''
  if (!login.value || !password.value) {
    error.value = 'Заполните все поля!'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Пароль должен быть не менее 6 символов.'
    return
  }
  const existingUser = JSON.parse(localStorage.getItem('user') || '{}')
  if (existingUser.login === login.value) {
    error.value = 'Пользователь с таким логином уже зарегистрирован.'
    return
  }
  localStorage.setItem('user', JSON.stringify({ login: login.value, password: password.value }))
  localStorage.setItem('isAuth', 'true')
  window.dispatchEvent(new Event('storage'))
  router.push('/profile')
}
</script> 