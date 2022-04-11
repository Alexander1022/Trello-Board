import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function EditBoard({name, desc, index})
{
    const [boardName, setBoardName] = useState("");
    const [boardDescription, setBoardDescription] = useState("");
    const { id } = useParams(); 

    console.log("Edit id: " + id);

    const onChangeName = (e) => {
        setBoardName(e.target.value);
    };

    const onChangeDescription = (e) => {
        setBoardDescription(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        // stupid way to update object from objectStore :D
         
        const newBoard = {
            data: {
                name: boardName,
                description: boardDescription
            },
            id: parseInt(id)
    };
        const request = indexedDB.open("trello", 1);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction("boards", "readwrite");
            const req = transaction.objectStore("boards").put(newBoard);
            console.log("Done");
        }

        request.onerror = () =>
        {
            console.log("Error deleting board");
        };
    };

    return (
        <div className="mb-auto h-screen justify-center bg-sky-600">
            <form className="flex flex-col text-center text-white p-10 justify-center justify-items-center">
                    <h2 className="text-2xl m-5 font-bold">Edit the board</h2>
                    <input type="text" name="name" placeholder="Edit Name" className="p-3 my-1 outline-0 border-2 border-black text-black" value={name} onChange={onChangeName}/>
                    <input type="text" name="desc" placeholder="Edit description" className="p-3 my-1 outline-0 border-2 border-black text-black" value={desc} onChange={onChangeDescription}></input>
                    <input type="button" value="Submit" className="m-5 cursor-pointer" onClick={onSubmit}/>
            </form>
        </div>
    );
}

export default EditBoard;