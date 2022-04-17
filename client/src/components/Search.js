import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Search() {
    const [boards, setBoards] = useState([]);
    const [tasks, setTasks] = useState([]);
    const { keyword } = useParams();

    const getBoards = () => {
        const request = openDb();
        request.onsuccess = (e) => {
            const db = e.target.result;
            const objectStore = getObjectStore(db, "boards", "readonly");
            
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                const b = event.target.result;
                setBoards(b.filter(board => (board.data.name.toLowerCase().includes(keyword) || board.data.description.toLowerCase().includes(keyword))));
            };
        };
    }

    const getTasks = () => {
        const request = openDb();
        request.onsuccess = (e) => {
            const db = e.target.result;
            const objectStore = getObjectStore(db, "tasks", "readonly");
            
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                const t = event.target.result;
                setTasks(t.filter(task => (task.data.name.toLowerCase().includes(keyword))));
            };
            console.log(tasks)
        };
    }

    const openDb = () => {
        return indexedDB.open("trello", 1);
    }

    const getObjectStore = (db, store, mode) => {
        const transaction = db.transaction(store, mode);
        return transaction.objectStore(store);
    }

    useEffect(() => {
        getBoards();
        getTasks();
    });

    return ( 
    <div className="h-screen bg-sky-600">
        <div className="mb-auto h-view justify-center bg-sky-600">
            { 
            (boards.length === 0) ?
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white">No boards include the keword '{keyword}'</h1>
                
            </div>
            :
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white">Boards that include '{keyword}'</h1>
            
                <div className="flex flex-col mx-auto p-auto h-view items-center">
                    <div className="flex items-center justify-center">
                        <div className="flex px-4 pt-10 pb-8 items-start overflow-x-scroll">
                        {
                            boards.map((board, index) => (
                                <div className="flex flex-col bg-white shadow-2xl h-view rounded-md justify-center justify-items-center text-center p-5 m-3" key={index}>
                                    <Link to={"/boards/" + board.id} className="">
                                        <h1 className="font-semibold text-2xl">{board.data.name}</h1>
                                    </Link>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
            </div>
            }
            {
            (tasks.length === 0) ? 
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white">No tasks include the keword '{keyword}'</h1>
                
            </div>
            :
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white">Tasks that include the keword '{keyword}'</h1>
                <div className="mt-10 transition ease-in-out duration-200 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                {tasks.map((task, index) => (
                    <div key={index} className="flex flex-col relative h-max">
                        <Link to={"/boards/" + task.data.boardId} className="group flex flex-col shadow-lg hover:shadow-2xl transition duration-200 delay-75 w-full bg-white hover:bg-gray-200 rounded-md py-6 pr-6 pl-9 lg:p-5">
                            <p className="text-2xl font-bold text-gray-700 ease-in-out duration-200 group-hover:text-gray-700">
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
            }
        </div>
    </div>
    )
}

export default Search;