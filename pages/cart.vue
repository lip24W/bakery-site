<template>
  <div class="container mt-6">
    <h1 class="title is-2 has-text-centered mb-5">Корзина</h1>
    <div v-if="cartItems.length === 0" class="has-text-centered">
      <p class="is-size-4">Корзина пуста</p>
      <NuxtLink to="/catalog" class="button is-link mt-4">В каталог</NuxtLink>
    </div>
    <div v-else>
      <div class="box mb-5" v-for="item in cartItems" :key="item.id">
        <div class="columns is-vcentered">
          <div class="column is-2">
            <img :src="item.image" :alt="item.name" style="max-width: 100px; border-radius: 12px;">
          </div>
          <div class="column is-4">
            <b>{{ item.name }}</b>
            <div class="has-text-grey">{{ item.category }}</div>
          </div>
          <div class="column is-2">
            <div class="field has-addons">
              <p class="control">
                <button class="button is-small" @click="decrement(item)">-</button>
              </p>
              <p class="control">
                <input class="input is-small" style="width: 40px; text-align: center;" type="number" v-model.number="item.qty" min="1">
              </p>
              <p class="control">
                <button class="button is-small" @click="increment(item)">+</button>
              </p>
            </div>
          </div>
          <div class="column is-2">
            <b>{{ item.price * item.qty }} ₽</b>
          </div>
          <div class="column is-2 has-text-right">
            <button class="delete is-medium" @click="remove(item)"></button>
          </div>
        </div>
      </div>
      <div class="box has-text-right">
        <b>Итого: {{ total }} ₽</b>
      </div>
      <div class="has-text-centered mt-5">
        <button class="button is-link is-medium">Оформить заказ</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const cartItems = ref([])
const router = useRouter()

function loadCart() {
  const data = localStorage.getItem('cart')
  cartItems.value = data ? JSON.parse(data) : []
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

function increment(item) {
  item.qty++
  saveCart()
}
function decrement(item) {
  if (item.qty > 1) {
    item.qty--
    saveCart()
  }
}
function remove(item) {
  cartItems.value = cartItems.value.filter(i => i.id !== item.id)
  saveCart()
}

const total = computed(() => cartItems.value.reduce((sum, i) => sum + i.price * i.qty, 0))

onMounted(loadCart)
watch(cartItems, saveCart, { deep: true })
</script> 