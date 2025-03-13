import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);

  useEffect(() => {
    client.models.User.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
    });
  }, []);

  function createUser() {
    client.models.User.create({ authId: window.prompt("User id: ") });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createUser}>+ new</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.authId}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new user.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
