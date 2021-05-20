import {create} from 'apisauce';

const api = create({
  baseURL: 'https://api.openweathermap.org/data/2.5/',
});

/*
api.addAsyncRequestTransform((request) => async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
});
*/

export default api;
