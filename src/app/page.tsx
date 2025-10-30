import SearchGarbage from "../components/payments/page";

export default function Home() {
  return (
    <main className="flex flex-1 items-start justify-center bg-background-main pt-30">
      <div className="container max-w-3xl px-4">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            捨てる神あれば{" "}
            <span className="text-muted-foreground">拾う神あり。</span>
          </h1>
          <p className="text-base text-muted-foreground">
            捨てたいごみを入力してください。
          </p>
        </div>

        <SearchGarbage />
      </div>
    </main>
  );
}
