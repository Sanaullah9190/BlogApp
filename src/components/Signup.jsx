import React from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {Button,Logo,Input,} from './index'
import { useState,useEffect } from "react";
import {login} from '../store/authSlice'
import { useDispatch } from "react-redux";

function Signup(){
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {register,handleSubmit} = useForm()

    const craete = async(data)=>{
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if(userData){
                const userData = authService.getCurrentUser()
                if(userData) dispatch(login(userData))
                    navigate("/")
            }
        } catch (error) {
            setError(error.massage)
        }
    }
    return(
        <div className=" flex items-center justify-center w-full">

            <div className={` mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">

                    <span className=" inline-block w-full amx-w-[100px]">
                        <Logo width="100%"/>
                    </span>

                    </div>
                    <h2 className=" text-center text-2xl font-bold leading-tight">Sign in to your account</h2>

                    <p className=" mt-2 text-center text-base text-black/60">

                    don&apos;t have any acount?&nbsp;
                    <Link
                    to='/signup'
                    className=" font-medium text-primary transition-all duration-200 hover:underline">
                        Sign up
                    </Link>
                </p>
                {error && <p className=" text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(craete)}>
                    <div className=" space-y-5">
                        <Input
                        label="Full Name: "
                        placeholder= "Enter the Full Name "
                        {...register("name",{
                            required:true
                        })}
                        />
                        <Input
                        label = "Email: "
                        palceholder = "Enter the email"
                        type = "email"
                        {...register("email",{
                            required:true,
                            validate:{
                                matchPatern:(value)=> /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value) ||
                                "Email address must be a valid addresh",
                            }
                        })}
                        />
                        <Input
                        label = "password: "
                        palceholder="Enter the password"
                        type="password"
                        {...register("password",{
                            required:true
                        })}     
                        />
                        <Button
                        type="submit"
                        classname=" w-full"
                        >Create Account</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;
