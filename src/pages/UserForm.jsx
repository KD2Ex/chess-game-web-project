import React, {useState} from 'react';
import {auth} from "../API/firebase.js";

const UserForm = () => {
    const [name, setName] = useState('')
    async  function handleSubmit(e) {
        e.preventDefault()
        localStorage.setItem('userName', name)
        await auth.signInAnonymously()
    }
    return (
        <div className="">
            <form className="user-form" onSubmit={handleSubmit}>
                <h1>Введите свое имя:</h1>
                <br/>
                <div className="field">
                    <p className="control">
                        <input type="text"
                               name=""
                               id=""
                               className="input"
                               placeholder="Name"
                               value={name}
                               onChange={e => setName(e.target.value)}
                               required
                        />
                    </p>

                </div>
                <div className="field">
                    <p className="control">
                        <button className="button" type="submit">
                            Pogнали
                        </button>
                    </p>
                </div>
            </form>
        </div>

    );
};

export default UserForm;