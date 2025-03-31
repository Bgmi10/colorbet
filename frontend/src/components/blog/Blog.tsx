export default function Blog() {
  const featuredPost = {
    title: "Why MovieSpot.fun Is Changing How We Stream",
    excerpt: "Discover how our platform is revolutionizing the streaming experience with unique features and an extensive library.",
    date: "March 28, 2025",
    author: "MovieSpot Team",
    image: "/assets/zero.PNG",
    slug: "why-moviespot-fun-is-changing-streaming",
    link: "moviespot.fun"
  };

  const recentPosts = [
    {
      title: "Top 10 Must-Watch Movies This Spring",
      excerpt: "From blockbuster hits to indie gems, here are the films you shouldn't miss this season.",
      date: "March 25, 2025",
      author: "Film Critic",
      link: "moviespot.fun",
      image: "/assets/moviespofun.PNG",
      slug: "top-10-must-watch-movies-spring"
    },
    {
      title: "New Features Coming to MovieSpot.fun",
      excerpt: "Exciting updates and enhanced viewing experiences are on their way to your favorite streaming platform.",
      date: "March 20, 2025",
      author: "Product Team",
      image: "/assets/mvoies.PNG",
      link: "moviespot.fun/search",
      slug: "new-features-coming-to-moviespot"
    },
    {
      title: "Behind the Scenes: How We Curate Content",
      excerpt: "Learn about our process for selecting the best movies and shows for our streaming library.",
      date: "March 15, 2025",
      author: "Content Manager",
      link: "moviespot.fun/tv",
      image: "/assets/moviespot.PNG",
      slug: "behind-scenes-content-curation"
    }
  ];

  return (
    <div>
      <div className="min-h-screen mb-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-6">
            <span className="text-yellow-500">Amusebox</span>
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-xl mb-8">
              Insights, updates, and recommendations from your favorite streaming platform.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Featured Post</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer" onClick={() => window.open(`https://${featuredPost.link}`, "_blank")} >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    className="h-64 w-full object-cover md:h-full" 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {featuredPost.date} • {featuredPost.author}
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {featuredPost.excerpt}
                  </p>
                 
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Recent Posts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer" onClick={() => window.open(`https://${post.link}`, "_blank")}>
                  <img 
                    className="w-full h-48 object-cover" 
                    src={post.image} 
                    alt={post.title} 
                  />
                  <div className="p-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {post.date} • {post.author}
                    </div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {post.excerpt}
                    </p>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-16 bg-black dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="md:flex items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-gray-300">
                  Subscribe to our newsletter for the latest streaming news, updates, and recommendations.
                </p>
              </div>
              <div className="md:w-1/3">
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-grow px-4 py-2 rounded-l-md focus:outline-none" 
                  />
                  <button className="bg-yellow-500 text-black px-4 py-2 rounded-r-md font-medium hover:bg-yellow-600 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}