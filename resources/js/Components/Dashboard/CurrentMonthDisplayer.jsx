import React from 'react';

const CurrentMonthDisplayer = ({ currentMonthData }) => {
    const balance = currentMonthData['Balance'];
    const income = currentMonthData['Income'];
    const expenses = currentMonthData['Expenses'];

    return (
        <div className="flex flex-col sm:flex-row w-full justify-between gap-4 sm:gap-8 lg:gap-12">
            <div className="flex-1 max-w-none sm:max-w-[200px]">
                <h3 className="text-[var(--color-neutral-bright)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold font-[var(--font-general)] mb-2">
                    Saldo
                </h3>
                <div className="text-[var(--color-neutral-bright)] text-xl sm:text-2xl lg:text-3xl xl:text-[2.25rem] font-bold font-[var(--font-numeric)]">
                    € {balance}
                </div>
            </div>
            <div className="flex-1 max-w-none sm:max-w-[200px]">
                <h3 className="text-[var(--color-neutral-bright)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold font-[var(--font-general)] mb-2">
                    Ingresos
                </h3>
                <div className="text-[var(--color-success)] text-xl sm:text-2xl lg:text-3xl xl:text-[2.25rem] font-bold font-[var(--font-numeric)]">
                    € {income}
                </div>
            </div>
            <div className="flex-1 max-w-none sm:max-w-[200px]">
                <h3 className="text-[var(--color-neutral-bright)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold font-[var(--font-general)] mb-2">
                    Gastos
                </h3>
                <div className="text-[var(--color-error)] text-xl sm:text-2xl lg:text-3xl xl:text-[2.25rem] font-bold font-[var(--font-numeric)]">
                    € {expenses}
                </div>
            </div>
        </div>
    );
};

export default CurrentMonthDisplayer;