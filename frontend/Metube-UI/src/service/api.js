const API_BASE_URL = 'http://localhost:3000/api'; // Adjust based on your backend port

export const fetchVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Fallback to mock data
    return MOCK_VIDEOS;
  }
};

export const fetchVideoById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    // Fallback to mock data
    return MOCK_VIDEOS.find(video => video.id === id);
  }
};

// Import MOCK_VIDEOS for fallback
import { MOCK_VIDEOS } from '../utils/constants';
