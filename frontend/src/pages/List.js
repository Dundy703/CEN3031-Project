import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import '../styles/List.css'

function List(props) {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        itemName: '',
        itemPrice: '',
        itemDescription: '',
        imageData: '',
        sellerEmail: props.email,
    });

    const [fileURL, setFileURL] = useState();

    const handleChange = (e) => {
        let { name, value } = e.target;
        if(name == "itemPrice") {
            value = parseInt(value);
            if(isNaN(value)) value = '';
        }
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    function handleImgChange(e) {
        setFileURL(URL.createObjectURL(e.target.files[0]));
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageData = event.target.result;
            
            setFileURL(imageData);
            setFormData(prevState => ({
                ...prevState,
                imageData: imageData
            }));
        };

        reader.readAsDataURL(file);
    }    

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formData);
        axios.post("http://localhost:3001/items/listItem", formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
 
    return (
        <div className="list">
            <form onSubmit={handleSubmit}>
                <h1>List an Item</h1>
                <p>
                    <label for="name">Item Name: </label>
                    <input name="itemName" value={formData.itemName} onChange={handleChange} />
                </p>
                <br />
                <p>
                    <label for="description">Description: </label>
                    <textarea name="itemDescription" type="textarea" value={formData.itemDescription} onChange={handleChange} />
                </p>
                <br />
                <p>
                    <label for="price">Price: </label>
                    <input name="itemPrice" value={formData.itemPrice} onChange={handleChange} />
                </p>
                <br />
                <p>
                    <label for="image">Image: </label>
                    <input type="file" name="image" accept="image/*" onChange={handleImgChange}></input>
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