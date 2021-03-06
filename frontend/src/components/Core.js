import React, { Component } from 'react';

class Core extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: "home",
      show: false,
      isLoading: true,
      mainPicPath : '',
      mainPicCaption : '',
      flaskMessage : '',
      error: null,
    //  imageId: null,
      selectedFile: null,
      showFileUpload: true,
      showCaption: false,
      capButton: 'Submit Caption',
      showPreview: false,
      imagePath: null,
      trigger: 0,
     // selectedImage: this.props.selectedImage, // this shouldn't happen
      selectedImage: 'latest', // this shouldn't happen
      showNext: true,
      showPrev: true,
      newImageId: '',
      appClass : 'App',
      picNav : 'Pic-wide',
    }
  }

  componentDidMount() {
  //  this.fetchData();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (window.innerWidth < 1000) {
      this.setState({ appClass : "Narrow-format", picNav : "Pic-narraow" });
    } else {
      this.setState({ appClass : "Wide-format", picNav : "Pic-wide" });
    }
  }

  showModal = () => {
    this.setState({ show: true });
  }
  
  hideModal = () => {
    this.setState({ show: false });
    this.fetchData();
  }

  handleFileChange = event => {
    this.setState( { selectedFile: event.target.files[0] } );
  }

  handleTextChange = event => {
     this.setState({ caption: event.target.value });
  }

  handleUpload = () => {
    // this is causing mainpic to rerender and I want to avoid that
    // so I can keep the picture in the modal and add the caption
    // I may need to move the modal out of mainpic to do this
    if (!this.state.selectedFile) { 
      this.setState( { warning : 'No file selected' } );
      return;
    } else {
      this.setState( { warning : null } );
    }
    const fd = new FormData();
    fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
    fd.append('caption', this.state.caption);
    fd.append('user_id', this.props.user.userId);
    fd.append('sessionvalue', this.props.user.sessionvalue);
    fetch( this.props.DATA_URI + '/upload_image', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials : 'same-origin',
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      // it should probably ask the user if it's ok
      // maybe the image should even be saved in a temp dir
      // and then moved when user says ok
      console.log("data is ", data);
      this.setState( { 
        showFileUpload : false,
        showCaption : true,
        showPreview: true,
        imageId : data.image_id,
      //  imagePath : data.imagePath,
      } );
      // maybe this shouldn't be set yet?
      // I think it's causing a refresh and closing the modal?
       this.props.image.setImageId(data.image_id);
    })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem uploading the file' } );
    });
  }

  handleCaption = () => {
    const fd = new FormData();
    fd.append('caption', this.state.caption);
    fd.append('imageId', this.props.image.imageId);
    fetch( this.props.DATA_URI + '/caption', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      }, 
      credentials : 'same-origin',
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState( { showFileUpload : false } );
      this.setState( { capButton : 'Edit Caption' });
    })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem adding the caption' } );
    });
  }

  fetchData(msg='') {
    fetch( this.props.DATA_URI + "/get_image?imageId=" + this.props.image.imageId
       + "&selected_image=" + this.state.selectedImage + "&user_id=" 
       + this.props.user.userId + "&sessionvalue=" + this.props.user.sessionvalue, {
      credentials : 'same-origin',
      method: 'GET',
      headers: { 'Accept': 'application/json', },
	})
	.then(response => response.json())
         .then(data =>  {
           this.setState( { 
             mainPicPath : data.imagePath,
             mainPicCaption : data.caption,
             flaskMessage : data.message,
  //           imageId : data.image_id,
           })
           this.props.image.setImageId(data.image_id);
           this.props.refresh();
           if (data.imagePosition === 'last') {
             this.setState( { showNext : false, showPrev : true } );
           } else if (data.imagePosition === 'first') {
             this.setState( { showPrev : false, showNext : true } );
           } else {
             this.setState( { showPrev : true, showNext : true } );
           }
         })
         .catch(error => {
           this.setState({ error, isLoading: false});
           console.log("error: ", error);
           })
  }

  renderFileUpload() {
    if (this.state.showFileUpload) {
      return (
        <div>
        <font color='white'>Upload new pic</font><br />
        <form onSubmit={this.handleUpload}>
      <input type="file" onChange={this.handleFileChange} name="file" id="file"/>
      <label htmlFor="file">Choose a file</label>
      <input type="submit" value="Upload" />
        </form>
        </div>
      );
    }
  }

  renderCaption() {
    if (this.state.showCaption) {
      return (
        <div>
      <input type="text" onChange={this.handleTextChange}/>
      <button onClick={this.handleCaption}>{this.state.capButton}</button>
        </div>
      );
    }
  }

  previewPic() {
    if (this.state.showPreview) {
      return (
        <div>
        <img src={this.props.DATA_URI + this.state.imagePath} alt="what is it img" className="previewPic" />
        </div>
      );
    }
  }

  triggerAnswers = (trigger) => {
    this.setState( { trigger : 1 } );
  }
			
  unTriggerAnswers = (trigger) => {
    if (this.state.trigger === 1) {
      this.setState( { trigger : 0 } );
    }
  }
  
 
  handlePrevOrNext(direction) {
    // should this be a component on its own to avoid unneccesary rerenders
    // if this.state.selectedImage is user nd direction is previous or next
    // need to get the next or previous from that user
    // so need to send something more to api
    if (this.state.selectedImage === 'user') { direction = "user_" + direction; }
    fetch( this.props.DATA_URI + '/get_image?imageId='+this.props.image.imageId+
      '&selected_image=' + direction + "&user_id=" + this.props.user.userId 
      + "&sessionvalue=" + this.props.user.sessionvalue, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials : 'same-origin',
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
	this.setState( { 
             mainPicPath : data.imagePath,
             mainPicCaption : data.caption,
             flaskMessage : data.message,
           //  imageId : data.image_id,
        })
        this.props.image.setImageId(data.image_id);
        this.props.refresh();
        if (data.imagePosition === 'last') {
          this.setState( { showNext : false, showPrev : true } );

        } else if (data.imagePosition === 'first') {
          this.setState( { showPrev : false, showNext : true } );
        } else {
          this.setState( { showNext : true, showPrev : true } );
        }
//	this.props.refresh();
      }
    })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem getting that image.' } );
	  console.log(error);
    });
  }

  sortPic(type) {
    if (type === 'mostAnswers') { 
      this.setState( { selectedImage : 'most_answers' }, () => this.fetchData());
    }
    if (type === 'latest') { 
      this.setState( { selectedImage : 'latest' }, () => this.fetchData());
    }
    if (type === 'user') {
      this.setState( { selectedImage : 'user' }, () => this.fetchData());
    }
    // this needs to refresh answers
    this.props.refresh();
  }

  handleNewImageChange = event => {
    this.setState({ newImageId : event.target.value });
  }

  setImage = (event) => {
    event.preventDefault();
    this.props.image.setImageId(this.state.newImageId);
    this.setState({ selectedImage : '' }, () => this.fetchData());
  }

  navigate(place) {
    console.log("Place is ", place);
  }

  render() {
   // console.log(window.document.getElementsByTagName('body')[0].clientWidth);
  //  console.log(window.document.getElementsByTagName('body'));
    //
    //
    // Maybe I can make a navigation tree here where I make arrays of arrays where 
    // the main window shows you the elements of the array you have navigated to
    // the windown on the left shows you the parent.  If you are at the first element
    // it's one big window.
    // each element could be a component
    //
    //
    var caption = {
      fontWeight : 'normal',
      fontSize : '16px',
      fontStyle : 'italic',
    }

  var leftArrow = 
  <svg width="15" height="10" onClick={() => this.handlePrevOrNext("previous")}>
  <line x1="0" y1="5" x2="15" y2="5" stroke="#000000" strokeWidth="3" />
  <line x1="0" y1="5" x2="10" y2="0" stroke="#000000" strokeWidth="2" />
  <line x1="0" y1="5" x2="10" y2="10" stroke="#000000" strokeWidth="2" />
</svg>;

  var rightArrow = 
  <svg width="15" height="10" onClick={() => this.handlePrevOrNext("next")}>
  <line x1="0" y1="5" x2="15" y2="5" stroke="#000000" strokeWidth="3" />
  <line x1="15" y1="5" x2="5" y2="0" stroke="#000000" strokeWidth="2" />
  <line x1="15" y1="5" x2="5" y2="10" stroke="#000000" strokeWidth="2" />
</svg>;
    /*
	return(
	<div className="Core-window">
          <p>Welcome to HelpYourselfSolar.com where you can get the best solar system at the best prices!</p>
          <div className="Lower-core">
            <span>Get Started</span>
            <span><button onClick={() => this.navigate("learn")}>Learn More</button></span>
          </div>
	</div>
	);
        */
    // thinking about defining a navigation object 
  var navigationObj =  {};
  navigationObj.home = ["about solar", "about helpyourselfsolar"];
  console.log("page is ", this.state.page);
  console.log("is the page  = ", navigationObj[this.state.page][0]);
    //
    //  can I do that and include the name of the component?
    //      `
                        
        return(
          <div className="Core-window1">
            <div className="breadcrumb">
              Here -> is -> the -> breadcrumb -> navigation
            </div>
            <div className="Core-window2">
              <div className="parent">
                <p>Welcome to HelpYourselfSolar.com where you can get the best solar system at the best prices!</p>
                <div className="Lower-core">
                  <span>Get Started</span>
                  <span><button onClick={() => this.navigate("learn")}>Learn More</button></span>
                </div>
              </div>
              <div className="Core-window-main">
                <span>About How Solar Works?</span>
                <span>About How HelpYourselfSolar Works?</span>
              </div>
            </div>
          </div>
	);
    }
}

const Modal = ({ handleClose, fetchdata, handleFileChange, handleUpload, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return(
    <div className={showHideClassName}>
    {children}
    <button onClick={handleClose} className="modal-button">close</button>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
// ReactDOM.render(<App />, container);

export default Core 

class AddAnswer extends Component {

  constructor() {
    super();
    this.state = {
      answer: '',
      warning: '',
    }
  }
  
  // doesn't this really belong in Answer?
  // if you submit a blank answer after another non-blank answer
  // it repeats the same answer
  handleSubmit = (event) => {
    event.preventDefault();
    const fd = new FormData();
    fd.append('answer', this.state.answer);
    fd.append('imageId', this.props.imageId);
    fd.append('user_id', this.props.user.userId);
    fd.append('sessionvalue', this.props.user.sessionvalue);
    document.getElementById('answerbox').value = '';
    fetch( this.props.DATA_URI + '/answer', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials : 'same-origin',
      body: fd, 
    })
    .then((response) => response.json())
    .then((data) => {
          if (data.error) {
            this.setState( { warning : data.error } );
            return null;
          } else {
            this.setState( { warning : '' } );
          }
          this.props.refresh();
    })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem submitting the answer.' } );
	  console.log(error);
    });
  }

  handleChange = event => {
     this.setState({ answer: event.target.value });
  }

  renderWarning() {
    if (this.state.warning) {
      return(
        <div>
        <font color='red'>{this.state.warning}</font><br />
        </div>
      );
    }
  }

  scrollToMyRef = () => {
    window.scrollTo({
      top:this.myRef.current.OffsetTop,
      behavior: "smooth"
    });
  }

  render() {
    return(
      <div ref={this.myRef} className="Answer-box">
      {this.renderWarning()}
      <div>What is it?</div>
      <form onSubmit={this.handleSubmit} className="Answer-box">
      <input type="text" onChange={this.handleChange} id="answerbox"/>
      <input type="submit" value="Submit Answer" />
      </form>
      <button type="button" onClick={this.props.showModal} className="Answer-box">
      Upload New Image
      </button>
      </div>
    );
  }
}

