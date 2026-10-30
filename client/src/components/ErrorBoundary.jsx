import React, { Component } from 'react';
import ErrorState from './common/ErrorState';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <ErrorState
            message="An unexpected UI error occurred. We have isolated the issue so the rest of your experience stays smooth."
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
