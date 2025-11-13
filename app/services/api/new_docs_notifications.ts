import { BASE_URL } from "./apiConfig";

export const newDocsNotification = async () => {
    try {
      const response = await fetch(`${BASE_URL}documents/`);
  
      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }
      
      // Parse the response to JSON format
      const data = await response.json();

      return data;
  
    } catch (error) {
      // Handle any errors
      console.error('Error fetching data:', error);
    }
  }
  