import { exec } from "child_process";
import { promisify } from "util";
import ffprobePath from "ffprobe-static";

const execPromise = promisify(exec);

export const getVideoDuration = async (filePath) => {
    try {
        const cmd = `"${ffprobePath.path}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1`;
        
        const { stdout } = await execPromise(`${cmd} "${filePath}"`);
        
        const duration = parseFloat(stdout.trim());
        
        return isNaN(duration) ? 0 : Math.round(duration);
    } 
    catch (error) 
    {
        console.error("Error getting video duration:", error);
        return 0;
    }
};