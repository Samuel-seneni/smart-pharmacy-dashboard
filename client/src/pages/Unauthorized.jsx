function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">
          403 - Unauthorized
        </h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;