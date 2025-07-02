<template>
  <div class="container mt-6">
    <template v-if="!isAuth">
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head" style="justify-content: center; border-bottom: none;">
            <p class="modal-card-title" style="font-size: 2rem; color: #b48ead; font-weight: bold; width: 100%; text-align: center;">Требуется авторизация</p>
          </header>
          <section class="modal-card-body has-text-centered">
            <p class="mb-4" style="color: #d48fa6; font-weight: 700; font-size: 1.2rem;">Войдите или зарегистрируйтесь для просмотра заказов</p>
            <NuxtLink to="/login" class="button is-link mr-2">Войти</NuxtLink>
            <NuxtLink to="/register" class="button is-light mr-2">Регистрация</NuxtLink>
            <NuxtLink to="/" class="button is-info is-light">На главную</NuxtLink>
          </section>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="showModal">
        <div class="modal is-active">
          <div class="modal-background" @click="showModal = false"></div>
          <div class="modal-card" style="max-width: 480px;">
            <header class="modal-card-head">
              <p class="modal-card-title">Заказ №{{ selectedOrder?.id }}</p>
              <button class="delete" aria-label="close" @click="showModal = false"></button>
            </header>
            <section class="modal-card-body">
              <div class="mb-2"><b>Дата:</b> {{ selectedOrder?.date }}</div>
              <div class="mb-2"><b>Телефон:</b> {{ selectedOrder?.phone }}</div>
              <div class="mb-2" v-if="selectedOrder?.type === 'delivery'"><b>Адрес:</b> {{ selectedOrder?.address }}</div>
              <div class="mb-2"><b>Способ получения:</b> {{ selectedOrder?.type === 'pickup' ? 'Самовывоз' : 'Доставка' }}</div>
              <div class="mb-3"><b>Состав заказа:</b></div>
              <ul>
                <li v-for="item in selectedOrder?.cart" :key="item.id">
                  {{ item.name }} — {{ item.qty }} шт. × {{ item.price }} ₽ = <b>{{ item.qty * item.price }} ₽</b>
                </li>
              </ul>
              <div class="mt-4 has-text-right"><b>Итого: {{ selectedOrder?.total }} ₽</b></div>
            </section>
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="title is-2 has-text-centered mb-5">Ваши заказы</h1>
        <div v-if="orders.length === 0" class="box has-text-centered">У вас пока нет заказов.</div>
        <div v-else class="columns is-multiline">
          <div v-for="order in orders" :key="order.id" class="column is-one-third">
            <div class="box order-card" @click="openOrder(order)">
              <div class="is-size-5 mb-2"><b>Заказ №{{ order.id }}</b></div>
              <div class="mb-1">Дата: {{ order.date }}</div>
              <div>Сумма: <b>{{ order.total }} ₽</b></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const orders = ref([])
const showModal = ref(false)
const selectedOrder = ref(null)
const isAuth = ref(false)

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAuth.value = localStorage.getItem('isAuth') === 'true'
  const allOrders = JSON.parse(localStorage.getItem('orders') || '[]').reverse()
  if (user.login) {
    orders.value = allOrders.filter(o => o.userLogin === user.login)
  } else {
    orders.value = []
  }
})

function openOrder(order) {
  selectedOrder.value = order
  showModal.value = true
}
</script>

<style scoped>
.order-card {
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
  border: 2px solid #f8c8dc;
}
.order-card:hover {
  box-shadow: 0 4px 24px #f3e1d6;
  border: 2px solid #b48ead;
}
</style> 