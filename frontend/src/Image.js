class Image {

  constructor() {
    this.mainPicPath = '';
    this.mainPicCaption = '';
    this.flaskMessage = '';
    this.imagePosition = '';
    this.imageId = 0;
  }

  requestImage(selectedImage, server, imageId=null, userId=null, sessionvalue=null) {
    var promise = fetch( server + '/get_image?imageId=' + imageId
       + "&selected_image=" + selectedImage + "&user_id=" 
       + userId + "&sessionvalue=" + sessionvalue, {
      credentials : 'same-origin',
      method: 'GET',
      headers: { 'Accept': 'application/json', },
	})
    /*
	.then(response => response.json())
         .then(data =>  {
             this.mainPicPath = data.imagePath;
             this.mainPicCaption = data.caption;
             this.flaskMessage = data.message;
             this.imagePosition = data.imagePosition;
             this.imageId = data.image_id;
         })
         .catch(error => {
           this.setState({ error, isLoading: false});
           console.log("error: ", error);
        });
        */
    return promise;
  }

}

export default Image 
