import React from 'react'
import { useNavigation } from 'react-router-dom'

function Account() {
    let navigate = useNavigation();
    function logout() {
        localStorage.removeItem("token");
        window.location.reload();

    }
    return (

        <div onClick={logout}>log out</div>
    )
}

export default Account