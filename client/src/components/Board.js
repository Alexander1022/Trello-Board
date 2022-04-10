import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

function Board()
{
    const { id } = useParams();
    const [board, setBoard] = useState([]);

    const getBoardInfo = () => {
        const request = indexedDB.open("trello", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["boards"], "readonly");
            const objectStore = transaction.objectStore("boards");
            const r = objectStore.get(parseInt(id) + 1);

            r.onsuccess = (event) => {
                const board = event.target.result;
                setBoard(board);
                console.log("board: ", board);
            }
        }
    };

    useEffect(() => {
        getBoardInfo();
        console.log(board);
    }, []);

    return(
        <div className="mb-auto h-screen justify-center bg-sky-600">
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white font-semibold">{}</h1>
                <p className="text-white text-lg">Desc</p>
            </div>

            <div className="flex mx-auto p-auto h-view justify-center items-stretch">

            </div>
        </div>
    );
}

export default Board;
