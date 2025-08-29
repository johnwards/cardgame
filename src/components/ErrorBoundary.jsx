/**
 * Error Boundary Component for debugging React errors
 * This will help us see what's causing the white screen
 */

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-100 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Error Details:</h2>
              <div className="bg-red-50 p-4 rounded border">
                <pre className="text-sm text-red-700 whitespace-pre-wrap">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Component Stack:</h2>
              <div className="bg-gray-50 p-4 rounded border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Error Stack:</h2>
              <div className="bg-gray-50 p-4 rounded border overflow-auto max-h-64">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {this.state.error && this.state.error.stack}
                </pre>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;