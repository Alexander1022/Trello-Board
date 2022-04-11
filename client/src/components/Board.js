import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

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
    const [board, setBoard] = useState({name:'', description:''})

    const getBoardInfo = () => {
        const request = indexedDB.open("trello", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["boards"], "readonly");
            const objectStore = transaction.objectStore("boards");
            const r = objectStore.get(parseInt(id));
            console.log("Getting info for " + id);

            r.onsuccess = (event) => {
                const b = event.target.result;
                setBoard({name: b.data.name, description: b.data.description})
                loading.set = false;
            }
        }
    };

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

            <div class="flex px-4 pt-10 pb-8 items-start overflow-x-scroll">
                <div class="rounded bg-gray-300 flex-no-shrink w-64 p-2 mr-3">
                    <div class="flex justify-between py-1">
                        <h3 class="text-sm">To Do</h3>
                    </div>

                    <div class="text-sm mt-2">
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            To do 1
                        </div>
                        
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            To do 2
                        </div>
                        
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            To do 3
                        </div>
                        <input class="mt-3 text-gray-600 bg-gray-300 outline-0" placeholder="Add a task..."/>
                    </div>
                </div>

                <div class="rounded bg-gray-300 flex-no-shrink w-64 p-2 mr-3">
                    <div class="flex justify-between py-1">
                        <h3 class="text-sm">In progress</h3>
                    </div>

                    <div class="text-sm mt-2">
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            Progress task 1
                        </div>
                        
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            Progress task 2
                        </div>
                        
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            Make this web app and take a rest
                        </div>
                        <input class="mt-3 text-gray-600 bg-gray-300 outline-0" placeholder="Add a task..."/>
                    </div>
                </div>

                <div class="rounded bg-gray-300 flex-no-shrink w-64 p-2 mr-3">
                    <div class="flex justify-between py-1">
                        <h3 class="text-sm">Done</h3>
                    </div>

                    <div class="text-sm mt-2">
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            Done task 1
                        </div>
                        
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            Done task 2
                        </div>
                        
                        <div class="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-gray-100">
                            Done task 3
                        </div>
                        <input class="mt-3 text-gray-600 bg-gray-300 outline-0" placeholder="Add a task..."/>
                    </div>
                </div>
            </div>
        </div>
    );    
}

export default Board;
