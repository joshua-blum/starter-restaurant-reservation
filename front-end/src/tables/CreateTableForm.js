import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import ErrorAlert from '../layout/ErrorAlert';


export default function CreateTableForm({tableCreation}){
    const [error, setError] = useState(null);
    const abortController = new AbortController();
    const history = useHistory();
    const initialFormState = {
        table_name: "",
        capacity: 0
    }

    const [formData, setFormData] = useState({...initialFormState});

    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]: target.value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{ 
            await tableCreation(formData, abortController.signal);
            setFormData({...initialFormState});
            history.push('/dashboard');
            return () => abortController.abort();
        } 
        catch(error){
            setError(error); 
            throw error
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        setFormData({...initialFormState});
        history.goBack();
    }

    return (
        <>
            <div>
                <ErrorAlert error={error} />
                <h1>Set up a Table</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='table_name'>
                    Table Name: 
                    <input
                        id='table_name'
                        type='text'
                        name='table_name'
                        onChange={handleChange}
                        value={formData.table_name}
                    />
                    </label>
                    <br />
                    <label htmlFor='capacity'>
                        Capacity: 
                        <input
                            id='capacity'
                            type='number'
                            name='capacity'
                            onChange={handleChange}
                            value={formData.capacity}
                        />
                    </label>
                    <br />
                    <button type='submit' onSubmit={handleSubmit}>Submit</button>
                    <button type='button' onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </>
    );
}