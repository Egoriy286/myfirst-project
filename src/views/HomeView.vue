<template>
  <div>
    <h2>Мои проекты</h2>
    <div class="projects">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>
</template>

<script>
import ProjectCard from "@/components/ProjectCard.vue";

export default {
  name: "Home",
  components: {
    ProjectCard,
  },
  data() {
    return {
      projects: [
        {
          id: 1,
          title: "Проект 1",
          description: "Описание проекта 1",
          image: null,
          link: null,
        },
        {
          id: 2,
          title: "Проект 2",
          description: "Описание проекта 2",
          image: null,
          link: null,
        },
        // Добавьте больше проектов
      ],
    };
  },
};
</script>

<style scoped>
.projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>
