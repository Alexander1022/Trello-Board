import React, {useEffect, useState} from "react";
import Column from "./Column";
import {Link} from "react-router-dom";

function Home(props)
{
    const data = localStorage.getItem(props.board_name);
    const [recentTasks, setRecentTasks] = useState([]);

    let temp = [];

    const openDb = () => {
        return indexedDB.open("trello", 1);
    }

    const isRecent = (timestamp) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diff = now - then;

        //  задачата е създадена преди по-малко от седмица
        return diff < 604800000;
    }

    const getRecentTasks = () => {
        openDb().onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["tasks"], "readonly");
            const objectStore = transaction.objectStore("tasks");
            const request = objectStore.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor)
                {
                    if(isRecent(cursor.value.data.timestamp))
                    {
                        temp.push(cursor.value);
                    }

                    cursor.continue();
                }
                else
                {
                    setRecentTasks(temp);
                }
            }
        }
    }

    useEffect(() => {
        getRecentTasks();
    }, [])

    return (
        <div className="mb-auto h-screen justify-center bg-sky-600">
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white font-semibold">Hello, {props.nickname}</h1>
                <p className="text-white text-lg">All recent tasks.</p>
            </div>

            <div className="flex bg-sky-600 items-center justify-center px-10 pb-10">
                <div className="mt-10 transition ease-in-out duration-200 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                {recentTasks.map((task, index) => (
                    <div key={index} className="flex flex-col relative h-max">
                        <Link to={"/boards/" + task.data.boardId} className="group flex flex-col shadow-lg hover:shadow-2xl transition duration-200 delay-75 w-full bg-white hover:bg-gray-200 rounded-md py-6 pr-6 pl-9 lg:p-5">
                            <p className="text-2xl font-bold text-gray-700 ease-in-out duration-200 group-hover:text-gray-700 truncate">
                                {task.data.name}
                            </p>

                            <p className="text-sm font-semibold ease-in-out duration-200 text-gray-700 group-hover:text-gray-700 mt-2 leading-6">
                                From {new Date(task.data.timestamp).toLocaleTimeString()}
                            </p>

                            <p className="text-sm font-semibold ease-in-out duration-500 text-gray-700 group-hover:text-gray-700 mt-2 leading-6">
                                {new Date(task.data.timestamp).toLocaleDateString()}
                            </p>
                        </Link>
                    </div>
                ))}
                </div>
            </div>
        </div>
  );
}

export default Home;