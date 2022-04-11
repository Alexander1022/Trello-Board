import React, {useRef} from 'react';
import {BrowserRouter, Routes,  Route} from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AllBoards from "./components/AllBoards";
import Board from "./components/Board";
import NicknameForm from "./components/NicknameForm";
import EditBoard from './components/EditBoardForm';


function App()
{
    const name = localStorage.getItem("nickname");
    const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    const request = indexedDB.open("trello", 1);

    request.onerror = function (event) {
        console.error("An error occurred with IndexedDB");
        console.error(event);
    };

    request.onupgradeneeded = function(event)
    {
        const db = event.target.result;
        const objectStore = db.createObjectStore("boards", {autoIncrement: true, keyPath: "id"});
        const objectStore2 = db.createObjectStore("columns", {autoIncrement: true, keyPath: "id"});
    };

    if(name === null)
    {
       return (<NicknameForm />);
    }

    return(
        <div>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route exact path="/" element={<Home nickname={name}/>} />
                    <Route exact path="/boards" element={<AllBoards />} />
                    <Route path="/boards/:id" element={<Board/>} />
                    <Route path="/boards/:id/edit" element={<EditBoard/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;