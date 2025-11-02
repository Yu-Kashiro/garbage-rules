import SearchGarbage from "../components/searchGarbage/searchGarbage";

export default function Home() {
  return (
    <main className="flex flex-1 items-start justify-center bg-background-main pt-10 md:pt-10">
      <div className="container max-w-3xl px-4">
        <h1 className="text-center text-xl font-bold md:text-4xl">
          捨てたいごみを入力してください。
        </h1>

        <SearchGarbage />
      </div>
    </main>
  );
}
