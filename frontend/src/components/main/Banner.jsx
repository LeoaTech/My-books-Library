import React from 'react'

const Banner = ({ date, planName }) => {
    return (
        <div className="sticky top-30 z-50 bg-slate-200 border border-gray-400 rounded-lg shadow-xsmax-w-1/2 top-6 dark:bg-gray-700 dark:border-gray-600 mb-10">

            <p className="text-gray-700 dark:text-gray-300 text-center py-2">{`Your Subscription will be canceled at ${date}!`}</p>
        </div>
    )
}

export default Banner