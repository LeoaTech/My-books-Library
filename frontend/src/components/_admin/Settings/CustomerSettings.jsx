import React, { useState } from 'react';


const dummySettings = [
    { label: "Allow User to Select Booking Date", value: true, type: "toggle" },
    { label: "Default Booking Date", value: "15", type: "number" },

];

const CustomerSettings = () => {
    1

    const [userSettings, setUserSettings] = useState(dummySettings);

    const handleToggleChange = (index) => {
        const settingsCopy = [...userSettings];
        settingsCopy[index].value = !settingsCopy[index].value;
        setUserSettings(settingsCopy);
    };
    return (
        <div className="w-full">
            <div className="overflow-x-auto mt-5 shadow-md">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-800 text-white dark:bg-gray-400 dark:text-black">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                Setting
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {userSettings.map((setting, index) => (
                            <tr className="hover:bg-blue-50" key={setting.label}>
                                <td className="py-2 px-4 dark:text-gray-600">{setting.label}</td>
                                <td className="py-2 px-4">
                                    {setting.type === "toggle" ? (
                                        <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={setting.value}
                                                onChange={() => handleToggleChange(index)}
                                            />
                                            <div
                                                className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                                            ></div>
                                        </label>
                                    ) : (
                                        <input
                                            type={setting.type}
                                            className="px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-blue-500"
                                            value={setting.value}
                                            onChange={(e) => {
                                                const settingsCopy = [...userSettings];
                                                settingsCopy[index].value = e.target.value;
                                                setUserSettings(settingsCopy);
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CustomerSettings