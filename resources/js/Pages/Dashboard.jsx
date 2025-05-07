import React from 'react'

import IncomeExpenseChart from '../Components/Dashboard/IncomeExpenseChart'
import CurrentMonthDisplayer from '../Components/Dashboard/CurrentMonthDisplayer';
import RecentMovementsTable from '../Components/Dashboard/RecentMovementsTable';

import { format } from 'date-fns';
import { format as formatWithSuffix } from 'date-fns/format';
import { enUS } from 'date-fns/locale';

function getFormattedDate() {
    return format(new Date(), "do MMMM yyyy", { locale: enUS });
}

export default function Dashboard({ lastFourMonthsData, currentMonthData, recentMovements }) {

    const date = getFormattedDate();

    return (
        <div className='min-h-screen w-full bg-[var(--color-neutral-dark)]'>
            <h1>Your global position</h1>
            <div className='subtitle'>{ date }</div>
            <h2>This month:</h2>
            
            <CurrentMonthDisplayer currentMonthData={currentMonthData} />
            <IncomeExpenseChart dataPoints={lastFourMonthsData} />
            <RecentMovementsTable recentMovements={recentMovements} />

        </div>
    )
}
