// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect, createRef} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../Components/Loader';
import GlobalProperties from '../../helper/GlobalProperties';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  TextInput,
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [token, setToken] = useState('');
  const [uuid, setUUID] = useState('');
  const [profilePictureModalVisible, setProfilePictureModalVisible] = useState(false);
  
  const [profilePictureViewModalVisible, setProfilePictureViewModalVisible] = useState(false);

  const [profileImage, setProfileImage] = useState(null);

  const [profileUri, setProfileImageUri] = useState('https://bootdey.com/img/Content/avatar/avatar6.png');

  const userFNameInputRef = createRef();
  const userLNameInputRef = createRef();

  const sample_avatar_uri = 'https://bootdey.com/img/Content/avatar/avatar6.png';


  useEffect(async () => {
    const userData = await AsyncStorage.getItem('@u_info')
    let userInfo = JSON.parse(userData);
    console.log(userInfo);
    setUUID(userInfo.uuid);
    setToken(userInfo.token);
    setEmail(userInfo.email);
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    
  }, []);

  const handleOpenUpdateModal = () => {
    setModalVisible(true);
  };

  const handleOpenUpdateProfilePictureModal = () => {
    setProfilePictureModalVisible(true);
  };

  const handleSubmitPress = () => {
    setErrortext('');
    if (!firstName) {
      alert('Please fill firstName');
      return;
    }
    if (!lastName) {
      alert('Please fill lastName');
      return;
    }
    setLoading(true);

    var dataToSend = {
      unique_id: uuid,
      first_name: firstName,
      last_name: lastName,
    };

    console.log(dataToSend);
    let url = GlobalProperties.BASE_URL + '/spaccount/update-profile/';

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
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
          //   this.updateUIModelFields
          setModalVisible(false);
          //   clearInput();
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

  const uploadProfileImageServer = image => {
    setErrortext('');
    if (!image) {
      // eslint-disable-next-line no-alert
      alert('No image selected');
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append('file', image);
    formData.append('unique_id', uuid);

    console.log(formData);
    let url = GlobalProperties.BASE_URL + '/spaccount/update-profile-image/';

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
          setProfilePictureModalVisible(false);
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

  const selectProfileImage = async () => {
    console.log('in,,,,,,');
    //Opening Document Picker for selection of multiple file
    try {
      const image = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        //There can me more options as well find above
      });
      console.log('URI : ' + image.uri);
      setProfileImage(image);
      setProfileImageUri(image.uri);
      uploadProfileImageServer(image);
      // setProfilePictureModalVisible(false);
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

  const viewProfileImage = () => {
    setProfilePictureViewModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleOpenUpdateProfilePictureModal}>
            <Image style={styles.avatar} source={{uri: profileUri}} />
          </TouchableOpacity>
          <Text style={styles.name}>{firstName} </Text>
          <Text style={styles.userInfo}>{email}</Text>
          {/* <Text style={styles.userInfo}>Florida </Text> */}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.item}>
          <View style={styles.iconContent}>
            <Text style={styles.info}>First Name: </Text>

            {/* <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/cottage.png'}}/> */}
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.info}>{firstName}</Text>
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.iconContent}>
            <Text style={styles.info}>Last Name: </Text>

            {/* <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/administrator-male.png'}}/> */}
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.info}>{lastName}</Text>
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.iconContent}>
            <Text style={styles.info}>Email: </Text>

            {/* <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/filled-like.png'}}/> */}
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.info}>{email}</Text>
          </View>
        </View>

        {/* <TouchableOpacity
                      style={styles.buttonStyle}
                      activeOpacity={0.5}
                      onPress={handleOpenUpdateModal}>
                      <Text style={styles.buttonTextStyle}>Update Profile</Text>
                    </TouchableOpacity> */}

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleOpenUpdateModal}>
              <Text style={styles.shareButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.item}>
            <View style={styles.iconContent}>
              <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/facebook-like.png'}}/>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.info}>Shop</Text>
            </View>
          </View> */}

      </View>

      {/* modal PROFILE UPDATE */}

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
                        value={firstName}
                        onChangeText={UserFName => setFirstName(UserFName)}
                        underlineColorAndroid="#f000"
                        placeholder="Enter First Name"
                        placeholderTextColor="#8b9cb5"
                        autoCapitalize="sentences"
                        ref={userFNameInputRef}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          userLNameInputRef.current &&
                          userLNameInputRef.current.focus()
                        }
                        blurOnSubmit={false}
                      />
                    </View>
                    <View style={styles.SectionStyle}>
                      <TextInput
                        style={styles.inputStyle}
                        value={lastName}
                        onChangeText={(UserLName) => setLastName(UserLName)}
                        underlineColorAndroid="#f000"
                        placeholder="Enter Last Name"
                        placeholderTextColor="#8b9cb5"
                        autoCapitalize="sentences"
                        ref={userLNameInputRef}
                        returnKeyType="next"
                        blurOnSubmit={false}
                      />
                    </View>


                    <TouchableOpacity
                      style={styles.buttonStyle}
                      activeOpacity={0.5}
                      onPress={handleSubmitPress}>
                      <Text style={styles.buttonTextStyle}>Update</Text>
                    </TouchableOpacity>
                  </KeyboardAvoidingView>

                </View>
              </ScrollView>
            </View>
            <View style={styles.popupButtons}>
              <TouchableOpacity onPress={() => { setModalVisible(false) }} style={styles.btnClose}>
                <Text style={styles.txtClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* modal PROFILE picture add*/}

      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => setProfilePictureModalVisible(false)}
        visible={profilePictureModalVisible}>
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.popupContent}>
              <ScrollView contentContainerStyle={styles.modalInfo}>
                <View>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.attachButtonStyle}
                    onPress={selectProfileImage}>
                    {/*Multiple files selection button*/}
                    <Text>Upload Image</Text>
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                      }}
                      style={styles.imageIconStyle}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.attachButtonStyle}
                    onPress={viewProfileImage}>
                    {/*Multiple files selection button*/}
                    <Text>View Image</Text>
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                      }}
                      style={styles.imageIconStyle}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                onPress={() => {
                  setProfilePictureModalVisible(false);
                }}
                style={styles.btnClose}>
                <Text style={styles.txtClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* modal PROFILE picture view*/}

      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => setProfilePictureViewModalVisible(false)}
        visible={profilePictureViewModalVisible}>
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.popupContent}>
              <ScrollView contentContainerStyle={styles.modalInfo}>
                <View>
                  <Image
                      source={{
                        uri: profileUri,
                      }}
                      style={styles.imageView}
                    />
                </View>
              </ScrollView>
            </View>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                onPress={() => {
                  setProfilePictureViewModalVisible(false);
                }}
                style={styles.btnClose}>
                <Text style={styles.txtClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DCDCDC',
  },
  headerContent: {
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
  },
  userInfo: {
    fontSize: 16,
    color: '#778899',
    fontWeight: '600',
  },
  body: {
    backgroundColor: '#778899',
    height: 500,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 5
  },
  iconContent: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: '#FFFFFF',
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "#00BFFF",
    width: 250,
  },
  shareButtonText: {
    color: "#FFFFFF",
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
    marginHorizontal: 5,
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
  cardTitle: {
    color: "#00BFFF"
  },

  imageView: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
