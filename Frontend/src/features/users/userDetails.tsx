import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchUserById } from './usersSlice';


export default function UserDetails() {
const { id } = useParams();
const dispatch = useAppDispatch();
const user = useAppSelector((s) => s.users.list.find((u) => u.id === id));


useEffect(() => {
if (id && !user) dispatch(fetchUserById(id));
}, [id, user, dispatch]);


if (!user) return <div>Loading...</div>;


return (
<div>
<h2>{user.name}</h2>
<p><strong>Username:</strong> {user.username}</p>
<p><strong>Email:</strong> {user.email}</p>
<p><strong>Phone:</strong> {user.phone}</p>
<p><strong>Website:</strong> {user.website}</p>
<p><strong>Role:</strong> {user.role}</p>
<p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>


<h3>Skills</h3>
<ul>{user.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>


<h3>Available Slots</h3>
<ul>{user.availableSlots.map((s, i) => <li key={i}>{s}</li>)}</ul>


<h3>Address</h3>
<p>{user.address.street}, {user.address.city} - {user.address.zipcode}</p>


<h3>Company</h3>
<p>{user.company.name}</p>


<Link to={`/edit/${user.id}`}><button className="button">Edit</button></Link>
<Link to="/"><button className="button">Back</button></Link>
</div>
);
}