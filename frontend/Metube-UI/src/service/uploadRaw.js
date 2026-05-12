import axios from 'axios';
import { encrypting } from '../../../../api_server/src/middleware/AES.js';
// .env format in Vite

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const secret_key = import.meta.env.VITE_AES_SECRET_KEY;
const host = `http://localhost:${api_port}/metube`;

export const uploadS3 = async(file, progress) => {
    if(!file) throw new Error('Empty file'); 
    try{
        const { name, type, size } = file;

        // 1> Request for presigned URL
        const vietnixRep = await axios.post(`${host}/presigned-URL`,{
            fileName: name,
            contentType: type,
            fileSize: size,
        });

        const { url, key, fields } = vietnixRep.data;
        const encryptKey = encrypting(secret_key, key);

        // Build form data
        const formData = new FormData();
        Object.entries(fields).forEach(([k, v]) => {
            formData.append(k, v);
        });
        formData.append("file", file);
        
        // 2> Initialize status = "uploading"  for file video
        //    videoPath will be use in enqueue step
        try{
            await axios.post(`${host}/${encryptKey}/initVidDB`, {
                videoPath: key,
            })
        }
        catch(err)
        {
            console.error(`Initialize DB for video failed: ${err}`);
            throw err;
        }

        // 3> Upload raw video to Vietnix using presigned URL
        await axios.post(url, formData, {
            // Calculate complete percent & display in progress bar
            onUploadProgress: (e) => {
                const completePercent = Math.round((e.loaded * 100) / e.total);
                if(progress) progress(completePercent);
            }
        })

        // Return key(videoId) for UI to confirm with Api server
        return encryptKey;
    }
    catch(err){
        console.error("Error when uploading video to S3: ", err);
        throw err;
    }
}
