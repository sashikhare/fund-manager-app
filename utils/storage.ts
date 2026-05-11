import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (data) => {
  await AsyncStorage.setItem('APP_DATA', JSON.stringify(data));
};

export const loadData = async () => {
  const data = await AsyncStorage.getItem('APP_DATA');
  return data ? JSON.parse(data) : null;
};