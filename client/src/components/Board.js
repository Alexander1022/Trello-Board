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
    const [board, setBoard] = useState({name:'', description:''});
    const [cols, setCols] = useState([]);
    const [colName, setColName] = useState('');

    const getBoardInfo = () => {
        const request = indexedDB.open("trello", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["boards"], "readonly");
            const objectStore = transaction.objectStore("boards");
            const r = objectStore.get(parseInt(id));

            r.onsuccess = (event) => {
                const b = event.target.result;
                setBoard({name: b.data.name, description: b.data.description})
                getColumns();
            }
        }
    };

    const getColumns = () => {
        const request = indexedDB.open("trello", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["columns"], "readonly");
            const objectStore = transaction.objectStore("columns");
            console.log(parseInt(id));
            const r = objectStore.getAll();
            console.log("Getting columns for " + parseInt(id));

            r.onsuccess = (event) => {
                const c = event.target.result;

                var cols = [];
                for(let i = 0; i < c.length; i++) {
                    if(c[i].data.boardId === parseInt(id))
                        cols.push(c[i])
                }

                setCols(cols);
                loading.set = false;
            }
        }
    }

    const onColChange = (e) => {
        setColName(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(e.target.colName === '') {
            console.warn("field is empty")
            return null;
        }
        const request = indexedDB.open("trello", 1);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction("columns", "readwrite");
            const store = transaction.objectStore("columns");
            const data = {
                name: colName,
                boardId: parseInt(id)
            };

            console.log(data)
            store.add({
                data
            });

            setColName("");

            console.log("Column added");
            getColumns();
        }
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

            <div class="flex px-4 pt-10 pb-8 items-start overflow-x-scroll">
                    {
                        cols.map((col, index) => (
                        <div class="rounded bg-gray-300 flex-no-shrink w-64 p-2 mr-3">
                            <div class="flex justify-between py-1">
                                <h3 class="text-sm">{col.data.name}</h3>
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
                        ))    
                    }

                <form className="flex flex-col w-min bg-white rounded-md text-black justify-items-center p-5 mb-10 justify-center text-center mr-5">
                  <p className="text-xl mb-5">Add a new column</p>
                  <input required className="outline-0 mb-3" type="text" name="column_name" placeholder="Name" value={colName} onChange={onColChange}/>
                  <input className="cursor-pointer" type="button" value="Submit" onClick={onSubmit}/>
              </form>
            </div>
        </div>
    );    
}

export default Board;
