import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 text-center">
        <h1 className="text-6xl font-bold mb-4 text-red-500">403</h1>
        <p className="text-xl text-gray-600 mb-2">Access Denied</p>
        <p className="text-gray-500 mb-6">You don't have permission to access this page</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
