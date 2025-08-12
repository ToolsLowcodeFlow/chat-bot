import Link from "next/link";
import ChatWidget from "./components/chatwidget";

export default function Home() {
  return (
  <>
    <div>
<Link href="/jsonpage" className="text-black bg-amber-800 rounded-3xl p-4 text-xl font-bold  hover:bg-amber-700 hover:text-white duration-300">
new Page test for json insert
</Link>
<Link href="/jsonpagemulti_auto" className="text-black bg-amber-800 rounded-3xl p-4 text-xl font-bold  hover:bg-amber-700 hover:text-white duration-300">
Page to insert auto trader data Automatically
</Link>
    </div>
<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-transparent">
<ChatWidget/>
</div>
</>
  );
}
