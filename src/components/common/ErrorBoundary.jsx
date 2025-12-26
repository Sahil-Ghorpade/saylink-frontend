import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("React crash:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5 text-center">
                    <h4>Something went wrong</h4>
                    <p className="text-muted">
                        Please refresh the page or try again later.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;