/*
import React from 'react'
import { MIEBarChart } from '../Components/MIEBarChart'

export default function Dashboard({ balance, lastFourMonthsData, recentMovements }) {



    return (
        <div>
            <h1>Dashboard</h1>
            <ul>
                <li><b>Balance:</b> {balance}</li>
                <li>
                    <b>Last four months data:</b>
                        <MIEBarChart data={lastFourMonthsData} />                     
                </li>
                <li>
                    <b>Recent movements:</b>
                    <ul>
                        {recentMovements.map((movement) => {
                            return (
                                <li>{movement.label_id} — {movement.amount} — {movement.transaction_date}</li>
                            )
                        })}
                    </ul>
                </li>
            </ul>
        </div>
    )
}
*/