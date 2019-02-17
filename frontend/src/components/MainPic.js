import React, { Component } from 'react';
import './MainPic.css';
import Answers from './Answers';

class MainPic extends Component {
  constructor(props){
    super(props);
    this.state = {
      show: false,
      isLoading: true,
      mainPicPath : '',
      mainPicCaption : '',
      flaskMessage : '',
      error: null,
      imageId: null,
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
      this.setState( { 
        showFileUpload : false,
        showCaption : true,
        showPreview: true,
        imageId : data.image_id,
        imagePath : data.imagePath,
      } );
    })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem uploading the file' } );
    });
  }

  handleCaption = () => {
    
    const fd = new FormData();
    fd.append('caption', this.state.caption);
    fd.append('imageId', this.state.imageId);
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
    fetch( this.props.DATA_URI + "/get_image?imageId=" + this.state.imageId
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
             imageId : data.image_id,
           })
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

  componentDidMount() {
    this.fetchData();
  }

  renderFileUpload() {
    if (this.state.showFileUpload) {
      return (
        <div>
        <font color='white'>Upload new pic</font><br />
      <input type="file" onChange={this.handleFileChange}/>
      <button onClick={this.handleUpload}>Upload</button>
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
    fetch( this.props.DATA_URI + '/get_image?imageId='+this.state.imageId+
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
             imageId : data.image_id,
        })
        if (data.imagePosition === 'last') {
          this.setState( { showNext : false, showPrev : true } );

        } else if (data.imagePosition === 'first') {
          this.setState( { showPrev : false, showNext : true } );
        } else {
          this.setState( { showNext : true, showPrev : true } );
        }
	this.props.refresh();
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
  }

  handleNewImageChange = event => {
    this.setState({ newImageId : event.target.value });
  }

  setImage = (event) => {
    event.preventDefault();
    this.setState({ imageId : this.state.newImageId, selectedImage : '' }, () => this.fetchData());
  }


  render() {
   // console.log(window.document.getElementsByTagName('body')[0].clientWidth);
  //  console.log(window.document.getElementsByTagName('body'));
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

	return(
		<div>
          <button onClick={() => {this.sortPic('latest')}}>Most Recent</button>
            <button onClick={() => {this.sortPic('mostAnswers')}}>Most Answers</button>
      { (this.props.user.userId && (this.state.selectedImage !== 'user')) ? <button onClick={() => {this.sortPic('user')}}>Your Pics</button> : null }
      { (this.props.user.userId && (this.state.selectedImage === 'user')) ? <button onClick={() => {this.sortPic('user')}}>All Pics</button> : null }
              <br />
          { this.state.showPrev ? <span>{leftArrow}<button onClick={() => {this.handlePrevOrNext('previous')}}>Prev</button>&nbsp;&nbsp;&nbsp;</span> : null }  { this.state.showNext ? <span>&nbsp;&nbsp;&nbsp;<button onClick={() => {this.handlePrevOrNext('next')}}>Next</button>{rightArrow}</span> : null }
          <div className="Main-image">
		   <img src={ this.props.DATA_URI + this.state.mainPicPath } alt='whatisthis' /><br />
          </div>
          <span style={caption}>
		{ this.state.mainPicCaption }
  </span>
		<br />
        <br />
         <AddAnswer DATA_URI={this.props.DATA_URI} user={this.props.user} imageId={this.state.imageId} refresh={this.props.refresh} triggerAnswers={this.triggerAnswers}/>
          { this.state.imageId && <Answers imageId={this.state.imageId} DATA_URI={this.props.DATA_URI} trigger={this.state.trigger} unTriggerAnswers={this.unTriggerAnswers} triggerAnswers={this.triggerAnswers} user={this.props.user} refresh={this.props.refresh} answerToggle={this.props.answerToggle} /> }
         <Modal show={this.state.show} handleClose={this.hideModal} fetchdata={this.fetchdata} handleFileChange={this.handleFileChange} handleUpload={this.handleUpload} >
                  {this.renderFileUpload()}
                  {this.renderCaption()}
                  {this.previewPic()}
          </Modal>
           <button type="button" onClick={this.showModal}>
         Upload 
         </button>
          <form onSubmit={this.setImage}>
          <input type="text" onChange={this.handleNewImageChange} />
          <input type="submit" value="submit" />
          </form>
	</div>
	);
    }
}

const Modal = ({ handleClose, fetchdata, handleFileChange, handleUpload, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return(
    <div className={showHideClassName}>
    <section className="modal-main">
    {children}
    <button onClick={handleClose}>close</button>
    </section>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
// ReactDOM.render(<App />, container);

export default MainPic

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
      this.setState( { warning : 'There was a problem uploading the file' } );
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
      <form onSubmit={this.handleSubmit}>
      <input type="text" onChange={this.handleChange} id="answerbox"/>
      <input type="submit" value="Submit Answer" />
      </form>
      </div>
    );
  }
}

