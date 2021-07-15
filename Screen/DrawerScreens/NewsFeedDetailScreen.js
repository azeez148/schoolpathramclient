import React, {Component, createRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

import GlobalProperties from '../../helper/GlobalProperties';

import DocumentPicker from 'react-native-document-picker';

export default class NewsFeedDetailScreen extends Component {
  constructor(props) {
    super(props);
    // console.log('props');
    console.log(props.route.params);

    let newsFeedParam = props.route.params.params.newsFeedItem;
    let uInfoParams = props.route.params.params.u_info;

    this.state = {
      postTitle: '',
      postDescription: '',
      images: [],
      postTitleRef: createRef(),
      postDescriptionRef: createRef(),
      errortext: '',
      loading: false,
      modalVisible: false,
      userSelected: [],
      profilePictureViewModalVisible: false,
      newsFeed: {
        title: newsFeedParam.title,
        description: newsFeedParam.description,
        created: newsFeedParam.created_by,
        images: newsFeedParam.images,
        id: newsFeedParam.id,
        // colors:[
        //   "#00BFFF",
        //   "#FF1493",
        //   "#00CED1",
        //   "#228B22",
        //   "#20B2AA",
        //   "#FF4500",
        // ]
      },
      uInfo: uInfoParams,
    };
  }

  __setImageSelected = image => {
    this.setState({selectedImage: image});
  };

  __renderImages = () => {
    return (
      <View style={styles.smallImagesContainer}>
        {this.state.newsFeed.images.map((image, key) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                this.__setImageSelected(image);
              }}>
              <Image
                style={styles.smallImage}
                source={{uri: GlobalProperties.BASE_URL + image.url}}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  //   __renderColors = () => {
  //     return(
  //       <View style={styles.contentColors}>
  //         {this.state.newsFeed.colors.map((prop, key) => {
  //           return (
  //             <TouchableOpacity key={key} style={[styles.btnColor, {backgroundColor:prop}]}></TouchableOpacity>
  //           );
  //         })}
  //       </View>
  //     )
  //   }

  clickEventListener = item => {
    this.setModalVisible(true);
    // this.setState({userSelected: item}, () =>{
    //   this.setModalVisible(true);
    // });
  };

  setModalVisible(visible) {
    // eslint-disable-next-line eqeqeq
    if (visible == true) {
      this.setPostTitle(this.state.newsFeed.title);
      this.setPostDescription(this.state.newsFeed.description);
      this.setInitialImages(this.state.newsFeed.images);
    } else {
      this.setPostTitle('');
      this.setPostDescription('');
      this.setImages([]);
    }

    this.setState({modalVisible: visible});
    // console.log(this.state.newsFeed.title)

    // this.setState({postTitle: this.state.newsFeed.title})
    // this.setState({postDescription: this.state.newsFeed.description})
  }

  setPostTitle(title) {
    this.setState({postTitle: title});
  }

  setPostDescription(description) {
    this.setState({postDescription: description});
  }

  setInitialImages(images) {
    this.setState({images: images});
  }

  setImages(image) {
    var newStateArray = this.state.images.slice();
    newStateArray.push(image);

    this.setState({images: newStateArray});
  }

  selectMultipleFile = async () => {
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
        this.setImages(res);
      }

      //   this.setState({images: results});
      //   //Setting the state to show multiple file attributes
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

  handleSubmitPress = () => {
    this.setState({errortext: ''});

    if (!this.state.postTitle) {
      alert('Please fill Post Title');
      return;
    }
    if (!this.state.postDescription) {
      alert('Please fill Post Description');
      return;
    }
    this.setState({loading: true});

    const formData = new FormData();

    this.state.images.forEach(image => {
      console.log(image);
      if (image.hasOwnProperty('type')) {
        formData.append('file', image);
      }
    });

    formData.append('title', this.state.postTitle);
    formData.append('description', this.state.postDescription);
    formData.append('created_by', this.state.uInfo.uuid);
    formData.append('newsfeed_id', this.state.newsFeed.id);

    // formData.append('created_by', uuid);

    // var dataToSend = {title: postTitle, description: postDescription, created_by: uuid, images: attachmentsToSend};

    console.log(formData);
    let url = GlobalProperties.BASE_URL + '/spnewsfeed/update-newsfeed/';

    fetch(url, {
      method: 'PUT',
      body: formData,
      headers: {
        //Header
        Authorization: 'Token ' + this.state.uInfo.token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        this.setState({loading: false});
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.success === true) {
          console.log(responseJson.data);
          //   this.updateUIModelFields
          this.setModalVisible(false);
          //   clearInput();
        } else {
          let errorMessage = 'Unexpected error, Please try again.';
          this.setState({errortext: errorMessage});
          console.log(errorMessage);
        }
      })
      .catch(error => {
        //Hide Loader
        this.setState({loading: false});
        console.error(error);
      });
  };

  viewProfileImage = () => {
    this.setState({profilePictureViewModalVisible: true});
  };

  render() {
    var mainImage = this.state.selectedImage
      ? this.state.selectedImage
      : this.state.newsFeed.images[0];
    let sampleImageUrl = '/media/images/image_not_found.png';
    var mainImageUrl = mainImage == undefined ? sampleImageUrl : mainImage.url;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{this.state.newsFeed.title}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.header}>
                <View style={styles.imageView}>
                  <TouchableOpacity onPress={this.viewProfileImage}>
                    <Image
                      style={styles.mainImage}
                      source={{uri: GlobalProperties.BASE_URL + mainImageUrl}}
                    />
                  </TouchableOpacity>
                </View>
                {this.__renderImages()}
              </View>
            </View>
          </View>

          {/* <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Colors</Text>
            </View>
            <View style={styles.cardContent}>
              {this.__renderColors()}
            </View>
          </View> */}

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Description</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.description}>
                {this.state.newsFeed.description}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => this.clickEventListener()}>
                <Text style={styles.shareButtonText}>Update Post</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* modal */}

          <Modal
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => this.setModalVisible(false)}
            visible={this.state.modalVisible}>
            <View style={styles.popupOverlay}>
              <View style={styles.popup}>
                <View style={styles.popupContent}>
                  <ScrollView contentContainerStyle={styles.modalInfo}>
                    <View>
                      <KeyboardAvoidingView enabled>
                        <View style={styles.SectionStyle}>
                          <TextInput
                            style={styles.inputStyle}
                            value={this.state.postTitle}
                            onChangeText={postTitle =>
                              this.setPostTitle(postTitle)
                            }
                            underlineColorAndroid="#f000"
                            placeholder="Enter a Title"
                            placeholderTextColor="#8b9cb5"
                            autoCapitalize="sentences"
                            ref={this.state.postTitleRef}
                            returnKeyType="next"
                            onSubmitEditing={() =>
                              this.state.postDescriptionRef.current &&
                              this.state.postDescriptionRef.current.focus()
                            }
                            blurOnSubmit={false}
                          />
                        </View>
                        <View style={styles.SectionStyle}>
                          <TextInput
                            style={styles.inputMultiStyle}
                            value={this.state.postDescription}
                            placeholder="Enter Details"
                            placeholderTextColor="#8b9cb5"
                            onChangeText={postDescription =>
                              this.setPostDescription(postDescription)
                            }
                            autoCapitalize="sentences"
                            ref={this.state.postDescriptionRef}
                            multiline={true}
                            numberOfLines={4}
                          />
                        </View>

                        {/*To multiple single file attribute*/}
                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={styles.attachButtonStyle}
                          onPress={this.selectMultipleFile}>
                          {/*Multiple files selection button*/}
                          <Text>Upload Images</Text>
                          <Image
                            source={{
                              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                            }}
                            style={styles.imageIconStyle}
                          />
                        </TouchableOpacity>
                        <ScrollView style={styles.attachmentsStyle}>
                          {/*Showing the data of selected Multiple files*/}
                          {this.state.images.map((item, key) => (
                            <View key={key}>
                              <Text style={styles.textStyle}>
                                File Name: {item.name ? item.name : ''}
                              </Text>
                            </View>
                          ))}
                        </ScrollView>

                        <TouchableOpacity
                          style={styles.buttonStyle}
                          activeOpacity={0.5}
                          onPress={this.handleSubmitPress}>
                          <Text style={styles.buttonTextStyle}>Post</Text>
                        </TouchableOpacity>
                      </KeyboardAvoidingView>
                    </View>

                    {/*
                                    <Image style={styles.image} source={{ uri: this.state.userSelected.image }} />
                                    <Text style={styles.name}>{this.state.userSelected.name}</Text>
                                    <Text style={styles.position}>{this.state.userSelected.position}</Text>
                                    <Text style={styles.about}>{this.state.userSelected.about}</Text> */}
                  </ScrollView>
                </View>
                <View style={styles.popupButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(false);
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
            onRequestClose={() =>
              this.setState({profilePictureViewModalVisible: false})
            }
            visible={this.state.profilePictureViewModalVisible}>
            <View style={styles.mPopupOverlay}>
              <View style={styles.mPopup}>
                <View style={styles.mPopupContent}>
                  <ScrollView contentContainerStyle={styles.modalInfo}>
                    <View>
                      <Image
                        source={{uri: GlobalProperties.BASE_URL + mainImageUrl}}
                        style={styles.mImageView}
                      />
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.mPopupButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({profilePictureViewModalVisible: false});
                    }}
                    style={styles.btnClose}>
                    <Text style={styles.txtClose}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#ebf0f7',
  },
  content: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
  },
  mainImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  smallImagesContainer: {
    flexDirection: 'column',
  },
  smallImage: {
    width: 60,
    height: 60,
    marginTop: 5,
    marginLeft: 10,
  },
  btnColor: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginHorizontal: 3,
  },
  contentColors: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 22,
    color: '#696969',
    fontWeight: 'bold',
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    color: '#696969',
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00BFFF',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
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
    height: 100,
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
    width: 200,
    marginTop: 10,
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
    color: '#00BFFF',
  },
  /************ modals ************/
  popup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 7,
    height: 800,
  },
  popupOverlay: {
    backgroundColor: '#00000057',
    flex: 1,
    // marginTop: 50
  },
  popupContent: {
    //alignItems: 'center',
    margin: 5,
  },
  popupHeader: {
    marginBottom: 45,
  },
  popupButtons: {
    // marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    marginTop: 60,
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
  SectionStyle: {
    flexDirection: 'row',
    marginTop: 60,
  },

  attachmentsStyle: {
    marginTop: 10,
  },
  imageView: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  mPopup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 7,
  },
  mPopupOverlay: {
    backgroundColor: '#00000057',
    flex: 1,
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
});
