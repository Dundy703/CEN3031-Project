import React, { useState, useEffect } from 'react'
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

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            sellerEmail: props.email,
        }));
    }, [props.email]);

    const [fileURL, setFileURL] = useState();

    const handleChange = (e) => {
        let { name, value } = e.target;
        if(name === "itemPrice") {
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
                navigate('/');
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
                <label htmlFor="name">Item Name:</label>
                <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} />
            </p>
            <p>
                <label htmlFor="description">Description:</label>
                <textarea name="itemDescription" value={formData.itemDescription} onChange={handleChange} />
            </p>
            <p>
                <label htmlFor="price">Price:</label>
                <input type="number" name="itemPrice" value={formData.itemPrice} onChange={handleChange} />
            </p>
            <p>
                <label htmlFor="image">Image:</label>
                <input type="file" name="image" accept="image/*" onChange={handleImgChange} />
                {fileURL && <img className="image" alt="preview" src={fileURL} />}
            </p>
            <button type="submit">List Item</button>
        </form>
    </div>
    )
}

export default List