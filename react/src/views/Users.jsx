import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import axiosClient from '../axios-client.js';
import { Link } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // New state for current page
  const perPage = 5; // Number of items per page
  const { setNotification } = useStateContext();

  useEffect(() => {
    getUsers();
  }, [currentPage]); // Update the user list when the current page changes

  const onDeleteClick = (user) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    axiosClient
      .delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted');
        getUsers();
      });
  };

  const getUsers = () => {
    setLoading(true);
    const page = currentPage + 1; // API pages start from 1, not 0
    axiosClient
      .get(`/users?page=${page}&per_page=${perPage}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        console.log(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Users</h1>
        <Link className="btn-add" to="/users/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={'/users/' + u.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button className="btn-delete" onClick={(ev) => onDeleteClick(u)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalUsers ? Math.ceil(totalUsers / perPage) : 0}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}
