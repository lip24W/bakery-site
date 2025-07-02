<template>
  <footer class="footer has-text-centered">
    <div class="footer-content">
      <div class="mb-2">
        <b>Булонька</b> &copy; {{ new Date().getFullYear() }}
      </div>
      <div class="is-size-6 mb-1">
        г. Нижний Новгород, ул. Максима Горького, 144
      </div>
      <div class="is-size-6">
        <a href="tel:+78314223344" style="color: #d48fa6;">+7 (831) 422-33-44</a> &nbsp;|&nbsp;
        <a href="mailto:info@bulonka.ru" style="color: #d48fa6;">info@bulonka.ru</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #fffdfa;
  border-top: 2px solid #f8c8dc;
  padding: 32px 0 24px 0;
  color: #b48ead;
  font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
  font-size: 1.1rem;
  margin-top: 64px;
}
.footer-content {
  max-width: 600px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .footer {
    font-size: 1rem;
    padding: 20px 0 16px 0;
  }
}
</style> 