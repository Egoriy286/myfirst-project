import axios from 'axios';
import { API_BASE_URL } from './config'

export async function deleteFile(fileName) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileName}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
}
export async function fetchFiles() {
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
}
export async function downloadFile(file, response) {  
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