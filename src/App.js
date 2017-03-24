import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DATA from './data';
import Moment from 'react-moment';
import moment from 'moment';


class Row extends Component {
  locationDisplay() {
    const rowData = this.props.rowData;
    if (!!rowData.Pathway) { return 'Pathway';}
    if (!!rowData.Road) {return 'Road';}
    if (!!rowData['Off road']) {return 'Off road';}
    if (!!rowData['Long road']) {return 'Long road';}
    if (!!rowData.Workshop) {return 'Workshop';}
  }

  audienceDisplay() {
    const rowData = this.props.rowData;
    const audience = [];

    if (rowData.Kids) { audience.push('Kids'); }
    if (rowData.Adults) { audience.push('Adults'); }
    if (rowData.Women) { audience.push('Women'); }
    if (rowData.Beginners) { audience.push('Beginners'); }

    return (audience.join(', '));
  }

  datetime() {
    const rowData = this.props.rowData;

    const month = rowData.Date.split('-')[1];
    const day = rowData.Date.split('-')[0];
    const time = rowData.Time;
    const ampm = rowData.timeOfDay;

    const datetimeString = [month, day, time, ampm].join(' ');

    return moment(datetimeString, 'MMMM DD hh:mm a');
  }


  render() {
    return (
    <div className='row'>
      <div className='cell name'>
        {this.props.rowData.Event}
      </div>
      <div className='cell day'>
        <Moment format="MMM D">{this.datetime()}</Moment>
      </div>
      <div className='cell time'>
        <Moment format="h:mm a">{this.datetime()}</Moment>
      </div>
      <div className='cell audience'>
        {this.audienceDisplay()}
      </div>
      <div className='cell location'>
        {this.locationDisplay()}
      </div>
    </div>)
  }
}

class App extends Component {
  render() {
    const rows = DATA.map((row) => {
      return (<Row rowData={row} />)
    })

    return (

      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React HELLO</h2>
        </div>
        <div>
          <div className="row header">
            <div className='cell name'>
              Event
            </div>
            <div className='cell day'>
              Date
            </div>
            <div className='cell time'>
              Time
            </div>
            <div className='cell audience'>
              Audience
            </div>
            <div className='cell location'>
              Event Type
            </div>
          </div>
          {rows}
        </div>
      </div>

    );
  }
}

export default App;
