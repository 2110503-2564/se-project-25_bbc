// -------------------------- Import -------------------------- //

// Variable & Function
import { userSockets , hotelSockets , superAdminSockets , io } from '../server.js';

// Chat

const emitUser = (user_id , event , data) => {
    try{
        const userSocket = userSockets[user_id];
        if (!userSocket) return; 
    
        userSocket.emit(event , data);
    
    } catch (error) {
        console.error(`Error emitting event ${event} to user ${user_id}:`, error);
    }
}

const emitHotelAdmin = (hotel_id , event , data) => {
    try{
        const hotelSocketList = hotelSockets[hotel_id];
        if (!hotelSocketList) return; 

        hotelSocketList.forEach((hotelAdminSocket) => hotelAdminSocket.emit(event, data));

    } catch (error) {
        console.error(`Error emitting event ${event} to hotel admin for hotel ${hotel_id}:`, error);
    }
}

export const emitGuests = (hotel_id , event , data) => {
    
}