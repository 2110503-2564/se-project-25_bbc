'use client'

import React, { useEffect, useState } from 'react'

export const UserProfileTab = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedLogin = localStorage.getItem("res_login");
    // console.log(storedLogin);
    if (storedLogin) {
      const parsedUser = JSON.parse(storedLogin);
      console.log(parsedUser);
      setUser(parsedUser);
    }
  }, []);

  return (
    <div>
        {user && user.account.first_name}
    </div>
  );
}
