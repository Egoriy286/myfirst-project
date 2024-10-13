<template>
    <div>
      <h1>File Uploader</h1>
      <input type="file" @change="handleFileUpload" />
      <button @click="uploadFile">Upload</button>
  
      <div>
        <p>Uploading: {{ uploadProgress }}%</p>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
      </div>
  
      <h2>Available Files</h2>
      <ul>
        <li v-for="file in files" :key="file.name">
          <span>{{ file.name }} ({{ file.size }} bytes)</span>
          <button @click="downloadFile(file.name)">Download</button>
          <button @click="deleteFile(file.name)">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
import { API_BASE_URL } from '../config';

  export default {
    data() {
      return {
        selectedFile: null,
        file: null,
        files: [],
        uploading: true,
        uploadProgress: 0,
      };
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
      async uploadFile() {
      if (!this.file) {
        alert("Пожалуйста, выберите файл.");
        return;
      }

      const CHUNK_SIZE = 1024 * 1024; // 1 MB
      const totalChunks = Math.ceil(this.file.size / CHUNK_SIZE);

      let uploadedChunks = 0;

      // Получаем текущий статус загрузки
      try {
        const statusResponse = await fetch(`${API_BASE_URL}/upload-status/${this.file.name}`);
        const statusData = await statusResponse.json();
        uploadedChunks = statusData.uploaded_chunks || 0;
      } catch (error) {
        console.error("Ошибка при получении статуса загрузки:", error);
      }

      for (let i = uploadedChunks; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, this.file.size);
        const chunk = this.file.slice(start, end);
        
        const formData = new FormData();
        formData.append("file", chunk, this.file.name);

        try {
          const response = await fetch(`${API_BASE_URL}/upload/`, {
            method: "POST",
            body: formData,
            headers: {
              "chunk-number": i,
              "total-chunks": totalChunks,
            },
          });

          if (!response.ok) {
            throw new Error(`Ошибка загрузки файла: ${response.statusText}`);
          }

          console.log(`Часть ${i + 1} из ${totalChunks} загружена`);
        } catch (error) {
          console.error("Ошибка загрузки файла:", error);
          break; // Завершение при ошибке
        }
      }

      alert("Файл загружен успешно!");
    },
      async fetchFiles() {
        try {
          const response = await fetch(`${API_BASE_URL}/files`);
          if (!response.ok) {
            throw new Error('Error fetching files');
          }
          const data = await response.json();
          this.files = data;
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      },
      async downloadFile(filename) {
        try {
          const response = await fetch(`${API_BASE_URL}/download/${filename}`);
          if (!response.ok) {
            throw new Error('Error downloading file');
          }
  
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      },
      async deleteFile(filename) {
        if (confirm(`Are you sure you want to delete ${filename}?`)) {
          try {
            const response = await fetch(`${API_BASE_URL}/delete/${filename}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              throw new Error('Error deleting file');
            }
  
            alert('File deleted successfully');
            this.fetchFiles(); // Refresh the list of files
          } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
          }
        }
      },
    },
    mounted() {
      this.fetchFiles();
    },
  };
  </script>
  
  <style scoped>
.progress-bar {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 5px;
  margin-top: 10px;
}

.progress {
  height: 20px;
  background-color: #4caf50;
  width: 0;
  border-radius: 5px;
}
  </style>
  