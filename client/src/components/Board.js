import React, {useEffect, useState, Fragment} from "react";
import {useParams} from "react-router-dom";
import { Transition } from '@headlessui/react';
import { useNavigate } from "react-router-dom";



function Board()
{
    const { id } = useParams();
    const loading = {
        isLoading: false,

        get get() {
            return this.isLoading;
        },
        set set(value) {
            this.isLoading = value;
        }
    }
    const [isShowing, setIsShowing] = useState(true)
    const navigate = useNavigate();
    const [board, setBoard] = useState({name:'', description:''});
    const [cols, setCols] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [colName, setColName] = useState('');
    const [hidden, setHidden] = useState(true);
    const [colToEdit, setColToEdit] = useState(0);
    const [editedName, setEditedName] = useState('');
    const [taskName, setTaskName] = useState('');

    const getBoardInfo = () => {
        const request = openDb();
        request.onsuccess = function() {
            const db = request.result;
            const objectStore = getObjectStore(db, "boards", "readonly");
            
            const r = objectStore.get(parseInt(id));
            r.onsuccess = (event) => {
                const b = event.target.result;
                setBoard({name: b.data.name, description: b.data.description})
                getColumns();
                getTasks();
            }
        }
    };

    const getColumns = () => {
        const request = openDb();
        request.onsuccess = function() {
            const db = request.result;
            const objectStore = getObjectStore(db, "columns", "readonly")
            const r = objectStore.getAll();

            r.onsuccess = (event) => {
                const c = event.target.result;

                var cols = [];
                for(let i = 0; i < c.length; i++) {
                    if(c[i].data.boardId === parseInt(id))
                        cols.push(c[i])
                }

                setCols(cols);
            }
        }
    }

    const getTasks = () => {
        const request = openDb();
        request.onsuccess = function() {
            const db = request.result;
            const objectStore = getObjectStore(db, "tasks", "readonly")
            const r = objectStore.getAll();

            r.onsuccess = (event) => {
                const t = event.target.result;

                var tasks = [];
                for(let i = 0; i < t.length; i++) {
                    if(t[i].data.boardId === parseInt(id))
                        tasks.push(t[i])
                }

                setTasks(tasks);
                loading.set = false;
            }
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(e.target.colName === '') {
            console.warn("field is empty")
            return null;
        }

        const request = openDb();
        request.onsuccess = function () {
            const db = request.result;
            const objectStore = getObjectStore(db, "columns", "readwrite")
            
            const data = {
                name: colName,
                boardId: parseInt(id)
            };
            objectStore.add({
                data
            });

            setColName("");
            getColumns();
        }
    }

    const onDelete = (index) => {
        const request = openDb();

        request.onsuccess = function () {
            const db = request.result;
            getObjectStore(db, "columns", "readwrite").delete(index);
        }

        request.onerror = () =>
        {
            console.log("Error deleting column");
        };

        getColumns();
    }

    const openEdit = (id) => {
        setHidden(!hidden);
        setColToEdit(id);
    }

    const submitEdit = (e) => {
        e.preventDefault();

        const editedCol = {
            data: {
                boardId: parseInt(id),
                name: editedName
            },
            id: cols.find(element => element.id === colToEdit).id
        };

        const request = openDb()
        request.onsuccess = function () {
            const db = request.result;
            getObjectStore(db, "columns", "readwrite").put(editedCol);
            setEditedName('');
        }

        request.onerror = () =>
        {
            console.log("Error updating the column");
        };

        setHidden(!hidden);
        getColumns();
    }

    const createTask = (e, colId) => {
        if(e.which == 13) {
            const request = openDb();
            request.onsuccess = function () {
                const db = request.result;
                const objectStore = getObjectStore(db, "tasks", "readwrite")
                
                const data = {
                    name: taskName,
                    boardId: parseInt(id),
                    columnId: colId,
                    timestamp: Date.now()
                };
                objectStore.add({
                    data
                });

                setTaskName('');
                getTasks();
            }
        }
    }

    const openDb = () => {
        return indexedDB.open("trello", 1);
    }

    const getObjectStore = (db, store, mode) => {
        const transaction = db.transaction(store, mode);
        return transaction.objectStore(store);
    }

    useEffect(() => {
        loading.set = true;
        getBoardInfo();
    }, []);

    return(!loading ? 
        <div className="mb-auto h-screen justify-center bg-sky-600">
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white font-semibold">Loading...</h1>
            </div>
        </div>
        :
        <div className="mb-auto h-screen justify-center bg-sky-600 items-center">
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white font-semibold">Name: {board.name}</h1>
                <p className="text-white text-lg">Description: {board.description}</p>
            </div>

            <div className="flex px-4 pt-10 pb-8 items-start overflow-x-scroll">
                    {
                        cols.map((col, index) => (
                        <Transition
                            as={Fragment}
                            show={isShowing}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                        <div className="rounded bg-gray-300 flex-no-shrink w-64 p-2 mr-3">
                            <div className="flex justify-between py-1">
                                <h3 className="text-sm">{col.data.name}</h3>
                            </div>

                            <div className="text-sm mt-2">
                                {
                                    tasks.map((task, index) => (
                                        <div>
                                            { (task.data.columnId === col.id) ? 
                                                <div
                                                    key={index}
                                                    className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100"
                                                    onClick={() => navigate(`/boards/${id}/tasks/${task.id}/edit`)}
                                                >
                                                    {task.data.name}
                                                </div>
                                                :
                                                <div></div>
                                            }
                                        </div>
                                    ))
                                }
                                <input className="mt-3 text-gray-600 bg-gray-300 outline-0" placeholder="Add a task..." value={taskName} onChange={(e) => { setTaskName(e.target.value) }} onKeyUp={(e) => createTask(e, col.id)}/>
                                <input className="cursor-pointer text-white bg-red-600 border-2 border-white" type="button" value="Delete" onClick={() => onDelete(col.id)} />
                                <input className="cursor-pointer text-white bg-green-600 border-2 border-white" type="button" value="Edit" onClick={() => openEdit(col.id)} />
                            </div>
                        </div> 
                        </Transition>
                        ))    
                    }

                <form className="flex flex-col w-min bg-white rounded-md text-black justify-items-center p-5 mb-10 justify-center text-center mr-5">
                  <p className="text-xl mb-5">Add a new column</p>
                  <input required className="outline-0 mb-3" type="text" name="column_name" placeholder="Name" value={colName} onChange={(e) => { setColName(e.target.value) }}/>
                  <input className="cursor-pointer" type="button" value="Submit" onClick={onSubmit}/>
              </form>
            </div>
            
            { !hidden ? 
            <div className="mb-auto h-screen justify-center bg-sky-600">
                <form className="flex flex-col text-center text-white p-10 justify-center justify-items-center">
                    <h2 className="text-2xl m-5 font-bold">Edit the column {cols.find(element => element.id === colToEdit).id}</h2>
                    <input type="text" name="name" placeholder="New Name" className="p-3 my-1 outline-0 border-2 border-black text-black" value={editedName} onChange={(e) => { setEditedName(e.target.value) }}/>
                    <div className="flex flex-row justify-items-center">
                        <input type="button" value="Submit" className="m-5 cursor-pointer" onClick={submitEdit}/>
                        <input type="button" value="Close" className="m-5 cursor-pointer" onClick={() => { setHidden(!hidden) }}/>
                    </div>
                </form>
            </div>
            :
            <div></div> }
        </div>
    );    
}

export default Board;
