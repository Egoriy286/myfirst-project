<script setup lang="ts">
import { ref }  from 'vue'
import { RouterLink, RouterView } from 'vue-router'
const links = [
        { name: 'Главная', path: '/' },
        { name: 'Хранилище', path: '/storage' },
        { name: 'О себе', path: '/about' },
        { name: 'Контакты', path: '/contact' },
        { name: 'Тест', path: '/test' },
      ]
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
        <nav class="nav-list">
          <li v-for="(link, index) in links" :key="index">
            <RouterLink class="btn btn-header ml-4" @click="closeMenu" :to="link.path">{{ link.name }}</RouterLink>
          </li>
          
        </nav>
      </div>
    </div>
  </header> 

  <div class="content">
    <RouterView/>
  </div>
  

  <div class="footer">
    <footer class="footer">
    <p>© 2024 Proste20. Этот сайт на стадии разработки</p>
    <p>
          <RouterLink class="btn-header ml-4" @click="closeMenu" to="/">Главная</RouterLink>
          <RouterLink class="btn-header ml-4" @click="closeMenu" to="/storage">Хранилище</RouterLink>
          <RouterLink class="btn-header ml-4" @click="closeMenu" to="/about">О себе</RouterLink>
          <RouterLink class="btn-header ml-4" @click="closeMenu" to="/contact">Контакты</RouterLink>
          <RouterLink class="btn-header ml-4" @click="closeMenu" to="/test">Тест</RouterLink>
    </p>
  </footer>
  </div>
</template>
<style scoped>


html, body {
  margin: 0;
  padding: 0;
  height: 100%; /* Занимает всю высоту */
}
.nav-list {
  list-style-type: none; /* Убирает маркеры у списка */
  padding: 0;           /* Убирает отступы */
  margin: 0;            /* Убирает внешние отступы */
}

.content {
  display: flex;
  flex-direction: column; /* Вертикальное размещение элементов */
  min-height: 100vh; /* Минимальная высота — 100% высоты окна */
}

.content {
  flex: 1; /* Занять всё доступное пространство */
}
.footer {
  background-color: #f8f9fa; /* Светлый фон */
  text-align: center; /* Центрирование текста */
  padding: 20px; /* Отступы */
  position: relative; /* Относительное позиционирование */
  bottom: 0; /* Прикрепить к нижней части страницы */
  width: 100%; /* Занимает всю ширину */
}

.footer p {
  margin: 5px 0; /* Отступы для абзацев */
}

.footer a {
  color: #007bff; /* Цвет ссылок */
  text-decoration: none; /* Убираем подчеркивание */
}

.footer a:hover {
  text-decoration: underline; /* Подчеркивание при наведении */
}
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