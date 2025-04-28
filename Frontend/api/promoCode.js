const URL = process.env.NEXT_PUBLIC_API_URL;

export async function checkPromocode(token , code) {
    try {
        const res = await fetch(`${URL}/api/promo/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code })
        });
    
        const data = await res.json();
    
        if (!res.ok) throw new Error(data.message || "Failed to checking promotion code");
    
        return data;
      } catch (error) {
        console.error("Error checking promotion code:", error);
        return error;
      }
}

export async function usePromocode(token , code) {
    try {
        const res = await fetch(`${URL}/api/promo/use`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code })
        });
    
        const data = await res.json();
    
        if (!res.ok) throw new Error(data.message || "Failed to using promotion code");
    
        return data;
      } catch (error) {
        console.error("Error using promotion code:", error);
        return null;
      }
}