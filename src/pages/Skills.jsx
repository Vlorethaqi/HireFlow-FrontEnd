import { useEffect, useState } from "react";
import api from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get("/skills")
      .then(res => setSkills(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Skills</h1>

      {skills.map(skill => (
        <p key={skill.id}>{skill.name}</p>
      ))}
    </div>
  );
}

export default Skills;