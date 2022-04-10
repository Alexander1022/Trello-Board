import React from "react";
import Column from "./Column";

function Home(props)
{
    const data = localStorage.getItem(props.board_name);
    const board = JSON.parse(data);

    return (
        <div className="mb-auto h-screen justify-center bg-sky-600">
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white font-semibold">Hello, {props.nickname}</h1>
                <p className="text-white text-lg">All recent shit.</p>
            </div>

            <div className="flex mx-auto p-auto h-view justify-center items-stretch">

            </div>
        </div>
  );
}

export default Home;