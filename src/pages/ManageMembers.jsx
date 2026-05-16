import React, {
  useEffect,
  useState
} from "react";
import {BASE_URL} from "../services/api";
import "../styles/ManageMembers.css";

const ManageMembers = () => {

  const [projects, setProjects]
    = useState([]);

  const [users, setUsers]
    = useState([]);

  const [members, setMembers]
    = useState([]);

  const [projectId, setProjectId]
    = useState("");

  const [userId, setUserId]
    = useState("");

  const [message, setMessage]
    = useState("");

  const [error, setError]
    = useState("");

  /* POPUP */

  const [showPopup, setShowPopup]
    = useState(false);

  const [selectedMemberId,
    setSelectedMemberId]
    = useState(null);

  /* =========================
        GET PROJECTS
  ========================= */

  const fetchProjects = async () => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/admin/projects`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if(response.ok){

      const data =
        await response.json();

      setProjects(data);
    }
  };

  /* =========================
        GET USERS
  ========================= */

  const fetchUsers = async (
    projectId
  ) => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/members/users/${projectId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if(response.ok){

      const data =
        await response.json();

      setUsers(data);
    }
  };

  /* =========================
      GET ALL MEMBERS
  ========================= */

  const fetchMembers = async () => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/members`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if(response.ok){

      const data =
        await response.json();
      console.log(data);
      setMembers(data);
    }
  };

  useEffect(() => {

    fetchProjects();

    fetchMembers();

  }, []);

  /* =========================
        ADD MEMBER
  ========================= */

  const handleAddMember =
    async () => {

      if (
        !projectId ||
        !userId
      ) {

        setError(
          "Both fields are required"
        );

        return;
      }

      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/members`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({

            userId:
              Number(userId),

            projectId:
              Number(projectId)
          })
        }
      );

      if(response.ok){

        setMessage(
          "Member Added Successfully"
        );

        setProjectId("");

        setUserId("");

        fetchMembers();

      }else{

        const text =
          await response.text();

        setError(text);
      }

      setTimeout(() => {

        setMessage("");

        setError("");

      }, 3000);
    };

  /* =========================
        REMOVE POPUP
  ========================= */

  const handleRemove =
    (id) => {

      setSelectedMemberId(id);

      setShowPopup(true);
  };

  /* =========================
      CONFIRM REMOVE
  ========================= */

  const confirmRemove =
    async () => {

      const token =
        localStorage.getItem("token");

      await fetch(
        `${BASE_URL}/members/${selectedMemberId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      fetchMembers();

      setShowPopup(false);

      setSelectedMemberId(null);
  };

  /* =========================
        CANCEL POPUP
  ========================= */

  const cancelRemove = () => {

    setShowPopup(false);

    setSelectedMemberId(null);
  };

  return (

    <div className="manage-members-page">

      {/* HEADER */}

      <div className="manage-header">

        <h2>
          Manage Members
        </h2>

        <p>
          Add or remove members
          from projects
        </p>

      </div>

      {/* TOP BOX */}

      <div className="top-box">

        {/* PROJECT */}

        <div className="input-box">

          <label>
            Select Project
          </label>

          <select
            value={projectId}
            onChange={(e) => {

              setProjectId(
                e.target.value
              );

              fetchUsers(
                e.target.value
              );
            }}
          >

            <option value="">
              Select Project
            </option>

            {projects.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>

            ))}

          </select>

        </div>

        {/* MEMBER */}

        <div className="input-box">

          <label>
            Add Member
          </label>

          <select
            value={userId}
            onChange={(e) =>
              setUserId(
                e.target.value
              )
            }
          >

            <option value="">
              Select Member
            </option>

            {users.map((user) => (

              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>

            ))}

          </select>

        </div>

        {/* BUTTON */}

        <button
          className="add-member-btn"
          onClick={
            handleAddMember
          }
        >
          Add Member
        </button>

      </div>

      {/* MESSAGE */}

      {
        message && (

          <p className="success-msg">
            {message}
          </p>

        )
      }

      {
        error && (

          <p className="error-msg">
            {error}
          </p>

        )
      }

      {/* TABLE */}

      <div className="members-table-box">

        <h3>
          All Project Members
        </h3>

        <table>

          <thead>

            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Project</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {members.map((member) => (

              <tr key={member.projectMemberId}>

                <td>

                  <div className="member-info">

                    <img
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      alt="profile"
                    />

                    <span>
                      {member.name}
                    </span>

                  </div>

                </td>

                <td>
                  {member.email}
                </td>

                <td>
                  {member.projectName}
                </td>

                <td>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      handleRemove(
                        member.projectMemberId
                      )
                    }
                  >
                    Remove
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="total-members">

          Total Members:
          {members.length}

        </div>

      </div>

      {/* POPUP */}

      {
        showPopup && (

          <div className="popup-overlay">

            <div className="popup-box">

              <h3>
                Remove Member
              </h3>

              <p>
                Are you sure you want
                to remove this member?
              </p>

              <div className="popup-buttons">

                <button
                  className="cancel-btn"
                  onClick={cancelRemove}
                >
                  Cancel
                </button>

                <button
                  className="confirm-btn"
                  onClick={confirmRemove}
                >
                  Confirm
                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>
  );
};

export default ManageMembers;