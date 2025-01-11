export default function ComingSoon({ title, icon }: { title: string; icon: any }) {

    return (
      <div className="h-screen dark:bg-gray-900 flex justify-center items-center flex-col gap-4 px-4">
        <div className="flex items-center justify-center">
          {icon}
        </div>
        <span className="dark:text-white text-gray-700 text-3xl font-serif font-semibold tracking-wide">
          {title}
        </span>
        <span className="text-red-500 font-serif text-lg">
          Coming soon...
        </span>
      </div>
    );
    
  }
  