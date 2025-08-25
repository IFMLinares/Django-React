
export default function StocksMetrics() {
    // Datos de ejemplo para las acciones
    const stocks = [
        {
            name: "Apple, Inc",
            subtitle: "AAPL",
            value: "$1,232.00",
            change: "+11.01%",
            changeType: "up",
            logo: "/images/brand/brand-07.svg",
            badgeColor: "success",
        },
        {
            name: "Paypal, Inc",
            subtitle: "PYPL",
            value: "$965.00",
            change: "-9.05%",
            changeType: "down",
            logo: "/images/brand/brand-08.svg",
            badgeColor: "error",
        },
        {
            name: "Tesla, Inc",
            subtitle: "TSLA",
            value: "$1,232.00",
            change: "+11.01%",
            changeType: "up",
            logo: "/images/brand/brand-09.svg",
            badgeColor: "success",
        },
        {
            name: "Amazon.com, Inc",
            subtitle: "AMZN",
            value: "$2,567.00",
            change: "+11.01%",
            changeType: "up",
            logo: "/images/brand/brand-10.svg",
            badgeColor: "success",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {stocks.map((stock) => (
                <div
                    key={stock.name}
                    className="rounded-2xl border border-gray-200 bg-white px-6 pb-5 pt-6 dark:border-gray-800 dark:bg-white/[0.03]"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10">
                            <img alt={stock.name} src={stock.logo} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{stock.name}</h3>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{stock.subtitle}</span>
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">{stock.value}</h4>
                        </div>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm ${stock.badgeColor === "success"
                                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                                    : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                                }`}
                        >
                            <span className="mr-1">
                                {stock.changeType === "up" ? (
                                    <svg className="fill-current" width="1em" height="1em" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.06462 1.62393C6.20193 1.47072 6.40135 1.37432 6.62329 1.37432C6.6236 1.37432 6.62391 1.37432 6.62422 1.37432C6.81631 1.37415 7.00845 1.44731 7.15505 1.5938L10.1551 4.5918C10.4481 4.88459 10.4483 5.35946 10.1555 5.65246C9.86273 5.94546 9.38785 5.94562 9.09486 5.65283L7.37329 3.93247L7.37329 10.125C7.37329 10.5392 7.03751 10.875 6.62329 10.875C6.20908 10.875 5.87329 10.5392 5.87329 10.125L5.87329 3.93578L4.15516 5.65281C3.86218 5.94561 3.3873 5.94546 3.0945 5.65248C2.8017 5.35949 2.80185 4.88462 3.09484 4.59182L6.06462 1.62393Z" fill="" /></svg>
                                ) : (
                                    <svg className="fill-current" width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.31462 10.3761C5.45194 10.5293 5.65136 10.6257 5.87329 10.6257C5.8736 10.6257 5.8739 10.6257 5.87421 10.6257C6.0663 10.6259 6.25845 10.5527 6.40505 10.4062L9.40514 7.4082C9.69814 7.11541 9.69831 6.64054 9.40552 6.34754C9.11273 6.05454 8.63785 6.05438 8.34486 6.34717L6.62329 8.06753L6.62329 1.875C6.62329 1.46079 6.28751 1.125 5.87329 1.125C5.45908 1.125 5.12329 1.46079 5.12329 1.875L5.12329 8.06422L3.40516 6.34719C3.11218 6.05439 2.6373 6.05454 2.3445 6.34752C2.0517 6.64051 2.05185 7.11538 2.34484 7.40818L5.31462 10.3761Z" fill="" /></svg>
                                )}
                            </span>
                            {stock.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
