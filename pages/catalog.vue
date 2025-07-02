<template>
  <div class="container mt-6">
    <h1 class="title is-2 has-text-centered mb-5">Каталог выпечки</h1>
    <div class="field is-grouped is-grouped-multiline mb-5 category-scroll">
      <div class="control">
        <div class="buttons has-addons">
          <button class="button" :class="{ 'is-link': sortBy === 'name' }" @click="sortBy = 'name'">По названию</button>
          <button class="button" :class="{ 'is-link': sortBy === 'price' }" @click="sortBy = 'price'">По цене</button>
        </div>
      </div>
      <div class="control category-buttons">
        <div class="buttons">
          <button v-for="cat in categories" :key="cat" class="button is-light" :class="{ 'is-link': selectedCategory === cat }" @click="selectCategory(cat)">{{ cat }}</button>
          <button class="button" :class="{ 'is-link': selectedCategory === '' }" @click="selectCategory('')">Все</button>
        </div>
      </div>
      <div class="control">
        <input class="input" v-model="search" placeholder="Поиск по названию..." style="min-width: 220px;" />
      </div>
    </div>
    <div class="columns is-multiline">
      <div v-for="item in filteredAndSorted" :key="item.id" class="column is-one-quarter-desktop is-half-tablet">
        <div class="box has-text-centered">
          <img :src="item.image" :alt="item.name" style="max-height: 180px; object-fit: cover; border-radius: 16px; margin-bottom: 1rem; box-shadow: 0 2px 12px #f3e1d6;">
          <h2 class="title is-5 mb-2">{{ item.name }}</h2>
          <span class="tag is-light mb-2" style="font-size: 1rem; color: #d48fa6;">{{ item.category }}</span>
          <p class="mb-2">{{ item.description }}</p>
          <div class="mb-3"><b>{{ item.price }} ₽</b></div>
          <div v-if="getCartQty(item.id) === 0">
            <button class="button is-link is-light is-fullwidth" @click="addToCart(item)">В корзину</button>
          </div>
          <div v-else class="is-flex is-justify-content-center is-align-items-center" style="gap: 0.5rem;">
            <button class="button is-link is-light" @click="changeCartQty(item, -1)">-</button>
            <span style="min-width: 2rem; text-align: center; font-weight: 600; color: #b48ead;">{{ getCartQty(item.id) }}</span>
            <button class="button is-link is-light" @click="changeCartQty(item, 1)">+</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="addedMsg" class="notification is-success has-text-centered mt-4" style="max-width: 400px; margin: 0 auto;">Товар добавлен в корзину!</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const items = ref([])
const sortBy = ref('name')
const search = ref('')
const selectedCategory = ref('')
const addedMsg = ref(false)
const cartItems = ref([])

const categories = [
  'Круассаны', 'Пирожные', 'Хлеб', 'Пончики', 'Тарты', 'Сырники', 'Маффины', 'Слойки'
]

function selectCategory(cat) {
  selectedCategory.value = cat
}

// Локальные изображения из public/bakery/
const bakeryImages = {
  'Круассан классический': '/bakery/croissant.jpg',
  'Эклер ванильный': '/bakery/eclair.jpg',
  'Багет французский': '/bakery/baguette.jpg',
  'Пончик с сахаром': '/bakery/donut.jpg',
  'Тарт с малиной': '/bakery/tart.jpg',
  'Сырник творожный': '/bakery/syrnik.jpg',
  'Маффин шоколадный': '/bakery/muffin.jpg',
  'Слойка с яблоком': '/bakery/puff.jpg',
  'Песочный тарт': '/bakery/tart.jpg',
  'Пончик с клубникой': '/bakery/donut.jpg',
  'Бриошь': '/bakery/brioche.jpg',
  'Круассан миндальный': '/bakery/croissant.jpg',
}

async function fetchBakery() {
  const data = [
    { name: 'Круассан классический', category: 'Круассаны', price: 120 },
    { name: 'Эклер ванильный', category: 'Пирожные', price: 150 },
    { name: 'Багет французский', category: 'Хлеб', price: 90 },
    { name: 'Пончик с сахаром', category: 'Пончики', price: 110 },
    { name: 'Тарт с малиной', category: 'Тарты', price: 130 },
    { name: 'Сырник творожный', category: 'Сырники', price: 100 },
    { name: 'Маффин шоколадный', category: 'Маффины', price: 140 },
    { name: 'Слойка с яблоком', category: 'Слойки', price: 160 },
    { name: 'Песочный тарт', category: 'Тарты', price: 180 },
    { name: 'Пончик с клубникой', category: 'Пончики', price: 200 },
    { name: 'Бриошь', category: 'Хлеб', price: 170 },
    { name: 'Круассан миндальный', category: 'Круассаны', price: 125 },
  ]
  items.value = data.map((item, i) => ({
    id: i+1,
    ...item,
    description: 'Свежая, ароматная выпечка из лучших ингредиентов.',
    image: bakeryImages[item.name] || '/bakery/croissant.jpg',
  }))
}

function updateCartItems() {
  cartItems.value = JSON.parse(localStorage.getItem('cart') || '[]')
}

function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const idx = cart.findIndex(i => i.id === item.id)
  if (idx !== -1) {
    cart[idx].qty += 1
  } else {
    cart.push({ ...item, qty: 1 })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartItems()
  addedMsg.value = true
  setTimeout(() => addedMsg.value = false, 1200)
}

function getCartQty(itemId) {
  const found = cartItems.value.find(i => i.id === itemId)
  return found ? found.qty : 0
}

function changeCartQty(item, delta) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const idx = cart.findIndex(i => i.id === item.id)
  if (idx !== -1) {
    cart[idx].qty += delta
    if (cart[idx].qty <= 0) {
      cart.splice(idx, 1)
    }
  } else if (delta > 0) {
    cart.push({ ...item, qty: 1 })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  updateCartItems()
}

onMounted(() => {
  fetchBakery()
  updateCartItems()
})

const filteredAndSorted = computed(() => {
  let arr = items.value.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase()) &&
    (selectedCategory.value === '' || item.category === selectedCategory.value)
  )
  if (sortBy.value === 'name') {
    arr = arr.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'price') {
    arr = arr.sort((a, b) => a.price - b.price)
  }
  return arr
})
</script>

<style scoped>
@media (max-width: 768px) {
  .category-scroll {
    overflow-x: auto;
    flex-wrap: nowrap !important;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
  }
  .category-buttons .buttons {
    flex-wrap: nowrap !important;
    overflow-x: auto;
    gap: 0.5rem;
  }
  .category-buttons .button {
    min-width: 110px;
    margin-right: 0.5rem;
    white-space: nowrap;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 1rem;
  }
}
</style> 