<template>
  <h1>ТЕСТОВАЯ СРЕДА ДЛЯ КОМПОНЕНТА ФАЙЛА</h1>
  <div class="tools">
  <button @click="deleteSelectedFiles" :disabled="selectedFiles.length === 0" class="delete-button">
      <img src="../assets/trash.png" alt="Delete Selected"/>
  </button> <!-- Delete button -->
  <button @click="downloadSelectedFiles" class="download-button">
    <img src="../assets/download.png" alt="Download Selected"/>
  </button>
  
  <input type="file" @change="handleFileChange" class="custom-file-input" />

  <!-- Upload Button -->
  <button @click="uploadFile" :disabled="!file" class="upload-button">
    Загрузить файл
  </button>
  </div>

  <div class="grid-container">
    <FileCardVue
      v-for="file in files"
      :key="file.name"
      :file="file"
      :isSelected="selectedFiles.includes(file)"
      @toggle-select="toggleSelect(file)" 
    />
    
  </div>
  
  <div>{{ downloadStatus }}</div>
  <div>
    <p>{{ progress }}%</p>
    <progress class="progress progress-success w-56" :value="progress/100"> </progress>
  </div>
</template>

<script >
import FileCardVue from '../components/FileCard.vue'
import { API_BASE_URL } from '../config';
import { deleteFile, fetchFiles, downloadFile } from '../modules'
import axios from 'axios';

export default {
  name: "StorageView",
  components: {
      FileCardVue,
  },
  data(){
      return {
          files: [
          { "name": "file1.txt", "size": 1234 },
          { "name": "file2.jpg", "size": 5678 },
          { "name": "file3.pdf", "size": 91011 }
          ],
          selectedFiles: [],
          downloadStatus: '',
          progress: 0,
          file: null,
          uploadStatus: '',
          progress: 0,
          chunkSize: 1024 * 1024, // 1 MB chunk size
      }
  },
  methods:{
      toggleSelect(file) {
          const index = this.selectedFiles.indexOf(file);
          if (index === -1) {
            this.selectedFiles.push(file);
          } else {
            this.selectedFiles.splice(index, 1);
          }
      },
      async deleteSelectedFiles() {
        const confirmDelete = confirm(`Вы точно хотите удалить выбранные файлы?`);
        if (confirmDelete) {
          for (const file of this.selectedFiles) {
            await deleteFile(file.name);
          }
          // Clear the selected files array
          this.selectedFiles = [];
          // Refresh the file list
          this.refresh()
        }
      },
      async downloadSelectedFiles() {
        if (this.selectedFiles.length === 0) {
          this.downloadStatus = 'Выберите файлы для скачивания.';
          return;
        }
          this.downloadStatus = ''; // Reset the status
          this.progress = 0; // Reset progress
          for (const file of this.selectedFiles) {
            const response = await axios.get(`${API_BASE_URL}/download/${file.name}`, {
            responseType: 'blob', // Set the response type to blob for file downloads
            onDownloadProgress: (progressEvent) => {
                const total = progressEvent.total;
                const current = progressEvent.loaded;
          
                // Calculate the progress percentage
                if (total) {
                  this.progress = Math.round((current / total) * 100); 
                  //console.info(`Download progress: ${this.progress}%`); // You can update a progress state here if needed
                }
            }
          });
            await downloadFile(file, response); // Call the download function
          }
          this.selectedFiles = [];
      },
      handleFileChange(event) {
        this.file = event.target.files[0];
      },
      async uploadFile() {
    if (!this.file) {
      this.uploadStatus = 'Пожалуйста, выберите файл.';
      return;
    }

    try {
      this.uploadStatus = 'Загрузка файла...';
      await this.uploadChunksWithProgress(this.file, this.chunkSize);
      this.uploadStatus = 'Файл успешно загружен!';
      this.refresh()
      this.progress = 100;
    } catch (error) {
      this.uploadStatus = 'Ошибка при загрузке файла.';
      console.error('Ошибка загрузки:', error);
    }
  },
  chunkFile(file, chunkSize) {
    const chunks = [];
    let offset = 0;

    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      chunks.push(chunk);
      offset += chunkSize;
    }

    return chunks;
  },
  async uploadChunksWithProgress(file, chunkSize) {
    const chunks = this.chunkFile(file, chunkSize);
    let uploadedBytes = 0;

    for (let i = 0; i < chunks.length; i++) {
      const formData = new FormData();
      formData.append("file", chunks[i], file.name);
      formData.append("chunkIndex", i);
      formData.append("totalChunks", chunks.length);

      try {
        await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            uploadedBytes += progressEvent.loaded;
            this.progress = Math.round((uploadedBytes / file.size) * 100);
            //console.info(`Прогресс загрузки: ${this.progress}%`);
          }
        });
      } catch (error) {
        console.error(`Ошибка загрузки чанка ${i + 1}:`, error);
        throw error;
      }
    }
  },
    async refresh(){
      this.files = await fetchFiles()
    }
  },
  async mounted(){
      this.refresh()
  }
  
}
</script>

<style scoped>
.grid-container {
display: grid; /* Enable grid layout */
grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Create responsive grid */
gap: 10px; /* Space between cards */
justify-items: center; /* Center items in each grid cell */
}
button{
height: 40px;
}
.delete-button {
background: rgb(216, 249, 217); /* No background */
border: 1px solid transparent; /* Initial border set to transparent */
padding:3px 10px 3px 10px ; /* Padding for spacing*/
border-radius: 5px; /* Rounded corners */

cursor: pointer; /* Pointer cursor */
margin: 20px; /* Margin for spacing */
transition: transform 0.3s ease, opacity 0.3s ease; /* Smooth transition for transform and opacity */
}
.delete-button img {
width: 30px; /* Set image width */
height: auto; /* Maintain aspect ratio */
transition: transform 0.3s ease; /* Smooth transition for image scaling */
}
.delete-button:hover {
transform: scale(1.1); /* Slightly increase size on hover */
opacity: 0.8; /* Slightly decrease opacity on hover */
}
.delete-button:active {
transform: scale(0.95); /* Slightly decrease size when clicked */
}


.download-button {
background: rgb(216, 249, 217); /* No background */
border: 1px solid transparent; /* Initial border set to transparent */
padding:3px 10px 3px 10px ; /* Padding for spacing*/
border-radius: 5px; /* Rounded corners */

cursor: pointer; /* Pointer cursor */
margin: 20px; /* Margin for spacing */
transition: transform 0.3s ease, opacity 0.3s ease; /* Smooth transition for transform and opacity */
}
.download-button img {
width: 30px; /* Set image width */
height: auto; /* Maintain aspect ratio */
transition: transform 0.3s ease; /* Smooth transition for image scaling */
}
.download-button:hover {
transform: scale(1.1); /* Slightly increase size on hover */
opacity: 0.8; /* Slightly decrease opacity on hover */
}
.download-button:active {
transform: scale(0.95); /* Slightly decrease size when clicked */
}
.upload-container {
text-align: center;
margin-top: 20px;
}

.custom-file-input {
display: inline-block;
width: 80%;
max-width: 300px;
margin-top: 14px;
margin-bottom: 20px;
margin-right: 10px;
padding: 10px;
border: 2px solid #ddd;
border-radius: 5px;
cursor: pointer;
transition: border-color 0.3s ease;
}

.upload-button {
background-color: #4CAF50;
color: white;
border: none;

padding: 7px 15px 10px 15px;
margin: 20px 10px 20px 20px;
font-size: 16px;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s ease, transform 0.2s ease;

}
.custom-file-input:hover {
border-color: #4CAF50;
}
.upload-button:hover {
background-color: #45a049;
}

.upload-button:disabled {
background-color: #cccccc;
cursor: not-allowed;
}

.upload-button:active {
transform: scale(0.98);
}
.tools{
display: flex; /* Use flex layout for horizontal alignment */
}
</style>