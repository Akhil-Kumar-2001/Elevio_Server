// import { Server } from "socket.io";
// import {Server as HttpServer} from 'http'

// const configureSocket = (server: HttpServer) => {
//     const io = new Server(server, {
//         cors: { origin: "*", methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }, 
//     });

//     const userSocketMap: { [key: string]: string } = {};

//     io.on('connection',(socket)=>{
//         console.log("a user connected",socket.id)

//         const userId = Array.isArray(socket.handshake.query.userId)
//             ? socket.handshake.query.userId[0]
//             : socket.handshake.query.userId;

//         if (userId) {
//             userSocketMap[userId] = socket.id;
//         }

//         io.emit("getOnlineUser",Object.keys(userSocketMap));
        
        
//         socket.on('disconnect',()=>{
//             console.log("user is disconnected",socket.id)
//             if(userId){
//                 delete userSocketMap[userId]
//                 io.emit("getOnlineUser",Object.keys(userSocketMap));
//             }
//         })
//     })

// }

// export default configureSocket;
















// 'use client'

// import { createContext, ReactNode, useEffect, useState } from "react";
// import userAuthStore from "@/store/userAuthStore";
// import tutorAuthStore from "@/store/tutorAuthStore";
// import { io, Socket } from "socket.io-client";
// import { DefaultEventsMap } from "@socket.io/component-emitter";

// // 1. Define the correct context type
// interface SocketContextType {
//   socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
//   onlineUser: any[]; // replace `any` with your actual user type if possible
// }

// // 2. Create the context with proper type
// export const SocketContext = createContext<SocketContextType | null>(null);

// // 3. Create provider
// export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
//   const tutor = tutorAuthStore();
//   const student = userAuthStore();

//   const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
//   const [onlineUser, setOnlineUser] = useState<any[]>([]);
//   const userId = tutor.user?.id || student.user?.id

// //   useEffect(() => {
// //     if (tutor.user?.id || student.user?.id) {
// //       const socket = io("http://localhost:5000");
// //       setSocket(socket);

// //       return () => socket.close();
// //     } else {
// //       if (socket) {
// //         socket.close();
// //         setSocket(null);
// //       }
// //     }
// //   }, []);

// useEffect(() => {
//     let socketInstance: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
    
//     if (userId) {
//       socketInstance = io("http://localhost:5000",
//          {
//             // query:{
//             //     userId:userId
//             // },
//         transports: ['websocket', 'polling'] // Try forcing websocket first
//       }
//     );
//       setSocket(socketInstance);
//     }
//     return () => {
//       if (socketInstance) {
//         socketInstance.close();
//       }
//       if (socket && !socketInstance) {
//         socket.close();
//         setSocket(null);
//       }
//     };
//   }, []); 

//   return (
//     <SocketContext.Provider value={{ socket, onlineUser }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


