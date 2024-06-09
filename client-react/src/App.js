import { useState, useEffect } from 'react';
import Axios from 'axios';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, ListGroup, Form, Button } from 'react-bootstrap';

export default function App() {
  const api = "http://localhost:3001";

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await Axios.get(`${api}/users`);
    setUsers(response.data);
  };

  const createUser = async () => {
    if (name && age && email) {
      const response = await Axios.post(`${api}/createUser`, { name, age, email });
      setUsers([...users, response.data]);
      setName('');
      setAge('');
      setEmail('');
    }
  };

  const updateUser = async () => {
    if (name && age && email) {
      const response = await Axios.put(`${api}/users/${currentUser._id}`, { name, age, email });
      setUsers(users.map(user => (user._id === currentUser._id ? response.data : user)));
      setEditing(false);
      setCurrentUser(null);
      setName('');
      setAge('');
      setEmail('');
    }
  };

  const deleteUser = async (id) => {
    await Axios.delete(`${api}/users/${id}`);
    setUsers(users.filter(user => user._id !== id));
  };

  const editUser = (user) => {
    setEditing(true);
    setName(user.name);
    setAge(user.age);
    setEmail(user.email);
    setCurrentUser(user);
  };

  return (
    <div className='body'>
      <Container className="form-container">
        <Form className='form'>
          <Form.Control
            type='text'
            placeholder='Name'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Form.Control
            type='number'
            placeholder='Age'
            value={age}
            onChange={e => setAge(e.target.value)}
          />
          <Form.Control
            type='text'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button onClick={editing ? updateUser : createUser} variant="primary">
            {editing ? 'Update User' : 'Create User'}
          </Button>
        </Form>
      </Container>

      <Container className="result-container">
        {users.map(({ _id, name, age, email }) => (
          <ListGroup key={_id} className="result-item">
            <ListGroup.Item variant='dark' className='d-flex justify-content-between'>
              <div className='ms-2 me-auto'>
                <div className='fw-bold'>{name}</div>
                {email}
              </div>
              <Button variant="warning" onClick={() => editUser({ _id, name, age, email })}>Edit</Button>
              <Button variant="danger" onClick={() => deleteUser(_id)}>Delete</Button>
            </ListGroup.Item>
          </ListGroup>
        ))}
      </Container>
    </div>
  );
}
