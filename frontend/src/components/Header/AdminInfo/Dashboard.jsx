import React, { useEffect, useState } from 'react';
import { fetchAllUsers, deleteUser } from '../../../apiCalls';
import { Button, Form } from 'react-bootstrap';
import { ProductForm } from '../../Forms/ProductForm';

export const AdminDashboard = ({ token }) => {
  const [users, setUsers] = useState([])
  const [showProductForm, setShowProductForm] = useState(false)

  useEffect(() => {
    if (token) {
      async function getUsers() {
        try {
          console.log('DASHBOARD TOKEN CHECK:', token)
          const data = await fetchAllUsers(token)
          console.log(data)
          setUsers(data)
        } catch (error) {
          console.error(error)
        }
      }
      getUsers()
    }
  }, [token])

  const handleDeleteUser = async (userId) => {
    try {
      // Make an API call to delete the user by userId
      await deleteUser(token, userId);
      // Update the users list by removing the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleProductForm = () => {
    setShowProductForm((prevState) => !prevState); // Toggle the value of showProductForm
  };

  return (
    <>
      <h1>ADMIN DASHBOARD</h1>
      <h2>CREATE NEW PRODUCT</h2>
      <Button onClick={toggleProductForm}>
        {showProductForm ? 'Hide Product Form' : 'Show Product Form'}
      </Button>
      {showProductForm && <ProductForm token={token} />}
      <div>{users.map(user =>
        <div key={user.id} value={user}>
          <h3>{user.username}</h3>
          <Button onClick={() => handleDeleteUser(user.id)}>Delete User</Button>
        </div>
      )}</div>
    </>
  )
}