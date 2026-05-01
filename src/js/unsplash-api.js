import axios from 'axios';

// это халявные ключи ;)
// сделать перебор ключей если по одному из ключей закончились лимиты
// N2hFKxqELoV2Hd6dcIRJn1oRrjfp310WTtPLEXfMXjg
// q1FZ3G3lUf_2UuiXCVry3Fo9yR8N-uicMlLcML8Lwj4

axios.defaults.baseURL = 'https://api.unsplash.com';

export const getPhotosByQuery = async (currentQuery, currentPage) => {
  const requestParams = {
    query: currentQuery,
    color: 'black_and_white',
    orientation: 'portrait',
    client_id: 'hSTA8EIaWVLmqIJI77a2lf0seJ4NS_sPytSdWiEik3g',
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
    client_id: 'hSTA8EIaWVLmqIJI77a2lf0seJ4NS_sPytSdWiEik3g',
  };

  return axios.get('/photos/random', { params: requestParams });
};
