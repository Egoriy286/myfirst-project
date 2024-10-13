<template>
    <div class="project-card">
      <img :src="project.image" alt="Project image" />
      <h2>{{ project.title }}</h2>
      <p>{{ project.description }}</p>
      <a :href="project.link" target="_blank">Смотреть проект</a>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProjectCard",
    props: {
      project: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .project-card {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
  }
  .project-card img {
    max-width: 100%;
    border-radius: 5px;
  }
  </style>
  