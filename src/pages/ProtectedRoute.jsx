import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FakeAuthContext";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(
        function () {
            if (!isAuthenticated) navigate("/");
        },
        [isAuthenticated, navigate]
    );

    return isAuthenticated ? children : null;
}

export default ProtectedRoute;