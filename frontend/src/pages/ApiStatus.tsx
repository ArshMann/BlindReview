import { useEffect, useState } from "react";

export default function ApiStatus() {
    const [status, setStatus] = useState("Checking backend...");

    useEffect(() => {
        fetch("/api/PlaceHolder")
            .then(r => r.text())
            .then(() => setStatus("Backend connected ✅"))
            .catch(() => setStatus("Backend unreachable ❌"));
    }, []);

    return (
        <>
            <h2>API Status</h2>
            <p>{status}</p>
        </>
    );
}
