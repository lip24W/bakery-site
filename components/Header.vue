<template>
  <nav class="navbar is-white is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand" style="flex-direction: column; align-items: center;">
      <span class="navbar-item logo" style="margin-top: 16px; margin-bottom: 8px;">
        <NuxtLink to="/">
          <svg width="340" height="100" viewBox="0 0 350 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <ellipse cx="50" cy="50" rx="48" ry="28" fill="#FFE5B4"/>
              <ellipse cx="50" cy="40" rx="36" ry="20" fill="#FFF6E5"/>
              <ellipse cx="50" cy="58" rx="22" ry="10" fill="#FFD6A0"/>
              <path d="M32 22 Q36 12 40 22" stroke="#F8C8DC" stroke-width="3" fill="none"/>
              <path d="M60 18 Q64 8 68 18" stroke="#F8C8DC" stroke-width="3" fill="none"/>
              <text x="90" y="60" font-family="'Comic Sans MS', 'Comic Sans', cursive" font-size="64" fill="#F8C8DC" font-weight="bold">Булонька</text>
            </g>
          </svg>
        </NuxtLink>
      </span>
      <button class="burger" @click="showMenu = !showMenu" aria-label="Меню" v-if="isMobile">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="navbar-menu" v-if="!isMobile">
      <div class="navbar-start">
        <NuxtLink to="/" class="navbar-item">Главная</NuxtLink>
        <NuxtLink to="/catalog" class="navbar-item">Каталог</NuxtLink>
        <NuxtLink to="/orders" class="navbar-item">Заказы</NuxtLink>
      </div>
      <div class="navbar-end">
        <template v-if="isAuth">
          <NuxtLink to="/profile" class="navbar-item" style="padding:0 12px;">
            <span class="avatar-placeholder">
              <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="12" r="7" fill="#e7bfae"/><ellipse cx="16" cy="25" rx="10" ry="6" fill="#f8c8dc"/></svg>
            </span>
          </NuxtLink>
          <a class="navbar-item" @click="logout" style="cursor:pointer;">Выйти</a>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="navbar-item">Войти</NuxtLink>
          <NuxtLink to="/register" class="navbar-item">Регистрация</NuxtLink>
        </template>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showMenu && isMobile" class="mobile-menu">
        <button class="close-mobile" @click="showMenu = false" aria-label="Закрыть меню">&times;</button>
        <NuxtLink to="/" class="mobile-link" @click="showMenu = false">Главная</NuxtLink>
        <NuxtLink to="/catalog" class="mobile-link" @click="showMenu = false">Каталог</NuxtLink>
        <NuxtLink to="/orders" class="mobile-link" @click="showMenu = false">Заказы</NuxtLink>
        <template v-if="isAuth">
          <NuxtLink to="/profile" class="mobile-link" @click="showMenu = false">Профиль</NuxtLink>
          <a class="mobile-link" @click="logout; showMenu = false" style="color:#e76a6a;">Выйти</a>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="mobile-link" @click="showMenu = false">Войти</NuxtLink>
          <NuxtLink to="/register" class="mobile-link" @click="showMenu = false">Регистрация</NuxtLink>
        </template>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
const isAuth = ref(false)
const router = useRouter()
const showMenu = ref(false)
const isMobile = ref(false)

function checkAuth() {
  if (typeof window !== 'undefined') {
    isAuth.value = localStorage.getItem('isAuth') === 'true'
  }
}

function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuth')
    router.push('/')
    isAuth.value = false
  }
}

function handleResize() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 768
    if (!isMobile.value) showMenu.value = false
  }
}

onMounted(() => {
  checkAuth()
  handleResize()
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', checkAuth)
    setInterval(checkAuth, 500)
    window.addEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.navbar {
  overflow-x: hidden;
}
.burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 8px;
}
.burger span {
  display: block;
  width: 28px;
  height: 4px;
  background: #b48ead;
  border-radius: 2px;
  margin: 3px 0;
  transition: 0.2s;
}
.mobile-menu {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.98);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.mobile-link {
  font-size: 2rem;
  color: #b48ead;
  margin: 1.5rem 0;
  font-weight: 700;
  text-decoration: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@media (max-width: 768px) {
  .navbar-menu {
    display: none !important;
  }
  .burger {
    display: flex;
  }
}
body, html {
  max-width: 100vw;
  overflow-x: hidden;
}
.avatar-placeholder {
  box-shadow: 0 2px 8px #f3e1d6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3e1d6;
}
.close-mobile {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #b48ead;
  cursor: pointer;
  z-index: 1100;
  padding: 0;
  line-height: 1;
}
</style> 