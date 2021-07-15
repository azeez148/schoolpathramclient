// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  RefreshControl,
  Modal,
  Button,
} from 'react-native';
import GlobalProperties from '../../helper/GlobalProperties';

const ListUsersScreen = () => {
  const [token, setToken] = useState('');
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setItemSelected] = useState(null);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // const [lastName, setLastName] = useState('');
  // const [email, setEmail] = useState('');

  //  useEffect(async()=>{
  //     const userData = await AsyncStorage.getItem('@u_info')
  //     let userInfo = JSON.parse(userData);
  //     setToken(userInfo.token)
  //     fetchUsers()
  //   },[])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const userData = await AsyncStorage.getItem('@u_info');
    let userInfo = JSON.parse(userData);
    setToken(userInfo.token);
    console.log(userInfo);
    // setItemSelected(userInfo);

    let url = GlobalProperties.BASE_URL + '/spaccount/list-users/';

    fetch(url, {
      method: 'GET',
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userInfo.token,
      },
    })
      .then(data => {
        return data.json();
      })
      .then(data => {
        console.log(data.data);
        setUsers(data.data);
      })
      .catch(() => {
        console.log(123123);
      });
  }, [token]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    try {
      let url = GlobalProperties.BASE_URL + '/spaccount/list-users/';

      let response = await fetch(url, {
        method: 'GET',
        headers: {
          //Header Defination
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        },
      });
      let responseJson = await response.json();
      console.log(responseJson);

      console.log(responseJson.data);
      setUsers(responseJson.data);
      // setListData(responseJson.result.concat(initialData));
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);

  // eslint-disable-next-line no-undef
  const clickEventListener = item => {
    setItemSelected(item);
    showModal();
    // console.log(props);

    // props.navigation.navigate('NewsFeedDetailScreen', {
    //   screen: 'NewsFeedScreen',
    //   params: { newsFeedItem: item, u_info: u_info },
    // });
  };

  const viewUserDetails = () => {
    alert('viewUserDetails');
  };
  const contactUser = () => {
    alert('contactUser');
  };
  const deActivateUser = () => {
    alert('deActivateUser');
  };
  const deleteUser = () => {
    alert('deleteUser');
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={users}
        horizontal={false}
        numColumns={2}
        keyExtractor={item => {
          return item.username;
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) => {
          let thumbnail_url = '/media/images/image_not_found.png';
          console.log(item.image);
          if (item.image.hasOwnProperty('url')) {
            console.log('ghshs');
            thumbnail_url = item.image.url;
          }

          console.log(GlobalProperties.BASE_URL + thumbnail_url);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                clickEventListener(item);
              }}>
              <View style={styles.cardHeader}>
                <Image
                  style={styles.icon}
                  source={{
                    uri: 'https://img.icons8.com/flat_round/64/000000/hearts.png',
                  }}
                />
              </View>
              <Image
                style={styles.userImage}
                source={{uri: GlobalProperties.BASE_URL + thumbnail_url}}
              />
              <View style={styles.cardFooter}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={styles.name}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={styles.position}>{item.email}</Text>
                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={() => this.clickEventListener(item)}>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* <Modal visible={modalVisible} onDismiss={hideModal}>
        <View style={styles.mPopupOverlay}>
          <View style={styles.mPopup}>
            <View style={styles.mPopupContent}>
              <Text>Example Modal. Click outside this area to dismiss. </Text>
            </View>
            <View style={styles.mPopupButtons}>
              <TouchableOpacity
                onPress={() => {
                  hideModal();
                }}
                style={styles.btnClose}>
                <Text style={styles.txtClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      <Modal
        animationType={'fade'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        {/*All views of Modal*/}
        <View style={styles.modal}>
          {/* <Text style={styles.text}></Text> */}
          {/* <Image
                style={styles.userImage}
                source={{uri: GlobalProperties.BASE_URL + selectedItem.image.url}}
              /> */}
          <View style={styles.mButtons}>
            <Button
              title="View User Details"
              onPress={() => {
                viewUserDetails(selectedItem);
              }}
            />
          </View>
          <View style={styles.mButtons}>
            <Button
              title="Contact User"
              onPress={() => {
                contactUser(selectedItem);
              }}
            />
          </View>
          <View style={styles.mButtons}>
            <Button
              title="DeActivate User"
              onPress={() => {
                deActivateUser(selectedItem);
              }}
            />
          </View>
          <View style={styles.mButtons}>
            <Button
              title="Delete User"
              onPress={() => {
                deleteUser(selectedItem);
              }}
            />
          </View>
          <View style={styles.mPopupButtons}>
            <TouchableOpacity
              onPress={() => {
                hideModal();
              }}
              style={styles.btnClose}>
              <Text style={styles.txtClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListUsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor: '#E6E6E6',
  },
  listContainer: {
    alignItems: 'center',
  },
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 5,
    backgroundColor: 'white',
    flexBasis: '46%',
    marginHorizontal: 5,
  },
  cardFooter: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  userImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    borderColor: '#DCDCDC',
    borderWidth: 3,
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'center',
    color: '#008080',
    fontWeight: 'bold',
  },
  position: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#696969',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  icon: {
    height: 20,
    width: 20,
  },
  mPopup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 7,
  },
  mPopupOverlay: {
    backgroundColor: 'white',
    flex: 1,
    width: 500,
    height: 500,
    // marginTop: 50
  },
  mPopupContent: {
    //alignItems: 'center',
    margin: 5,
  },
  mPopupHeader: {
    marginBottom: 45,
  },
  mPopupButtons: {
    // marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    marginTop: 60,
  },
  mPopupButton: {
    flex: 1,
    marginVertical: 16,
  },
  mImageView: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 500,
    width: '80%',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#eee',
    marginTop: 80,
    marginLeft: 40,
  },
  mButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#eee',
    padding: 1,
  },

  btnClose: {
    height: 30,
    backgroundColor: '#20b2aa',
    padding: 5,
  },
});
