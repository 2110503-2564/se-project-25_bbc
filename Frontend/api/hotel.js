const URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllHotel() {
    try {
        const response = await fetch(`${URL}/api/hotel`);
        if (!response.ok) throw new Error("Failed to fetch hotels");
        return await response.json();
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return null;
    }
}
