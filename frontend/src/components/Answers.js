import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MainPic.css';
// import User from '../User';

class Answers extends Component {
  constructor(props){
    super(props);
  //  var user = new User();
    this.state = {
          answerBatch : [], // [ [answer, answerId, up, down], ... ]
          oldestAnswerId : 0,
          newestAnswerId : 0,
          scrollTimer : true,
          userId : this.props.user.userId,
    }
  }

  componentDidMount() {
    this.fetchData(0);
    ReactDOM.findDOMNode(this).addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  fetchData(oldestAnswerId) {
    let retArr = [];
    fetch( this.props.DATA_URI + "/get_answers?imageId=" + this.props.imageId + "&answerId=" + oldestAnswerId, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }, 
      credentials : "same-origin" 
      } )
      .then(response => response.json())
      .then(data =>  {
         let thisOldAnswerId = 0;
         let thisNewAnswerId = 0;
         data.forEach(function(element) {
           retArr.push([element['answer'], element['answerId'], 
              element['up'], element['down']]);
	   if (thisOldAnswerId === 0) {
              thisOldAnswerId = element['answerId'];
              thisNewAnswerId = element['answerId'];
           } else {
             if (element['answerId'] < thisOldAnswerId) {
               thisOldAnswerId = element['answerId'];
             }
             if (element['answerId'] > thisNewAnswerId) {
               thisNewAnswerId = element['answerId'];
             }
           }
         });
	 retArr = retArr.sort(function(a, b) {
	   return b[1] - a[1];
	 });
         this.setState( { answerBatch : retArr } )
         this.setState({ oldestAnswerId : thisOldAnswerId })
         this.setState({ newestAnswerId : thisNewAnswerId })
      })
      .catch(error => {
        console.log("error: ", error);
      })
  }
  
  // dunno if this should be a separate function from fetchData or not, maybe combine later
  fetchNextAnswer(answerId, imageId) {
    fetch( this.props.DATA_URI + "/get_next_answer?imageId=" + imageId + "&answerId=" + answerId, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }, 
      credentials : "same-origin" } )
      .then(response => response.json())
      .then(data =>  {
        if (data.response !== 'oldest') {
	  let tempArr = this.state.answerBatch;
	  tempArr.push([data[0]['answer'], data[0]['answerId'],
            data[0]['up'], data[0]['down']]);
	  tempArr.shift();
	  this.setState( { answerBatch : tempArr } );
	  this.setState( { oldestAnswerId : data[0]['answerId'] } );
          this.setState( { newestAnswerId : tempArr[0][1] } );
          if (this.state.scrollTimer) {
            this.timer = setInterval(() => {
              this.handleScroll();
            }, 1000);
            this.setState( { scrollTimer : false } );
          }
        }
      })
      .catch(error => {
        console.log("error: ", error);
      })
  }

  fetchPreviousAnswer(answerId, imageId) {
    fetch( this.props.DATA_URI + "/get_previous_answer?imageId=" + imageId + "&answerId=" + answerId, { 
      credentials : "same-origin",
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }, 
    } )
      .then(response => response.json())
      .then(data => {
        if (data.response !== 'newest') {
          let tempArr = this.state.answerBatch;
          tempArr.splice(0,0,[data[0]['answer'], data[0]['answerId'], 
            data[0]['up'], data[0]['down']]);
          tempArr.pop();
          this.setState( { answerBatch : tempArr } );
          this.setState( { newestAnswerId : data[0]['answerId'] } );
          this.setState( { oldestAnswerId : tempArr[9][1] } );

          if (this.state.scrollTimer) {
            this.timer = setInterval(() => {
              this.handleScroll();
            }, 1000);
            this.setState( { scrollTimer : false } );
          }
        }
      })
      .catch(error => {
        console.log("error: ", error);
      })
  }

  handleUlClick = (event) => {
    if (this.props.user.userId) {
      const fd = new FormData();
      fd.append('answer_id', event.target.getAttribute('thisanswerid'));
      fd.append('vote', event.target.getAttribute('vote'));
      fd.append('user_id', this.props.user.userId);
      fd.append('sessionvalue', this.props.user.sessionvalue);
      fetch( this.props.DATA_URI + '/vote', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        },
        credentials : 'same-origin',
        body: fd
      })
      .then(response => response.json())
      .then(this.buildBatch.bind(null, event.target.getAttribute('thisanswer')))
      .catch(error => {
        console.log("error: ", error);
      });
    }
  }

  buildBatch = (attribute, data) => {
    let i = 0;
    let tempArr = this.state.answerBatch;
	console.log("I got here");
	console.log("attribute is ", attribute);
	console.log("data is ", data);
    this.state.answerBatch.forEach( function(element) {
      if (element[1] === attribute) {
		console.log("and I got here too");
        tempArr[i][2] = data[0][2];
        tempArr[i][3] = data[0][3];
      }
    });
    this.setState({ answerBatch : tempArr });
  }

  handleScroll = (event) => {
     if (ReactDOM.findDOMNode(this).scrollHeight - ReactDOM.findDOMNode(this).offsetHeight - 1 < ReactDOM.findDOMNode(this).scrollTop) {
       this.fetchNextAnswer(this.state.oldestAnswerId, this.props.imageId);
     } else if (ReactDOM.findDOMNode(this).scrollTop === 0) {
       this.fetchPreviousAnswer(this.state.newestAnswerId, this.props.imageId);
     } else {
       clearInterval(this.timer);
       this.setState( { scrollTimer : true } );
     }
  }

  render() {
    let display = [];
    if (Array.isArray(this.state.answerBatch)) {
      if (this.state.answerBatch.length > 0) {
        this.state.answerBatch.forEach((element) => {
           display.push(
             <ul key={element[1]}>{element[0]}
             <div onClick={this.handleUlClick} thisanswerid={element[1]} vote="up" 
             key={element[1] + 'up'}>{ this.props.answerToggle ? "thumbup " + element[2]  : "" }
             </div>
             <div onClick={this.handleUlClick} thisanswerid={element[1]} vote="down" 
             key={element[1] + 'down'}>{ this.props.answerToggle ? "thumbdown " + element[3]  : "" }
             </div>
             </ul>);
        });

      }
    }

    return(
          <div className="answerBox">
          {display}
          </div>
	);
    }
}

export default Answers 
