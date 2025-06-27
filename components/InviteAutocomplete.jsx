"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export default function InviteAutocomplete({ email, setEmail }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (email.length < 1) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(() => {
      fetch(`/api/user?search=${email}`)
        .then(async (res) => {
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch {
            throw new Error("Invalid JSON: " + text);
          }
        })

        .then((data) => setSuggestions(data))
        .catch((err) => console.error("Gagal fetch suggestion:", err));
    }, 300);

    return () => clearTimeout(delay);
  }, [email]);

  const handleSelect = (user) => {
    setEmail(user.email);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder="Email pengguna"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto">
          {suggestions.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
