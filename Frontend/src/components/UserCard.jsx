const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  return (
    <div>
      <div className="card bg-base-300 w-96 shadow-xl">
        <figure>
          <img src={photoUrl} alt="user-photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-xl font-bold">
            {firstName + " " + lastName}
          </h2>
          {age && gender && <p>{age + ", " + gender}</p>}

          <p>{about}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
