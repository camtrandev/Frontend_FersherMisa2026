<template>
  <div class="default-layout">
    <!-- Navbar bây giờ nằm trên cùng, chiếm trọn chiều ngang -->
    <TheHeader />

    <div class="body-container">
      <!-- Sidebar nằm dưới Navbar -->
      <TheSidebar />

      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import TheHeader from '../components/layout/TheHeader.vue'
import TheSidebar from '../components/layout/TheSidebar.vue'

</script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  /* Xếp Navbar trên, Body dưới */
  height: 100vh;

}

.body-container {
  display: flex;
  /* Xếp Sidebar bên trái, Content bên phải */
  flex: 1;

}

.content-area {
  flex: 1;
  background-color: var(--bg-light);
  display: flex;
  min-height: 0;
  min-width: 0;
}
</style>