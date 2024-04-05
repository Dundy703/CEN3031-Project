import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import '../styles/List.css'

function List() {
    /*window.addEventListener('load', function () {
        document.querySelector('input[type="file"]').addEventListener('change', function () {
            if (this.files && this.files[0]) {
                var img = document.getElementsByClassName("image")[0];
                img.onload = () => {
                    URL.revokeObjectURL(img.style.backgroundImage);  // no longer needed, free memory
                }

                img.style.backgroundImage = "url(" + URL.createObjectURL(this.files[0]) + ")"; // set src to blob url
            }
        });
    });*/
    const [file, setFile] = useState();
    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
    }    
 
    return (
        <div className="list">
            <h1>List an Item</h1>
            <p>
                <label for="name">Item Name: </label>
                <input name="name"></input>
            </p>
            <br />
            <p>
                <label for="description">Description: </label>
                <textarea name="description"></textarea>
            </p>
            <br />
            <p>
                <label for="image">Image: </label>
                <input type="file" name="image" accept="image/*" onChange={handleChange}></input>
                <br />
                <img className="image" src={file} />
            </p>
            <Link to="/">
                <button>List Item</button>
            </Link>
            <br />
        </div>
    )
}

export default List