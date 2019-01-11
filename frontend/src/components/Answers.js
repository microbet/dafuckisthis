import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MainPic.css';

class Answers extends Component {
  constructor(props){
    super(props);
	this.state = {
          commentBatch : [],
          oldestAnswerId : 0,
          newestAnswerId : 0,
          scrollTimer : true,
        }
  }

  componentDidMount() {
    this.fetchData(0);
    ReactDOM.findDOMNode(this).addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // get the 10 most recent answers- must also know the comment
  // id so you can go back and get the 10 before that
  fetchData(oldestAnswerId) {
    let retArr = [];
    fetch( this.props.DATA_URI + "/get_answers?imageId=" + this.props.imageId + "&answerId=" + oldestAnswerId)
      .then(response => response.json())
      .then(data =>  {
         let thisOldAnswerId = 0;
         let thisNewAnswerId = 0;
         data.forEach(function(element) {
           retArr.push([element['answer'], element['answerId']]);
	   if (thisOldAnswerId == 0) {
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
         this.setState( { commentBatch : retArr } )
         this.setState({ oldestAnswerId : thisOldAnswerId })
         this.setState({ newestAnswerId : thisNewAnswerId })
      })
      .catch(error => {
        console.log("error: ", error);
      })
  }
  
  // dunno if this should be a separate function from fetchData or not, maybe combine later
  fetchNextAnswer(answerId, imageId) {
    fetch( this.props.DATA_URI + "/get_next_answer?imageId=" + imageId + "&answerId=" + answerId)
      .then(response => response.json())
      .then(data =>  {
		  if (data.response != 'oldest') {
			let tempArr = this.state.commentBatch;
			tempArr.push([data[0]['answer'], data[0]['answerId']]);
			tempArr.shift();
			this.setState( { commentBatch : tempArr } );
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
    fetch( this.props.DATA_URI + "/get_previous_answer?imageId=" + imageId + "&answerId=" + answerId)
      .then(response => response.json())
      .then(data => {
        if (data.response != 'newest') {
          let tempArr = this.state.commentBatch;
          tempArr.splice(0,0,[data[0]['answer'], data[0]['answerId']]);
          tempArr.pop();
          this.setState( { commentBatch : tempArr } );
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
    if (Array.isArray(this.state.commentBatch)) {
      if (this.state.commentBatch.length > 0) {
        this.state.commentBatch.map((element, index) => {
         display.push(<ul>{element[0]}</ul>);
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
