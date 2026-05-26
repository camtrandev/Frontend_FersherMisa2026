<template>
  <DefaultLayout />
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<style>
html, body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden; /* Cấm trình duyệt cuộn toàn trang */
}

#app {
    width: 100%;
    height: 100vh;
    overflow: hidden; /* Ép thẻ gốc của Vue không được tràn */
}
</style>