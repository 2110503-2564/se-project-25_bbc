const URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchRoom(query="") {
    try {
        const response = await fetch(`${URL}/api/room/search?${query}`);
        if (!response.ok) throw new Error("Failed to fetch rooms");
        return await response.json();
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return null;
    }
}