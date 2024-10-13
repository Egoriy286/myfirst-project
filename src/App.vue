<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>
    <div class="wrapper m-4">
      <nav>
        <RouterLink class="badge badge-lg ml-4" to="/">Главная</RouterLink>
        <RouterLink class="badge badge-lg ml-4" to="/storage">Хранилище</RouterLink>
        <RouterLink class="badge badge-lg ml-4" to="/about">О себе</RouterLink>
        <RouterLink class="badge badge-lg ml-4" to="/test">Тест</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>