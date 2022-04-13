import React, {useState} from "react";
import Column from "./Column";

function Home(props)
{
    const data = localStorage.getItem(props.board_name);
    const[recentTasks, setRecentTasks] = useState([]);

    let temp = [];

    const openDb = () => {
        return indexedDB.open("trello", 1);
    }

    const isRecent = (timestamp) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diff = now - then;

        //  задачата е създадена преди по-малко от седмицас
        return diff < 604800000;
    }

    const getRecentTasks = () => {
        openDb().onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["tasks"], "readonly");
            const objectStore = transaction.objectStore("tasks");
            const request = objectStore.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor)
                {
                    if(isRecent(cursor.value.data.timestamp))
                    {
                        temp.push(cursor.value);
                    }

                    cursor.continue();
                }
            }
        }

        // i need to fix this
        setRecentTasks(temp);
    }

    useState(() => {
        getRecentTasks();
    }, []);

    return (
        <div className="mb-auto h-screen justify-center bg-sky-600">
            <div className="p-5 flex flex-col items-center justify-center">
                <h1 className="text-3xl text-white font-semibold">Hello, {props.nickname}</h1>
                <p className="text-white text-lg">All recent tasks.</p>
            </div>

            <div className="flex mx-auto p-auto h-view justify-center items-stretch">
                {recentTasks.map((task, index) => (
                    <div key={index}>
                        {task.data}
                    </div>
                ))}
            </div>
        </div>
  );
}

export default Home;