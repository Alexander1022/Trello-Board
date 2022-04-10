import React from "react";

function Column({columnsInfo})
{
    return (
        <div className="rounded bg-gray-300 flex-no-shrink w-64 p-2 mr-3">
            <div className="flex justify-between py-1">
                <h3 className="text-sm">To Do</h3>
            </div>

            <div className="text-sm mt-2">
                <div
                    className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer">
                    Wash the dishes
                </div>

                <div
                    className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer">
                    Upload photos in the cloud
                </div>

                <div
                    className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer">
                    Do the math homework
                </div>
                <input name="New tasks" className="mt-3 border-0 outline-0 bg-transparent text-black" placeholder="Add new task..."/>
            </div>
        </div>
    );
}

export default Column;