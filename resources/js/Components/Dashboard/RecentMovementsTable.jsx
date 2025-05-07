import { tr } from 'date-fns/locale';
import React from 'react';

const LABELS_ENDPOINT = 'https://capahotra.com/labels';

function getLabelName()
{

}

const RecentMovementsTable = ({ recentMovements }) => {

    console.log(recentMovements);

    return (
        <div className='recent-movements-table'>
            <table>
                <caption><h3>Recent Movements</h3></caption>
                <tbody>
                    {recentMovements.map((movement) => {
                        return (
                            <tr>
                                <td>{movement.label_id}</td>
                                <td>€</td>
                                <td>{movement.amount}</td>
                                <td>{movement.transaction_date}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
};

export default RecentMovementsTable;