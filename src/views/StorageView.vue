<template>
  
  <div class="tools">
    <div>
  <button @click="deleteSelectedFiles" :disabled="selectedFiles.length === 0" class="delete-button">
      <img src="../assets/trash.png" alt="Delete Selected"/>
  </button> <!-- Delete button -->
  <button @click="downloadSelectedFiles" class="download-button">
    <img src="../assets/download.png" alt="Download Selected"/>
  </button>
</div>
  
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
            try {
              const response = await fetch(`${API_BASE_URL}/files/${file.name}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Error deleting file');
              }
            } catch (error) {
              console.error('Error deleting file:', error);
            }
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
          try {
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element to download the file
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name); // Use file.name for the download name
            document.body.appendChild(link);
            link.click();

            // Clean up the link and revoke the object URL
            link.remove();
            window.URL.revokeObjectURL(url); // Revoke the URL after downloading

            console.log('Файл загружен успешно!'); // Successfully downloaded message
            // You can set the download status in your Vue component here
          } catch (error) {
            console.error('Ошибка загрузки:', error);
            // Handle the error and set an appropriate status message
            console.error('Ошибка при загрузке файла.');
          }
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
  async fetchFiles() {
    try {
      const response = await fetch(`${API_BASE_URL}/files`);
      if (!response.ok) {
        throw new Error('Error fetching files');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching files:', error);
    }
},
    async refresh(){
      this.files = await this.fetchFiles()
    }
  },
  async mounted(){
      this.refresh()
  }
  
}
</script>

<style scoped>


.grid-container {
display: grid; 
grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
gap: 10px; 
justify-items: center;
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



/* Responsive Styles */
@media (max-width: 768px) {
  .tools {
    flex-direction: column; /* Stack buttons on smaller screens */
    align-items: center; /* Center items */
  }
  
  .custom-file-input {
    width: 90%; /* More width on smaller screens */
  }

  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* Smaller cards on mobile */
  }

  .delete-button img,
  .download-button img {
    width: 20px; /* Smaller icons on mobile */
  }
}

@media (max-width: 480px) {
  .upload-button {
    font-size: 14px; /* Smaller text for mobile */
  }
}

</style>