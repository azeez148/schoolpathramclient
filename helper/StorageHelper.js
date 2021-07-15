// StorageHelper.js

async function set(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
};

async function get(key) {
  try {
    const value = await AsyncStorage.getItem(key);

    return JSON.parse(value);
  } catch (error) {
    console.error(error);
    return null;
  }
};


// setToken(token) {
//     return set('token', token);
// };

// getToken() {
//     return get('token');
// };