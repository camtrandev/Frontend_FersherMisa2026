<template>
  <main class="the-content">
    
    <router-view /> 
  </main>
</template>

<style scoped>
.the-content {
  flex: 1;
  background-color: #f4f5f8;
   scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
}
</style>