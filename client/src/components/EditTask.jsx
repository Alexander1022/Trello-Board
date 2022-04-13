import React from "react";
import {useState} from "react";
import {Dialog} from "@headlessui/react";
import {Transition} from "@headlessui/react";
import {Fragment} from "react";
import {useNavigate, useParams} from 'react-router-dom'

function EditTask()
{
    const [isOpen, setIsOpen] = useState(true);
    const {id, taskId} = useParams();
    const [taskName, setTaskName] = useState("");
    const [taskTime, setTaskTime] = useState("");
    const [newName , setNewName] = useState("");

    const navigate = useNavigate();

    const openDb = () => {
        return indexedDB.open("trello", 1);
    }

    const onChangeName = (event) => {
        setNewName(event.target.value);
    }

    const getTask = () => {
        openDb().onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["tasks"], "readonly");
            const objectStore = transaction.objectStore("tasks");
            const request = objectStore.get(parseInt(taskId));
            request.onsuccess = (event) => {
                const task = event.target.result;
                setTaskName(task.data.name);
                setTaskTime(new Date(task.data.timestamp).toLocaleTimeString());
            }
        }
    }

    const editTask = () => {
        openDb().onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["tasks"], "readwrite");
            const objectStore = transaction.objectStore("tasks");
            const request = objectStore.get(parseInt(taskId));

            request.onsuccess = (event) => {
                const task = event.target.result;

                const editedTask = {
                    id: task.id,
                    data: {
                        name: newName,
                        timestamp: task.data.timestamp,
                        boardId: task.data.boardId,
                        columnId: task.data.columnId
                    }
                }

                const requestUpdate = objectStore.put(editedTask);
                requestUpdate.onsuccess = (event) => {
                    navigate("/boards/" + id);
                }
            }
        }
    }

    const deleteTask = () => {
        openDb().onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["tasks"], "readwrite");
            const objectStore = transaction.objectStore("tasks");
            const request = objectStore.delete(parseInt(taskId));
            request.onsuccess = (event) => {
                console.log("Task deleted");
                navigate("/boards/" + id);
            }
        }
    }

    useState(() => {
        getTask();
    }, []);


    return (
        <div className="h-screen bg-sky-600">
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    onClose={() => setIsOpen(true)}
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                         </span>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Detailed View - {taskName}
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">
                                        Created at {taskTime} 🕒
                                    </p>

                                    <input type="text" placeholder="New Name" className="outline-0 mt-5 focus:border-b-2 focus:border-b-sky-400 transition ease-in-out duration-200" onChange={onChangeName}/>
                                </div>

                                <div className="mt-4 justify-items-stretch">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={() => editTask()}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={deleteTask}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default EditTask;