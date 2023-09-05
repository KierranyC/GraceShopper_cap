export const BASE_URL = "http://localhost:4000/api";

// GET - get all products

export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

// POST - create new product

export const createProduct = async (
  title,
  description,
  price,
  quantity,
  category,
  photo
) => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        price,
        quantity,
        category,
        photo,
      }),
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// GET - view a single product

export const fetchProduct = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// PATCH - update a product

export const updateProduct = async (
  productId,
  title,
  description,
  price,
  quantity,
  category,
  photo
) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        price,
        quantity,
        category,
        photo,
      }),
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// GET - get all products in a certain category and search term

export const getProductsByCategoryAndSearch = async ({
  category,
  searchTerm,
}) => {
  try {
    const response = await fetch(
      `${BASE_URL}/products?category=${category}&search=${searchTerm}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// POST - register user

export const signUp = async (
  email,
  username,
  password,
  setToken,
  setIsLoggedIn
) => {
  const maxLength = 8;
  const minLength = 7;
  if (username.length < maxLength) {
    alert(`Username must be at least ${maxLength} characters long.`);
  }
  if (password.length < minLength) {
    alert(`Password must be at least ${minLength} characters long.`);
  }
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });
    const result = await response.json();
    localStorage.setItem("token", result.token);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

// POST - user login

export const userLogin = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const result = await response.json();
    localStorage.setItem("token", result.token);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

// GET - getting all users

export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// GET - getting a user

export const fetchUserData = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// DELETE - delete a product

const deleteProduct = async (id, setDeleted, deleted) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const result = await response.json();
    result.success ? setDeleted(deleted + 1) : null;
    return result;
  } catch (error) {
    console.error(error);
  };
};

// GET - getting all user's orders
export const fetchUserOrders = async (username, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/orders`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
};


//PATCH - Updating Users
export const editUser = async (username, password, email, userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
};

// POST - creating cart for user upon registering or logging in

// export const createUserCart = async (token, productId, quantity) => {
//   try {
//     const response = await fetch(`${BASE_URL}/cart/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         productId,
//         quantity
//       })
//     })
//     const result = await response.json()
//     return result
//   } catch (error) {
//     console.error(error)
//   }
// }

// GET - returning a user's cart
// export const fetchUserCart = async (authToken) => {
//   try {
//     const headers = {
//       "Content-Type": "application/json"
//     };

//     if (authToken) {
//       headers["Authorization"] = `Bearer ${authToken}`;
//     } else {
//       // Handle guest session ID here, if applicable
//       const guestSessionId = localStorage.getItem("guestSessionId");
//       if (guestSessionId) {
//         headers["x-guest-session-id"] = guestSessionId;
//       }
//     }

//     const response = await fetch(`${BASE_URL}/cart`, {
//       headers
//     });

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const createNewGuest = async (guestSessionId) => {
//   try {

//   }
// }

export const fetchUserCart = async (token) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/cart`, {
      headers,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const createNewGuest = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/newguest`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      }
    })
    const result = await response.json()
    return result;
  } catch (error) {
    console.error(error)
  }
}

export const fetchGuestCart = async (guestSessionId) => {

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (guestSessionId) {
      headers["x-guest-session-id"] = guestSessionId;
    }

    const response = await fetch(`${BASE_URL}/cart`, {
      headers,
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
};



export const addItemToCart = async (authToken, guestSessionId, productId, quantity) => {
  console.log(authToken, guestSessionId)
  try {
    const headers = {
      "Content-Type": "application/json"
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (guestSessionId) {
      headers["x-guest-session-id"] = guestSessionId;

    }

    const response = await fetch(`${BASE_URL}/cart/add`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        productId,
        quantity
      })
    });

    const result = await response.json();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const updateCartItem = async (authToken, guestSessionId, productId, quantity) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (guestSessionId) {
      headers["x-guest-session-id"] = guestSessionId;

    }

    const response = await fetch(`${BASE_URL}/cart/update`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const removeItemFromCart = async (authToken, guestSessionId, productId) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (guestSessionId) {
      headers["x-guest-session-id"] = guestSessionId;

    }

    const response = await fetch(`${BASE_URL}/cart/remove`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({
        productId
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  };
}