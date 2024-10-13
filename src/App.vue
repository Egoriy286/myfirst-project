<script setup lang="ts">
import { ref }  from 'vue'
import { RouterLink, RouterView } from 'vue-router'
const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header>
    <div class="wrapper m-4">
      <RouterLink to="/">
        <img src="./assets/logo.png" class="logo" />
      </RouterLink>
      <button class="menu-toggle" @click="toggleMenu">
        ☰
      </button>
      <div class="nav-bar" :class="{ 'open': isMenuOpen }">
        <button class="close-button" @click="closeMenu">✖</button>
        <nav>
          <RouterLink class="btn btn-header ml-4" @click="closeMenu" to="/">Главная</RouterLink>
          <RouterLink class="btn btn-header ml-4" @click="closeMenu" to="/storage">Хранилище</RouterLink>
          <RouterLink class="btn btn-header ml-4" @click="closeMenu" to="/about">О себе</RouterLink>
          <RouterLink class="btn btn-header ml-4" @click="closeMenu" to="/test">Тест</RouterLink>
        </nav>
      </div>
    </div>
  </header>

  <RouterView />
</template>
<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.logo {
  height: 4em;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
}
.nav-bar {
  display: flex;
  align-items: center;
}
.nav-bar nav {
  display: flex;
}
.nav-bar.open nav {
  display: block;
}
.close-button{
  display: none;
}
@media (max-width: 768px) {
  .menu-toggle {
    display: block; /* Show the menu toggle button on smaller screens */
  }
  .nav-bar {
  position: fixed;
  top: 0;
  right: -250px; /* Initially hidden off-screen */
  height: 100%;
  width: 250px;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease-in-out; /* Smooth slide-in effect */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 2em;
}
.close-button {
  display:block;
  background: none;
  border: none;
  font-size: 1.5em;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.nav-bar.open {
  right: 0; /* Slide in when 'open' class is applied */
}
.nav-bar nav {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.btn-header {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  text-align: left;
  font-size: 1.2em;
}
}
</style>