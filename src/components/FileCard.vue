<template>
  <div class="file-card" :class="{ selected: isSelected }" @click="toggleSelect">
    <div class="file-card-content">
      <p class="file-name">{{ file.name }}</p>
      <p class="file-size">{{ formatSize(file.size) }}</p>
      
    </div>
  </div>
</template>

<script lang="ts">
import { type File } from './models';
import { defineComponent, type PropType  } from "vue";


export default defineComponent({
    name: "FileCard",
    props: {
        file: {
          type: Object as PropType<File>,
          required: true,
        },
        isSelected: {
          type: Boolean,
          default: false,
        },
    },

    methods: {
    formatSize(sizeInBytes: number): string {
      if (sizeInBytes < 1024) {
        return `${sizeInBytes} bytes`;
      } else if (sizeInBytes < 1024 ** 2) {
        return `${(sizeInBytes / 1024).toFixed(2)} KB`; // Format to 2 decimal places
      } else if (sizeInBytes < 1024 ** 3) {
        return `${(sizeInBytes / (1024 ** 2)).toFixed(2)} MB`; // Format to 2 decimal places
      } else {
        return `${(sizeInBytes / (1024 ** 3)).toFixed(2)} MB`;
      }
    },
    
    toggleSelect() {
      // Emit an event to toggle selection
      this.$emit('toggle-select', this.file);
    },
},

});
</script>

<style scope>
.file-card {
  width: 150px; /* Set width for square shape */
  height: 150px; /* Set height for square shape */
  background-color: #f8f9fa; /* Light background color */
  border: 1px solid #ccc; /* Border styling */
  border-radius: 8px; /* Rounded corners */
  display: flex; /* Center content */
  align-items: center; /* Center content vertically */
  justify-content: center; /* Center content horizontally */
  margin: 10px; /* Margin between cards */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional shadow */
  transition: transform 0.3s; /* Animation for hover effect */
}

.file-card:hover {
  transform: scale(1.05); /* Scale effect on hover */
}

.selected {
  background-color: #007bff; /* Highlight color for selected */
  border-color: #0056b3; /* Darker border for selected */
  color: white; /* Change text color for better visibility */
}


.file-card-content {
  text-align: center; /* Center text */
  overflow: hidden; /* Prevent overflow */
}

.file-name {
  font-weight: bold; /* Bold for file name */
  font-size: 14px; /* Adjust font size */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Add ellipsis for overflow */
}

.file-size {
  color: #6c757d; /* Secondary text color */
  font-size: 12px; /* Adjust font size */
}
</style>