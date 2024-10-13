<template>
    <div>
      <h1>File Uploader</h1>
      <input type="file" @change="onFileChange" />
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
        files: [],
        uploading: true,
        uploadProgress: 0,
      };
    },
    methods: {
      onFileChange(event) {
        this.selectedFile = event.target.files[0];
      },
      async uploadFile() {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile);

  this.uploading = true;
  this.uploadProgress = 0;

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/upload/`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        this.uploadProgress = Math.round((event.loaded * 100) / event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        alert('File uploaded successfully');
        this.fetchFiles(); // Refresh the list of files
      } else {
        throw new Error('Error uploading file');
      }
    };

    xhr.onerror = () => {
      alert('Error uploading file');
    };

    xhr.send(formData);
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file');
  } finally {
    this.uploading = false; // Завершаем индикатор загрузки
    this.uploadProgress = 0; // Сбрасываем прогресс
  }
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
  