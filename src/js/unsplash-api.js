import axios from 'axios';

axios.defaults.baseURL = 'https://api.unsplash.com';

export const getPhotosByQuery = async (currentQuery, currentPage) => {
  const requestParams = {
    query: currentQuery,
    color: 'black_and_white',
    orientation: 'portrait',
    client_id: 'N2hFKxqELoV2Hd6dcIRJn1oRrjfp310WTtPLEXfMXjg',
    page: currentPage,
    per_page: '12',
  };

  const { data } = await axios.get(`/search/photos`, { params: requestParams });

  return data;
};

export const getRandomPhotos = () => {
  const requestParams = {
    orientation: 'portrait',
    count: 12,
    client_id: 'N2hFKxqELoV2Hd6dcIRJn1oRrjfp310WTtPLEXfMXjg',
  };

  return axios.get('/photos/random', { params: requestParams });
};
