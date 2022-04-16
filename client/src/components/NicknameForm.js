import React from "react";

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
        <div className="mb-auto h-screen justify-center bg-sky-600">
        <form className="flex flex-col text-center text-white p-10 justify-center justify-items-center">
                <h2 className="text-2xl m-5 font-bold">Please enter your nickname</h2>
                <input type="text" name="nickname" placeholder="Enter your nickname" className="outline-0 border-2 border-black text-black" value={nickname} onChange={onChange}/>
                <input type="button" value="Submit" className="m-5 cursor-pointer" onClick={onSubmit}/>
            </form>
    </div>)
}

export default NicknameForm;