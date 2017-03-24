import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DATA from './data';
import Moment from 'react-moment';
import moment from 'moment';
import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

const AUDIENCE_OPTIONS = [
  { value: 'Adults', label: 'Adults' },
  { value: 'Women', label: 'Women' },
  { value: 'Kids', label: 'Kids' },
  { value: 'Beginners', label: 'Beginners' }
];

const EVENT_TYPE_OPTIONS = [
  { value: 'Pathway', label: 'Pathway' },
  { value: 'Road', label: 'Road' },
  { value: 'Off road', label: 'Off road' },
  { value: 'Long road', label: 'Long road' },
  { value: 'Workshop', label: 'Workshop' }
];

const TIME_OF_DAY_OPTIONS = [
  { value: 'Morning', label: 'Morning' },
  { value: 'Afternoon', label: 'Afternoon' },
  { value: 'Evening', label: 'Evening' }
];


const DAY_OF_WEEK_OPTIONS = [
  { value: 'Weekday', label: 'Weekday' },
  { value: 'Weekend', label: 'Weekend' }
];


class Row extends Component {
  locationDisplay() {
    const rowData = this.props.rowData;
    if (!!rowData.Pathway) { return 'Pathway';}
    if (!!rowData.Road) { return 'Road'; }
    if (!!rowData['Off road']) { return 'Off road'; }
    if (!!rowData['Long road']) { return 'Long road'; }
    if (!!rowData.Workshop) { return 'Workshop'; }
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
    return _makeDatetime(rowData);
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

function _makeDatetimeString(dataItem) {
  const month = dataItem.Date.split('-')[1];
  const day = dataItem.Date.split('-')[0];
  const time = dataItem.Time;
  const ampm = dataItem.timeOfDay;

  return [month, day, time, ampm].join(' ');
}

function _makeDatetime(dataItem) {
  return moment(_makeDatetimeString(dataItem), 'MMMM DD hh:mm a');
}

function _makeTime(dataItem) {
  return moment(_makeDatetimeString(dataItem), 'hh:mm a');
}


function dateTimeCompare(a, b) {
  const date1 = _makeDatetime(a);
  const date2 = _makeDatetime(b)
  if (date1 < date2) { return -1 }
  if (date1 > date2) { return 1 };
  return 0;
}

function timeCompare(a, b) {
  const time1 = _makeTime(a);
  const time2 = _makeTime(b);
  if (time1 < time2) { return -1 }
  if (time1 > time2) { return 1 }
  return 0

}


class App extends Component {

  constructor(props) {
    super(props);
    this.data = DATA;

    this.state = {
      filteredData: this.sortByDateTime(DATA),
      selectedAudienceFilter: 'Adults',
      selectedEventTypeFilter: 'Workshop',
      selectedTimeOfDayFilter: 'Evening',
      selectedDayOfWeekFilter: 'Weekday'
    }
  }

  sortByDateTime() {
    return this.data.sort(dateTimeCompare);
  }

  sortByTime() {
    return this.data.sort(timeCompare);
  }

  filterMethod(selectOption) {
    const filteredRows = this.data.filter((row) => {
      return !!row[selectOption.value];
    });

    this.setState({ filteredData: filteredRows });
  }

  filterByAudience(option) {
    this.setState({ selectedAudienceFilter: option.value });
    this.filterMethod(option);
  }


  filterByEventType(option) {
    this.setState({ selectedEventTypeFilter: option.value });
    this.filterMethod(option);
  }

  filterByTimeOfDay(option) {
    this.setState({ selectedTimeOfDayFilter: option.value });
    this.filterMethod(option);
  }

  filterByDayOfWeek(option) {
    this.setState({ selectedDayOfWeekFilter: option.value });
    this.filterMethod(option);
  }

  render() {

    const rows = this.state.filteredData.map((row) => {
      return (<Row rowData={row} />)
    })

    return (

      <div className="App">
        <div className="App-header">

          <div>
            Filter by audience:
            <Select
              value={this.state.selectedAudienceFilter}
              options={AUDIENCE_OPTIONS}
              onChange={this.filterByAudience.bind(this)}
            />
          </div>
          <div>
            Filter by event type:
            <Select
              value={this.state.selectedEventTypeFilter}
              options={EVENT_TYPE_OPTIONS}
              onChange={this.filterByEventType.bind(this)}
            />
          </div>

          <div>
            Filter by time of day:
            <Select
              value={this.state.selectedTimeOfDayFilter}
              options={TIME_OF_DAY_OPTIONS}
              onChange={this.filterByTimeOfDay.bind(this)}
            />
          </div>


          <div>
            Filter by day of week:
            <Select
              value={this.state.selectedDayOfWeekFilter}
              options={DAY_OF_WEEK_OPTIONS}
              onChange={this.filterByDayOfWeek.bind(this)}
            />
          </div>


          <div>filter by audience</div>
          <div>filter by event type</div>
          <div>filter by time of day (morning, afternoon, evening)</div>
          <div>am/pm checkbox</div>
          <div>sort by date/time</div>
        </div>
        <div>
          <div className="row header">
            <div className='cell name'>
              Event <span>(sort)</span>
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
