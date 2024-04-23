import React from 'react'

function Account() {
    function logout() {
        localStorage.removeItem("token");
        window.location.reload();
    }
    return (

        <div onClick={logout}>log out</div>
    )
}

export default Account