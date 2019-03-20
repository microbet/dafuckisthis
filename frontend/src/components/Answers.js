import React, { Component } from 'react';
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
		  mostVotedAnswerBatch : 0,
      most : 'netUp',
      scrollTimer : true,
    //  userId : this.props.user.userId,
    }
  }

  componentDidMount() {
//    document.getElementById('answerBox').addEventListener('scroll', this.handleScroll);
   // if (this.props.image.imageId) {
      // did this happen and with what image id when you first hit most answered
    //  console.log("what imageid = ", this.props.image.imageId);
      this.fetchData();
      this.fetchMost(this.state.most);
   // }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
 //   ReactDOM.findDOMNode(this).addEventListener('scroll', this.handleScroll);
  }
  
  componentWillReceiveProps(answerToggle) {
    if (this.props.image.imageId) {
	  this.fetchData();
	  this.fetchMost(this.state.most); // this should probably be set in state
    }
  }

  fetchMost(type) {
    let endpoint;
    if (type === 'netUp') { endpoint = '/get_most_net_upvoted'; }
    if (type === 'netDown') { endpoint = '/get_most_net_downvoted'; }
    if (type === 'mostUp') { endpoint = '/get_most_upvoted'; }
    if (type === 'mostDown') { endpoint = '/get_most_downvoted'; }
    if (type === 'most') { endpoint = '/get_most_voted'; }
	  let retArr = [];
	  fetch( this.props.DATA_URI + endpoint + "?imageId=" + this.props.image.imageId, {
		  method: 'GET',
		  headers: { 'Accept': 'application/json' },
		  credentials: 'same-origin',
	  })
	  .then(response => response.json())
	  .then(data => {
		  data.forEach(function(element) {
			  retArr.push([element['answer'], element['answerId'], 
              element['up'], element['down']]);
      });
      this.setState( { mostVotedAnswerBatch : retArr } )
      })
      .catch(error => {
        console.log("error: ", error);
      })
  }
  
  fetchData() {
    let retArr = [];
    fetch( this.props.DATA_URI + "/get_answers?imageId=" + this.props.image.imageId + "&answerId=" + 0, { 
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
  
// just for diagnostics 
 sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    document.getElementById('answerBox').scrollTop = 506;
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


  // dunno if this should be a separate function from fetchData or not, maybe combine later
  fetchAnswer(answerId, imageId, direction) {   // (direction is 'next' or 'previous'
    fetch( this.props.DATA_URI + "/get_answer?imageId=" + imageId + 
      "&answerId=" + answerId + "&direction=" + direction, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }, 
      credentials : "same-origin" } )
      .then(response => response.json())
      .then(data =>  {
        if (data.response === 'done') {
          // do something to the next or previous button here
          if (direction === 'next') {
            document.getElementById('nextMainImage').setAttribute("style", "background-color: #636363;");
            document.getElementById('nextMainImage').setAttribute("disabled", "true;");
          }
          if (direction === 'previous') {
            document.getElementById('previousMainImage').setAttribute("style", "background-color: #636363;");
            document.getElementById('previousMainImage').setAttribute("disabled", "true;");
          }
          return null;
        } else {
          document.getElementById('previousMainImage').setAttribute("style", "background-color: null;");
          document.getElementById('nextMainImage').setAttribute("style", "background-color: null;");
          document.getElementById('previousMainImage').removeAttribute("disabled", "true;");
          document.getElementById('nextMainImage').removeAttribute("disabled", "true;");
        }

	      let tempArr = this.state.answerBatch;
        if (direction === 'next') {
	        tempArr.push([data[0]['answer'], data[0]['answerId'],
            data[0]['up'], data[0]['down']]);
	        tempArr.shift();
        //  setTimeout(function() {
        //    document.getElementById('answerBox').scrollTop = 506;
        //  }, 500);
        }
        if (direction === 'previous') {
          tempArr.splice(0,0,[data[0]['answer'], data[0]['answerId'], 
            data[0]['up'], data[0]['down']]);
          tempArr.pop();
        }
	      this.setState( { answerBatch : tempArr } );
        if (direction === 'next') {
	        this.setState( { oldestAnswerId : data[0]['answerId'] } );
          this.setState( { newestAnswerId : tempArr[0][1] } );
        }
        if (direction === 'previous') {
          this.setState( { newestAnswerId : data[0]['answerId'] } );
          this.setState( { oldestAnswerId : tempArr[9][1] } );
        }
    //    if (this.state.scrollTimer) {
    //      this.timer = setInterval(() => {
    //        this.handleScroll();
    //      }, 1000);
    //      this.setState( { scrollTimer : false } );
    //    }
      })
      .catch(error => {
        console.log("error: ", error);
      })
  }

  /*
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
  */

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
	  .then(data => {
		  this.buildBatch(data['answer_id'], data['up'], data['down'])
	  })
      .catch(error => {
        console.log("error: ", error);
      });
    }
  }
  
  buildBatch = (answerId, up, down) => {
    let i = 0;
    let tempArr = this.state.answerBatch;
    this.state.answerBatch.forEach( function(element) {
	  if (element[1] === parseInt(answerId)) {
		tempArr[i][2] = up;
        tempArr[i][3] = down;
      }
	  i++;
    });
    this.setState({ answerBatch : tempArr });
  }

  /*
  handleScroll = (event) => {
    console.log("hwkhj");
     if (ReactDOM.findDOMNode(this).scrollHeight - ReactDOM.findDOMNode(this).offsetHeight - 1 < ReactDOM.findDOMNode(this).scrollTop) {
       this.fetchNextAnswer(this.state.oldestAnswerId, this.props.imageId);
     } else if (ReactDOM.findDOMNode(this).scrollTop === 0) {
       this.fetchPreviousAnswer(this.state.newestAnswerId, this.props.imageId);
     } else {
       clearInterval(this.timer);
       this.setState( { scrollTimer : true } );
     }
  }
  */
  //  document.getElementById('answerBox').addEventListener('scroll', this.handleScroll);

  handleScroll = (event) => {
     if (document.getElementById('answerBox').scrollHeight - document.getElementById('answerBox').offsetHeight === document.getElementById('answerBox').scrollTop) {
       this.fetchAnswer(this.state.oldestAnswerId, this.props.image.imageId, 'next');
     } else if (document.getElementById('answerBox').scrollTop === 0) {
       this.fetchAnswer(this.state.newestAnswerId, this.props.image.imageId, 'previous');
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
             <ul key={element[1]} className="Answer-list">{element[0]}
             <div onClick={this.handleUlClick} thisanswerid={element[1]} vote="up"
				key={element[1] + 'upvote'}>{ this.props.user.userId ? "thumbup " : null }</div>
				<div> { element[2] } up</div>
			<div onClick={this.handleUlClick} thisanswerid={element[1]} vote='down'
				key={element[1] + 'downvote'}>{ this.props.user.userId ? "thumbdown " : null }</div>
				<div> { element[3] } down</div>	
             </ul>);
        });
      }
    }
	let mostVotedDisplay = []
	if (Array.isArray(this.state.mostVotedAnswerBatch)) {
		if (this.state.mostVotedAnswerBatch.length > 0) {
			this.state.mostVotedAnswerBatch.forEach((element) => {
				mostVotedDisplay.push(
					<ul key={element[1] + 'mostvoted'}>{element[0]}
			<div thisanswerid={element[1]} vote='up'
				key={element[1] + 'mostVote'}>{ this.props.user.userId ? "thumbup " : null }</div>
				<div> { element[2] } up</div>
			<div thisanswerid={element[1]} vote='down'
				key={element[1] + 'downvote'}>{ this.props.user.userId ? "thumbdown " : null }</div>
				<div> { element[3] } down</div>
				</ul>);
		});
	  }
	}
	
    return(
	<div className="Answer-box"><center>
      <button onClick={() => {this.fetchAnswer(this.state.oldestAnswerId, this.props.image.imageId, 'next')}} id="nextMainImage">Next</button>
      <button onClick={() => {this.fetchAnswer(this.state.newestAnswerId, this.props.image.imageId, 'previous')}} id="previousMainImage">Previous</button>
      </center>
          <div className="Answer-box1" id="answerBox">
          { display }
		  </div>
			<br />
			<br />
			<div className="answerBox">
     <button onClick={() => {this.fetchMost('netUp')}}>Net Up</button>
     <button onClick={() => {this.fetchMost('netDown')}}>Net Down</button>
     <button onClick={() => {this.fetchMost('mostUp')}}>Most Up</button>
     <button onClick={() => {this.fetchMost('mostDown')}}>Most Down</button>
     <button onClick={() => {this.fetchMost('most')}}>Most</button>
			{ mostVotedDisplay }
          </div>
		  </div>
	);
    }
}

export default Answers 
