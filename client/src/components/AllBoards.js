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
                const boards = event.target.result;
                setBoards(boards);
                console.log(boards);
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

            store.put({
                data
            });

            setBoardName("");
            setBoardDescription("");

            console.log("Success");
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
            const req = transaction.objectStore("boards").delete(index+1);

            console.log("Success");
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
      <div className="mb-auto h-screen justify-center bg-sky-600">
          <div className="p-5 flex flex-col items-center justify-center">
              <h1 className="text-3xl text-white">All Boards</h1>
              <p className="text-white text-lg">Create, Edit or Delete boards</p>
          </div>

          <div className="flex mx-auto p-auto h-view justify-center items-stretch">
              <form className="flex flex-col bg-white rounded-md text-black justify-items-center p-5 justify-center text-center mr-5">
                  <p className="text-xl mb-5">Create a board</p>
                  <input required className="outline-0 mb-3" type="text" name="board_name" placeholder="Name" value={boardName} onChange={onChangeBoardName}/>
                  <input required className="outline-0 mb-3" type="text" name="board_desc" placeholder="Description" value={boardDescription} onChange={onChangeBoardDescription}/>
                  <input className="cursor-pointer" type="button" value="Submit" onClick={onSubmit}/>
              </form>

              <div className="flex px-4 pb-8 items-start overflow-x-scroll">
                  {
                      boards.map((board, index) => (

                          <>
                          <Link to={"/boards/" + index} className="bg-white border-2 border-white h-max w-max rounded-md justify-center justify-items-center text-center p-3 m-1" key={index}>
                              <h1 className="font-semibold text-2xl">{board.data.name}</h1>
                          </Link>
                          <input className="cursor-pointer" type="button" value="Delete board" onClick={() => onDelete(index)} />
                          </>
                      ))
                  }
              </div>
          </div>
      </div>
  );
}

export default AllBoards;