import React, { useState } from 'react'
import axios from 'axios'
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
    const [fileURL, setFileURL] = useState();
    const [file, setFile] = useState();
    function handleChange(e) {
        setFileURL(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }    

    function handleSubmit(e) {
        const url = './http://localhost:3000/uploadFile';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        console.log(file);
        //axios.post(url, formData, config).then((response) => {
        //    console.log(response.data);
        //});
        const testF = new FormData();
        fetch("http://localhost:3001/r/")
            .then((res) => res.json())
            .then((data) => console.log(data.message))
            .catch((error) => console.error("Error:", error));
        e.preventDefault();
    }
 
    return (
        <div className="list">
            <form onSubmit={handleSubmit}>
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
                    <img className="image" src={fileURL} />
                </p>
                    <button type="submit">List Item</button>
                <br />
            </form>
        </div>
    )
}

export default List