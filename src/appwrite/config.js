import {Client,Databases,Storage,Query,ID} from 'appwrite'
import conf from '../conf/conf';

export class Service{
    Client = new Client();
    Databases;
    bucket;

    constructor(){
        this.Client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)
        this.Databases = new Databases(this.Client)
        this.bucket = new Storage(this.Client)
    }

    async craetePost({title,slug,content,featuredimage,status,userid}){
        try {
            return await this.Databases.createDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid
                }
            )
        } catch (error) {
            console.log("appwite servisce :: createpost :: error",error)
        }
    }   
    
    async upadtePost(slug,{title,content,featuredimage,status}){
        try {
            return await this.Databases.updateDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status
                }
            )
        } catch (error) {
            console.log("appwite servisce :: upadtePost :: error",error)
        }
    }

    async deletePost(slug){
        try {
            return await this.Databases.deleteDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true
        } catch (error) {
            console.log("appwite servisce :: deltePost :: error",error)
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.Databases.getDocument(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("appwite servisce :: getPost :: error",error)
            return false
        }
    }

    async getPosts(queries =[Query.equal("status","active")]){
        try {
            return await this.Databases.listDocuments(
                conf.appwriteDataBaseId,
                conf.appwriteCollectionId,
                queries,
            )
            return true
        } catch (error) {
            console.log("appwite servisce :: getPots :: error",error)
            return false
        }
    }

    // file upload service 
    
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
            return true
        } catch (error) {
            console.log("appwite servisce :: uploadfile :: error",error)
            return false
        }
    }

    async deleteFile(fileId){
        try {
            return await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true
        } catch (error) {
            console.log("appwite servisce :: deleteFile :: error",error)
            return false
        }
    }

    getFilePreviwe(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )

    }


}

export const service = new Service()
export default service