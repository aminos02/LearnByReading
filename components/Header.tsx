import Link from "next/link"

export default function Header(){
return <header className="flex justify-between px-4 py-1 max-w-4xl mx-auto">
<div className="flex items-center space-x-5">
    <Link href="/">
        <img src="logo.png" alt="logo" className="w-36 cursor-pointer" />
    </Link>
<div className="hidden md:inline-flex items-center space-x-5 ">
    <Link href="#">
    <h3>About</h3>
    </Link>
    <Link href="#">
    <h3>Contact</h3>
    </Link>
    <Link href="#">
    <h3 className="bg-green-600 px-4 text-white rounded-full p-1">Follow</h3>
    </Link>
</div>
</div>
<div className="flex text-green-600 space-x-5 items-center">
    <h3 >Sign In</h3>
    <h3 className="rounded-full border-green-600 border-2 px-2 py-1">Get Started</h3>
</div>

</header>
}