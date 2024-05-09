// A base url for making CRUD calls to the API server
export const BASE_URL = "https://restless-butterfly-4927.fly.dev/api";

// ----- All GET requests -----
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

// Get - gets all featured products
export const fetchFeaturedProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/featured`, {
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

// GET - view a single product
export const fetchProduct = async (productId) => {
  console.log('FETCH PRODUCT API CALL PRODUCTID:', productId)
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log('FETCH PRODUCT API CALL RESULT:', result);
    return result;
  } catch (error) {
    console.error(error);
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
      }
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// GET - getting all users
export const fetchAllUsers = async (token) => {
  console.log('FETCH ALL USERS TOKEN CHECK:', token)
  try {
    const response = await fetch(`${BASE_URL}/users`, {
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

export const fetchAllGuests = async (token) => {
  console.log('FETCH ALL GUESTS TOKEN CHECK:', token)
  try {
    const response = await fetch(`${BASE_URL}/users/guests`, {
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

// GET - getting a user
export const fetchUserData = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    delete result.password;
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

// GET - getting all user's orders
export const fetchUserOrders = async (username, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}/orders`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    // console.log('USER ORDERS API CALL:', result)
    return result;
  } catch (err) {
    console.error(err);
  }
};

// GET - Gets all products in a certain category
export const getProductsByCategory = async (category) => {
  console.log("CATEGORY API CALL:", category);
  try {
    const response = await fetch(
      `${BASE_URL}/products/categories/${category}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
};

// ----- All POST requests -----
// POST - create new product
export const createProduct = async (
  token,
  title,
  description,
  price,
  quantity,
  category,
  photo,
  featured
) => {
  console.log(token)
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        price,
        quantity,
        category,
        photo,
        featured
      }),
    });
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
  // const minLength = 8;
  // if (username.length < minLength) {
  //   alert(`Username must be at least ${minLength} characters long.`);
  // }
  // if (password.length < minLength) {
  //   alert(`Password must be at least ${minLength} characters long.`);
  // }
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
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

// POST - user login
export const userLogin = async (
  username,
  password,
  setIsLoggedIn,
  setToken
) => {
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

// ----- All PATCH requests -----
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

//PATCH - Updating Users
export const editUser = async (username, password, email, userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

// ----- All DELETE requests -----
// DELETE - delete a product
export const deleteProduct = async (token, productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId
      })
    });
    const result = await response.json();
    // result.success ? setDeleted(deleted + 1) : null;
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const updateCart = async (token, sessionId) => {
  console.log('TOKEN AND GUEST ID CHECK API CALL:', token, sessionId)
  try {
    const response = await fetch(`${BASE_URL}/cart/updateuser`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        guestId: sessionId
      })
    })
    const result = await response.json()
    return result;
  } catch (error) {
    console.error(error)
  }
}

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
      method: "POST",
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

export const addItemToCart = async (
  authToken,
  guestSessionId,
  productId,
  quantity
) => {
  console.log(authToken, guestSessionId);
  try {
    const headers = {
      "Content-Type": "application/json",
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
        quantity,
      }),
    });

    const result = await response.json();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const updateCartItem = async (
  authToken,
  guestSessionId,
  productId,
  quantity
) => {
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

export const removeItemFromCart = async (
  authToken,
  guestSessionId,
  productId
) => {
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
        productId,
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  };
}

export const deleteUser = async (token, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        userId
      })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error(error)
  }
}

export const deleteGuest = async (token, guestId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/guest/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        guestId
      })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error(error)
  }
}