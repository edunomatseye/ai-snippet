import { useState } from "react";
import { useLoaderData, Link } from "react-router";

import reactLogo from "../../assets/react.svg";
import viteLogo from "/vite.svg";
import "../../App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export function Root() {
  return <h1>Hello world</h1>;
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  const res = await fetch(`${API_URL}/snippets`);
  return res.json();
}

export function Index() {
  const snippets =
    useLoaderData<{ _id: string; summary: string; text: string }[]>();

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Snippets</h1>
        <Link
          to="/snippets/new"
          className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
        >
          + New Snippet
        </Link>
      </div>

      <ul className="space-y-4">
        {snippets.map((s) => (
          <li key={s._id} className="border rounded p-4 shadow-sm bg-white">
            <Link
              to={`/snippets/${s._id}`}
              className="font-semibold text-blue-600"
            >
              {s.summary}
            </Link>
            <p className="text-gray-600 mt-2">{s.text}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
