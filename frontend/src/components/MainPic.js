import React, { Component } from 'react';
import Answers from './Answers';
import './MainPic.css';

class MainPic extends Component {
	constructor(){
		super();
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
                        imageId: null,
                }
	}

  showModal = () => {
    this.setState({ show: true });
  }
  
  hideModal = () => {
    this.setState({ show: false });
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
        imageId : data.message,
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
      body: fd
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState( { showFileUpload : false } );
      this.setState( { showCaption : false } );
    })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem adding the caption' } );
    });
  }

  fetchData() {
		 fetch( this.props.DATA_URI + "/getimage?selected_image=" + this.props.selectedImage)
			.then(response => response.json())
         .then(data =>  {
           this.setState( { 
             mainPicPath : data.imagePath,
             mainPicCaption : data.caption,
             flaskMessage : data.message,
             imageId : data.image_id,
           })
           console.log("here imageid is ", this.state.imageId);
           console.log("here mpp is ", this.state.mainPicPath);
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
        Upload new pic<br />
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
      <button onClick={this.handleCaption}>Submit</button>
        </div>
      );
    }
  }
			
  render() {
	return(
		<div>
		   <img src={ this.props.DATA_URI + this.state.mainPicPath } alt='whatisthis' /> 
		<br />
		{ this.state.mainPicCaption }
        <br />
         <AddComment DATA_URI={this.props.DATA_URI} imageId={this.state.imageId}/>
          { this.state.imageId && <Answers imageId={this.state.imageId} DATA_URI={this.props.DATA_URI} /> }
         <Modal show={this.state.show} handleClose={this.hideModal} handleFileChange={this.handleFileChange} handleUpload={this.handleUpload}>
                  {this.renderFileUpload()}
                  {this.renderCaption()}
                  <p>Modal</p>
                  <p>Datapi</p>
          </Modal>
           <button type="button" onClick={this.showModal}>
          open
         </button>
	</div>
	);
    }
}

const Modal = ({ handleClose, handleFileChange, handleUpload, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  // console.log("children are ", children);
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
    fetch( this.props.DATA_URI + '/comment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: fd
    })
    .then((response) => response.json())
    .then((data) => { console.log(data); })
    .catch((error) => { 
      this.setState( { warning : 'There was a problem uploading the file' } );
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

  render() {
    return(
      <div>
      {this.renderWarning()}
      <input type="text" onChange={this.handleChange}/>
      <button onClick={this.handleSubmit}>Make Comment</button>
      </div>
    );
  }
}

