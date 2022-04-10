import React from "react";
import {useState} from "react";

function NicknameForm()
{
    const [nickname, setNickname] = React.useState("");

    const onChange = (e) =>
    {
        setNickname(e.target.value);
    };

    const onSubmit = (e) =>
    {
        e.preventDefault();
        localStorage.setItem("nickname", nickname);
        window.location.reload();
    }

    return (
        <div>
            <form>
                <h2>Please enter your nickname</h2>
                <input type="text" name="nickname" placeholder="Enter your nickname" value={nickname} onChange={onChange}/>
                <input type="button" value="Submit" onClick={onSubmit}/>
            </form>
    </div>)
}

export default NicknameForm;