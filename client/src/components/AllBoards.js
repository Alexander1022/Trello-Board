import React, {useEffect} from "react";
import {useState} from "react";
import {Link} from "react-router-dom";
function AllBoards()
{
    const [boardName, setBoardName] = useState("");
    const [boardDescription, setBoardDescription] = useState("");
    const [boards, setBoards] = useState([]);

    const getBoards = () => {
        const request = indexedDB.open("trello", 1);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["boards"], "readonly");
            const objectStore = transaction.objectStore("boards");
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                const b = event.target.result;
                console.log(event.target);
                console.log(b);
                setBoards(b);
            };
        };
    }

    const onChangeBoardName = (e) => {
        setBoardName(e.target.value);
    }

    const onChangeBoardDescription = (e) => {
        setBoardDescription(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(e.target.boardName == '' || e.target.boardDescription == '') {
            console.warn("fields are empty")
            return null;
        }
        const request = indexedDB.open("trello", 1);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction("boards", "readwrite");
            const store = transaction.objectStore("boards");
            const data = {
                name: boardName,
                description: boardDescription
            };

            store.add({
                data
            });

            setBoardName("");
            setBoardDescription("");

            console.log("Success");
            getBoards();
        }

        request.onerror = () =>
        {
            console.log("Error adding board");
        };
    }

    const onDelete = (index) => {
        const request = indexedDB.open("trello", 1);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction("boards", "readwrite");
            const req = transaction.objectStore("boards").delete(index);
            console.log("Board deleted - " + index);
            getBoards();
        }

        request.onerror = () =>
        {
            console.log("Error deleting board");
        };
    }

    useEffect(() => {
       getBoards();
    }, []);

    return (
    <div className="h-screen bg-sky-600">
      <div className="mb-auto h-view justify-center bg-sky-600">
          <div className="p-5 flex flex-col items-center justify-center">
              <h1 className="text-3xl text-white">All Boards</h1>
              <p className="text-white text-lg">Create, Edit or Delete boards</p>
          </div>

          <div className="flex flex-col mx-auto p-auto h-view items-center">
              <form className="flex flex-col w-min bg-white rounded-md text-black justify-items-center p-5 mb-10 justify-center text-center mr-5">
                  <p className="text-xl mb-5">Create a board</p>
                  <input required className="outline-0 mb-3" type="text" name="board_name" placeholder="Name" value={boardName} onChange={onChangeBoardName}/>
                  <input required className="outline-0 mb-3" type="text" name="board_desc" placeholder="Description" value={boardDescription} onChange={onChangeBoardDescription}/>
                  <input className="cursor-pointer" type="button" value="Submit" onClick={onSubmit}/>
              </form>

                <div className="flex items-center justify-center">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                    {
                        boards.map((board, index) => (
                            <div className="flex flex-col bg-white shadow-2xl h-view rounded-md justify-center justify-items-center text-center p-5 m-3" key={index}>
                                <Link to={"/boards/" + board.id} className="">
                                    <h1 className="font-semibold text-2xl">{board.data.name}</h1>
                                </Link>
                                
                                <input className="cursor-pointer text-white bg-red-600 border-2 border-white" type="button" value="Delete" onClick={() => onDelete(board.id)} />
                                
                                <Link to={"/boards/" + board.id + "/edit"} className="cursor-pointer text-white bg-green-600 border-2 border-white">
                                    <h1>Edit</h1>
                                </Link>
                            
                            </div>
                        ))
                    }
                    </div>
                </div>
          </div>
      </div>
      </div>
  );
}

export default AllBoards;