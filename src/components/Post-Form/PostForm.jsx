import React from "react";
import {useForm} from 'react-hook-form'
import {useCallback} from 'react'
import appwriteService from '../../appwrite/config'
import {Button,RTE , Input, Select} from '../index'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'


export default function PostForm({post}){

    const {register,handleSubmit,watch,setValue,control,getValues} = useForm({
        defaultValues:{
            title:post?.title ||"",
            slug:post?.slug ||"",
            content:post?.content ||"",
            status:post?.status ||"active",
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state=> state.auth.userData)

    const submit = async(data)=>{
        if(post){
            const file = data.image[0]? await appwriteService.uploadFile(data.image[0]) : null

            if(file){
                appwriteService.deleteFile(post.featuredimage)
            }

            const dbPost = await appwriteService.upadtePost(post.$id,{
                ...data,
                featuredimage:file ? file.$id:undefined,
            })

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
            
        }else{
            const file = await appwriteService.uploadFile(data.image[0]);

            if(file){
                const fileId = file.$id
                data.featuredimage = fileId
                const dbPost = await appwriteService.craetePost({
                    ...data,
                    userId:userData.$id,
                })
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    }

    const slugTransForm = useCallback((value)=>{
        if(value && typeof value === "string"){
        return value
            .trim()
            .toLowerCase()
            .replace (/[^a-zA-Z\d\s]+/g,'-')
            .replace(/\s/g,'-')

        return ''
        }


    },[])

    React.useEffect(()=>{
        const subscription = watch((value,{name})=>{
            if(name==="title"){
                setValue('slug',slugTransForm(value.title,{
                    shouldValidate:true
                }))
            }
        })

        return()=>{
            subscription.unsubscribe()
        }
    },[watch,slugTransForm,setValue])

    return(
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-2/3 px-2">
            <Input
                label="Title :"
                placeholder="Title"
                className="mb-4"
                {...register("title", { required: true })}
            />
            <Input
                label="Slug :"
                placeholder="Slug"
                className="mb-4"
                {...register("slug", { required: true })}
                onInput={(e) => {
                    setValue("slug", slugTransForm(e.currentTarget.value), { shouldValidate: true });
                }}
            />
            <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
        </div>
        <div className="w-1/3 px-2">
            <Input
                label="Featured Image :"
                type="file"
                className="mb-4"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("image", { required: !post })}
            />
            {post && (
                <div className="w-full mb-4">
                    <img
                        src={appwriteService.getFilePreviwe(post.featuredimage)}
                        alt={post.title}
                        className="rounded-lg"
                    />
                </div>
            )}
            <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4"
                {...register("status", { required: true })}
            />
            <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full bg-white rounded-xl py-2 font-medium hover:bg-yellow-300 duration-200">
                {post ? "Update" : "Submit"}
            </Button>
        </div>
    </form>
    )
}