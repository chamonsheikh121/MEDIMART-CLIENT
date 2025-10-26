

const Title = ({
    title= "this is Title",
    desc= "sdasdasdasdasdasdas asdasda asdasd"
}) => {
    return (
        <div className="text-center mb-12 px-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-400 bg-clip-text text-transparent mb-6">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          {desc}
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 mx-auto mt-6 rounded-full"></div>
      </div>
    );
};

export default Title;