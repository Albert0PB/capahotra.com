import React from 'react';
import '../../../css/Components/Dashboard/currentMonthDisplayer.css';

const CurrentMonthDisplayer = ({ currentMonthData }) => {

    const balance = currentMonthData['Balance'];
    const income = currentMonthData['Income'];
    const expenses = currentMonthData['Expenses'];

    return (
        <div className='current-month-displayer'>
            <div className='current-month-balance current-month-display-element'>
                <h3>Balance</h3>
                <div className="value-balance numeric">€ {balance}</div>
            </div>
            <div className="current-month-income current-month-display-element">
                <h3>Income</h3>
                <div className="value-income numeric">€ {income}</div>
            </div>
            <div className="current-month-expenses current-month-display-element">
                <h3>Expenses</h3>
                <div className="value-expenses numeric">€ {expenses}</div>
            </div>
        </div>
    );
};

export default CurrentMonthDisplayer;