import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1YH5wsTT05BlCfLhal3PoUU--IVeBHVC4CA23fZQuSVI/pubhtml?gid=13692711&single=true';
// var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1YH5wsTT05BlCfLhal3PoUU--IVeBHVC4CA23fZQuSVI/pubhtml?gid=1872620934&single=true';

function init() {
  window.Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: showInfo,
                   simpleSheet: false } );
}

function showInfo(data, tabletop) {
  ReactDOM.render(
    <App data={tabletop.sheets().v3.all()}/>,
    document.getElementById('root')
  );
}

window.addEventListener('DOMContentLoaded', init)


