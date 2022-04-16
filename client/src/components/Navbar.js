import React from "react";
import {Link} from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import '../index.css';


function Navbar()
{
    const navigate = useNavigate();

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

            <div className="search">
                <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      navigate(`/boards/search/${e.target.value.toLowerCase()}`)
                      e.target.value = '';
                    }
                  }}
                inputProps={{ style: { color: 'white'}}}
                multiline={false}
                label="Search boards"
                />
            </div>
        </nav>
    );
}

export default Navbar;