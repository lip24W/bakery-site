<template>
  <div class="container mt-6">
    <div class="column is-half is-offset-one-quarter">
      <div class="box has-text-centered">
        <h2 class="title is-3 mb-4">Здравствуйте, {{ userName }}!</h2>
      </div>
      <div class="box mt-5">
        <h3 class="title is-4 mb-4">Корзина</h3>
        <div v-if="cart.length === 0" class="has-text-grey">Ваша корзина пуста.</div>
        <table v-else class="table is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Цена</th>
              <th>Кол-во</th>
              <th>Сумма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.price }} ₽</td>
              <td>{{ item.qty }}</td>
              <td>{{ item.price * item.qty }} ₽</td>
              <td><button class="button is-small is-danger" @click="removeFromCart(item.id)">Удалить</button></td>
            </tr>
          </tbody>
        </table>
        <div v-if="cart.length" class="has-text-right mt-4">
          <b>Итого: {{ total }} ₽</b>
        </div>
        <div v-if="cart.length" class="has-text-centered mt-5">
          <button class="button is-link is-medium" @click="showOrder = true">Оформить заказ</button>
        </div>
        <div v-if="showOrder" class="modal is-active">
          <div class="modal-background" @click="showOrder = false"></div>
          <div class="modal-card" style="max-width: 420px;">
            <header class="modal-card-head">
              <p class="modal-card-title">Оформление заказа</p>
            </header>
            <section class="modal-card-body">
              <div class="field mb-4">
                <label class="label">Адрес доставки</label>
                <div class="control">
                  <input v-model="order.address" class="input" type="text" placeholder="Введите адрес" :disabled="order.type === 'pickup'" :required="order.type === 'delivery'" />
                </div>
              </div>
              <div class="field mb-4">
                <label class="label">Телефон</label>
                <div class="control">
                  <input v-model="order.phone" class="input" type="tel" placeholder="+7 (___) ___-__-__" @input="maskPhone" required />
                </div>
              </div>
              <div class="field mb-4">
                <label class="label">Способ получения</label>
                <div class="control">
                  <label class="radio mr-4">
                    <input type="radio" value="delivery" v-model="order.type" /> Доставка
                  </label>
                  <label class="radio">
                    <input type="radio" value="pickup" v-model="order.type" /> Самовывоз
                  </label>
                </div>
              </div>
            </section>
            <footer class="modal-card-foot" style="justify-content: flex-end; gap: 1.5rem;">
              <button class="button is-link" :disabled="!canOrder" @click="submitOrder">Заказать</button>
              <button class="button" @click="showOrder = false">Отмена</button>
            </footer>
          </div>
        </div>
        <div v-if="showSuccess" class="modal is-active">
          <div class="modal-background"></div>
          <div class="modal-card" style="max-width: 340px; text-align: center;">
            <section class="modal-card-body">
              <div style="font-size: 3rem; color: #48c774; margin-bottom: 1rem;">
                <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#eafbe7"/><path d="M14 25l7 7 13-13" stroke="#48c774" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
              </div>
              <div class="title is-4 mb-2" style="color: #48c774;">Заказ оформлен!</div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
const userName = ref('')
const cart = ref([])
const total = ref(0)
const router = useRouter()
const showOrder = ref(false)
const order = ref({ address: '', phone: '', type: 'delivery' })
const showSuccess = ref(false)

const canOrder = computed(() => {
  // Проверка на полный номер: +7 (XXX) XXX-XX-XX (18 символов)
  const phoneOk = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(order.value.phone.trim())
  if (order.value.type === 'delivery') {
    return order.value.address.trim() && phoneOk
  }
  return phoneOk
})

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userName.value = user.login || 'Гость'
  loadCart()
})

function loadCart() {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]')
  total.value = cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
}

function removeFromCart(id) {
  cart.value = cart.value.filter(i => i.id !== id)
  localStorage.setItem('cart', JSON.stringify(cart.value))
  loadCart()
}

function logout() {
  localStorage.removeItem('isAuth')
  router.push('/')
}

function maskPhone(e) {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  let res = '+7 ('
  if (v.length > 1) res += v.slice(1, 4)
  if (v.length >= 4) res += ') ' + v.slice(4, 7)
  if (v.length >= 7) res += '-' + v.slice(7, 9)
  if (v.length >= 9) res += '-' + v.slice(9, 11)
  e.target.value = res
  order.value.phone = res
}

function submitOrder() {
 
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const orderId = Math.random().toString(36).substring(2, 10).toUpperCase()
  const newOrder = {
    id: orderId,
    cart: [...cart.value],
    address: order.value.address,
    phone: order.value.phone,
    type: order.value.type,
    date: new Date().toLocaleString(),
    total: total.value,
    userLogin: user.login || ''
  }
  let orders = JSON.parse(localStorage.getItem('orders') || '[]')
  orders.push(newOrder)
  localStorage.setItem('orders', JSON.stringify(orders))
 
  cart.value = []
  localStorage.setItem('cart', '[]')
  total.value = 0
  showOrder.value = false
  showSuccess.value = true
  setTimeout(() => showSuccess.value = false, 2000)
}
</script>

<style scoped>
.modal-card {
  border-radius: 20px;
  box-shadow: 0 8px 40px #f3e1d6;
  background: #fffdfa;
  border: 2px solid #f8c8dc;
}
.modal-card-head {
  background: transparent;
  border-bottom: none;
  justify-content: center;
  padding-top: 2rem;
  padding-bottom: 0.5rem;
}
.modal-card-title {
  color: #b48ead;
  font-size: 2rem;
  font-weight: 800;
  width: 100%;
  text-align: center;
}
.modal-card-body {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.input:focus, .input:active {
  border-color: #f8c8dc !important;
  box-shadow: 0 0 0 2px #f8c8dc33 !important;
}
.input[disabled] {
  background: #f8f3f8;
  color: #b48ead;
}
.button.is-link {
  background: #f8c8dc;
  color: #fff;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px 0 #f3e1d6;
  transition: background 0.2s;
}
.button.is-link:disabled {
  background: #e7bfae;
  color: #fff;
  opacity: 0.7;
}
.button.is-link:hover:not(:disabled) {
  background: #e7bfae;
  color: #fff;
}
</style> 