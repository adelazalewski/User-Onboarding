import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as yup from 'yup';

//schema for validation
const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field"),
    email: yup.string().email("Must be a valid email address").required("Must include email address"),
    password: yup.string()
        .required("Must set a password")
        .min(8 ,"Password should be 8 characters long")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/, "Password must 4 to 8 characters long and have one uppercase, one lowercase and one numeric digit"),
    confirmPassword: yup.string().oneOf([yup.ref('password') , null], "Password must match"),
    house: yup.string().required("Must choose a house for team building activities"),
    description: yup.string().required("We would like to get to know you as soon as possible :)"),
    terms: yup.boolean().oneOf([true], "Please agree to the terms of use")
});

export default function Form () {
    const [formState, setFromState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        house: '',
        description: '',
        terms: false,
    });

    const [errorState, setErrorState] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        house: '',
        description: '',
        terms: '',
    });

    const [users, setUsers] = useState([]);
    //console.log(users);
    //validation of the form here
    const validate = (e) => {
        let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
      yup
       .reach(formSchema, e.target.name)
       .validate(value)
       .then((valid) => {
           setErrorState({...errorState, [e.target.name]: ''});
       })
       .catch((err) => {
           //console.log(err.errors);
           setErrorState({...errorState, [e.target.name]: err.errors[0]});
       });
    };

    //OnChange function
    const inputChangeHandler = (e) => {
        e.persist();
        //console.log("input changed!", e.target.value, e.target.checked);
        validate(e);
        let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFromState({...formState, [e.target.name]: value})
    }


    //onSubmit handler 
    const submitForm = (e) => {
        e.preventDefault();
        setFromState({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            house: '',
            description: '',
            terms: '',
        });
        console.log("form submited!!");
        axios
         .post("https://reqres.in/api/users", formState)
         .then((res) => {
            console.log(res);
            setUsers(res.data);
            //console.log(users);
         })
         .catch((err) => console.log(err));
    };

    const [buttonDisabled, setButtonDisabled] = useState(true);
    useEffect(() => {
        formSchema.isValid(formState).then((valid) => {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    return (
        <form onSubmit={submitForm}>
            <label htmlFor="name">Full Name</label>
            <input type="text" name="name" value={formState.name} onChange={inputChangeHandler}/>

            <label htmlFor="email">Your email
            {errorState.email.length > 0 ? <p>{errorState.email}</p> : null}
            </label>
            <input type="email" name="email" value={formState.email} onChange={inputChangeHandler}/>

            <label htmlFor="password">Set a password
            {errorState.password.length > 0 ? <p>{errorState.password}</p> : null}
            </label>
            <input type="password" name="password" value={formState.password} onChange={inputChangeHandler}/>

            <label htmlFor="confirmPassword">Confirm password
            {formState.confirmPassword === formState.password ? null : <p>{errorState.confirmPassword}</p>}
            </label>
            <input type="password" name="confirmPassword" value={formState.confirmPassword} onChange={inputChangeHandler}/>

            <label htmlFor="house">Choose Your House ( ͡• ͜ʖ ͡•)
            {errorState.house.length > 0 ? <p>{errorState.house}</p> : null}
            </label>
            <select name="house" value={formState.house} onChange={inputChangeHandler}>
                <option value="gryffindor">Gryffindor</option>
                <option value="ravenclaw">Ravenclaw</option>
                <option value="hufflepuff">Hufflepuff</option>
                <option value="slytherin">Slytherin</option>
            </select>

            <label htmlFor="description">Tell us about yourself
            {errorState.description.length > 0 ? <p>{errorState.description}</p> : null}
            </label>
            <textarea name="description" value={formState.description} onChange={inputChangeHandler}/>

            <label htmlFor="terms" id="checkbox-label">Terms and Conditions
            {errorState.terms.length > 0 ? <p>{errorState.terms}</p> : null}
            </label>
            <input type="checkbox" name="terms" id="checkbox" value={formState.terms} onChange={inputChangeHandler}/>

            <button disabled={buttonDisabled} type="submit">Submit</button>
        </form>
    )
}