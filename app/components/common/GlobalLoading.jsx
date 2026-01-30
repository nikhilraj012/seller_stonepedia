import { useAuth } from "../context/AuthContext";

const GlobalLoading = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalLoading;
