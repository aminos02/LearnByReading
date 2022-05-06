export default function () {
  return (
    <div className="mx-auto flex max-w-4xl items-center 
    justify-between border-y border-gray-600 bg-green-500 p-5  
    text-white">
      <div className="px-10">
        <h1 className="max-w-xl font-serif text-6xl">
          This is your place to read, write, learn and Connect
        </h1>
        <h5>
          it's easy and free to post your thinking on any topic and connect with
          millions of readers
        </h5>
      </div>
      <img src="logoBig.svg"  className="hidden md:inline-flex h-32 lg:h-full" alt="" />
    </div>
  )
}
