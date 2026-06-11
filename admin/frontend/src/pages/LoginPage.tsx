import { useState } from "react";
import { useNavigate } from "react-router";
import { useSignIn } from "@clerk/react";
import { BsPersonCircle } from "react-icons/bs";
import { BASE_URL } from "../utils/routes";

function LoginPage() {
    const { signIn } = useSignIn();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        if (signIn == null) {
            return;
        }
        
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { error: clerkError } = await signIn.password({
                emailAddress: email,
                password: password
            }) as any;
            
            if (clerkError) {
                setError(clerkError.errors[0]?.longMessage);
                return;
            }

            if (signIn.status === 'complete') {
                await fetch(`${BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                await signIn.finalize();
                navigate("/");
            }
        } catch(error) {
            setError("Something wrong happened!");
        } finally {
            setLoading(false);
        }
    }

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
                    <input 
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                
                <div className="form-floating mb-3 input-field">
                    <input 
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                {error && <p className="text-danger">{error}</p>}

                <p>
                    Don't have an account? Create one <a href='/sign-up' className="text-decoration-none text-revenue">here</a>.
                </p>

                <button 
                    className="btn btn-lg btn-login rounded-pill px-5"
                    onClick={handleLogin}
                    disabled={loading}
                    onMouseUp={(e) => e.currentTarget.blur()}
                >
                    {loading ? "SINGING IN.." : "LOGIN"}
                </button>  
            </div>
        </div>
    );
}

export default LoginPage;