import React, { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs); // Ensure it's configured here too (redundant but helps debugging)
console.log("✅ Amplify configured inside App.tsx");

let client: ReturnType<typeof generateClient<Schema>> | null = null;
type UserType = Schema["User"]["type"];

function App() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [authId, setAuthId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");

  useEffect(() => {
    if (!client) client = generateClient<Schema>();
    console.log("Fetching users...");

    const subscription = client.models.User.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
      error: (e) => console.error("Error observing users: ", e),
    });

    // cleanup when component unmounts
    return () => subscription.unsubscribe();
  }, []);

async function createUser(event: React.FormEvent) {
    event.preventDefault();
    // check if empty answer
    if (!authId || !email) {
      alert("User ID and email are required.");
      return;
    }
    if (!client) client = generateClient<Schema>();
    try {
      const response = await client.models.User.create({
        authId,
        email,
        firstName,
        lastName,
      });
      console.log("User created:", response);
      if (response && "data" in response && response.data) {
        setUsers((prevUsers) => [...prevUsers, response.data]);
    } else {
        setUsers((prevUsers) => [...prevUsers, response]);
    }
      setAuthId("");
      setEmail("");
      setFirst("");
      setLast("");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user!");
  }

  }

  return (
    <main>
      <h1>User Signup</h1>
      <form onSubmit={createUser}>
        <input
          type="text"
          value="authId"
          onChange={(e) => setAuthId(e.target.value)}
          placeholder="User ID"
          required 
        />
         <input
          type="email"
          value="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required 
        />
         <input
          type="text"
          value="first"
          onChange={(e) => setFirst(e.target.value)}
          placeholder="First Name"
        />
         <input
          type="text"
          value="last"
          onChange={(e) => setLast(e.target.value)}
          placeholder="Last Name" 
        />
        <button type="submit">Create new user</button>
      </form>
      <ul>
          {users.length > 0 ? (
              users.map((user) => (
                  <li key={user.id}>
                      {user.firstName} {user.lastName} - {user.email}
                  </li>
              ))
          ) : (
              <li>No users found.</li>
          )}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new user.
        <br />
      </div>
    </main>
  );
}

export default App;
