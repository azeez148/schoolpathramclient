// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef, useEffect} from 'react';
import Loader from '../Components/Loader';

import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  Alert,
  FlatList,
  Button,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  Modal,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

// import MediaPicker from "react-native-mediapicker"

import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

import DocumentPicker from 'react-native-document-picker';

import GlobalProperties from '../../helper/GlobalProperties';

const NewsFeedScreen = props => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [u_info, setUserInfo] = useState({});

  const [uuid, setUUID] = useState('');
  const [token, setToken] = useState('');

  const [newsfeeds, setNewsfeeds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const {width} = Dimensions.get('window');
  let userInfo = {};

  useEffect(async () => {
    const userData = await AsyncStorage.getItem('@u_info');
    userInfo = JSON.parse(userData);
    setUUID(userInfo.uuid);
    setToken(userInfo.token);
    setUserInfo(userInfo);
    console.log(userInfo);
    let url = GlobalProperties.BASE_URL + '/spnewsfeed/list-newsfeed/';
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
        setNewsfeeds(data.data);
      })
      .catch(() => {
        console.log(123123);
      });
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    try {
      let url = GlobalProperties.BASE_URL + '/spnewsfeed/list-newsfeed/';

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
      setNewsfeeds(responseJson.data);
      // setListData(responseJson.result.concat(initialData));
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);

  const postTitleRef = createRef();
  const postDescriptionRef = createRef();

  const handleSubmitPress = () => {
    setErrortext('');

    if (!postTitle) {
      alert('Please fill Post Title');
      return;
    }
    if (!postDescription) {
      alert('Please fill Post Description');
      return;
    }
    setLoading(true);

    const formData = new FormData();

    images.forEach(image => {
      formData.append('file', image);
    });

    formData.append('title', postTitle);
    formData.append('description', postDescription);
    formData.append('created_by', uuid);

    // var dataToSend = {title: postTitle, description: postDescription, created_by: uuid, images: attachmentsToSend};

    console.log(formData);
    let url = GlobalProperties.BASE_URL + '/spnewsfeed/create/';

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        //Header
        Authorization: 'Token ' + token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.success === true) {
          console.log(responseJson.data);
          newsfeeds.push(responseJson.data);
          setModalVisible(false);
          clearInput();
        } else {
          let errorMessage = 'Unexpected error, Please try again.';
          setErrortext(errorMessage);
          console.log(errorMessage);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

  const clearInput = () => {
    setPostTitle('');
    setPostDescription('');
    setImages([]);
  };

  const onClose = () => {
    setModalVisible(false);
    clearInput();
  };

  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
        //There can me more options as well find above
      });
      for (const res of results) {
        //Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('File Size : ' + res.size);
      }
      //Setting the state to show multiple file attributes
      setImages(results);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  // eslint-disable-next-line no-undef
  clickEventListener = item => {
    console.log(item.title);
    console.log(props);

    props.navigation.navigate('NewsFeedDetailScreen', {
      screen: 'NewsFeedScreen',
      params: {newsFeedItem: item, u_info: u_info},
    });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <View style={styles.card} visible={userInfo.isAdmin}>
        <View style={styles.createPostContent}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.createButtonText}>Create a Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        visible={modalVisible}>
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.popupContent}>
              <ScrollView contentContainerStyle={styles.modalInfo}>
                <View>
                  <KeyboardAvoidingView enabled>
                    <View style={styles.SectionStyle}>
                      <TextInput
                        style={styles.inputStyle}
                        // eslint-disable-next-line no-shadow
                        onChangeText={postTitle => setPostTitle(postTitle)}
                        underlineColorAndroid="#f000"
                        placeholder="Enter a Title"
                        placeholderTextColor="#8b9cb5"
                        autoCapitalize="sentences"
                        ref={postTitleRef}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          postDescriptionRef.current &&
                          postDescriptionRef.current.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </View>
                    <View style={styles.SectionStyle}>
                      <TextInput
                        style={styles.inputMultiStyle}
                        placeholder="Enter Details"
                        placeholderTextColor="#8b9cb5"
                        // eslint-disable-next-line no-shadow
                        onChangeText={postDescription =>
                          setPostDescription(postDescription)
                        }
                        autoCapitalize="sentences"
                        ref={postDescriptionRef}
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>
                    {/* <FlatList
                            style={[
                              styles.container,
                              {
                                paddingTop: 6,
                              },
                            ]}
                            data={images}
                            keyExtractor={(item, index) => (item?.filename ?? item?.path) + index}
                            renderItem={renderItem}
                            numColumns={3}
                          />
                          <TouchableOpacity style={styles.openPicker} onPress={openPicker}>
                            <Text style={styles.openText}>open</Text>
                          </TouchableOpacity> */}

                    {/*To multiple single file attribute*/}
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={styles.attachButtonStyle}
                      onPress={selectMultipleFile}>
                      {/*Multiple files selection button*/}
                      <Text>Upload Images</Text>
                      <Image
                        source={{
                          uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                        }}
                        style={styles.imageIconStyle}
                      />
                    </TouchableOpacity>
                    <ScrollView>
                      {/*Showing the data of selected Multiple files*/}
                      {images.map((item, key) => (
                        <View key={key}>
                          <Text style={styles.textStyle}>
                            File Name: {item.name ? item.name : ''}
                            {'\n'}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.buttonStyle}
                      activeOpacity={0.5}
                      onPress={handleSubmitPress}>
                      <Text style={styles.buttonTextStyle}>Post</Text>
                    </TouchableOpacity>
                  </KeyboardAvoidingView>
                </View>
              </ScrollView>
            </View>
            <View style={styles.popupButtons}>
              <TouchableOpacity onPress={onClose} style={styles.btnClose}>
                <Text style={styles.txtClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'flex-start',
          alignContent: 'center',
        }}>
        <FlatList
          style={styles.list}
          data={newsfeeds}
          keyExtractor={item => {
            return item.id;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          renderItem={post => {
            const item = post.item;
            let thumbnail_url = '/media/images/image_not_found.png';
            if (post.item.images.length > 0) {
              thumbnail_url = post.item.images[0].url;
            }
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  // eslint-disable-next-line no-undef
                  clickEventListener(item);
                }}>
                <Image
                  style={styles.cardImage}
                  source={{uri: GlobalProperties.BASE_URL + thumbnail_url}}
                />
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.title}>{item.title}</Text>

                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.timeContainer}>
                      <Image
                        style={styles.iconData}
                        source={{
                          uri: 'https://img.icons8.com/color/96/3498db/calendar.png',
                        }}
                      />
                      <Text style={styles.time}>{item.created_by}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.socialBarContainer}>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Image
                          style={styles.icon}
                          source={{
                            uri: 'https://img.icons8.com/material/96/2ecc71/visible.png',
                          }}
                        />
                        <Text style={styles.socialBarLabel}>78</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Image
                          style={styles.icon}
                          source={{
                            uri: 'https://img.icons8.com/ios-glyphs/75/2ecc71/comments.png',
                          }}
                        />
                        <Text style={styles.socialBarLabel}>25</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

export default NewsFeedScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E6E6E6',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    marginTop: 60,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 160,
    marginRight: 35,
    marginTop: 100,
    width: 100,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 5,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  inputMultiStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 5,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
    marginTop: -30,
    height: 100,
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },

  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 17,
    backgroundColor: '#E6E6E6',
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor: 'white',
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor: '#EEEEEE',
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
  },
  description: {
    fontSize: 15,
    color: '#888',
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  time: {
    fontSize: 13,
    color: '#808080',
    marginTop: 5,
  },
  icon: {
    width: 25,
    height: 25,
  },
  iconData: {
    width: 15,
    height: 15,
    marginTop: 5,
    marginRight: 5,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  socialBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  createPostContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  createButton: {
    marginTop: 10,
    marginBottom: 10,
    height: 45,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },

  /************ modals ************/
  popup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 7,
  },
  popupOverlay: {
    backgroundColor: '#00000057',
    flex: 1,
    marginTop: 50,
  },
  popupContent: {
    //alignItems: 'center',
    margin: 5,
  },
  popupHeader: {
    marginBottom: 45,
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
  },
  popupButton: {
    flex: 1,
    marginVertical: 16,
  },
  btnClose: {
    height: 30,
    backgroundColor: '#20b2aa',
    padding: 5,
  },
  modalInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  attachButtonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginLeft: 110,
    marginRight: 35,
    marginTop: 10,
    width: 200,
  },

  imageView: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
