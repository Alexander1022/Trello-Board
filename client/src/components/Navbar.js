import React, {useState} from "react";
import {Link} from "react-router-dom";

function Navbar()
{
    return (
        <nav className="flex items-center justify-between flex-wrap bg-sky-700 border-b border-black p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <h1 className="font text-2xl tracking-tight">Trello Board</h1>
            </div>

            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-lg text-white mr-4">Home</Link>
                    <Link to="/boards" className="block mt-4 lg:inline-block lg:mt-0 text-lg text-white mr-4">All Boards</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;