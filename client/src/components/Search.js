import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Search() {
    const [boards, setBoards] = useState([]);
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

    const openDb = () => {
        return indexedDB.open("trello", 1);
    }

    const getObjectStore = (db, store, mode) => {
        const transaction = db.transaction(store, mode);
        return transaction.objectStore(store);
    }

    useEffect(() => {
        getBoards();
    }, []);

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
            </div>
            }
            <div className="flex flex-col mx-auto p-auto h-view items-center">
                  <div className="flex items-center justify-center">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 items-center justify-center justify-items-center">
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
    </div>
    )
}

export default Search;