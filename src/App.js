import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DATA from './data';
import Moment from 'react-moment';
import moment from 'moment';
import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';
const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1YH5wsTT05BlCfLhal3PoUU--IVeBHVC4CA23fZQuSVI/pubhtml?gid=1872620934&single=true';

const AUDIENCE_OPTIONS = [
  { value: 'Adults', label: 'Adults' },
  { value: 'Women', label: 'Women' },
  { value: 'Kids', label: 'Kids' },
  { value: 'Families', label: 'Families' }
];

const EVENT_TYPE_OPTIONS = [
  { value: 'Pathway', label: 'Pathway' },
  { value: 'Road', label: 'Road' },
  { value: 'Road, Relaxed', label: 'Road, Relaxed' },
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

const STARTING_AREA_OPTIONS = [
  { value: "Alden Bridge", label: "Alden Bridge" },
  { value: "Cochrans  Crossing", label: "Cochrans Crossing" },
  { value: "Creekside", label: "Creekside" },
  { value: "Grogans Mill", label: "Grogans Mill" },
  { value: "Indian Springs", label: "Indian Springs" },
  { value: "Panther Creek", label: "Panther Creek" },
  { value: "Sterling Ridge", label: "Sterling Ridge" },
  { value: "Town Center", label: "Town Center" }
];


class Row extends Component {
  locationDisplay() {
    const rowData = this.props.rowData;
    if (!!rowData.Pathway) { return 'Pathway';}
    if (!!rowData.Road) { return 'Road'; }
    if (!!rowData['Off road']) { return 'Off road'; }
    if (!!rowData['Long road']) { return 'Long road'; }
    if (!!rowData.Workshop) { return 'Workshop'; }
    if (!!rowData['Road, Relaxed']) { return 'Road, Relaxed'; }
  }

  audienceDisplay() {
    const rowData = this.props.rowData;
    const audience = [];

    if (rowData.Kids) { audience.push('Kids'); }
    if (rowData.Adults) { audience.push('Adults'); }
    if (rowData.Women) { audience.push('Women'); }
    if (rowData.Families) { audience.push('Families'); }

    return (audience.join(', '));
  }

  datetime() {
    const rowData = this.props.rowData;
    return _makeDatetime(rowData);
  }

  startingLocationDisplay() {
    const rowData = this.props.rowData;
    let location = null;
    STARTING_AREA_OPTIONS.forEach((option) => {
      if (!!rowData[option.value]) {
        location = option.label;
      }
    });
    return location;
  }


  render() {
    return (
    <div className='row clearfix'>
      <div className='cell col col-4 name'>
        {this.props.rowData.Event}
      </div>
      <div className='cell col col-1 day'>
        <Moment format="MMM D">{this.datetime()}</Moment>
      </div>
      <div className='cell col col-2 time'>
        <Moment format="h:mm a">{this.datetime()}</Moment>
      </div>
      <div className='cell col col-2 audience'>
        {this.audienceDisplay()}
      </div>
      <div className='cell col col-2 location'>
        {this.locationDisplay()}
      </div>
      <div className='cell col col-3 location'>
        {this.startingLocationDisplay()}
      </div>
    </div>)
  }
}

function _makeDatetimeString(dataItem) {
  const month = dataItem.Date.split('-')[1];
  const day = dataItem.Date.split('-')[0];
  const time = dataItem.Time;
  // const ampm = dataItem.timeOfDay;

  return [month, day, time].join(' ');
}

function _makeDatetime(dataItem) {
  return moment(_makeDatetimeString(dataItem), 'MMMM DD hh:mma');
}

function _makeTime(dataItem) {
  return moment(_makeDatetimeString(dataItem), 'hh:mma');
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
    this.data =  this.props.data;

    this.state = {
      filteredData: this.props.data,
      selectedAudienceFilter: null,
      selectedEventTypeFilter: null,
      selectedTimeOfDayFilter: null,
      selectedDayOfWeekFilter: null
    }
  }

  sortByDateTime() {
    return this.data.sort(dateTimeCompare);
  }

  sortByTime() {
    return this.data.sort(timeCompare);
  }

  _filterMethod(data, value) {
    const x = data.filter((row) => {
      return !!row[this.state[value]]
    });
    return x
  }

  filterMethod() {
    let filteredRows = Array.prototype.slice.apply(DATA);//   this.data;
    const _this = this;
    ['selectedAudienceFilter',
     'selectedEventTypeFilter',
     'selectedTimeOfDayFilter',
     'selectedDayOfWeekFilter',
     'selectedStartingLocationFilter'].forEach(function(filterString) {
       if (!!_this.state[filterString]) {
        filteredRows = _this._filterMethod(filteredRows, filterString);
       }
     });
     _this.setState({ filteredData: filteredRows });
  }

  filterBy(filterName, option) {
    // 1. Get existing list of filters from this.state, store in local var
    // 2. Update newFilterSet of filters by adding [filterName]: option.value or null
    // 3. Compute newFilteredData using this new list of filters
    // 4. setState({filteredData: newFilteredData, filters: newFilterSet})
    //
    if (option) {
      this.setState({ [filterName]: option.value });
      setTimeout(() => {
        this.filterMethod();
      }, 1);
    } else {
      this.setState({ [filterName]: null })
      setTimeout(() => {
        this.filterMethod();
      }, 1);
    }
  }

  filterByAudience(option) {
    this.filterBy('selectedAudienceFilter', option)
  }

  filterByEventType(option) {
    this.filterBy('selectedEventTypeFilter', option)
  }

  filterByTimeOfDay(option) {
    this.filterBy('selectedTimeOfDayFilter', option)
  }

  filterByDayOfWeek(option) {
    this.filterBy('selectedDayOfWeekFilter', option)
  }

  filterByStartingLocation(option) {
    this.filterBy('selectedStartingLocationFilter', option)
  }

  clearFilters() {
    this.setState({
      filteredData: this.data,
      selectedAudienceFilter: null,
      selectedEventTypeFilter: null,
      selectedTimeOfDayFilter: null,
      selectedDayOfWeekFilter: null,
      selectedStartingLocationFilter: null
    })
  }

  render() {
    const rows = this.state.filteredData.map((row) => {
      return (<Row rowData={row} />)
    })

    return (
      <div className="App">
        <div className="picture-header">
          <h1>Bike Month 2017</h1>
          <h1>in The Woodlands</h1>
          <div className="photo-attribution">
            <a href="https://www.flickr.com/photos/eleaf/2562658408/in/photolist-4Usi4E-4Uo4Jk-cdZDWQ-f9ztwp-EkNaev-8P9xaj-9Sfuuf-ofR5Rq-5ntxjh-8YgXoS-93xJb2-9RY3Ma-8e6jpT-obYd9y-7D4Vmb-pcyWYn-pT9cTi-FxX789-uypKTW-k5Ee8V-kWEEEg-a2L82a-4UshrS-4Uo4UV-o8KCbS-dseySr-4Uo5ft-4Uo2uZ-eheECF-ckfm7C-d8BqmL-4Uo574-9tG11T-oxdGqy-4uML4R-rQM91j-kYmC4E-ckfHzA-hoJrJN-9Mfjux-czzpey-dsn4kg-5yxST9-7ZZ9nA-4DixfL-d5j2CC-ckfkcU-7n995Q-mLyCiX-9Mi7Zs">
              Iron Horse Bicycle Race Durango Women 9 by Ethan Lofton
            </a>
          </div>
        </div>
        <div className="App-header filter-header">

          <div className="filter">
            <div className="filter-title">Filter by time of day:</div>
            <Select
              value={this.state.selectedTimeOfDayFilter}
              options={TIME_OF_DAY_OPTIONS}
              onChange={this.filterByTimeOfDay.bind(this)}
              placeholder="Time of day…"
            />
          </div>

          <div className="filter">
            <div className="filter-title">Filter by day of week:</div>
            <Select
              value={this.state.selectedDayOfWeekFilter}
              options={DAY_OF_WEEK_OPTIONS}
              onChange={this.filterByDayOfWeek.bind(this)}
              placeholder="Day of week…"
            />
          </div>

          <div className="filter">
            <div className="filter-title">Filter by demographic:</div>
            <Select
              value={this.state.selectedAudienceFilter}
              options={AUDIENCE_OPTIONS}
              onChange={this.filterByAudience.bind(this)}
              placeholder="Demographic…"
            />
          </div>

          <div className="filter">
            <div className="filter-title">Filter by event type:</div>
            <Select
              value={this.state.selectedEventTypeFilter}
              options={EVENT_TYPE_OPTIONS}
              onChange={this.filterByEventType.bind(this)}
              placeholder="Event type…"
            />
          </div>


          <div className="filter">
            <div className="filter-title">Filter by Village:</div>
            <Select
              value={this.state.selectedStartingLocationFilter}
              options={STARTING_AREA_OPTIONS}
              onChange={this.filterByStartingLocation.bind(this)}
              placeholder="Village…"
            />
          </div>

          <div className="filter">
            <div className="clear-button" onClick={this.clearFilters.bind(this)}>Clear filters</div>
          </div>

        </div>

        <div className="table">
          <div className="row header clearfix">
            <div className='cell name col col-4'>
              Event <span>(sort)</span>
            </div>
            <div className='cell col day col-1'>
              Date
            </div>
            <div className='cell col time col-2'>
              Time
            </div>
            <div className='cell col audience col-2'>
              Demographic
            </div>
            <div className='cell col location col-2'>
              Event Type
            </div>
            <div className='cell col location col-3'>
              Starting Location
            </div>
          </div>
          {rows}
        </div>
      </div>

    );
  }
}


export default App;
