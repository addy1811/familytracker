import React, { useState , useEffect} from "react";
import { useNavigate , useLocation} from "react-router-dom";

export default function CreateMemory() {
  const navigate = useNavigate();
  const locationRouter = useLocation();
  const prefillCountry = locationRouter.state?.country || "";
  const [country, setCountry] = useState(prefillCountry);
  const [countries, setCountries] = useState([])
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch("/countries.geojson")
      .then(res => res.json())
      .then(data => {
        const countryNames = data.features
        .map(f => ({
          name: f.properties.name || f.properties.ADMIN, 
          value: f.properties.ADMIN                     
        }))
          .filter(Boolean)
          .sort();
        setCountries(countryNames);
      })
      .catch(err => {
        console.error("Failed to load countries.geojson", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (!country) return setError("Please select a country.");
    if (!image) return setError("Please select an image.");
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("country", country);
      formData.append("description", description);
      formData.append("image", image);
  
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/memories`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      const data = await res.json(); // ✅ parse once
  
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : data.error?.message || "Upload failed"
        );
      }
  
      navigate("/memory");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
   <div className="min-h-screen flex items-center justify-center bg-[#161a26] p-4">
      <form className="bg-black/40 p-8 rounded flex flex-col gap-5 max-w-md w-full" onSubmit={handleSubmit}>
        <h2 className="text-yellow-400 text-xl font-bold text-center">Create Memory</h2>

        <label className="text-yellow-400 font-semibold" htmlFor="country-select">Country:</label>
        <select
          id="country-select"
          value={country} 
          onChange={e => setCountry(e.target.value)}
          required
          className="px-3 py-2 rounded w-full bg-white text-black"
        >
           <option value="" disabled>Select a country</option>
  {countries.map((c, index) => (
     <option key={index} value={c.value}>
    {c.name}
    </option>
          ))}
        </select>

        <label className="text-yellow-400 font-semibold mt-4" htmlFor="description">Description:</label>
        <textarea
          id="description"
          className="px-3 py-2 rounded w-full text-white"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
        
        <label className="text-yellow-400 font-semibold mt-4" htmlFor="image-upload">Select Image:</label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          required
        />

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 py-2 rounded text-black hover:bg-yellow-500 font-semibold mt-6"
        >
          {loading ? "Saving..." : "Save Memory"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/memory")}
          className="text-gray-100 underline mt-3"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
 
