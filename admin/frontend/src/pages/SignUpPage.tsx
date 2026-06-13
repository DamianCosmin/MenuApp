import { useState } from "react";
import { useNavigate } from "react-router";
import { useSignIn } from "@clerk/react";
import { BsPersonCircle } from "react-icons/bs";
import { BASE_URL } from "../utils/routes";

function SignUpPage() {
    const { signIn } = useSignIn();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        if (signIn == null) {
            return;
        }
        
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/auth/sign-up`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, secretKey}),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                return;
            }

            const { clerkError } = await signIn.ticket({
                ticket: data.token
            }) as any;

            if (clerkError) {
                setError(clerkError.errors[0]?.longMessage);
                return;
            }

            if (signIn.status === 'complete') {
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

                <div className="form-floating mb-3 input-field">
                    <input 
                        type="text"
                        className="form-control"
                        id="floatingSecret"
                        placeholder="Secret key"
                        value={secretKey}
                        onChange={e => setSecretKey(e.target.value)}
                    />
                    <label htmlFor="floatingSecret">Secret admin key</label>
                </div>

                {error && <p className="text-danger">{error}</p>}

                <button
                    className="btn btn-lg btn-login rounded-pill px-5 mt-3"
                    onClick={handleSignUp}
                    disabled={loading}
                    onMouseUp={(e) => e.currentTarget.blur()}
                >
                    {loading ? "CREATING.." : "SIGN UP"}
                </button>  
            </div>
        </div>
    );
}

export default SignUpPage;