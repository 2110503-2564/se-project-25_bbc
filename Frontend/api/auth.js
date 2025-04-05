const URL = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async ( first_name, last_name, email, tel, password ) => {
  try {
    const response = await fetch(`${URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        first_name,
        last_name,
        email,
        tel ,
        password,
        role: "user"
       }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: error.message };
  }
};

export const signinUser = async (tel, password) => {
  try {
    const response = await fetch(`${URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tel, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.message };
  }
};
