const Home = ({ user }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 px-4">
      {!user ? (
        // 🔐 Agar user null bo‘lsa
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome 👋</h1>
          <p className="text-gray-600 mb-6">
            Please login or register to continue.
          </p>
        </div>
      ) : (
        // 👤 Agar user mavjud bo‘lsa
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome back, {user?.name} 🎉
          </h1>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-semibold text-gray-800">{user?.id}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-800">{user?.name}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
