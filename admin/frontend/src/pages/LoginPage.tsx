import { BsPersonCircle } from "react-icons/bs";

function LoginPage() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
        <div
        className="p-4 bg-dark rounded d-flex flex-column align-items-center"
        style={{ width: '30vw', minWidth: '300px' }}
        >
            <BsPersonCircle size={80} color="lightgrey" className="mb-4"></BsPersonCircle>
            
            <div className="form-floating mb-3 input-field">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"></input>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-4 input-field">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"></input>
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="btn btn-lg btn-login rounded-pill px-5" type="submit" value="Submit" onMouseUp={(e) => e.currentTarget.blur()}>LOGIN</button>  
        </div>
    </div>
  );
}

export default LoginPage;