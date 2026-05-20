import { useEffect, useState } from "react";
import api from "../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api.get("/departments")
      .then(res => setDepartments(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Departments</h1>

      {departments.map(dep => (
        <p key={dep.id}>{dep.name}</p>
      ))}
    </div>
  );
}

export default Departments;