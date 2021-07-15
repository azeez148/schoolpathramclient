export async function get(url, token) {
  await fetch(url, {
    method: 'GET',
    headers: {
      //Header Defination
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token,
    },
  })
    .then(data => {
      return data.json();
    })
    .then(responseJson => {
      console.log(responseJson.data);
      return responseJson.data;
    })
    .catch(error => {
      console.log(error);
    });
};

export function post(url, token, formData) {
  await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: 'Token ' + token,
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      //Hide Loader
      //setLoading(false);
      console.log(responseJson);
      // If server response message same as Data Matched
      if (responseJson.success === true) {
        console.log(responseJson.data);
        // console.log(data.data);
        return responseJson.data;
        // newsfeeds.push(responseJson.data);
        // setModalVisible(false);
        // clearInput();
      } else {
        let errorMessage = 'Unexpected error, Please try again.';
        // setErrortext(errorMessage);
        console.log(errorMessage);
      }
    })
    .catch(error => {
      //Hide Loader
      //   setLoading(false);
      console.error(error);
    });
}
