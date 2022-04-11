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
        <div className="mb-auto h-screen justify-center bg-sky-600">
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white font-semibold">Name: {board.name}</h1>
                <p className="text-white text-lg">Description: {board.description}</p>
            </div>

            <div className="flex mx-auto p-auto h-view justify-center items-stretch">

            </div>
        </div>
    );    
}

export default Board;
