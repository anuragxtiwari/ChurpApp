import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1️⃣ Lookup UID from username
    const usernameRef = doc(db, 'usernames', username.trim());
    const usernameSnap = await getDoc(usernameRef);

    if (!usernameSnap.exists()) {
      alert('Username not found');
      return;
    }

    const uid = usernameSnap.data().uid;

    // 2️⃣ Lookup email from UID
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert('User profile not found');
      return;
    }

    const email = userSnap.data().email;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful');
      navigate('/chat');
    } catch (error) {
      alert('Incorrect password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </div>
  );
}
