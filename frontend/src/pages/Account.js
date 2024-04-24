import React from 'react'
import { useNavigate } from 'react-router-dom'

function Account() {
    let navigate = useNavigate();
    function logout() {
        localStorage.removeItem("token");
        window.location.reload();

    }
    return (

        <div onClick={logout}>log out</div>
    )
}

export default Account