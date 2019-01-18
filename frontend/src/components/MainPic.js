import React, { Component } from 'react';
import Answers from './Answers';
import './MainPic.css';

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
                        selectedImage: this.props.selectedImage,
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
    fetch( this.props.DATA_URI + "/getimage?selected_image=" + this.state.selectedImage, {
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
        <img src={this.props.DATA_URI + this.state.imagePath} alt="what is it img" />
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

  render() {
	return(
		<div>
		   <img src={ this.props.DATA_URI + this.state.mainPicPath } alt='whatisthis' /> 
		<br />
		{ this.state.mainPicCaption }
        <br />
         <AddComment DATA_URI={this.props.DATA_URI} user={this.props.user} imageId={this.state.imageId} refresh={this.props.refresh} triggerAnswers={this.triggerAnswers}/>
          { this.state.imageId && <Answers imageId={this.state.imageId} DATA_URI={this.props.DATA_URI} trigger={this.state.trigger} unTriggerAnswers={this.unTriggerAnswers} triggerAnswers={this.triggerAnswers} user={this.props.user} refresh={this.props.refresh} answerToggle={this.props.answerToggle} /> }
         <Modal show={this.state.show} handleClose={this.hideModal} fetchdata={this.fetchdata} handleFileChange={this.handleFileChange} handleUpload={this.handleUpload} >
                  {this.renderFileUpload()}
                  {this.renderCaption()}
                  {this.previewPic()}
          </Modal>
           <button type="button" onClick={this.showModal}>
         Upload 
         </button>
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

class AddComment extends Component {

  constructor() {
    super();
    this.state = {
      comment: '',
      warning: '',
    }
  }
  
  handleSubmit = () => {
    const fd = new FormData();
    fd.append('comment', this.state.comment);
    fd.append('imageId', this.props.imageId);
	fd.append('user_id', this.props.user.userId);
    fd.append('sessionvalue', this.props.user.sessionvalue);
	document.getElementById('commentbox').value = '';
    fetch( this.props.DATA_URI + '/comment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      credentials : 'same-origin',
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
	  this.props.refresh();
    })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem uploading the file' } );
	  console.log(error);
    });
  }

  handleChange = event => {
     this.setState({ comment: event.target.value });
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
      <div ref={this.myRef}>
      {this.renderWarning()}
      <input type="text" onChange={this.handleChange} id="commentbox"/>
      <button onClick={this.handleSubmit}>Make Comment</button>
      </div>
    );
  }
}

