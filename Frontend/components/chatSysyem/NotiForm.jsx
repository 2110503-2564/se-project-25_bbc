import React, { useState } from 'react';

export default function NotiForm() {
  const [formData, setFormData] = useState({
    head: '',
    detail: '',
    expire: '',
    type: 'promotion',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with your submit logic
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="head" className="block font-medium">
          Head
        </label>
        <input
          type="text"
          id="head"
          name="head"
          value={formData.head}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Special Offer: 20% Off Your Next Meal!"
        />
      </div>

      <div>
        <label htmlFor="detail" className="block font-medium">
          Detail
        </label>
        <input
          type="text"
          id="detail"
          name="detail"
          value={formData.detail}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enjoy 20% off your next meal at our restaurant. Valid till Friday!"
        />
      </div>

      <div>
        <label htmlFor="expire" className="block font-medium">
          Expire
        </label>
        <input
          type="datetime-local"
          id="expire"
          name="expire"
          value={formData.expire}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="type" className="block font-medium">
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="promotion">promotion</option>
          <option value="emergency">emergency</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
