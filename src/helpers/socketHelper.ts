import colors from "colors";
import { Server } from "socket.io";
import { logger } from "../shared/logger";

const socket = (io: Server)=>{
    io.on('connection', socket=>{
        logger.info(colors.blue('A User connected'));


        // for location testing
        socket.on("sent-location", (data)=>{
            logger.info(colors.green(`Location received: ${data}`));
            // Emit the location data to all connected clients
            io.emit("recieved-location", {id : socket.id, ...data});
        });

        // disconnect
        socket.on("disconnect", ()=>{
            logger.info(colors.red('A user disconnect'));
        })
    })
}

export const socketHelper = { socket }