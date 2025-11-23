import { useNavigate } from 'react-router-dom'
import { Calendar, Users, Clock, Shield, Zap, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function Landing() {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const handleGetStarted = () => {
        if (user) {
            navigate('/spaces')
        } else {
            navigate('/register')
        }
    }

    const features = [
        {
            icon: Calendar,
            title: 'Smart Scheduling',
            description: 'Effortlessly book and manage your space reservations with our intelligent calendar system.',
            gradient: 'from-blue-400 to-cyan-500',
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Coordinate with your team and share spaces seamlessly across your organization.',
            gradient: 'from-purple-400 to-pink-500',
        },
        {
            icon: Clock,
            title: 'Real-time Availability',
            description: 'See instant updates on space availability and never double-book again.',
            gradient: 'from-green-400 to-teal-500',
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security ensures your data and reservations are always protected.',
            gradient: 'from-orange-400 to-red-500',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Book spaces in seconds with our streamlined, intuitive interface.',
            gradient: 'from-yellow-400 to-orange-500',
        },
        {
            icon: TrendingUp,
            title: 'Analytics & Insights',
            description: 'Track usage patterns and optimize your space utilization with detailed reports.',
            gradient: 'from-indigo-400 to-purple-500',
        },
    ]

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '50K+', label: 'Reservations Made' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' },
    ]

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative px-6 py-20 md:py-32">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-8">
                        {/* Animated Badge */}
                        <div className="inline-flex items-center gap-2 clay-container px-6 py-3 animate-bounce-slow">
                            <Zap className="w-5 h-5 text-cyan-600" />
                            <span className="text-sm font-bold text-gray-700">
                                The Future of Space Management
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                            Reserve Your Space,{' '}
                            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Simplify Your Life
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                            The most intuitive reservation management system for modern teams.
                            Book meeting rooms, desks, and shared spaces in seconds.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <button
                                onClick={handleGetStarted}
                                className="clay-button text-lg px-10 py-5 group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started Free
                                    <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="clay-input text-lg px-10 py-5 hover:shadow-xl transition-all duration-300"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="clay-card p-6 hover:scale-105 transition-transform duration-300"
                                >
                                    <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm md:text-base text-gray-600 font-semibold mt-2">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-20 bg-gradient-to-b from-transparent to-blue-50/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Everything You Need,{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                All in One Place
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to make space management effortless
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="clay-card p-8 group hover:scale-105 transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                                >
                                    <feature.icon className="w-full h-full text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Get Started in{' '}
                            <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                Three Simple Steps
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Lines */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 -translate-y-1/2 -z-10"></div>

                        {[
                            {
                                step: '01',
                                title: 'Create Account',
                                description: 'Sign up in seconds with your email or social accounts',
                                icon: Users,
                            },
                            {
                                step: '02',
                                title: 'Browse Spaces',
                                description: 'Explore available spaces with real-time availability',
                                icon: Calendar,
                            },
                            {
                                step: '03',
                                title: 'Book Instantly',
                                description: 'Reserve your space and receive instant confirmation',
                                icon: Zap,
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="clay-container p-8 text-center group hover:scale-105 transition-all duration-300">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                                        {item.step}
                                    </div>
                                    <div className="mt-8 mb-6">
                                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 p-5 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                                            <item.icon className="w-full h-full text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="clay-container p-12 md:p-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                            Ready to Transform Your{' '}
                            <span className="bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                                Space Management?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of teams already using our platform to streamline
                            their reservations
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="clay-button text-xl px-12 py-6 group"
                        >
                            <span className="flex items-center gap-3">
                                Start Your Free Trial
                                <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </span>
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                            No credit card required • Free forever plan available
                        </p>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-12 border-t border-gray-200 bg-gradient-to-b from-transparent to-gray-50/50">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600 font-medium">
                        © 2024 Space Reservation System. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="#" className="text-gray-500 hover:text-cyan-600 transition-colors font-semibold">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-cyan-600 transition-colors font-semibold">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-500 hover:text-cyan-600 transition-colors font-semibold">
                            Contact Us
                        </a>
                    </div>
                </div>
            </footer>

            <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
        </div>
    )
}
