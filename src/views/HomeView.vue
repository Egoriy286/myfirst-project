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

      <h2>Uploaded Files local</h2>
    <ul>
      <li v-for="file in filesupload" :key="file">
        <a :href="`${API_BASE_URL}/download/${file}`" target="_blank">{{ file }}</a>
        <button @click="downloadFile(file)">Download</button>
        <button @click="deleteFile(file)">Delete</button>
      </li>
    </ul>
  
      <h2>Available Files BucketS3</h2>
      <ul>
        <li v-for="file in files" :key="file.name">
          <span>{{ file.name }} ({{ file.size }} bytes)</span>
          <button @click="downloadFileS3(file.name)">Download</button>
          <button @click="deleteFiles3(file.name)">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
import { API_BASE_URL } from '../config';
import axios from 'axios';
export default {
    data() {
      return {
        file: null,
        files: [],
        filesupload: [],
        totalChunks: 0,
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
        alert("Please select a file to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.file);

      // Use XMLHttpRequest to track the upload progress
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/upload/`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // Calculate the percentage completed
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          this.message = result.info;
          this.uploadProgress = 0; // Reset the progress bar
          this.fetchFiles(); // Refresh the file list
        } else {
          console.error("Error uploading file:", xhr.responseText);
          this.message = "Error uploading file.";
          this.uploadProgress = 0;
        }
      };

      xhr.onerror = () => {
        console.error("Error uploading file.");
        this.message = "Error uploading file.";
        this.uploadProgress = 0;
      };

      // Send the form data
      xhr.send(formData);
      this.fetchFiles();
    },
      async fetchFiles() {
        try {
          const response = await fetch(`${API_BASE_URL}/s3files`);
          if (!response.ok) {
            throw new Error('Error fetching files');
          }
          const data = await response.json();
          this.files = data;
        } catch (error) {
          console.error('Error fetching files:', error);
        }
        try {
            const response = await fetch(`${API_BASE_URL}/files`);
            this.filesupload = await response.json();
        } catch (error) {
            console.error("Error fetching filesupload:", error);
        }
      },
      async downloadFileS3(filename) {
        try {
          const response = await fetch(`${API_BASE_URL}/s3download/${filename}`);
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
      async downloadFile(filename) {
        try {
            console.log(filename)
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

      async deleteFileS3(filename) {
        if (confirm(`Are you sure you want to delete ${filename}?`)) {
          try {
            const response = await fetch(`${API_BASE_URL}/s3delete/${filename}`, {
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
  